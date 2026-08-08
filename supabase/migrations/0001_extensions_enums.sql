-- ═══════════════════════════════════════════════════════════
-- SEP · 0001 — Extensiones y tipos enumerados
-- Plan Maestro §8.2
-- ═══════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- ── Roles y perfiles ──────────────────────────────────────
create type user_role as enum (
  'estudiante', 'docente', 'institucion', 'mentor', 'speaker', 'admin', 'super_admin'
);

create type volunteer_type as enum (
  'mentor_junior', 'mentor_senior', 'community_manager', 'event_organizer'
);

create type institution_type as enum (
  'colegio', 'universidad', 'empresa', 'ong', 'gobierno'
);

-- ── Cursos ────────────────────────────────────────────────
create type course_level    as enum ('basico', 'intermedio', 'avanzado');
create type course_status   as enum ('borrador', 'proximamente', 'disponible', 'archivado');
create type course_audience as enum ('universitario', 'docente', 'escolar', 'general');

create type enrollment_status as enum ('activo', 'completado', 'abandonado', 'expulsado');
create type session_status    as enum ('programada', 'en_vivo', 'finalizada', 'cancelada');

-- ── Certificados ──────────────────────────────────────────
create type certificate_kind as enum (
  'sep', 'internacional', 'voluntariado', 'speaker', 'participacion'
);
create type certificate_status as enum ('pendiente', 'pagado', 'emitido', 'revocado');

-- ── Pagos ─────────────────────────────────────────────────
create type payment_method as enum (
  'yape', 'plin', 'culqi_card', 'transferencia', 'gratuito'
);
create type payment_status as enum (
  'pendiente', 'en_revision', 'pagado', 'rechazado', 'reembolsado'
);
create type membership_status as enum ('activa', 'vencida', 'cancelada');

-- ── Postulaciones y talleres ──────────────────────────────
create type application_status as enum (
  'recibida', 'en_revision', 'entrevista', 'aprobada', 'rechazada'
);
create type workshop_status as enum ('solicitado', 'confirmado', 'realizado', 'cancelado');

-- ── Diagnóstico ───────────────────────────────────────────
create type survey_profile as enum ('universitario', 'docente', 'empresa');
