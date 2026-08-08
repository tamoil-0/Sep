-- ═══════════════════════════════════════════════════════════
-- SEP · 0006 — Row Level Security
-- Plan Maestro §9.2 — "toda tabla tiene RLS y una política
-- explícita, sin excepciones".
--
-- Principios:
--   · El usuario solo ve y edita lo suyo.
--   · Los roles NO se autoasignan.
--   · Los certificados y la aprobación de pagos son del servidor.
--   · El enlace de Meet solo lo ve quien está inscrito.
--   · La auditoría es de solo lectura para super_admin.
-- ═══════════════════════════════════════════════════════════

-- ── Activar RLS en TODAS las tablas ───────────────────────
alter table profiles               enable row level security;
alter table user_roles             enable row level security;
alter table institutions           enable row level security;
alter table courses                enable row level security;
alter table course_sessions        enable row level security;
alter table enrollments            enable row level security;
alter table session_progress       enable row level security;
alter table certificate_types      enable row level security;
alter table certificates           enable row level security;
alter table orders                 enable row level security;
alter table payments               enable row level security;
alter table membership_plans       enable row level security;
alter table memberships            enable row level security;
alter table volunteer_roles        enable row level security;
alter table volunteer_applications enable row level security;
alter table volunteer_profiles     enable row level security;
alter table volunteer_hours        enable row level security;
alter table mentorships            enable row level security;
alter table speaker_profiles       enable row level security;
alter table speaker_invitations    enable row level security;
alter table school_applications    enable row level security;
alter table workshops              enable row level security;
alter table workshop_facilitators  enable row level security;
alter table workshop_attendees     enable row level security;
alter table posts                  enable row level security;
alter table comments               enable row level security;
alter table post_likes             enable row level security;
alter table events                 enable row level security;
alter table event_registrations    enable row level security;
alter table projects               enable row level security;
alter table survey_questions       enable row level security;
alter table survey_leads           enable row level security;
alter table survey_responses       enable row level security;
alter table newsletter_subscribers enable row level security;
alter table donations              enable row level security;
alter table partners               enable row level security;
alter table blog_posts             enable row level security;
alter table notifications          enable row level security;
alter table audit_log              enable row level security;
alter table job_queue              enable row level security;

-- ═══ PERFILES ══════════════════════════════════════════════
create policy "profiles_select_own_or_admin" on profiles
  for select using (id = auth.uid() or is_admin());

create policy "profiles_update_own" on profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

create policy "profiles_admin_all" on profiles
  for all using (is_admin()) with check (is_admin());

-- ═══ ROLES — nadie se autoasigna un rol ════════════════════
create policy "user_roles_select_own_or_admin" on user_roles
  for select using (user_id = auth.uid() or is_admin());

create policy "user_roles_admin_write" on user_roles
  for insert with check (is_admin());

create policy "user_roles_admin_update" on user_roles
  for update using (is_admin()) with check (is_admin());

create policy "user_roles_super_admin_delete" on user_roles
  for delete using (is_super_admin());

-- ═══ INSTITUCIONES ═════════════════════════════════════════
create policy "institutions_select_verified_or_own" on institutions
  for select using (
    is_verified
    or created_by = auth.uid()
    or id = my_institution_id()
    or is_admin()
  );

create policy "institutions_insert_authenticated" on institutions
  for insert with check (auth.uid() is not null and created_by = auth.uid());

create policy "institutions_update_own_or_admin" on institutions
  for update using (
    is_admin()
    or (id = my_institution_id() and has_role('institucion'))
  );

create policy "institutions_admin_delete" on institutions
  for delete using (is_admin());

-- ═══ CURSOS — catálogo público ═════════════════════════════
create policy "courses_select_published" on courses
  for select using (status in ('disponible','proximamente') or is_admin());

create policy "courses_admin_write" on courses
  for all using (is_admin()) with check (is_admin());

-- El meet_url y los materiales solo para inscritos activos.
create policy "course_sessions_select_enrolled" on course_sessions
  for select using (
    is_admin()
    or has_role('mentor')
    or exists (
      select 1 from enrollments e
      where e.course_id = course_sessions.course_id
        and e.user_id = auth.uid()
        and e.status in ('activo','completado')
    )
  );

create policy "course_sessions_admin_write" on course_sessions
  for all using (is_admin()) with check (is_admin());

-- ═══ INSCRIPCIONES ═════════════════════════════════════════
create policy "enrollments_select_own_or_staff" on enrollments
  for select using (user_id = auth.uid() or is_admin() or has_role('mentor'));

create policy "enrollments_insert_own" on enrollments
  for insert with check (user_id = auth.uid());

create policy "enrollments_update_own_or_admin" on enrollments
  for update using (user_id = auth.uid() or is_admin())
  with check (user_id = auth.uid() or is_admin());

create policy "enrollments_admin_delete" on enrollments
  for delete using (is_admin());

create policy "session_progress_own_or_staff" on session_progress
  for select using (
    is_admin()
    or has_role('mentor')
    or exists (select 1 from enrollments e
                where e.id = session_progress.enrollment_id and e.user_id = auth.uid())
  );

create policy "session_progress_write_own" on session_progress
  for insert with check (
    exists (select 1 from enrollments e
             where e.id = enrollment_id and e.user_id = auth.uid())
  );

create policy "session_progress_update_own" on session_progress
  for update using (
    is_admin()
    or exists (select 1 from enrollments e
                where e.id = session_progress.enrollment_id and e.user_id = auth.uid())
  );

-- ═══ CERTIFICADOS — los emite el servidor, nunca el usuario ═
create policy "certificate_types_select_all" on certificate_types
  for select using (is_active or is_admin());

create policy "certificate_types_admin_write" on certificate_types
  for all using (is_admin()) with check (is_admin());

create policy "certificates_select_own_or_admin" on certificates
  for select using (user_id = auth.uid() or is_admin());

create policy "certificates_admin_insert" on certificates
  for insert with check (is_admin());

create policy "certificates_admin_update" on certificates
  for update using (is_admin()) with check (is_admin());

-- ═══ PAGOS — el estudiante crea, el admin aprueba ══════════
create policy "orders_select_own_or_admin" on orders
  for select using (user_id = auth.uid() or is_admin());

create policy "orders_insert_own" on orders
  for insert with check (user_id = auth.uid());

create policy "orders_admin_update" on orders
  for update using (is_admin()) with check (is_admin());

create policy "payments_select_own_or_admin" on payments
  for select using (
    is_admin()
    or exists (select 1 from orders o where o.id = payments.order_id and o.user_id = auth.uid())
  );

-- Puede subir su voucher, pero siempre en estado 'pendiente'.
create policy "payments_insert_own_pending" on payments
  for insert with check (
    status = 'pendiente'
    and exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid())
  );

create policy "payments_admin_update" on payments
  for update using (is_admin()) with check (is_admin());

-- ═══ MEMBRESÍAS ════════════════════════════════════════════
create policy "membership_plans_select_active" on membership_plans
  for select using (is_active or is_admin());

create policy "membership_plans_admin_write" on membership_plans
  for all using (is_admin()) with check (is_admin());

create policy "memberships_select_own_or_admin" on memberships
  for select using (user_id = auth.uid() or is_admin());

create policy "memberships_admin_write" on memberships
  for all using (is_admin()) with check (is_admin());

-- ═══ VOLUNTARIADO ══════════════════════════════════════════
create policy "volunteer_roles_select_open" on volunteer_roles
  for select using (is_open or is_admin());

create policy "volunteer_roles_admin_write" on volunteer_roles
  for all using (is_admin()) with check (is_admin());

-- Postulación pública: cualquiera puede postular (con hCaptcha + rate limit
-- en la capa de aplicación), pero solo el admin y quien postuló pueden leerla.
create policy "volunteer_applications_insert_anyone" on volunteer_applications
  for insert with check (true);

create policy "volunteer_applications_select_own_or_admin" on volunteer_applications
  for select using (user_id = auth.uid() or is_admin());

create policy "volunteer_applications_admin_update" on volunteer_applications
  for update using (is_admin()) with check (is_admin());

create policy "volunteer_profiles_select_own_or_admin" on volunteer_profiles
  for select using (user_id = auth.uid() or is_admin());

create policy "volunteer_profiles_admin_write" on volunteer_profiles
  for all using (is_admin()) with check (is_admin());

create policy "volunteer_hours_select_own_or_admin" on volunteer_hours
  for select using (user_id = auth.uid() or is_admin());

create policy "volunteer_hours_insert_own" on volunteer_hours
  for insert with check (user_id = auth.uid() and has_role('mentor'));

-- El voluntario no puede aprobarse sus propias horas.
create policy "volunteer_hours_admin_update" on volunteer_hours
  for update using (is_admin()) with check (is_admin());

create policy "mentorships_select_involved_or_admin" on mentorships
  for select using (mentor_id = auth.uid() or mentee_id = auth.uid() or is_admin());

create policy "mentorships_mentor_update" on mentorships
  for update using (mentor_id = auth.uid() or is_admin());

create policy "mentorships_admin_write" on mentorships
  for insert with check (is_admin());

create policy "mentorships_admin_delete" on mentorships
  for delete using (is_admin());

-- ═══ SPEAKERS ══════════════════════════════════════════════
create policy "speaker_profiles_select_public_or_own" on speaker_profiles
  for select using ((is_public and is_approved) or user_id = auth.uid() or is_admin());

create policy "speaker_profiles_insert_anyone" on speaker_profiles
  for insert with check (true);

create policy "speaker_profiles_update_own" on speaker_profiles
  for update using (user_id = auth.uid() or is_admin())
  with check (user_id = auth.uid() or is_admin());

create policy "speaker_invitations_select_own_or_admin" on speaker_invitations
  for select using (
    is_admin()
    or exists (select 1 from speaker_profiles s
                where s.id = speaker_invitations.speaker_id and s.user_id = auth.uid())
  );

create policy "speaker_invitations_update_own" on speaker_invitations
  for update using (
    is_admin()
    or exists (select 1 from speaker_profiles s
                where s.id = speaker_invitations.speaker_id and s.user_id = auth.uid())
  );

create policy "speaker_invitations_admin_insert" on speaker_invitations
  for insert with check (is_admin());

-- ═══ COLEGIOS Y TALLERES ═══════════════════════════════════
create policy "school_applications_insert_anyone" on school_applications
  for insert with check (true);

create policy "school_applications_admin_select" on school_applications
  for select using (is_admin());

create policy "school_applications_admin_update" on school_applications
  for update using (is_admin()) with check (is_admin());

create policy "workshops_select_involved" on workshops
  for select using (
    is_admin()
    or institution_id = my_institution_id()
    or requested_by = auth.uid()
    or exists (select 1 from workshop_facilitators f
                where f.workshop_id = workshops.id and f.user_id = auth.uid())
  );

create policy "workshops_insert_institution_or_teacher" on workshops
  for insert with check (
    is_admin()
    or (requested_by = auth.uid()
        and (has_role('institucion') or has_role('docente')))
  );

create policy "workshops_admin_update" on workshops
  for update using (is_admin() or institution_id = my_institution_id());

create policy "workshop_facilitators_select" on workshop_facilitators
  for select using (
    is_admin()
    or user_id = auth.uid()
    or exists (select 1 from workshops w
                where w.id = workshop_facilitators.workshop_id
                  and w.institution_id = my_institution_id())
  );

create policy "workshop_facilitators_admin_write" on workshop_facilitators
  for all using (is_admin()) with check (is_admin());

-- Escolares menores de edad: solo el colegio y SEP (§9.5).
create policy "workshop_attendees_select_restricted" on workshop_attendees
  for select using (
    is_admin()
    or exists (select 1 from workshops w
                where w.id = workshop_attendees.workshop_id
                  and w.institution_id = my_institution_id())
  );

create policy "workshop_attendees_write_restricted" on workshop_attendees
  for all using (
    is_admin()
    or exists (select 1 from workshops w
                where w.id = workshop_attendees.workshop_id
                  and w.institution_id = my_institution_id())
  )
  with check (
    is_admin()
    or exists (select 1 from workshops w
                where w.id = workshop_id
                  and w.institution_id = my_institution_id())
  );

-- ═══ COMUNIDAD ═════════════════════════════════════════════
create policy "posts_select_authenticated" on posts
  for select using (auth.uid() is not null and (not is_hidden or is_admin()));

create policy "posts_insert_own" on posts
  for insert with check (user_id = auth.uid());

create policy "posts_update_own_or_admin" on posts
  for update using (user_id = auth.uid() or is_admin());

create policy "posts_delete_own_or_admin" on posts
  for delete using (user_id = auth.uid() or is_admin());

create policy "comments_select_authenticated" on comments
  for select using (auth.uid() is not null and (not is_hidden or is_admin()));

create policy "comments_insert_own" on comments
  for insert with check (user_id = auth.uid());

create policy "comments_update_own_or_admin" on comments
  for update using (user_id = auth.uid() or is_admin());

create policy "comments_delete_own_or_admin" on comments
  for delete using (user_id = auth.uid() or is_admin());

create policy "post_likes_select_authenticated" on post_likes
  for select using (auth.uid() is not null);

create policy "post_likes_write_own" on post_likes
  for insert with check (user_id = auth.uid());

create policy "post_likes_delete_own" on post_likes
  for delete using (user_id = auth.uid());

-- ═══ EVENTOS ═══════════════════════════════════════════════
create policy "events_select_published" on events
  for select using (is_published or is_admin());

create policy "events_admin_write" on events
  for all using (is_admin()) with check (is_admin());

create policy "event_registrations_select_own_or_admin" on event_registrations
  for select using (user_id = auth.uid() or is_admin());

create policy "event_registrations_insert" on event_registrations
  for insert with check (user_id = auth.uid() or user_id is null);

create policy "event_registrations_admin_update" on event_registrations
  for update using (is_admin()) with check (is_admin());

-- ═══ PROYECTOS ═════════════════════════════════════════════
create policy "projects_select_public_or_own" on projects
  for select using (is_public or user_id = auth.uid() or is_admin() or has_role('mentor'));

create policy "projects_write_own" on projects
  for all using (user_id = auth.uid() or is_admin())
  with check (user_id = auth.uid() or is_admin());

-- ═══ DIAGNÓSTICO — público sin login (§1.13) ═══════════════
create policy "survey_questions_select_all" on survey_questions
  for select using (true);

create policy "survey_questions_admin_write" on survey_questions
  for all using (is_admin()) with check (is_admin());

-- Cualquiera responde, pero solo SEP lee los resultados.
create policy "survey_leads_insert_anyone" on survey_leads
  for insert with check (true);

create policy "survey_leads_admin_select" on survey_leads
  for select using (is_admin());

create policy "survey_leads_update_service" on survey_leads
  for update using (is_admin()) with check (is_admin());

create policy "survey_responses_insert_anyone" on survey_responses
  for insert with check (true);

create policy "survey_responses_admin_select" on survey_responses
  for select using (is_admin());

-- ═══ NEWSLETTER ════════════════════════════════════════════
create policy "newsletter_insert_anyone" on newsletter_subscribers
  for insert with check (true);

create policy "newsletter_admin_select" on newsletter_subscribers
  for select using (is_admin());

create policy "newsletter_admin_update" on newsletter_subscribers
  for update using (is_admin()) with check (is_admin());

-- ═══ DONACIONES ════════════════════════════════════════════
create policy "donations_insert_anyone" on donations
  for insert with check (status = 'pendiente');

create policy "donations_admin_select" on donations
  for select using (is_admin());

create policy "donations_admin_update" on donations
  for update using (is_admin()) with check (is_admin());

-- ═══ ALIADOS Y BLOG — contenido público ════════════════════
create policy "partners_select_active" on partners
  for select using (is_active or is_admin());

create policy "partners_admin_write" on partners
  for all using (is_admin()) with check (is_admin());

create policy "blog_select_published" on blog_posts
  for select using (is_published or is_admin());

create policy "blog_admin_write" on blog_posts
  for all using (is_admin()) with check (is_admin());

-- ═══ NOTIFICACIONES ════════════════════════════════════════
create policy "notifications_select_own" on notifications
  for select using (user_id = auth.uid());

create policy "notifications_update_own" on notifications
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "notifications_admin_insert" on notifications
  for insert with check (is_admin());

-- ═══ AUDITORÍA — inmutable, solo super_admin lee ═══════════
create policy "audit_log_super_admin_select" on audit_log
  for select using (is_super_admin());
-- Sin políticas de INSERT/UPDATE/DELETE: solo escriben los triggers
-- (SECURITY DEFINER) y el service-role.

-- ═══ COLA DE TRABAJOS — solo el service-role ═══════════════
create policy "job_queue_admin_select" on job_queue
  for select using (is_admin());
-- El worker de Render usa el service-role, que salta RLS.
