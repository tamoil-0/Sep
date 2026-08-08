-- ═══════════════════════════════════════════════════════════
-- SEP · 0002 — Núcleo: perfiles, roles, instituciones,
--              cursos, inscripciones, certificados, pagos
-- Plan Maestro §8.3
-- ═══════════════════════════════════════════════════════════

-- ── INSTITUCIONES (antes que profiles por la FK) ──────────
create table institutions (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  type                institution_type not null,
  ruc                 text,
  region              text not null,
  province            text,
  district            text,
  address             text,
  contact_name        text,
  contact_role        text,
  contact_email       text,
  contact_phone       text,
  website             text,
  students_count      int,
  logo_url            text,
  is_verified         boolean not null default false,
  agreement_signed_at date,
  agreement_url       text,
  notes               text,
  created_by          uuid,
  created_at          timestamptz not null default now()
);
create index institutions_type_idx   on institutions (type);
create index institutions_region_idx on institutions (region);

-- ── PERFILES ──────────────────────────────────────────────
create table profiles (
  id                  uuid primary key references auth.users (id) on delete cascade,
  full_name           text not null default '',
  email               text not null unique,
  avatar_url          text,
  phone               text,
  birth_date          date,
  region              text,
  province            text,
  country             text not null default 'PE',
  bio                 text,
  university          text,
  career              text,
  study_cycle         text,
  current_situation   text,
  linkedin_url        text,
  instagram_url       text,
  institution_id      uuid references institutions (id) on delete set null,
  interests           text[] not null default '{}',
  onboarding_done     boolean not null default false,
  newsletter_opt_in   boolean not null default false,
  terms_accepted_at   timestamptz,
  privacy_accepted_at timestamptz,
  last_seen_at        timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index profiles_region_idx      on profiles (region);
create index profiles_institution_idx on profiles (institution_id);

alter table institutions
  add constraint institutions_created_by_fkey
  foreign key (created_by) references profiles (id) on delete set null;

-- ── ROLES (N:M) ───────────────────────────────────────────
-- Nunca en `profiles`: un usuario real acumula roles (§5.2).
create table user_roles (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles (id) on delete cascade,
  role       user_role not null,
  granted_by uuid references profiles (id) on delete set null,
  granted_at timestamptz not null default now(),
  revoked_at timestamptz,
  unique (user_id, role)
);
create index user_roles_active_idx on user_roles (user_id) where revoked_at is null;

-- ── CURSOS ────────────────────────────────────────────────
create table courses (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title          text not null,
  subtitle       text,
  description    text,
  audience       course_audience not null default 'universitario',
  level          course_level    not null default 'basico',
  status         course_status   not null default 'borrador',
  category       text,
  total_hours    numeric(4,1) not null default 8,
  sessions_count int  not null default 6,
  weeks          int  not null default 2,
  frequency      text default 'Interdiario',
  is_free        boolean not null default true,
  price_cents    int not null default 0 check (price_cents >= 0),
  cover_url      text,
  capacity       int,
  order_index    int not null default 0,
  published_at   timestamptz,
  created_at     timestamptz not null default now()
);
create index courses_status_idx   on courses (status);
create index courses_audience_idx on courses (audience);

create table course_sessions (
  id            uuid primary key default gen_random_uuid(),
  course_id     uuid not null references courses (id) on delete cascade,
  number        int  not null,
  week          int  not null,
  title         text not null,
  subtitle      text,
  description   text,
  duration_min  int  not null default 120,
  scheduled_at  timestamptz,
  meet_url      text,          -- protegido por RLS: solo inscritos (§9.2)
  recording_url text,
  materials     jsonb not null default '[]',
  status        session_status not null default 'programada',
  unique (course_id, number)
);
create index course_sessions_course_idx on course_sessions (course_id);

-- ── INSCRIPCIONES Y PROGRESO ──────────────────────────────
create table enrollments (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references profiles (id) on delete cascade,
  course_id    uuid not null references courses (id) on delete cascade,
  cohort       text not null default 'default',
  status       enrollment_status not null default 'activo',
  progress_pct int not null default 0 check (progress_pct between 0 and 100),
  enrolled_at  timestamptz not null default now(),
  completed_at timestamptz,
  unique (user_id, course_id, cohort)
);
create index enrollments_user_idx   on enrollments (user_id);
create index enrollments_course_idx on enrollments (course_id);

create table session_progress (
  id            uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references enrollments (id) on delete cascade,
  session_id    uuid not null references course_sessions (id) on delete cascade,
  attended      boolean not null default false,
  completed_at  timestamptz,
  unique (enrollment_id, session_id)
);
create index session_progress_enrollment_idx on session_progress (enrollment_id);

-- ── CERTIFICADOS ──────────────────────────────────────────
create table certificate_types (
  id          uuid primary key default gen_random_uuid(),
  kind        certificate_kind not null,
  name        text not null,
  issuer      text not null,
  price_cents int  not null check (price_cents >= 0),
  description text,
  is_active   boolean not null default true
);

create table certificates (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references profiles (id) on delete cascade,
  enrollment_id       uuid references enrollments (id) on delete set null,
  certificate_type_id uuid not null references certificate_types (id),
  verification_code   text not null unique,
  status              certificate_status not null default 'pendiente',
  issued_at           timestamptz,
  pdf_url             text,
  revoked_at          timestamptz,
  revoked_reason      text,
  issued_by           uuid references profiles (id) on delete set null,
  created_at          timestamptz not null default now()
);
create index certificates_user_idx on certificates (user_id);
create index certificates_code_idx on certificates (verification_code);

-- ── PAGOS ─────────────────────────────────────────────────
create table orders (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references profiles (id) on delete cascade,
  item_type      text not null check (
                   item_type in ('certificate','membership','silp','b2b_program','donation')),
  item_id        uuid,
  amount_cents   int  not null check (amount_cents >= 0),
  currency       text not null default 'PEN',
  status         payment_status not null default 'pendiente',
  institution_id uuid references institutions (id) on delete set null,
  created_at     timestamptz not null default now()
);
create index orders_user_idx   on orders (user_id);
create index orders_status_idx on orders (status);

create table payments (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid not null references orders (id) on delete cascade,
  method         payment_method not null,
  amount_cents   int  not null check (amount_cents >= 0),
  status         payment_status not null default 'pendiente',
  provider_ref   text,
  voucher_url    text,
  operation_code text,
  paid_at        timestamptz,
  reviewed_by    uuid references profiles (id) on delete set null,
  reviewed_at    timestamptz,
  reject_reason  text,
  created_at     timestamptz not null default now()
);
create index payments_order_idx  on payments (order_id);
create index payments_status_idx on payments (status);
-- Idempotencia de webhooks (§9.3)
create unique index payments_provider_ref_key
  on payments (provider_ref) where provider_ref is not null;

-- ── MEMBRESÍAS ────────────────────────────────────────────
create table membership_plans (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  name            text not null,
  duration_months int  not null,
  price_cents     int  not null check (price_cents >= 0),
  benefits        jsonb not null default '[]',
  is_active       boolean not null default true,
  order_index     int not null default 0
);

create table memberships (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references profiles (id) on delete cascade,
  plan_id   uuid not null references membership_plans (id),
  status    membership_status not null default 'activa',
  starts_at timestamptz not null default now(),
  ends_at   timestamptz not null,
  order_id  uuid references orders (id) on delete set null
);
create index memberships_user_idx on memberships (user_id);
