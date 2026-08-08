-- ═══════════════════════════════════════════════════════════
-- SEP · 0008 — Lógica de negocio en la base de datos
--
-- Por qué aquí y no solo en la app: estas funciones son
-- SECURITY DEFINER con validación interna. Aunque alguien
-- llame al RPC directamente con la anon key, saltándose por
-- completo el frontend, no puede:
--   · inscribirse en un curso no publicado
--   · marcar una sesión de un curso en el que no está
--   · fijar el precio de su propia orden
--   · aprobar su propio pago
--   · emitir su propio certificado
--   · registrar horas de voluntariado que nadie aprobó
--
-- El precio SIEMPRE se lee de la tabla, nunca del argumento.
-- ═══════════════════════════════════════════════════════════

-- ── Helper: registrar en auditoría ────────────────────────
create or replace function public.log_audit(
  p_action    text,
  p_entity    text,
  p_entity_id text,
  p_before    jsonb default null,
  p_after     jsonb default null
)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.audit_log (actor_id, action, entity, entity_id, before_data, after_data)
  values (auth.uid(), p_action, p_entity, p_entity_id, p_before, p_after);
$$;

-- ── Helper: encolar un trabajo para el worker ─────────────
create or replace function public.enqueue_job(p_kind text, p_payload jsonb default '{}')
returns uuid
language sql
security definer
set search_path = public
as $$
  insert into public.job_queue (kind, payload)
  values (p_kind, p_payload)
  returning id;
$$;

-- ── Helper: notificar a un usuario ────────────────────────
create or replace function public.notify_user(
  p_user_id uuid,
  p_kind    text,
  p_title   text,
  p_body    text default null,
  p_link    text default null
)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.notifications (user_id, kind, title, body, link)
  values (p_user_id, p_kind, p_title, p_body, p_link);
$$;


-- ═══════════════════════════════════════════════════════════
-- INSCRIPCIONES
-- ═══════════════════════════════════════════════════════════

/**
 * Inscribe al usuario actual en un curso.
 * Valida: sesión activa · curso publicado · cupo disponible · no duplicada.
 */
create or replace function public.enroll_in_course(p_course_slug text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user     uuid := auth.uid();
  v_course   record;
  v_taken    int;
  v_existing uuid;
  v_id       uuid;
begin
  if v_user is null then
    raise exception 'AUTH_REQUIRED' using hint = 'Debes iniciar sesión para inscribirte.';
  end if;

  select id, status, capacity, title, sessions_count
    into v_course
    from courses
   where slug = p_course_slug;

  if not found then
    raise exception 'COURSE_NOT_FOUND' using hint = 'Ese curso no existe.';
  end if;

  if v_course.status <> 'disponible' then
    raise exception 'COURSE_NOT_OPEN'
      using hint = 'Este curso aún no está abierto para inscripciones.';
  end if;

  select id into v_existing
    from enrollments
   where user_id = v_user and course_id = v_course.id and cohort = 'default';

  if v_existing is not null then
    return v_existing;  -- idempotente
  end if;

  if v_course.capacity is not null then
    select count(*) into v_taken
      from enrollments
     where course_id = v_course.id and status in ('activo', 'completado');

    if v_taken >= v_course.capacity then
      raise exception 'COURSE_FULL'
        using hint = 'Este curso llegó a su cupo máximo. Te avisaremos de la próxima cohorte.';
    end if;
  end if;

  insert into enrollments (user_id, course_id)
  values (v_user, v_course.id)
  returning id into v_id;

  perform log_audit('ENROLL', 'enrollments', v_id::text, null,
                    jsonb_build_object('course', p_course_slug));
  perform notify_user(
    v_user, 'enrollment',
    '¡Te inscribiste en ' || v_course.title || '!',
    'Tienes ' || v_course.sessions_count || ' sesiones por delante. Empieza cuando quieras.',
    '/estudiante/curso/' || p_course_slug
  );

  return v_id;
end;
$$;

/**
 * Marca o desmarca una sesión como completada.
 * Solo el dueño de la inscripción, y solo si la sesión pertenece a ese curso.
 * El trigger `recalc_progress` recalcula el porcentaje automáticamente.
 */
create or replace function public.toggle_session_complete(
  p_session_id uuid,
  p_done       boolean default true
)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user       uuid := auth.uid();
  v_enrollment uuid;
  v_progress   int;
begin
  if v_user is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select e.id into v_enrollment
    from course_sessions cs
    join enrollments e on e.course_id = cs.course_id
   where cs.id = p_session_id
     and e.user_id = v_user
     and e.status in ('activo', 'completado');

  if v_enrollment is null then
    raise exception 'NOT_ENROLLED'
      using hint = 'No estás inscrito en el curso de esta sesión.';
  end if;

  insert into session_progress (enrollment_id, session_id, attended, completed_at)
  values (v_enrollment, p_session_id, p_done, case when p_done then now() end)
  on conflict (enrollment_id, session_id) do update
    set attended     = excluded.attended,
        completed_at = excluded.completed_at;

  select progress_pct into v_progress from enrollments where id = v_enrollment;
  return v_progress;
end;
$$;


-- ═══════════════════════════════════════════════════════════
-- ÓRDENES Y PAGOS
-- ═══════════════════════════════════════════════════════════

/**
 * Crea una orden. El monto SIEMPRE se lee de la base de datos:
 * el cliente solo envía qué quiere comprar, nunca cuánto cuesta (§9.3).
 *
 * Devuelve la orden existente si ya hay una pendiente equivalente,
 * para que refrescar la página no genere órdenes duplicadas.
 */
create or replace function public.create_order(
  p_item_type text,
  p_item_id   uuid,
  p_ref_id    uuid default null   -- enrollment_id para certificados
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user   uuid := auth.uid();
  v_amount int;
  v_order  uuid;
begin
  if v_user is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  if p_item_type not in ('certificate', 'membership', 'silp') then
    raise exception 'INVALID_ITEM_TYPE';
  end if;

  -- ── Precio desde la tabla, jamás desde el cliente ──
  if p_item_type = 'certificate' then
    select price_cents into v_amount
      from certificate_types where id = p_item_id and is_active;

    if v_amount is null then
      raise exception 'ITEM_NOT_FOUND' using hint = 'Ese certificado no está disponible.';
    end if;

    -- El certificado solo se puede pedir con el curso completado.
    if p_ref_id is null then
      raise exception 'ENROLLMENT_REQUIRED';
    end if;

    if not exists (
      select 1 from enrollments
       where id = p_ref_id and user_id = v_user and status = 'completado'
    ) then
      raise exception 'COURSE_NOT_COMPLETED'
        using hint = 'Completa todas las sesiones del curso antes de pedir tu certificado.';
    end if;

    -- Evita comprar dos veces el mismo certificado.
    if exists (
      select 1 from certificates
       where user_id = v_user
         and enrollment_id = p_ref_id
         and certificate_type_id = p_item_id
         and status in ('pagado', 'emitido')
    ) then
      raise exception 'ALREADY_ISSUED'
        using hint = 'Ya tienes este certificado.';
    end if;

  elsif p_item_type = 'membership' then
    select price_cents into v_amount
      from membership_plans where id = p_item_id and is_active;
    if v_amount is null then
      raise exception 'ITEM_NOT_FOUND';
    end if;

  else -- silp
    select price_cents into v_amount from courses where id = p_item_id;
    if v_amount is null then
      raise exception 'ITEM_NOT_FOUND';
    end if;
  end if;

  if v_amount <= 0 then
    raise exception 'FREE_ITEM' using hint = 'Este producto no requiere pago.';
  end if;

  -- Reutiliza una orden pendiente equivalente (idempotencia).
  select id into v_order
    from orders
   where user_id = v_user
     and item_type = p_item_type
     and item_id = p_item_id
     and status = 'pendiente'
     and created_at > now() - interval '24 hours'
   limit 1;

  if v_order is not null then
    return v_order;
  end if;

  insert into orders (user_id, item_type, item_id, amount_cents)
  values (v_user, p_item_type, p_item_id, v_amount)
  returning id into v_order;

  -- Reserva el certificado en estado pendiente para trazabilidad.
  if p_item_type = 'certificate' then
    insert into certificates (user_id, enrollment_id, certificate_type_id, status)
    values (v_user, p_ref_id, p_item_id, 'pendiente')
    on conflict do nothing;
  end if;

  perform log_audit('CREATE_ORDER', 'orders', v_order::text, null,
                    jsonb_build_object('item_type', p_item_type, 'amount', v_amount));
  return v_order;
end;
$$;

/**
 * El usuario declara su pago de Yape/Plin y adjunta el voucher.
 * NO puede fijar el monto ni el estado: ambos salen de la orden.
 * Queda en 'en_revision' hasta que un admin lo concilie.
 */
create or replace function public.submit_payment_voucher(
  p_order_id       uuid,
  p_method         payment_method,
  p_voucher_url    text,
  p_operation_code text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user    uuid := auth.uid();
  v_order   record;
  v_payment uuid;
begin
  if v_user is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  if p_method not in ('yape', 'plin', 'transferencia') then
    raise exception 'INVALID_METHOD'
      using hint = 'Este flujo es solo para Yape, Plin o transferencia.';
  end if;

  if coalesce(trim(p_operation_code), '') = '' then
    raise exception 'OPERATION_CODE_REQUIRED'
      using hint = 'Escribe el código de operación que te dio la app.';
  end if;

  select * into v_order from orders where id = p_order_id and user_id = v_user;
  if not found then
    raise exception 'ORDER_NOT_FOUND';
  end if;

  if v_order.status = 'pagado' then
    raise exception 'ALREADY_PAID' using hint = 'Esta orden ya fue pagada.';
  end if;

  -- Un solo pago en revisión por orden.
  select id into v_payment
    from payments
   where order_id = p_order_id and status in ('pendiente', 'en_revision');

  if v_payment is not null then
    update payments
       set method = p_method,
           voucher_url = p_voucher_url,
           operation_code = p_operation_code,
           status = 'en_revision',
           reject_reason = null
     where id = v_payment;
  else
    insert into payments (order_id, method, amount_cents, status, voucher_url, operation_code)
    values (p_order_id, p_method, v_order.amount_cents, 'en_revision', p_voucher_url, p_operation_code)
    returning id into v_payment;
  end if;

  update orders set status = 'en_revision' where id = p_order_id;

  perform log_audit('SUBMIT_VOUCHER', 'payments', v_payment::text, null,
                    jsonb_build_object('order', p_order_id, 'method', p_method));
  return v_payment;
end;
$$;

/**
 * El admin concilia un pago. Al aprobarlo:
 *   · marca la orden como pagada
 *   · emite el certificado (con su código único) o activa la membresía
 *   · notifica al usuario y encola la generación del PDF
 *
 * Todo en una transacción: o pasa todo, o no pasa nada.
 */
create or replace function public.review_payment(
  p_payment_id uuid,
  p_approve    boolean,
  p_reason     text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_payment record;
  v_order   record;
  v_cert    uuid;
  v_plan    record;
  v_result  jsonb;
begin
  if not is_admin() then
    raise exception 'FORBIDDEN' using hint = 'Solo el equipo de SEP puede conciliar pagos.';
  end if;

  select * into v_payment from payments where id = p_payment_id;
  if not found then
    raise exception 'PAYMENT_NOT_FOUND';
  end if;

  if v_payment.status = 'pagado' then
    raise exception 'ALREADY_REVIEWED' using hint = 'Este pago ya fue aprobado.';
  end if;

  select * into v_order from orders where id = v_payment.order_id;

  if not p_approve then
    update payments
       set status = 'rechazado', reject_reason = p_reason,
           reviewed_by = auth.uid(), reviewed_at = now()
     where id = p_payment_id;

    update orders set status = 'rechazado' where id = v_order.id;

    perform notify_user(
      v_order.user_id, 'payment_rejected',
      'No pudimos validar tu pago',
      coalesce(p_reason, 'Revisa el comprobante y vuelve a enviarlo.'),
      '/estudiante/certificados'
    );
    perform log_audit('REJECT_PAYMENT', 'payments', p_payment_id::text, null,
                      jsonb_build_object('reason', p_reason));
    return jsonb_build_object('approved', false);
  end if;

  -- ── Aprobación ──
  update payments
     set status = 'pagado', paid_at = now(),
         reviewed_by = auth.uid(), reviewed_at = now(), reject_reason = null
   where id = p_payment_id;

  update orders set status = 'pagado' where id = v_order.id;

  if v_order.item_type = 'certificate' then
    update certificates
       set status = 'emitido', issued_at = now(), issued_by = auth.uid()
     where user_id = v_order.user_id
       and certificate_type_id = v_order.item_id
       and status = 'pendiente'
    returning id into v_cert;

    if v_cert is null then
      insert into certificates (user_id, certificate_type_id, status, issued_at, issued_by)
      values (v_order.user_id, v_order.item_id, 'emitido', now(), auth.uid())
      returning id into v_cert;
    end if;

    perform enqueue_job('generate_certificate_pdf',
                        jsonb_build_object('certificate_id', v_cert));
    perform notify_user(
      v_order.user_id, 'certificate_issued',
      '¡Tu certificado está listo! 🎓',
      'Ya puedes descargarlo y compartir su enlace de verificación.',
      '/estudiante/certificados'
    );
    v_result := jsonb_build_object('approved', true, 'certificate_id', v_cert);

  elsif v_order.item_type = 'membership' then
    select * into v_plan from membership_plans where id = v_order.item_id;

    insert into memberships (user_id, plan_id, starts_at, ends_at, order_id)
    values (v_order.user_id, v_order.item_id, now(),
            now() + (v_plan.duration_months || ' months')::interval, v_order.id);

    perform notify_user(
      v_order.user_id, 'membership_active',
      'Tu plan ' || v_plan.name || ' está activo 🌱',
      'Ya tienes todos los beneficios disponibles en tu panel.',
      '/estudiante/membresia'
    );
    v_result := jsonb_build_object('approved', true, 'plan', v_plan.name);

  else
    v_result := jsonb_build_object('approved', true);
  end if;

  perform log_audit('APPROVE_PAYMENT', 'payments', p_payment_id::text, null, v_result);
  return v_result;
end;
$$;


-- ═══════════════════════════════════════════════════════════
-- VOLUNTARIADO
-- ═══════════════════════════════════════════════════════════

/**
 * El admin aprueba una postulación: otorga el rol `mentor`,
 * crea el perfil de voluntario y descuenta la vacante.
 * Es la única vía por la que alguien obtiene el rol de mentor.
 */
create or replace function public.approve_volunteer_application(p_application_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_app  record;
  v_role record;
begin
  if not is_admin() then
    raise exception 'FORBIDDEN';
  end if;

  select * into v_app from volunteer_applications where id = p_application_id;
  if not found then
    raise exception 'APPLICATION_NOT_FOUND';
  end if;

  if v_app.user_id is null then
    raise exception 'NO_ACCOUNT'
      using hint = 'Quien postuló aún no tiene cuenta. Pídele que se registre primero.';
  end if;

  select * into v_role from volunteer_roles where id = v_app.volunteer_role_id;

  update volunteer_applications
     set status = 'aprobada', reviewed_by = auth.uid()
   where id = p_application_id;

  insert into user_roles (user_id, role, granted_by)
  values (v_app.user_id, 'mentor', auth.uid())
  on conflict (user_id, role) do update set revoked_at = null;

  insert into volunteer_profiles (user_id, type, hours_committed)
  values (v_app.user_id, v_role.type, v_role.hours_per_week)
  on conflict (user_id) do update
    set type = excluded.type, is_active = true;

  update volunteer_roles
     set open_positions = greatest(0, open_positions - 1)
   where id = v_app.volunteer_role_id;

  perform notify_user(
    v_app.user_id, 'volunteer_approved',
    '¡Bienvenid@ al equipo SEP! 🎉',
    'Fuiste aceptad@ como ' || v_role.name || '. Ya tienes acceso a tu panel de mentor.',
    '/mentor'
  );
  perform log_audit('APPROVE_VOLUNTEER', 'volunteer_applications', p_application_id::text);

  return v_app.user_id;
end;
$$;

/** Registra horas de voluntariado. El voluntario nunca las aprueba: quedan pendientes. */
create or replace function public.log_volunteer_hours(
  p_date     date,
  p_hours    numeric,
  p_activity text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user  uuid := auth.uid();
  v_total numeric;
  v_id    uuid;
begin
  if v_user is null or not has_role('mentor') then
    raise exception 'FORBIDDEN' using hint = 'Solo los voluntarios registran horas.';
  end if;

  if p_hours <= 0 or p_hours > 12 then
    raise exception 'INVALID_HOURS' using hint = 'Registra entre 0.5 y 12 horas por día.';
  end if;

  if p_date > current_date then
    raise exception 'FUTURE_DATE' using hint = 'No puedes registrar horas futuras.';
  end if;

  select coalesce(sum(hours), 0) into v_total
    from volunteer_hours where user_id = v_user and date = p_date;

  if v_total + p_hours > 12 then
    raise exception 'DAILY_LIMIT' using hint = 'Ya tienes 12 horas registradas ese día.';
  end if;

  insert into volunteer_hours (user_id, date, hours, activity)
  values (v_user, p_date, p_hours, p_activity)
  returning id into v_id;

  return v_id;
end;
$$;


-- ═══════════════════════════════════════════════════════════
-- ROLES — la operación más sensible del sistema
-- ═══════════════════════════════════════════════════════════

/**
 * Otorga un rol. Reglas:
 *   · solo un admin puede otorgar roles
 *   · solo un super_admin puede otorgar `admin` o `super_admin`
 *   · nadie puede modificar sus propios roles
 * Todo queda auditado por el trigger `trg_audit_roles`.
 */
create or replace function public.grant_role(p_user_id uuid, p_role user_role)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_admin() then
    raise exception 'FORBIDDEN';
  end if;

  if p_role in ('admin', 'super_admin') and not is_super_admin() then
    raise exception 'SUPER_ADMIN_REQUIRED'
      using hint = 'Solo un super administrador otorga roles de administración.';
  end if;

  if p_user_id = auth.uid() then
    raise exception 'SELF_MODIFICATION'
      using hint = 'No puedes modificar tus propios roles.';
  end if;

  insert into user_roles (user_id, role, granted_by)
  values (p_user_id, p_role, auth.uid())
  on conflict (user_id, role) do update
    set revoked_at = null, granted_by = auth.uid(), granted_at = now();
end;
$$;

create or replace function public.revoke_role(p_user_id uuid, p_role user_role)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_admin() then
    raise exception 'FORBIDDEN';
  end if;

  if p_role in ('admin', 'super_admin') and not is_super_admin() then
    raise exception 'SUPER_ADMIN_REQUIRED';
  end if;

  if p_user_id = auth.uid() then
    raise exception 'SELF_MODIFICATION';
  end if;

  update user_roles set revoked_at = now()
   where user_id = p_user_id and role = p_role and revoked_at is null;
end;
$$;


-- ═══════════════════════════════════════════════════════════
-- DIAGNÓSTICO PÚBLICO
-- ═══════════════════════════════════════════════════════════

/**
 * Guarda un diagnóstico completo en una sola llamada atómica.
 * Público (sin login) por diseño — el rate limiting vive en la app.
 * Re-enviar con el mismo email y perfil actualiza las respuestas
 * en lugar de duplicar el lead.
 */
create or replace function public.submit_diagnostic(
  p_email     text,
  p_profile   survey_profile,
  p_region    text,
  p_answers   jsonb,            -- [{"number": 1, "answer": ...}, …]
  p_utm       text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_lead uuid;
  v_item jsonb;
  v_q    uuid;
begin
  if p_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'INVALID_EMAIL';
  end if;

  if jsonb_typeof(p_answers) <> 'array' or jsonb_array_length(p_answers) = 0 then
    raise exception 'NO_ANSWERS';
  end if;

  insert into survey_leads (email, profile, region, utm_source, completed)
  values (lower(trim(p_email)), p_profile, p_region, p_utm, true)
  on conflict (lower(email), profile) do update
    set region = excluded.region, completed = true
  returning id into v_lead;

  for v_item in select * from jsonb_array_elements(p_answers) loop
    select id into v_q
      from survey_questions
     where profile = p_profile
       and number = (v_item ->> 'number')::int;

    if v_q is not null then
      insert into survey_responses (lead_id, question_id, answer)
      values (v_lead, v_q, v_item -> 'answer')
      on conflict (lead_id, question_id) do update set answer = excluded.answer;
    end if;
  end loop;

  return v_lead;
end;
$$;


-- ═══════════════════════════════════════════════════════════
-- PERMISOS DE EJECUCIÓN
-- ═══════════════════════════════════════════════════════════

-- Autenticados
grant execute on function public.enroll_in_course(text)                       to authenticated;
grant execute on function public.toggle_session_complete(uuid, boolean)       to authenticated;
grant execute on function public.create_order(text, uuid, uuid)               to authenticated;
grant execute on function public.submit_payment_voucher(uuid, payment_method, text, text) to authenticated;
grant execute on function public.log_volunteer_hours(date, numeric, text)     to authenticated;

-- Admin (la propia función revalida el rol)
grant execute on function public.review_payment(uuid, boolean, text)          to authenticated;
grant execute on function public.approve_volunteer_application(uuid)          to authenticated;
grant execute on function public.grant_role(uuid, user_role)                  to authenticated;
grant execute on function public.revoke_role(uuid, user_role)                 to authenticated;

-- Público
grant execute on function public.submit_diagnostic(text, survey_profile, text, jsonb, text)
  to anon, authenticated;

-- Helpers internos: nadie los llama desde el cliente
revoke execute on function public.log_audit(text, text, text, jsonb, jsonb) from anon, authenticated;
revoke execute on function public.enqueue_job(text, jsonb)                  from anon, authenticated;
revoke execute on function public.notify_user(uuid, text, text, text, text) from anon, authenticated;
