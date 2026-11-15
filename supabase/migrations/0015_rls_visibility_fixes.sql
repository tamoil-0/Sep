-- ════════════════════════════════════════════════════════════════
-- 0015 · Correcciones de visibilidad (RLS)
--
-- 1. Recursión infinita (42P17) entre las políticas de `workshops` y
--    `workshop_facilitators`: cada una consultaba la otra tabla con RLS.
--    Se reemplaza la consulta cruzada por funciones SECURITY DEFINER.
-- 2. `public_profiles`: ficha pública mínima (nombre, región, avatar,
--    universidad, carrera) para mostrar autores de la comunidad y
--    mentorados. `profiles` sigue cerrado: correo, teléfono y DNI no
--    salen de la tabla.
-- 3. Mentores: solo ven inscripciones y progreso de SUS mentorados
--    (antes `has_role('mentor')` veía las de todos los estudiantes).
-- ════════════════════════════════════════════════════════════════

-- ── 1. Talleres sin recursión ───────────────────────────────────

/** ¿El usuario actual facilita este taller? (sin pasar por RLS) */
create or replace function public.is_workshop_facilitator(p_workshop_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.workshop_facilitators f
    where f.workshop_id = p_workshop_id and f.user_id = auth.uid()
  );
$$;

/** ¿El taller es de la institución del usuario actual? (sin pasar por RLS) */
create or replace function public.is_my_institution_workshop(p_workshop_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.workshops w
    where w.id = p_workshop_id
      and w.institution_id is not null
      and w.institution_id = public.my_institution_id()
  );
$$;

drop policy if exists "workshops_select_involved" on workshops;
create policy "workshops_select_involved" on workshops
  for select using (
    is_admin()
    or institution_id = my_institution_id()
    or requested_by = auth.uid()
    or is_workshop_facilitator(id)
  );

drop policy if exists "workshop_facilitators_select" on workshop_facilitators;
create policy "workshop_facilitators_select" on workshop_facilitators
  for select using (
    is_admin()
    or user_id = auth.uid()
    or is_my_institution_workshop(workshop_id)
  );

drop policy if exists "workshop_attendees_select_restricted" on workshop_attendees;
create policy "workshop_attendees_select_restricted" on workshop_attendees
  for select using (
    is_admin()
    or is_my_institution_workshop(workshop_id)
  );

-- ── 2. Ficha pública de perfiles ───────────────────────────────
-- Vista con los permisos de su dueño (no security_invoker): lee `profiles`
-- sin RLS pero SOLO expone columnas no sensibles y SOLO a usuarios con
-- sesión. PostgREST la puede embeber por las FK de `profiles.id`.

create or replace view public.public_profiles
with (security_barrier = true)
as
  select p.id, p.full_name, p.region, p.avatar_url, p.university, p.career
  from public.profiles p
  where auth.uid() is not null;

comment on view public.public_profiles is
  'Ficha pública mínima para usuarios autenticados (comunidad, mentorías). Sin correo, teléfono ni documento.';

revoke all on public.public_profiles from public, anon;
grant select on public.public_profiles to authenticated;

-- ── 3. Mentores: solo sus mentorados ───────────────────────────

/** ¿El usuario indicado es mentorado activo del usuario actual? */
create or replace function public.is_my_mentee(p_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.mentorships m
    where m.mentor_id = auth.uid() and m.mentee_id = p_user_id and m.ended_at is null
  );
$$;

drop policy if exists "enrollments_select_own_or_staff" on enrollments;
create policy "enrollments_select_own_or_staff" on enrollments
  for select using (user_id = auth.uid() or is_admin() or is_my_mentee(user_id));

drop policy if exists "session_progress_own_or_staff" on session_progress;
create policy "session_progress_own_or_staff" on session_progress
  for select using (
    is_admin()
    or exists (select 1 from enrollments e
                where e.id = session_progress.enrollment_id
                  and (e.user_id = auth.uid() or is_my_mentee(e.user_id)))
  );

-- ── Permisos de las funciones nuevas (patrón de 0011) ──────────
revoke execute on function public.is_workshop_facilitator(uuid) from public;
revoke execute on function public.is_my_institution_workshop(uuid) from public;
revoke execute on function public.is_my_mentee(uuid) from public;
grant execute on function public.is_workshop_facilitator(uuid) to anon, authenticated;
grant execute on function public.is_my_institution_workshop(uuid) to anon, authenticated;
grant execute on function public.is_my_mentee(uuid) to anon, authenticated;
