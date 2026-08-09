-- SEP · 0011 — Endurecimiento de autenticación, formularios y funciones internas

-- Conserva en el perfil todos los datos validados durante el registro y crea
-- la institución asociada cuando el alta corresponde a una organización.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested text;
  base_role user_role;
  institution_kind institution_type;
  new_institution_id uuid;
  metadata jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  signup_interests text[] := '{}';
begin
  requested := metadata ->> 'account_type';
  base_role := case
    when requested in ('estudiante', 'docente', 'institucion')
      then requested::user_role
    else 'estudiante'::user_role
  end;

  if jsonb_typeof(metadata -> 'interests') = 'array' then
    select coalesce(array_agg(value), '{}')
      into signup_interests
      from jsonb_array_elements_text(metadata -> 'interests');
  end if;

  insert into public.profiles (
    id, email, full_name, phone, region, province, university, career,
    study_cycle, current_situation, interests, newsletter_opt_in,
    terms_accepted_at, privacy_accepted_at
  )
  values (
    new.id,
    new.email,
    coalesce(metadata ->> 'full_name', ''),
    nullif(metadata ->> 'phone', ''),
    nullif(metadata ->> 'region', ''),
    nullif(metadata ->> 'province', ''),
    case
      when requested = 'docente' then nullif(metadata ->> 'institution_name', '')
      else nullif(metadata ->> 'university', '')
    end,
    case
      when requested = 'docente' then nullif(metadata ->> 'subject', '')
      else nullif(metadata ->> 'career', '')
    end,
    nullif(metadata ->> 'study_cycle', ''),
    case
      when requested = 'docente' then nullif(metadata ->> 'teaching_level', '')
      else nullif(metadata ->> 'current_situation', '')
    end,
    signup_interests,
    coalesce(metadata ->> 'newsletter_opt_in', 'false') = 'true',
    now(),
    now()
  );

  insert into public.user_roles (user_id, role) values (new.id, base_role);

  if requested = 'institucion' then
    institution_kind := case metadata ->> 'institution_type'
      when 'colegio' then 'colegio'::institution_type
      when 'universidad' then 'universidad'::institution_type
      when 'empresa' then 'empresa'::institution_type
      when 'ong' then 'ong'::institution_type
      when 'gobierno' then 'gobierno'::institution_type
      else 'ong'::institution_type
    end;

    insert into public.institutions (
      name, type, ruc, region, province, contact_name, contact_role,
      contact_email, contact_phone, website, is_verified, created_by
    )
    values (
      coalesce(nullif(metadata ->> 'institution_name', ''), 'Institución por completar'),
      institution_kind,
      nullif(metadata ->> 'ruc', ''),
      coalesce(nullif(metadata ->> 'region', ''), 'Por completar'),
      nullif(metadata ->> 'province', ''),
      coalesce(metadata ->> 'full_name', ''),
      nullif(metadata ->> 'contact_role', ''),
      new.email,
      nullif(metadata ->> 'phone', ''),
      nullif(metadata ->> 'website', ''),
      false,
      new.id
    )
    returning id into new_institution_id;

    update public.profiles
       set institution_id = new_institution_id
     where id = new.id;
  end if;

  return new;
end;
$$;

-- Revisión atómica de una solicitud de colegio. La institución y el cambio de
-- estado se confirman juntos o se revierten juntos.
create or replace function public.review_school_application(
  p_application_id uuid,
  p_status application_status
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  application school_applications%rowtype;
  linked_institution uuid;
begin
  if not is_admin() then
    raise exception 'FORBIDDEN';
  end if;

  select * into application
    from school_applications
   where id = p_application_id
   for update;

  if not found then
    raise exception 'APPLICATION_NOT_FOUND';
  end if;

  linked_institution := application.institution_id;

  if p_status = 'aprobada' and linked_institution is null then
    insert into institutions (
      name, type, region, province, contact_name, contact_role,
      contact_email, contact_phone, students_count, is_verified, created_by
    )
    values (
      application.school_name,
      'colegio',
      application.region,
      application.province,
      application.director_name,
      'Director(a)',
      application.contact_email,
      application.contact_phone,
      application.students_3to5,
      true,
      auth.uid()
    )
    returning id into linked_institution;
  end if;

  update school_applications
     set status = p_status,
         institution_id = linked_institution,
         reviewed_by = auth.uid()
   where id = p_application_id;
end;
$$;

-- Aprobación y asignación de rol del speaker dentro de una sola transacción.
create or replace function public.review_speaker_profile(
  p_speaker_id uuid,
  p_approve boolean
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  linked_user uuid;
begin
  if not is_admin() then
    raise exception 'FORBIDDEN';
  end if;

  select user_id into linked_user
    from speaker_profiles
   where id = p_speaker_id
   for update;

  if not found then
    raise exception 'APPLICATION_NOT_FOUND';
  end if;

  if p_approve and linked_user is not null then
    insert into user_roles (user_id, role, granted_by)
    values (linked_user, 'speaker', auth.uid())
    on conflict (user_id, role) do update
      set revoked_at = null, granted_by = auth.uid(), granted_at = now();
  end if;

  update speaker_profiles
     set is_approved = p_approve,
         is_public = p_approve
   where id = p_speaker_id;
end;
$$;

-- Los formularios públicos pasan exclusivamente por Server Actions con
-- validación y rate limit. Se bloquea el INSERT directo con la anon key.
revoke insert on table public.volunteer_applications from anon, authenticated;
revoke insert on table public.speaker_profiles from anon, authenticated;
revoke insert on table public.school_applications from anon, authenticated;
revoke insert on table public.survey_leads from anon, authenticated;
revoke insert on table public.survey_responses from anon, authenticated;
revoke insert on table public.newsletter_subscribers from anon, authenticated;
revoke insert on table public.donations from anon, authenticated;

-- 0010 concedía EXECUTE sobre todas las funciones, incluidas las funciones
-- SECURITY DEFINER internas que escriben auditoría, notificaciones y jobs.
-- Se parte de cero y se publica únicamente la superficie necesaria.
revoke execute on all functions in schema public from public, anon, authenticated;

alter default privileges in schema public revoke execute on functions from public;
alter default privileges in schema public revoke execute on functions from anon;
alter default privileges in schema public revoke execute on functions from authenticated;
alter default privileges in schema public grant execute on functions to service_role;

-- Helpers usados por las políticas RLS.
grant execute on function public.has_role(user_role) to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.is_super_admin() to anon, authenticated;
grant execute on function public.my_institution_id() to anon, authenticated;

-- Única función pública invocable directamente.
grant execute on function public.verify_certificate(text) to anon, authenticated;

-- Operaciones autenticadas; cada función vuelve a validar auth.uid() y roles.
grant execute on function public.enroll_in_course(text) to authenticated;
grant execute on function public.toggle_session_complete(uuid, boolean) to authenticated;
grant execute on function public.create_order(text, uuid, uuid) to authenticated;
grant execute on function public.submit_payment_voucher(uuid, payment_method, text, text) to authenticated;
grant execute on function public.review_payment(uuid, boolean, text) to authenticated;
grant execute on function public.approve_volunteer_application(uuid) to authenticated;
grant execute on function public.log_volunteer_hours(date, numeric, text) to authenticated;
grant execute on function public.grant_role(uuid, user_role) to authenticated;
grant execute on function public.revoke_role(uuid, user_role) to authenticated;
grant execute on function public.review_school_application(uuid, application_status) to authenticated;
grant execute on function public.review_speaker_profile(uuid, boolean) to authenticated;
grant execute on function public.admin_dashboard() to authenticated;
grant execute on function public.diagnostic_results(survey_profile) to authenticated;
grant execute on function public.institution_impact_report(uuid) to authenticated;

-- Las Server Actions públicas usan service_role después de validar entrada y
-- límites. El cliente público ya no puede invocar directamente este RPC.
grant execute on function public.submit_diagnostic(text, survey_profile, text, jsonb, text)
  to service_role;

grant execute on all functions in schema public to service_role;
