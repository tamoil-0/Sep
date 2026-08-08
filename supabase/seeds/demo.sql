-- ═══════════════════════════════════════════════════════════
-- SEP · SEED DE DEMOSTRACIÓN
--
-- Llena la plataforma con un ecosistema completo y realista
-- para que cada panel se vea funcionando de verdad:
-- usuarios de los 6 roles, inscripciones con progreso real,
-- pagos en los 3 estados, certificados emitidos, comunidad,
-- talleres en colegios, voluntariado, speakers, donaciones
-- y respuestas del diagnóstico.
--
-- ⚠️ SOLO PARA DESARROLLO Y DEMO. No ejecutar en producción.
--    Todas las cuentas usan la contraseña: SepDemo2026!
--
-- Idempotente: se puede correr varias veces.
-- Para limpiar:  select public.demo_reset();
-- ═══════════════════════════════════════════════════════════

-- ── Helper: crear un usuario de demo con su perfil ────────
create or replace function public.demo_user(
  p_id        uuid,
  p_email     text,
  p_name      text,
  p_role      user_role,
  p_region    text,
  p_extra     jsonb default '{}'
)
returns uuid
language plpgsql
security definer
-- `extensions` es obligatorio: Supabase instala pgcrypto ahí, y sin él
-- `crypt()` y `gen_salt()` no se resuelven.
set search_path = public, auth, extensions
as $$
begin
  if exists (select 1 from auth.users where id = p_id) then
    return p_id;
  end if;

  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token
  ) values (
    '00000000-0000-0000-0000-000000000000',
    p_id, 'authenticated', 'authenticated', p_email,
    crypt('SepDemo2026!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('full_name', p_name, 'account_type',
      case when p_role in ('estudiante','docente','institucion')
           then p_role::text else 'estudiante' end,
      'region', p_region),
    now() - (random() * interval '180 days'), now(),
    '', '', '', ''
  );

  insert into auth.identities (
    provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
  ) values (
    p_id::text, p_id,
    jsonb_build_object('sub', p_id::text, 'email', p_email, 'email_verified', true),
    'email', now(), now(), now()
  );

  -- El trigger handle_new_user ya creó profiles + user_roles.
  update profiles
     set full_name         = p_name,
         region            = p_region,
         phone             = coalesce(p_extra ->> 'phone', '+51 9' || lpad((random()*99999999)::int::text, 8, '0')),
         university        = p_extra ->> 'university',
         career            = p_extra ->> 'career',
         study_cycle       = p_extra ->> 'study_cycle',
         current_situation = p_extra ->> 'current_situation',
         bio               = p_extra ->> 'bio',
         province          = p_extra ->> 'province',
         interests         = coalesce(
                               (select array_agg(value::text)
                                  from jsonb_array_elements_text(p_extra -> 'interests')),
                               '{}'),
         onboarding_done   = true,
         newsletter_opt_in = true
   where id = p_id;

  -- Rol adicional si no es uno de los 3 de registro abierto.
  if p_role not in ('estudiante','docente','institucion') then
    insert into user_roles (user_id, role) values (p_id, p_role)
    on conflict (user_id, role) do nothing;
  end if;

  return p_id;
end;
$$;


-- ═══════════════════════════════════════════════════════════
-- 1 · INSTITUCIONES
-- ═══════════════════════════════════════════════════════════

insert into institutions (id, name, type, region, province, district, contact_name,
                          contact_role, contact_email, contact_phone, students_count,
                          is_verified, agreement_signed_at)
values
  ('a1000000-0000-4000-8000-000000000001', 'I.E. San Bartolomé', 'colegio', 'Áncash', 'Casma', 'Casma',
   'Rosa Chávez Domínguez', 'Directora', 'sanbartolome@demo.edu.pe', '+51 943 112 233', 480, true, current_date - 120),
  ('a1000000-0000-4000-8000-000000000002', 'I.E. República de Perú', 'colegio', 'Áncash', 'Santa', 'Chimbote',
   'Luis Ramírez Solís', 'Director', 'republicadeperu@demo.edu.pe', '+51 944 556 677', 720, true, current_date - 95),
  ('a1000000-0000-4000-8000-000000000003', 'I.E. Mariscal Luzuriaga', 'colegio', 'Áncash', 'Huaraz', 'Independencia',
   'Carmen Príncipe Vega', 'Directora', 'luzuriaga@demo.edu.pe', '+51 945 778 899', 350, true, current_date - 60),
  ('a1000000-0000-4000-8000-000000000004', 'I.E. Túpac Amaru', 'colegio', 'Cusco', 'Cusco', 'Wanchaq',
   'Julio Huamán Quispe', 'Director', 'tupacamaru@demo.edu.pe', '+51 946 889 900', 610, true, current_date - 30),
  ('a1000000-0000-4000-8000-000000000005', 'I.E. José Carlos Mariátegui', 'colegio', 'Arequipa', 'Arequipa', 'Cerro Colorado',
   'Elena Torres Fuentes', 'Directora', 'mariategui@demo.edu.pe', '+51 947 990 011', 540, false, null),
  ('a1000000-0000-4000-8000-000000000006', 'Universidad Nacional del Santa', 'universidad', 'Áncash', 'Santa', 'Nuevo Chimbote',
   'Oficina de RSU', 'Coordinación RSU', 'rsu@demo.uns.edu.pe', '+51 943 220 011', 9000, true, current_date - 45),
  ('a1000000-0000-4000-8000-000000000007', 'Minera Andes Sostenible S.A.', 'empresa', 'Áncash', 'Huari', 'San Marcos',
   'Patricia Salas Ríos', 'Gerente de Sostenibilidad', 'rse@demo-andes.com.pe', '+51 948 111 222', null, true, current_date - 20)
on conflict (id) do nothing;


-- ═══════════════════════════════════════════════════════════
-- 2 · USUARIOS DE LOS 6 ROLES
-- ═══════════════════════════════════════════════════════════

do $$
declare
  u uuid;
begin
  -- ── Equipo SEP ──
  perform demo_user('b1000000-0000-4000-8000-000000000001', 'celeste@sep.pe',
    'Celeste Ulloa Jara', 'super_admin', 'Áncash',
    '{"province":"Casma","bio":"Managing Director de SEP. Emprende hoy, lidera mañana.",
      "current_situation":"Emprendedor"}'::jsonb);

  perform demo_user('b1000000-0000-4000-8000-000000000002', 'diana@sep.pe',
    'Diana Gamboa Reyes', 'admin', 'Áncash',
    '{"bio":"CMO — Content & Social Media Analyst en SEP."}'::jsonb);

  perform demo_user('b1000000-0000-4000-8000-000000000003', 'jhon@sep.pe',
    'Jhon Aracayo Medina', 'admin', 'Áncash',
    '{"bio":"CTO en SEP. Construyendo la plataforma."}'::jsonb);

  -- ── Estudiantes ──
  perform demo_user('b1000000-0000-4000-8000-000000000010', 'andrea@demo.sep.pe',
    'Andrea Núñez Salas', 'estudiante', 'Arequipa',
    '{"university":"Universidad Nacional de San Agustín","career":"Ingeniería Industrial",
      "study_cycle":"6to","current_situation":"Universitario (4to ciclo en adelante)",
      "bio":"Me interesa el diseño de soluciones para mi comunidad.",
      "interests":["Design Thinking","Liderazgo e impacto social"]}'::jsonb);

  perform demo_user('b1000000-0000-4000-8000-000000000011', 'ricardo@demo.sep.pe',
    'Ricardo Mamani Ccama', 'estudiante', 'Cusco',
    '{"university":"Universidad Nacional San Antonio Abad","career":"Administración",
      "study_cycle":"4to","current_situation":"Universitario (4to ciclo en adelante)",
      "interests":["Scrum y gestión ágil","Emprendimiento desde cero"]}'::jsonb);

  perform demo_user('b1000000-0000-4000-8000-000000000012', 'lucia@demo.sep.pe',
    'Lucía Vega Príncipe', 'estudiante', 'Áncash',
    '{"university":"Universidad Nacional del Santa","career":"Ingeniería de Sistemas",
      "study_cycle":"8vo","current_situation":"Universitario (4to ciclo en adelante)",
      "bio":"Coordinadora de la comunidad SEP en Áncash.",
      "interests":["Design Thinking","Gestión de proyectos sociales"]}'::jsonb);

  perform demo_user('b1000000-0000-4000-8000-000000000013', 'kevin@demo.sep.pe',
    'Kevin Quispe Apaza', 'estudiante', 'Puno',
    '{"university":"Universidad Nacional del Altiplano","career":"Economía",
      "study_cycle":"2do","current_situation":"Universitario (1er al 3er ciclo)",
      "interests":["Oratoria y comunicación","Liderazgo e impacto social"]}'::jsonb);

  perform demo_user('b1000000-0000-4000-8000-000000000014', 'milagros@demo.sep.pe',
    'Milagros Fernández Cruz', 'estudiante', 'La Libertad',
    '{"university":"Universidad Nacional de Trujillo","career":"Educación",
      "study_cycle":"5to","current_situation":"Universitario (4to ciclo en adelante)",
      "interests":["Cómo dictar talleres y capacitar"]}'::jsonb);

  perform demo_user('b1000000-0000-4000-8000-000000000015', 'diego@demo.sep.pe',
    'Diego Paredes Loayza', 'estudiante', 'Huánuco',
    '{"university":"Universidad Nacional Hermilio Valdizán","career":"Ingeniería Ambiental",
      "study_cycle":"3ro","current_situation":"Universitario (1er al 3er ciclo)"}'::jsonb);

  -- ── Docentes ──
  perform demo_user('b1000000-0000-4000-8000-000000000020', 'rosa@demo.sep.pe',
    'Rosa Chávez Domínguez', 'docente', 'Áncash',
    '{"province":"Casma","bio":"Directora de la I.E. San Bartolomé. 22 años en aula."}'::jsonb);

  perform demo_user('b1000000-0000-4000-8000-000000000021', 'julio@demo.sep.pe',
    'Julio Huamán Quispe', 'docente', 'Cusco',
    '{"bio":"Docente de CTA en secundaria. Buscando innovar en mi aula."}'::jsonb);

  -- ── Speakers ──
  perform demo_user('b1000000-0000-4000-8000-000000000030', 'marco@demo.sep.pe',
    'Marco Cárdenas Ruiz', 'speaker', 'Lima',
    '{"bio":"Facilitador en Design Thinking. Formo a 200 jóvenes al año."}'::jsonb);

  perform demo_user('b1000000-0000-4000-8000-000000000031', 'valeria@demo.sep.pe',
    'Valeria Ríos Osorio', 'speaker', 'Vivo en otro país',
    '{"bio":"Scrum Master y referente de agilidad social en Bogotá."}'::jsonb);

  -- ── Instituciones ──
  perform demo_user('b1000000-0000-4000-8000-000000000040', 'colegio@demo.sep.pe',
    'Luis Ramírez Solís', 'institucion', 'Áncash',
    '{"province":"Santa","bio":"Director de la I.E. República de Perú."}'::jsonb);

  perform demo_user('b1000000-0000-4000-8000-000000000041', 'empresa@demo.sep.pe',
    'Patricia Salas Ríos', 'institucion', 'Áncash',
    '{"bio":"Gerente de Sostenibilidad — Minera Andes Sostenible."}'::jsonb);
end $$;

-- ── Roles acumulados (§5.2: un usuario real acumula roles) ──
insert into user_roles (user_id, role) values
  ('b1000000-0000-4000-8000-000000000001', 'estudiante'),
  ('b1000000-0000-4000-8000-000000000001', 'mentor'),
  ('b1000000-0000-4000-8000-000000000002', 'estudiante'),
  ('b1000000-0000-4000-8000-000000000010', 'mentor'),
  ('b1000000-0000-4000-8000-000000000012', 'mentor')
on conflict (user_id, role) do nothing;

-- ── Vincular cuentas institucionales ──
update profiles set institution_id = 'a1000000-0000-4000-8000-000000000002'
 where id = 'b1000000-0000-4000-8000-000000000040';
update profiles set institution_id = 'a1000000-0000-4000-8000-000000000007'
 where id = 'b1000000-0000-4000-8000-000000000041';
update profiles set institution_id = 'a1000000-0000-4000-8000-000000000001'
 where id = 'b1000000-0000-4000-8000-000000000020';
update profiles set institution_id = 'a1000000-0000-4000-8000-000000000004'
 where id = 'b1000000-0000-4000-8000-000000000021';


-- ═══════════════════════════════════════════════════════════
-- 3 · SESIONES DE LOS CURSOS RESTANTES
-- ═══════════════════════════════════════════════════════════

insert into course_sessions (course_id, number, week, title, subtitle, description)
select c.id, s.n, s.w, s.t, s.st, s.d
from courses c,
(values
  (1,1,'Fundamentos de Scrum','Roles, eventos y artefactos','Qué es Scrum, para qué sirve y en qué se diferencia de la gestión tradicional.'),
  (2,1,'El backlog de tu proyecto social','Historias de usuario con impacto','Cómo traducir necesidades reales de tu comunidad en historias priorizables.'),
  (3,1,'Sprint planning en equipos voluntarios','Estimación y compromiso','Planificar cuando nadie cobra: motivación, capacidad real y compromisos honestos.'),
  (4,2,'Daily y tablero visual','Kanban con lo que tengas a mano','Tablero físico o digital. Cómo hacer que el equipo se vea a sí mismo avanzar.'),
  (5,2,'Review con la comunidad','Mostrar antes de terminar','Cómo presentar avances a los beneficiarios reales y recoger su feedback.'),
  (6,2,'Retrospectiva y mejora continua','Aprender del sprint','Formatos de retro que funcionan en equipos jóvenes y voluntarios.')
) as s(n,w,t,st,d)
where c.slug = 'scrum-proyectos-sociales'
on conflict (course_id, number) do nothing;

insert into course_sessions (course_id, number, week, title, subtitle, description)
select c.id, s.n, s.w, s.t, s.st, s.d
from courses c,
(values
  (1,1,'¿Qué tipo de líder eres?','Autodiagnóstico','Estilos de liderazgo y cuál encaja con tu forma de ser y tu contexto.'),
  (2,1,'Hablar sin miedo','Oratoria desde cero','Estructura de un mensaje, manejo del cuerpo y la voz. Práctica en vivo.'),
  (3,1,'Contar tu historia','Storytelling con propósito','Cómo tu origen regional es una fortaleza y no una desventaja.'),
  (4,2,'Construir equipo desde tu región','Reclutar y motivar','Cómo formar un equipo cuando no tienes presupuesto ni oficina.'),
  (5,2,'Decidir bajo incertidumbre','Toma de decisiones','Marcos simples para decidir con poca información y mucha presión.'),
  (6,2,'Tu plan de liderazgo a 12 meses','Cierre y compromiso','Diseñas tu ruta concreta y la presentas al grupo.')
) as s(n,w,t,st,d)
where c.slug = 'liderazgo-impacto-regional'
on conflict (course_id, number) do nothing;

insert into course_sessions (course_id, number, week, title, subtitle, description)
select c.id, s.n, s.w, s.t, s.st, s.d
from courses c,
(values
  (1,1,'Metodologías activas: el panorama','ABP, DT, Scrum en el aula','Qué es cada una, cuándo usarla y qué necesitas para empezar.'),
  (2,1,'Design Thinking con escolares','Adaptar el método a 3ro–5to','Cómo simplificar las 5 etapas sin perder la esencia.'),
  (3,1,'Diseñar una sesión activa','De la teoría al plan de clase','Plantilla de sesión de 90 minutos lista para tu próxima semana.'),
  (4,2,'Scrum para gestionar tu clase','Tablero y ciclos cortos','Organizar proyectos largos con estudiantes de secundaria.'),
  (5,2,'Evaluar por competencias','Rúbricas que sí funcionan','Evaluar procesos y no solo productos, con evidencia observable.'),
  (6,2,'Tu proyecto de aula','Presentación final','Diseñas un proyecto real para aplicar el próximo bimestre.')
) as s(n,w,t,st,d)
where c.slug = 'metodologias-agiles-en-el-aula'
on conflict (course_id, number) do nothing;

-- Fechas de la cohorte activa del Curso 1 (interdiario, 7:00 pm)
update course_sessions cs
   set scheduled_at = (current_date - interval '10 days' + (cs.number - 1) * interval '2 days' + interval '19 hours'),
       status = case
                  when cs.number <= 3 then 'finalizada'::session_status
                  when cs.number = 4 then 'programada'::session_status
                  else 'programada'::session_status
                end,
       meet_url = 'https://meet.google.com/sep-dt-' || lpad(cs.number::text, 3, '0')
  from courses c
 where c.id = cs.course_id and c.slug = 'design-thinking-aplicado';


-- ═══════════════════════════════════════════════════════════
-- 4 · INSCRIPCIONES Y PROGRESO
-- ═══════════════════════════════════════════════════════════

do $$
declare
  v_dt   uuid;
  v_silp uuid;
  v_user uuid;
  v_enr  uuid;
  v_n    int;
  users_progress record;
begin
  select id into v_dt   from courses where slug = 'design-thinking-aplicado';
  select id into v_silp from courses where slug = 'silp';

  for users_progress in
    select * from (values
      ('b1000000-0000-4000-8000-000000000010'::uuid, 6),  -- Andrea: completado
      ('b1000000-0000-4000-8000-000000000011'::uuid, 3),  -- Ricardo: a la mitad
      ('b1000000-0000-4000-8000-000000000012'::uuid, 6),  -- Lucía: completado
      ('b1000000-0000-4000-8000-000000000013'::uuid, 2),  -- Kevin: empezando
      ('b1000000-0000-4000-8000-000000000014'::uuid, 5),  -- Milagros: casi
      ('b1000000-0000-4000-8000-000000000015'::uuid, 1),  -- Diego: primera sesión
      ('b1000000-0000-4000-8000-000000000001'::uuid, 6)   -- Celeste: completado
    ) as t(uid, done)
  loop
    v_user := users_progress.uid;

    insert into enrollments (user_id, course_id, enrolled_at)
    values (v_user, v_dt, now() - interval '14 days')
    on conflict (user_id, course_id, cohort) do nothing
    returning id into v_enr;

    if v_enr is null then
      select id into v_enr from enrollments
       where user_id = v_user and course_id = v_dt and cohort = 'default';
    end if;

    for v_n in 1..users_progress.done loop
      insert into session_progress (enrollment_id, session_id, attended, completed_at)
      select v_enr, cs.id, true, now() - (6 - v_n) * interval '2 days'
        from course_sessions cs
       where cs.course_id = v_dt and cs.number = v_n
      on conflict (enrollment_id, session_id) do nothing;
    end loop;
  end loop;

  -- SILP: Andrea y Lucía en curso
  insert into enrollments (user_id, course_id, progress_pct, enrolled_at)
  values
    ('b1000000-0000-4000-8000-000000000010', v_silp, 16, now() - interval '7 days'),
    ('b1000000-0000-4000-8000-000000000012', v_silp, 33, now() - interval '9 days')
  on conflict (user_id, course_id, cohort) do nothing;
end $$;


-- ═══════════════════════════════════════════════════════════
-- 5 · PAGOS EN LOS 3 ESTADOS + CERTIFICADOS
-- ═══════════════════════════════════════════════════════════

do $$
declare
  v_cert_sep  uuid;
  v_cert_int  uuid;
  v_order     uuid;
  v_enr       uuid;
  v_cert      uuid;
begin
  select id into v_cert_sep from certificate_types where kind = 'sep';
  select id into v_cert_int from certificate_types where kind = 'internacional';

  -- ── (a) PAGADO Y EMITIDO — Andrea, certificado internacional ──
  select id into v_enr from enrollments
   where user_id = 'b1000000-0000-4000-8000-000000000010'
     and course_id = (select id from courses where slug = 'design-thinking-aplicado');

  insert into orders (id, user_id, item_type, item_id, amount_cents, status, created_at)
  values ('c1000000-0000-4000-8000-000000000001',
          'b1000000-0000-4000-8000-000000000010', 'certificate', v_cert_int, 5000,
          'pagado', now() - interval '4 days')
  on conflict (id) do nothing;

  insert into payments (order_id, method, amount_cents, status, operation_code,
                        voucher_url, paid_at, reviewed_by, reviewed_at)
  values ('c1000000-0000-4000-8000-000000000001', 'yape', 5000, 'pagado', '00412873',
          'vouchers/b1000000-0000-4000-8000-000000000010/demo-yape-01.jpg',
          now() - interval '3 days', 'b1000000-0000-4000-8000-000000000002', now() - interval '3 days')
  on conflict do nothing;

  insert into certificates (id, user_id, enrollment_id, certificate_type_id,
                            verification_code, status, issued_at, issued_by)
  values ('d1000000-0000-4000-8000-000000000001',
          'b1000000-0000-4000-8000-000000000010', v_enr, v_cert_int,
          'SEP-2026-A7K3M9', 'emitido', now() - interval '3 days',
          'b1000000-0000-4000-8000-000000000002')
  on conflict (id) do nothing;

  -- ── (b) PAGADO Y EMITIDO — Lucía, certificado SEP ──
  select id into v_enr from enrollments
   where user_id = 'b1000000-0000-4000-8000-000000000012'
     and course_id = (select id from courses where slug = 'design-thinking-aplicado');

  insert into orders (id, user_id, item_type, item_id, amount_cents, status, created_at)
  values ('c1000000-0000-4000-8000-000000000002',
          'b1000000-0000-4000-8000-000000000012', 'certificate', v_cert_sep, 3000,
          'pagado', now() - interval '6 days')
  on conflict (id) do nothing;

  insert into payments (order_id, method, amount_cents, status, operation_code,
                        voucher_url, paid_at, reviewed_by, reviewed_at)
  values ('c1000000-0000-4000-8000-000000000002', 'plin', 3000, 'pagado', '77120945',
          'vouchers/b1000000-0000-4000-8000-000000000012/demo-plin-01.jpg',
          now() - interval '5 days', 'b1000000-0000-4000-8000-000000000002', now() - interval '5 days')
  on conflict do nothing;

  insert into certificates (id, user_id, enrollment_id, certificate_type_id,
                            verification_code, status, issued_at, issued_by)
  values ('d1000000-0000-4000-8000-000000000002',
          'b1000000-0000-4000-8000-000000000012', v_enr, v_cert_sep,
          'SEP-2026-B2Q8X4', 'emitido', now() - interval '5 days',
          'b1000000-0000-4000-8000-000000000002')
  on conflict (id) do nothing;

  -- ── (c) EN REVISIÓN — Milagros subió su voucher, espera conciliación ──
  insert into orders (id, user_id, item_type, item_id, amount_cents, status, created_at)
  values ('c1000000-0000-4000-8000-000000000003',
          'b1000000-0000-4000-8000-000000000014', 'certificate', v_cert_sep, 3000,
          'en_revision', now() - interval '8 hours')
  on conflict (id) do nothing;

  insert into payments (order_id, method, amount_cents, status, operation_code, voucher_url)
  values ('c1000000-0000-4000-8000-000000000003', 'yape', 3000, 'en_revision', '00518402',
          'vouchers/b1000000-0000-4000-8000-000000000014/demo-yape-02.jpg')
  on conflict do nothing;

  insert into certificates (user_id, certificate_type_id, status)
  values ('b1000000-0000-4000-8000-000000000014', v_cert_sep, 'pendiente')
  on conflict do nothing;

  -- ── (d) RECHAZADO — código de operación no coincide ──
  insert into orders (id, user_id, item_type, item_id, amount_cents, status, created_at)
  values ('c1000000-0000-4000-8000-000000000004',
          'b1000000-0000-4000-8000-000000000013', 'certificate', v_cert_sep, 3000,
          'rechazado', now() - interval '2 days')
  on conflict (id) do nothing;

  insert into payments (order_id, method, amount_cents, status, operation_code,
                        voucher_url, reject_reason, reviewed_by, reviewed_at)
  values ('c1000000-0000-4000-8000-000000000004', 'yape', 3000, 'rechazado', '00000000',
          'vouchers/b1000000-0000-4000-8000-000000000013/demo-yape-03.jpg',
          'El código de operación no coincide con ningún movimiento recibido. Vuelve a enviarlo con la captura completa.',
          'b1000000-0000-4000-8000-000000000002', now() - interval '1 day')
  on conflict do nothing;

  -- ── (e) MEMBRESÍA ACTIVA — Andrea, plan Tronco ──
  insert into orders (id, user_id, item_type, item_id, amount_cents, status, created_at)
  select 'c1000000-0000-4000-8000-000000000005',
         'b1000000-0000-4000-8000-000000000010', 'membership', mp.id, mp.price_cents,
         'pagado', now() - interval '20 days'
    from membership_plans mp where mp.slug = 'tronco'
  on conflict (id) do nothing;

  insert into payments (order_id, method, amount_cents, status, operation_code, paid_at,
                        reviewed_by, reviewed_at)
  values ('c1000000-0000-4000-8000-000000000005', 'culqi_card', 8000, 'pagado', 'chr_test_9x2k',
          now() - interval '20 days', 'b1000000-0000-4000-8000-000000000002', now() - interval '20 days')
  on conflict do nothing;

  insert into memberships (user_id, plan_id, starts_at, ends_at, order_id)
  select 'b1000000-0000-4000-8000-000000000010', mp.id,
         now() - interval '20 days', now() + interval '160 days',
         'c1000000-0000-4000-8000-000000000005'
    from membership_plans mp where mp.slug = 'tronco'
  on conflict do nothing;

  -- ── (f) Certificados de voluntariado ──
  insert into certificates (user_id, certificate_type_id, verification_code, status, issued_at)
  select 'b1000000-0000-4000-8000-000000000012', ct.id, 'SEP-2026-V5N1P7', 'emitido',
         now() - interval '15 days'
    from certificate_types ct where ct.kind = 'voluntariado'
  on conflict do nothing;
end $$;


-- ═══════════════════════════════════════════════════════════
-- 6 · VOLUNTARIADO
-- ═══════════════════════════════════════════════════════════

insert into volunteer_profiles (user_id, type, started_at, hours_committed) values
  ('b1000000-0000-4000-8000-000000000010', 'mentor_junior',     current_date - 90, 4),
  ('b1000000-0000-4000-8000-000000000012', 'mentor_senior',     current_date - 150, 6),
  ('b1000000-0000-4000-8000-000000000001', 'event_organizer',   current_date - 400, 10)
on conflict (user_id) do nothing;

insert into volunteer_hours (user_id, date, hours, activity, approved_by, approved_at) values
  ('b1000000-0000-4000-8000-000000000010', current_date - 2,  2.0, 'Mentoría 1:1 con Kevin Quispe (proyecto de biblioteca comunal)', 'b1000000-0000-4000-8000-000000000002', now()),
  ('b1000000-0000-4000-8000-000000000010', current_date - 5,  3.0, 'Facilitación de la sesión 3 de Design Thinking', 'b1000000-0000-4000-8000-000000000002', now()),
  ('b1000000-0000-4000-8000-000000000010', current_date - 9,  2.5, 'Revisión de prototipos de la cohorte', 'b1000000-0000-4000-8000-000000000002', now()),
  ('b1000000-0000-4000-8000-000000000010', current_date - 1,  1.5, 'Preparación del taller en I.E. San Bartolomé', null, null),
  ('b1000000-0000-4000-8000-000000000012', current_date - 3,  4.0, 'Taller de Design Thinking en I.E. República de Perú', 'b1000000-0000-4000-8000-000000000002', now()),
  ('b1000000-0000-4000-8000-000000000012', current_date - 7,  3.0, 'Coordinación del Demo Day Áncash', 'b1000000-0000-4000-8000-000000000002', now()),
  ('b1000000-0000-4000-8000-000000000012', current_date - 12, 2.0, 'Mentoría grupal con la cohorte de Cusco', 'b1000000-0000-4000-8000-000000000002', now())
on conflict do nothing;

insert into mentorships (mentor_id, mentee_id, started_at, notes) values
  ('b1000000-0000-4000-8000-000000000010', 'b1000000-0000-4000-8000-000000000013', current_date - 20, 'Proyecto: biblioteca comunal en Puno. Muy motivado, necesita apoyo en oratoria.'),
  ('b1000000-0000-4000-8000-000000000010', 'b1000000-0000-4000-8000-000000000015', current_date - 12, 'Proyecto: gestión de residuos en su barrio. Avanza bien.'),
  ('b1000000-0000-4000-8000-000000000012', 'b1000000-0000-4000-8000-000000000011', current_date - 30, 'Proyecto: app de turismo comunitario. Listo para Demo Day.'),
  ('b1000000-0000-4000-8000-000000000012', 'b1000000-0000-4000-8000-000000000014', current_date - 25, 'Proyecto: club de lectura escolar. Quiere replicarlo en 3 colegios.')
on conflict do nothing;

-- Postulaciones en distintos estados del embudo
insert into volunteer_applications
  (volunteer_role_id, user_id, full_name, email, phone, region, university, career_cycle,
   motivation, completed_courses, status, created_at)
-- `a.st` sale de un VALUES, así que Postgres lo tipa como text:
-- hay que castearlo explícitamente al enum.
select vr.id, a.uid, a.name, a.email, a.phone, a.region, a.uni, a.cycle,
       a.mot, a.courses, a.st::application_status, a.created
from volunteer_roles vr,
(values
  ('mentor', 'b1000000-0000-4000-8000-000000000011'::uuid, 'Ricardo Mamani Ccama', 'ricardo@demo.sep.pe',
   '+51 984 221 334', 'Cusco', 'UNSAAC', 'Administración · 4to ciclo',
   'Quiero devolver lo que recibí. En mi región no hay nadie que acompañe a los que recién empiezan.',
   'Sí — Design Thinking aplicado', 'entrevista', now() - interval '3 days'),
  ('mentor', null, 'Ana Lucía Ferrer Ríos', 'analucia@demo.sep.pe',
   '+51 977 445 221', 'Piura', 'Universidad Nacional de Piura', 'Psicología · 7mo ciclo',
   'Trabajo con jóvenes en riesgo y quiero herramientas de innovación social para acompañarlos mejor.',
   'No, pero quiero empezar', 'recibida', now() - interval '1 day'),
  ('community-manager', null, 'Sebastián Ríos Alvarado', 'sebastian@demo.sep.pe',
   '+51 966 112 998', 'Lima', 'UPC', 'Comunicaciones · 6to ciclo',
   'Manejo redes de dos colectivos juveniles. Quiero aportar a algo que llegue a regiones.',
   'Sí — Design Thinking aplicado', 'en_revision', now() - interval '5 days'),
  ('organizador-eventos', 'b1000000-0000-4000-8000-000000000014'::uuid, 'Milagros Fernández Cruz', 'milagros@demo.sep.pe',
   '+51 955 663 001', 'La Libertad', 'UNT', 'Educación · 5to ciclo',
   'Organicé la semana de la juventud en mi facultad para 300 personas. Quiero hacerlo con propósito.',
   'Sí — Design Thinking aplicado', 'aprobada', now() - interval '25 days'),
  ('mentor', null, 'Carlos Enrique Ticona', 'carlos@demo.sep.pe',
   '+51 933 887 665', 'Tacna', 'UNJBG', 'Ingeniería Civil · 9no ciclo',
   'Me interesa el impacto pero no tengo tiempo suficiente ahora mismo.',
   'No', 'rechazada', now() - interval '18 days')
) as a(role_slug, uid, name, email, phone, region, uni, cycle, mot, courses, st, created)
where vr.slug = a.role_slug
on conflict do nothing;


-- ═══════════════════════════════════════════════════════════
-- 7 · SPEAKERS
-- ═══════════════════════════════════════════════════════════

insert into speaker_profiles
  (user_id, full_name, email, country, region, expertise, topics, story, opportunities,
   talk_experience, availability, linkedin_url, is_approved, is_public)
values
  ('b1000000-0000-4000-8000-000000000030', 'Marco Cárdenas Ruiz', 'marco@demo.sep.pe', 'PE', 'Lima',
   'Facilitador en Design Thinking · Emprendedor social',
   array['Design Thinking','Innovación regional','Emprendimiento'],
   'Dejé un trabajo corporativo para dedicarme al impacto social. Hoy formo a 200 jóvenes al año en metodologías de innovación.',
   'El impacto social me dio la claridad que ningún trabajo corporativo me dio.',
   'Sí, varias veces', 'Sí, estoy disponible', 'https://linkedin.com/in/demo-marco', true, true),

  ('b1000000-0000-4000-8000-000000000031', 'Valeria Ríos Osorio', 'valeria@demo.sep.pe', 'CO', 'Bogotá',
   'Scrum Master · Agilidad para impacto social',
   array['Scrum','Lean Startup','OKRs'],
   'Vengo de una región sin recursos y la innovación social fue mi trampolín. Hoy hablo en conferencias de todo Latam.',
   'Conseguí mi primer cliente gracias a mi red de voluntariado.',
   'Sí, varias veces', 'Depende de la fecha', 'https://linkedin.com/in/demo-valeria', true, true),

  (null, 'Jorge Medina Sotelo', 'jorge@demo.sep.pe', 'PE', 'Arequipa',
   'Liderazgo social · Fundador de colectivo juvenil',
   array['Liderazgo social','Innovación regional'],
   'Llegué sin experiencia a un taller de liderazgo. Hoy tengo mi propio programa y fui speaker en Star Lima.',
   'Fui invitado a hablar en Star Lima y armé una red de 40 voluntarios.',
   'Solo una vez', 'Sí, estoy disponible', null, true, true),

  (null, 'Paola Bermúdez Quintana', 'paola@demo.sep.pe', 'PE', 'Piura',
   'Gestión de proyectos sociales',
   array['Gestión de proyectos sociales','Emprendimiento'],
   'Coordino proyectos de agua en comunidades rurales del norte. Quiero compartir lo aprendido en el terreno.',
   'Acceso a fondos de cooperación internacional.',
   'Aún no, quiero empezar', 'Sí, estoy disponible', null, false, false)
on conflict do nothing;


-- ═══════════════════════════════════════════════════════════
-- 8 · EVENTOS Y DEMO DAY
-- ═══════════════════════════════════════════════════════════

insert into events (id, slug, title, description, kind, starts_at, ends_at,
                    location, is_online, meet_url, capacity, is_published)
values
  ('e1000000-0000-4000-8000-000000000001', 'demo-day-ancash-2026',
   'Demo Day Áncash 2026',
   'Los egresados de la cohorte de Design Thinking presentan sus proyectos de innovación social ante mentores, aliados y sus comunidades.',
   'demo_day', now() + interval '12 days', now() + interval '12 days' + interval '4 hours',
   'Auditorio UNS · Nuevo Chimbote', false, null, 200, true),

  ('e1000000-0000-4000-8000-000000000002', 'webinar-scrum-social',
   'Webinar: Scrum para proyectos que no tienen presupuesto',
   'Sesión abierta con Valeria Ríos (Bogotá) sobre cómo aplicar agilidad en equipos voluntarios.',
   'webinar', now() + interval '5 days', now() + interval '5 days' + interval '90 minutes',
   null, true, 'https://meet.google.com/sep-webinar-scrum', 500, true),

  ('e1000000-0000-4000-8000-000000000003', 'feria-innovacion-casma',
   'Feria de Innovación Escolar — Casma',
   'Estudiantes de 3ro a 5to de la I.E. San Bartolomé exponen los prototipos que diseñaron con mentores universitarios.',
   'feria', now() - interval '18 days', now() - interval '18 days' + interval '5 hours',
   'I.E. San Bartolomé · Casma', false, null, 150, true),

  ('e1000000-0000-4000-8000-000000000004', 'taller-oratoria-abierto',
   'Taller abierto de oratoria para jóvenes de regiones',
   'Dos horas prácticas para perder el miedo a hablar en público. Sin requisitos previos.',
   'taller', now() + interval '22 days', now() + interval '22 days' + interval '2 hours',
   null, true, 'https://meet.google.com/sep-oratoria', 300, true)
on conflict (id) do nothing;

insert into event_registrations (event_id, user_id, attended) values
  ('e1000000-0000-4000-8000-000000000001', 'b1000000-0000-4000-8000-000000000010', false),
  ('e1000000-0000-4000-8000-000000000001', 'b1000000-0000-4000-8000-000000000011', false),
  ('e1000000-0000-4000-8000-000000000001', 'b1000000-0000-4000-8000-000000000012', false),
  ('e1000000-0000-4000-8000-000000000001', 'b1000000-0000-4000-8000-000000000013', false),
  ('e1000000-0000-4000-8000-000000000002', 'b1000000-0000-4000-8000-000000000011', false),
  ('e1000000-0000-4000-8000-000000000002', 'b1000000-0000-4000-8000-000000000015', false),
  ('e1000000-0000-4000-8000-000000000003', 'b1000000-0000-4000-8000-000000000012', true),
  ('e1000000-0000-4000-8000-000000000003', 'b1000000-0000-4000-8000-000000000010', true)
on conflict (event_id, user_id) do nothing;

insert into speaker_invitations (speaker_id, event_id, topic, proposed_at, status)
select sp.id, 'e1000000-0000-4000-8000-000000000002',
       'Scrum para proyectos que no tienen presupuesto', now() + interval '5 days', 'aceptada'
  from speaker_profiles sp where sp.email = 'valeria@demo.sep.pe'
on conflict do nothing;

insert into speaker_invitations (speaker_id, event_id, topic, proposed_at, status)
select sp.id, 'e1000000-0000-4000-8000-000000000001',
       'Charla de apertura: por qué el talento regional gana', now() + interval '12 days', 'pendiente'
  from speaker_profiles sp where sp.email = 'marco@demo.sep.pe'
on conflict do nothing;


-- ═══════════════════════════════════════════════════════════
-- 9 · TALLERES EN COLEGIOS
-- ═══════════════════════════════════════════════════════════

insert into workshops (id, institution_id, title, topic, scheduled_at, modality, grade,
                       students_count, status, requested_by)
values
  ('f1000000-0000-4000-8000-000000000001', 'a1000000-0000-4000-8000-000000000001',
   'Design Thinking para escolares — Sesión 1', 'Design Thinking',
   now() - interval '40 days', 'presencial', '4to de secundaria', 32, 'realizado',
   'b1000000-0000-4000-8000-000000000020'),
  ('f1000000-0000-4000-8000-000000000002', 'a1000000-0000-4000-8000-000000000001',
   'Design Thinking para escolares — Sesión 2', 'Design Thinking',
   now() - interval '33 days', 'presencial', '4to de secundaria', 30, 'realizado',
   'b1000000-0000-4000-8000-000000000020'),
  ('f1000000-0000-4000-8000-000000000003', 'a1000000-0000-4000-8000-000000000002',
   'Liderazgo estudiantil', 'Liderazgo',
   now() - interval '25 days', 'presencial', '5to de secundaria', 41, 'realizado',
   'b1000000-0000-4000-8000-000000000040'),
  ('f1000000-0000-4000-8000-000000000004', 'a1000000-0000-4000-8000-000000000002',
   'Prototipado rápido con materiales reciclados', 'Design Thinking',
   now() - interval '11 days', 'presencial', '3ro de secundaria', 38, 'realizado',
   'b1000000-0000-4000-8000-000000000040'),
  ('f1000000-0000-4000-8000-000000000005', 'a1000000-0000-4000-8000-000000000002',
   'Taller de oratoria y presentación de ideas', 'Oratoria',
   now() + interval '9 days', 'presencial', '5to de secundaria', 40, 'confirmado',
   'b1000000-0000-4000-8000-000000000040'),
  ('f1000000-0000-4000-8000-000000000006', 'a1000000-0000-4000-8000-000000000004',
   'Introducción a la innovación social', 'Innovación social',
   now() + interval '20 days', 'presencial', '4to de secundaria', 35, 'solicitado',
   'b1000000-0000-4000-8000-000000000021'),
  ('f1000000-0000-4000-8000-000000000007', 'a1000000-0000-4000-8000-000000000003',
   'Design Thinking aplicado al barrio', 'Design Thinking',
   now() - interval '52 days', 'presencial', '4to y 5to', 28, 'realizado', null)
on conflict (id) do nothing;

insert into workshop_facilitators (workshop_id, user_id) values
  ('f1000000-0000-4000-8000-000000000001', 'b1000000-0000-4000-8000-000000000012'),
  ('f1000000-0000-4000-8000-000000000002', 'b1000000-0000-4000-8000-000000000012'),
  ('f1000000-0000-4000-8000-000000000003', 'b1000000-0000-4000-8000-000000000010'),
  ('f1000000-0000-4000-8000-000000000004', 'b1000000-0000-4000-8000-000000000012'),
  ('f1000000-0000-4000-8000-000000000004', 'b1000000-0000-4000-8000-000000000010'),
  ('f1000000-0000-4000-8000-000000000005', 'b1000000-0000-4000-8000-000000000010'),
  ('f1000000-0000-4000-8000-000000000007', 'b1000000-0000-4000-8000-000000000012')
on conflict do nothing;

-- Escolares: solo nombre y grado, anonimizados por defecto en la UI (§9.5)
insert into workshop_attendees (workshop_id, student_name, grade, attended)
select w.id,
       (array['A. Quispe','M. Torres','J. Ramírez','L. Vargas','C. Rojas','S. Mendoza',
              'D. Flores','P. Castillo','R. Sánchez','V. Espinoza','N. Guerrero','F. Herrera'])[1 + (n % 12)]
         || ' ' || chr(65 + (n % 26)) || '.',
       w.grade,
       (n % 10) <> 0
  from workshops w
 cross join generate_series(1, 26) as n
 where w.status = 'realizado'
on conflict do nothing;

insert into school_applications
  (school_name, region, province, director_name, contact_phone, contact_email,
   students_3to5, expectations, status, created_at)
values
  ('I.E. Nuestra Señora del Carmen', 'Junín', 'Huancayo', 'Marisol Camargo Pérez',
   '+51 964 332 118', 'carmen@demo.edu.pe', 180,
   'Queremos talleres de Design Thinking y que nuestros estudiantes conozcan a universitarios de la región.',
   'recibida', now() - interval '2 days'),
  ('I.E. Ricardo Palma', 'Piura', 'Sullana', 'Óscar Zapata Ruiz',
   '+51 969 887 200', 'ricardopalma@demo.edu.pe', 220,
   'Nos interesa el programa completo: talleres, mentores y el Demo Day.',
   'en_revision', now() - interval '6 days'),
  ('I.E. Simón Bolívar', 'Puno', 'Puno', 'Yeny Condori Mamani',
   '+51 951 224 776', 'bolivar@demo.edu.pe', 140,
   'Nuestros estudiantes no tienen referentes cercanos. Queremos cambiar eso.',
   'aprobada', now() - interval '15 days'),
  ('I.E. Micaela Bastidas', 'Apurímac', 'Abancay', 'Wilfredo Alarcón Peña',
   '+51 983 665 442', 'micaela@demo.edu.pe', 95,
   'Buscamos formar un club de innovación con acompañamiento externo.',
   'recibida', now() - interval '9 hours')
on conflict do nothing;


-- ═══════════════════════════════════════════════════════════
-- 10 · COMUNIDAD
-- ═══════════════════════════════════════════════════════════

insert into posts (id, user_id, course_id, content, is_pinned, created_at)
select p.id, p.uid, c.id, p.content, p.pinned, p.created
from (values
  ('11100000-0000-4000-8000-000000000001'::uuid, 'b1000000-0000-4000-8000-000000000012'::uuid,
   'Demo Day confirmado para dentro de dos semanas. Ya hay 12 proyectos inscritos de 6 regiones. Si aún no registras el tuyo, escríbeme por acá. 🎉',
   true, now() - interval '1 day'),
  ('11100000-0000-4000-8000-000000000002'::uuid, 'b1000000-0000-4000-8000-000000000010'::uuid,
   'Compartí mi prototipo de Design Thinking con mi colegio esta semana. Los escolares llegaron con ideas increíbles para mejorar la biblioteca del barrio. Nunca subestimen a un chico de 15 años con una hoja en blanco.',
   false, now() - interval '2 hours'),
  ('11100000-0000-4000-8000-000000000003'::uuid, 'b1000000-0000-4000-8000-000000000011'::uuid,
   '¿Alguien se suma al grupo de práctica de Scrum antes del Demo Day? Podemos armar equipos mixtos por región y hacer un sprint corto de dos semanas.',
   false, now() - interval '5 hours'),
  ('11100000-0000-4000-8000-000000000004'::uuid, 'b1000000-0000-4000-8000-000000000013'::uuid,
   'Sesión 2 terminada. El mapa de empatía me voló la cabeza: llevaba meses asumiendo lo que necesitaba mi comunidad sin haberle preguntado nunca. 😅',
   false, now() - interval '1 day'),
  ('11100000-0000-4000-8000-000000000005'::uuid, 'b1000000-0000-4000-8000-000000000014'::uuid,
   'Pregunta para los que ya terminaron: ¿el certificado internacional realmente pesa más en las postulaciones? Estoy decidiendo cuál sacar.',
   false, now() - interval '3 days'),
  ('11100000-0000-4000-8000-000000000006'::uuid, 'b1000000-0000-4000-8000-000000000015'::uuid,
   'Desde Huánuco reportándose. Primera sesión hecha y ya tengo tres ideas para el proyecto de residuos de mi barrio. Vamos con todo. 🌱',
   false, now() - interval '4 days'),
  ('11100000-0000-4000-8000-000000000007'::uuid, 'b1000000-0000-4000-8000-000000000001'::uuid,
   'Recordatorio: los cursos de SEP siempre serán gratuitos. Lo único opcional es el certificado. Si alguien les dice lo contrario, no somos nosotros. 💚',
   true, now() - interval '6 days')
) as p(id, uid, content, pinned, created)
left join courses c on c.slug = 'design-thinking-aplicado'
on conflict (id) do nothing;

insert into comments (post_id, user_id, content, created_at) values
  ('11100000-0000-4000-8000-000000000002', 'b1000000-0000-4000-8000-000000000012',
   '¡Qué bueno, Andrea! ¿Puedes compartir las fotos en el canal de mentores?', now() - interval '1 hour'),
  ('11100000-0000-4000-8000-000000000002', 'b1000000-0000-4000-8000-000000000013',
   'Esto es exactamente lo que quiero hacer en Puno. ¿Cómo coordinaste con el colegio?', now() - interval '40 minutes'),
  ('11100000-0000-4000-8000-000000000003', 'b1000000-0000-4000-8000-000000000015',
   'Me sumo. Tengo libres los jueves por la noche.', now() - interval '3 hours'),
  ('11100000-0000-4000-8000-000000000005', 'b1000000-0000-4000-8000-000000000010',
   'Yo saqué el internacional. En dos postulaciones me lo mencionaron explícitamente. Vale los S/20 extra.', now() - interval '2 days'),
  ('11100000-0000-4000-8000-000000000005', 'b1000000-0000-4000-8000-000000000012',
   'Los dos son válidos. Si postulas fuera del país, el internacional. Si es local, el de SEP alcanza.', now() - interval '2 days')
on conflict do nothing;

insert into post_likes (post_id, user_id) values
  ('11100000-0000-4000-8000-000000000002', 'b1000000-0000-4000-8000-000000000011'),
  ('11100000-0000-4000-8000-000000000002', 'b1000000-0000-4000-8000-000000000012'),
  ('11100000-0000-4000-8000-000000000002', 'b1000000-0000-4000-8000-000000000013'),
  ('11100000-0000-4000-8000-000000000002', 'b1000000-0000-4000-8000-000000000015'),
  ('11100000-0000-4000-8000-000000000001', 'b1000000-0000-4000-8000-000000000010'),
  ('11100000-0000-4000-8000-000000000001', 'b1000000-0000-4000-8000-000000000011'),
  ('11100000-0000-4000-8000-000000000007', 'b1000000-0000-4000-8000-000000000014'),
  ('11100000-0000-4000-8000-000000000006', 'b1000000-0000-4000-8000-000000000010')
on conflict do nothing;


-- ═══════════════════════════════════════════════════════════
-- 11 · PROYECTOS DE INNOVACIÓN SOCIAL
-- ═══════════════════════════════════════════════════════════

insert into projects (user_id, course_id, title, problem, solution, region, is_public)
select p.uid, c.id, p.title, p.problem, p.solution, p.region, p.pub
from (values
  ('b1000000-0000-4000-8000-000000000010'::uuid, 'Biblioteca viva de Cerro Colorado',
   'Los escolares del barrio no tienen dónde estudiar después del colegio y la biblioteca municipal cierra a las 5 pm.',
   'Red de casas-biblioteca gestionadas por vecinos voluntarios, con horario extendido y tutoría de universitarios.',
   'Arequipa', true),
  ('b1000000-0000-4000-8000-000000000011'::uuid, 'Ruta Andina Comunitaria',
   'Las comunidades cercanas a rutas turísticas no capturan valor: los tours llegan de Cusco y se van el mismo día.',
   'Plataforma que conecta viajeros con experiencias diseñadas y operadas por las propias comunidades.',
   'Cusco', true),
  ('b1000000-0000-4000-8000-000000000012'::uuid, 'Mentores de barrio',
   'Los escolares de Chimbote no conocen a nadie que haya llegado a la universidad desde su mismo barrio.',
   'Programa de apadrinamiento donde universitarios locales acompañan a un escolar durante todo el año.',
   'Áncash', true),
  ('b1000000-0000-4000-8000-000000000013'::uuid, 'Titicaca sin plástico',
   'Los residuos plásticos de las ferias semanales terminan en el lago.',
   'Sistema de acopio con incentivos para comerciantes y puntos de reciclaje gestionados por escolares.',
   'Puno', false),
  ('b1000000-0000-4000-8000-000000000015'::uuid, 'Compostaje vecinal Huánuco',
   'El 60 % de la basura del barrio es orgánica y va al relleno sanitario.',
   'Compostaje comunitario con huerto urbano y venta del abono para sostener el proyecto.',
   'Huánuco', false)
) as p(uid, title, problem, solution, region, pub)
left join courses c on c.slug = 'design-thinking-aplicado'
on conflict do nothing;


-- ═══════════════════════════════════════════════════════════
-- 12 · NEWSLETTER, DONACIONES Y BLOG
-- ═══════════════════════════════════════════════════════════

insert into newsletter_subscribers (email, full_name, region, source, is_confirmed, confirmed_at, created_at)
select
  'suscriptor' || n || '@demo.sep.pe',
  (array['Ana','Luis','María','Carlos','Rosa','Jorge','Elena','Pedro','Sofía','Miguel'])[1 + (n % 10)]
    || ' ' || (array['Quispe','Torres','Ramírez','Vargas','Rojas','Mendoza','Flores','Castillo'])[1 + (n % 8)],
  (array['Áncash','Cusco','Arequipa','La Libertad','Piura','Junín','Puno','Lima','Huánuco'])[1 + (n % 9)],
  (array['landing','diagnostico','evento','instagram'])[1 + (n % 4)],
  true,
  now() - (n || ' days')::interval,
  now() - (n || ' days')::interval
from generate_series(1, 48) as n
on conflict (email) do nothing;

insert into donations (donor_name, donor_email, amount_cents, is_recurring, cause, method, status, created_at) values
  ('Patricia Salas Ríos', 'rse@demo-andes.com.pe', 500000, false, 'Becas SILP', 'transferencia', 'pagado', now() - interval '30 days'),
  ('Anónimo', null, 5000, true, 'Formación de jóvenes en regiones', 'yape', 'pagado', now() - interval '25 days'),
  ('Carlos Zegarra', 'carlos.z@demo.sep.pe', 2000, true, 'Talleres en colegios', 'yape', 'pagado', now() - interval '20 days'),
  ('Familia Núñez Salas', 'familia@demo.sep.pe', 10000, false, 'Becas SILP', 'plin', 'pagado', now() - interval '14 days'),
  ('Anónimo', null, 1000, false, 'Formación de jóvenes en regiones', 'yape', 'pagado', now() - interval '9 days'),
  ('Egresados SILP 2025', 'egresados@demo.sep.pe', 30000, false, 'Talleres en colegios', 'transferencia', 'pagado', now() - interval '5 days'),
  ('Rocío Palacios', 'rocio@demo.sep.pe', 2000, false, 'Formación de jóvenes en regiones', 'yape', 'en_revision', now() - interval '6 hours')
on conflict do nothing;

insert into blog_posts (slug, title, excerpt, content_mdx, author_id, tags, is_published, published_at) values
  ('por-que-nacimos-en-casma',
   'Por qué SEP nació en Casma y no en Lima',
   'El 80 % de los programas de innovación del Perú están en Lima. Nosotros decidimos empezar donde está el talento.',
   'Cuando le contamos a la gente que fundamos SEP en Casma, la primera reacción casi siempre es la misma: "¿y por qué no en Lima?".\n\nLa respuesta es incómoda pero simple: porque en Lima ya hay quien lo haga.',
   'b1000000-0000-4000-8000-000000000001', array['historia','regiones'], true, now() - interval '45 days'),

  ('design-thinking-sin-post-its',
   'Design Thinking sin post-its: cómo lo enseñamos en colegios sin presupuesto',
   'No necesitas una sala de innovación ni material importado. Necesitas papel, lápiz y buenas preguntas.',
   'La primera vez que llevamos Design Thinking a un colegio de Casma llegamos con la idea de replicar lo que habíamos visto en fotos: paredes llenas de post-its de colores.\n\nDuró exactamente cinco minutos.',
   'b1000000-0000-4000-8000-000000000002', array['metodologías','docentes'], true, now() - interval '21 days'),

  ('demo-day-ancash-lo-que-aprendimos',
   'Demo Day Áncash: lo que aprendimos de 12 proyectos regionales',
   'Doce equipos, seis regiones y una conclusión clara: el problema nunca fue la falta de ideas.',
   'El sábado pasado, doce equipos presentaron sus proyectos ante un auditorio lleno.',
   'b1000000-0000-4000-8000-000000000012', array['eventos','impacto'], true, now() - interval '7 days')
on conflict (slug) do nothing;


-- ═══════════════════════════════════════════════════════════
-- 13 · RESPUESTAS DEL DIAGNÓSTICO
-- Para que el panel de admin muestre gráficos con datos reales
-- ═══════════════════════════════════════════════════════════

do $$
declare
  v_lead uuid;
  v_q    record;
  v_opts jsonb;
  v_n    int;
  v_prof survey_profile;
  v_regions text[] := array['Áncash','Cusco','Arequipa','La Libertad','Piura','Junín','Puno','Lima','Huánuco'];
begin
  for v_n in 1..90 loop
    v_prof := case
                when v_n <= 55 then 'universitario'::survey_profile
                when v_n <= 80 then 'docente'::survey_profile
                else 'empresa'::survey_profile
              end;

    insert into survey_leads (email, profile, region, utm_source, completed, created_at)
    values ('lead' || v_n || '@demo.sep.pe', v_prof,
            v_regions[1 + (v_n % array_length(v_regions, 1))],
            (array['instagram','whatsapp','landing','tiktok'])[1 + (v_n % 4)],
            true, now() - ((v_n % 45) || ' days')::interval)
    on conflict (lower(email), profile) do nothing
    returning id into v_lead;

    continue when v_lead is null;

    for v_q in select id, number, input_type, options
                 from survey_questions where profile = v_prof loop
      v_opts := v_q.options;

      if jsonb_array_length(v_opts) = 0 then
        continue;
      end if;

      -- Distribución sesgada: las primeras opciones pesan más,
      -- como pasa en las encuestas reales.
      if v_q.input_type = 'multiple' then
        insert into survey_responses (lead_id, question_id, answer)
        values (v_lead, v_q.id, jsonb_build_array(
                  v_opts -> ((v_n * 3) % greatest(1, jsonb_array_length(v_opts) - 1)),
                  v_opts -> ((v_n * 7) % greatest(1, jsonb_array_length(v_opts) - 1))))
        on conflict (lead_id, question_id) do nothing;
      else
        insert into survey_responses (lead_id, question_id, answer)
        values (v_lead, v_q.id,
                v_opts -> (case when v_n % 3 = 0
                                then (v_n % jsonb_array_length(v_opts))
                                else (v_n % greatest(1, least(3, jsonb_array_length(v_opts)))) end))
        on conflict (lead_id, question_id) do nothing;
      end if;
    end loop;
  end loop;
end $$;


-- ═══════════════════════════════════════════════════════════
-- 14 · NOTIFICACIONES
-- ═══════════════════════════════════════════════════════════

insert into notifications (user_id, kind, title, body, link, read_at, created_at) values
  ('b1000000-0000-4000-8000-000000000010', 'certificate_issued', '¡Tu certificado está listo! 🎓',
   'Certificado Internacional de Design Thinking aplicado. Ya puedes descargarlo.',
   '/estudiante/certificados', null, now() - interval '3 days'),
  ('b1000000-0000-4000-8000-000000000010', 'event', 'Demo Day Áncash en 12 días',
   'Confirma tu asistencia y prepara tu pitch de 3 minutos.',
   '/estudiante/eventos', now() - interval '1 day', now() - interval '2 days'),
  ('b1000000-0000-4000-8000-000000000014', 'payment_review', 'Estamos revisando tu pago',
   'Recibimos tu comprobante de Yape. Te confirmamos en menos de 24 horas.',
   '/estudiante/certificados', null, now() - interval '8 hours'),
  ('b1000000-0000-4000-8000-000000000013', 'payment_rejected', 'No pudimos validar tu pago',
   'El código de operación no coincide. Vuelve a enviarlo con la captura completa.',
   '/estudiante/certificados', null, now() - interval '1 day'),
  ('b1000000-0000-4000-8000-000000000011', 'session', 'Sesión 4 mañana a las 7:00 pm',
   'Ideación — Brainstorming sin límites. Ten papel y lápiz a la mano.',
   '/estudiante/curso/design-thinking-aplicado', null, now() - interval '4 hours'),
  ('b1000000-0000-4000-8000-000000000012', 'volunteer', 'Tienes 1.5 h pendientes de aprobación',
   'Registraste horas de preparación del taller. El equipo las revisará esta semana.',
   '/mentor/horas', null, now() - interval '1 day')
on conflict do nothing;


-- ═══════════════════════════════════════════════════════════
-- 15 · LIMPIEZA (para volver a un estado limpio)
-- ═══════════════════════════════════════════════════════════

create or replace function public.demo_reset()
returns text
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_count int;
begin
  delete from auth.users
   where email like '%@demo.sep.pe' or email like '%@sep.pe';
  get diagnostics v_count = row_count;

  delete from survey_leads   where email like '%@demo.sep.pe';
  delete from newsletter_subscribers where email like '%@demo.sep.pe';
  delete from donations      where donor_email like '%@demo%' or donor_email is null;
  delete from school_applications where contact_email like '%@demo%';
  delete from speaker_profiles    where email like '%@demo.sep.pe';
  delete from institutions   where id::text like 'a1000000-%';
  delete from events         where id::text like 'e1000000-%';

  return v_count || ' usuarios de demo eliminados. El resto de datos de demo también.';
end;
$$;

revoke execute on function public.demo_reset() from anon, authenticated;
revoke execute on function public.demo_user(uuid, text, text, user_role, text, jsonb)
  from anon, authenticated;


-- ═══════════════════════════════════════════════════════════
-- RESUMEN
-- ═══════════════════════════════════════════════════════════
do $$
begin
  raise notice '';
  raise notice '═══════════════════════════════════════════════';
  raise notice ' SEED DE DEMO CARGADO';
  raise notice '═══════════════════════════════════════════════';
  raise notice ' Usuarios:      %', (select count(*) from profiles);
  raise notice ' Inscripciones: %', (select count(*) from enrollments);
  raise notice ' Certificados:  %', (select count(*) from certificates);
  raise notice ' Pagos:         %', (select count(*) from payments);
  raise notice ' Talleres:      %', (select count(*) from workshops);
  raise notice ' Escolares:     %', (select count(*) from workshop_attendees);
  raise notice ' Diagnóstico:   % respuestas', (select count(*) from survey_responses);
  raise notice '';
  raise notice ' Contraseña de todas las cuentas: SepDemo2026!';
  raise notice '';
  raise notice '  celeste@demo → super_admin + mentor + estudiante';
  raise notice '  diana@sep.pe → admin';
  raise notice '  andrea@demo.sep.pe → estudiante + mentor';
  raise notice '  rosa@demo.sep.pe → docente';
  raise notice '  marco@demo.sep.pe → speaker';
  raise notice '  colegio@demo.sep.pe → institución (colegio)';
  raise notice '  empresa@demo.sep.pe → institución (empresa RSE)';
  raise notice '═══════════════════════════════════════════════';
end $$;
