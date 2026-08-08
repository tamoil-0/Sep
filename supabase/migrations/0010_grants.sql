-- ═══════════════════════════════════════════════════════════
-- SEP · 0010 — Permisos de tabla para los roles de la API
--
-- RLS solo RESTRINGE; no CONCEDE. Sin estos GRANT, Postgres
-- rechaza la consulta antes siquiera de evaluar las políticas
-- («permission denied for table …»).
--
-- El modelo es el de Supabase: se concede el privilegio a nivel
-- de tabla y RLS decide fila por fila. Aquí somos más estrictos
-- que el default de Supabase:
--
--   anon           → SELECT e INSERT (formularios públicos:
--                    colegios, voluntariado, speakers, diagnóstico,
--                    newsletter y donaciones). Nada de UPDATE ni DELETE.
--   authenticated  → SELECT, INSERT, UPDATE, DELETE. Las políticas
--                    de la migración 0006 acotan qué filas toca.
--   service_role   → todo (salta RLS por diseño; solo servidor).
-- ═══════════════════════════════════════════════════════════

grant usage on schema public to anon, authenticated, service_role;

-- ── Tablas existentes ─────────────────────────────────────
grant select, insert                         on all tables in schema public to anon;
grant select, insert, update, delete         on all tables in schema public to authenticated;
grant all                                    on all tables in schema public to service_role;

-- ── Secuencias (bigserial de audit_log, entre otras) ──────
grant usage, select on all sequences in schema public to anon, authenticated;
grant all           on all sequences in schema public to service_role;

-- ── Funciones ─────────────────────────────────────────────
grant execute on all functions in schema public to anon, authenticated, service_role;

-- ── Tablas y funciones futuras ────────────────────────────
-- Sin esto, cada migración nueva volvería a romper la API.
alter default privileges in schema public
  grant select, insert on tables to anon;
alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public
  grant all on tables to service_role;

alter default privileges in schema public
  grant usage, select on sequences to anon, authenticated;
alter default privileges in schema public
  grant all on sequences to service_role;

alter default privileges in schema public
  grant execute on functions to anon, authenticated, service_role;

-- ── Excepciones: lo que anon NO debe poder ni intentar ────
-- Estas tablas ya están cerradas por RLS, pero quitamos también
-- el privilegio para que ni siquiera lleguen a evaluarse.
revoke insert on
  profiles, user_roles, courses, course_sessions, enrollments,
  session_progress, certificates, certificate_types, orders, payments,
  memberships, membership_plans, volunteer_profiles, volunteer_hours,
  mentorships, workshops, workshop_attendees, workshop_facilitators,
  posts, comments, post_likes, projects, events, blog_posts,
  notifications, audit_log, job_queue, partners, institutions
from anon;

-- El log de auditoría es inmutable: solo escriben los triggers
-- (SECURITY DEFINER, corren como postgres) y el service_role.
revoke insert, update, delete on audit_log from anon, authenticated;

-- La cola de trabajos es exclusiva del worker (service_role).
revoke insert, update, delete on job_queue from anon, authenticated;
