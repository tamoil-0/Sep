-- ═══════════════════════════════════════════════════════════
-- SEP · 0004 — Diagnóstico, newsletter, donaciones,
--              aliados, blog, notificaciones y auditoría
-- Plan Maestro §8.3
-- ═══════════════════════════════════════════════════════════

-- ── DIAGNÓSTICO DE VALIDACIÓN (§1.13) ─────────────────────
create table survey_questions (
  id          uuid primary key default gen_random_uuid(),
  profile     survey_profile not null,
  block       int  not null,
  block_title text,
  number      int  not null,
  question    text not null,
  input_type  text not null check (input_type in ('single','multiple','scale_1_5','email')),
  options     jsonb not null default '[]',
  validates   text,
  tag         text,
  is_key      boolean not null default false,
  unique (profile, number)
);

create table survey_leads (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  profile    survey_profile not null,
  region     text,
  utm_source text,
  completed  boolean not null default false,
  created_at timestamptz not null default now()
);
create unique index survey_leads_email_profile_idx on survey_leads (lower(email), profile);

create table survey_responses (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid not null references survey_leads (id) on delete cascade,
  question_id uuid not null references survey_questions (id) on delete cascade,
  answer      jsonb not null,
  created_at  timestamptz not null default now(),
  unique (lead_id, question_id)
);

-- ── NEWSLETTER (§1.12) ────────────────────────────────────
create table newsletter_subscribers (
  id              uuid primary key default gen_random_uuid(),
  email           text not null unique,
  full_name       text,
  region          text,
  source          text,
  is_confirmed    boolean not null default false,
  confirm_token   uuid not null default gen_random_uuid(),
  confirmed_at    timestamptz,
  unsubscribed_at timestamptz,
  created_at      timestamptz not null default now()
);

-- ── DONACIONES (§10.6) ────────────────────────────────────
create table donations (
  id           uuid primary key default gen_random_uuid(),
  donor_name   text,
  donor_email  text,
  amount_cents int  not null check (amount_cents > 0),
  currency     text not null default 'PEN',
  is_recurring boolean not null default false,
  cause        text,
  method       payment_method not null,
  status       payment_status not null default 'pendiente',
  provider_ref text,
  is_anonymous boolean not null default false,
  created_at   timestamptz not null default now()
);

-- ── ALIADOS (§1.7) ────────────────────────────────────────
create table partners (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  logo_url    text,
  website     text,
  category    text check (category in ('red','alianza','mentoria','premio','aval')),
  order_index int not null default 0,
  is_active   boolean not null default true
);

-- ── BLOG ──────────────────────────────────────────────────
create table blog_posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  excerpt      text,
  content_mdx  text,
  cover_url    text,
  author_id    uuid references profiles (id) on delete set null,
  tags         text[] not null default '{}',
  published_at timestamptz,
  is_published boolean not null default false
);
create index blog_posts_published_idx on blog_posts (published_at desc) where is_published;

-- ── NOTIFICACIONES ────────────────────────────────────────
create table notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles (id) on delete cascade,
  kind       text not null,
  title      text not null,
  body       text,
  link       text,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);
create index notifications_unread_idx on notifications (user_id, created_at desc)
  where read_at is null;

-- ── AUDITORÍA (§9.6) ──────────────────────────────────────
-- Inmutable: sin políticas de UPDATE ni DELETE. Solo lee super_admin.
create table audit_log (
  id          bigserial primary key,
  actor_id    uuid references profiles (id) on delete set null,
  action      text not null,
  entity      text not null,
  entity_id   text,
  before_data jsonb,
  after_data  jsonb,
  ip          inet,
  user_agent  text,
  created_at  timestamptz not null default now()
);
create index audit_log_entity_idx on audit_log (entity, entity_id);
create index audit_log_actor_idx  on audit_log (actor_id, created_at desc);

-- ── COLA DE TRABAJOS (patrón outbox para el worker de Render, §11.4)
create table job_queue (
  id           uuid primary key default gen_random_uuid(),
  kind         text not null,
  payload      jsonb not null default '{}',
  status       text not null default 'pending'
               check (status in ('pending','processing','done','failed')),
  attempts     int  not null default 0,
  last_error   text,
  run_after    timestamptz not null default now(),
  created_at   timestamptz not null default now(),
  completed_at timestamptz
);
create index job_queue_pending_idx on job_queue (run_after)
  where status = 'pending';
