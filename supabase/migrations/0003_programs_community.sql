-- ═══════════════════════════════════════════════════════════
-- SEP · 0003 — Voluntariado, speakers, colegios, talleres,
--              comunidad, eventos y proyectos
-- Plan Maestro §8.3
-- ═══════════════════════════════════════════════════════════

-- ── VOLUNTARIADO (§1.9) ───────────────────────────────────
create table volunteer_roles (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  name           text not null,
  type           volunteer_type not null,
  description    text,
  requirements   jsonb not null default '[]',
  benefits       jsonb not null default '[]',
  hours_per_week int,
  open_positions int not null default 0,
  is_open        boolean not null default true
);

create table volunteer_applications (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references profiles (id) on delete set null,
  volunteer_role_id uuid not null references volunteer_roles (id) on delete cascade,
  full_name         text not null,
  email             text not null,
  phone             text,
  region            text,
  university        text,
  career_cycle      text,
  motivation        text,
  completed_courses text,
  status            application_status not null default 'recibida',
  reviewer_notes    text,
  reviewed_by       uuid references profiles (id) on delete set null,
  created_at        timestamptz not null default now()
);
create index volunteer_applications_status_idx on volunteer_applications (status);

create table volunteer_profiles (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null unique references profiles (id) on delete cascade,
  type            volunteer_type not null,
  started_at      date not null default current_date,
  hours_committed int,
  is_active       boolean not null default true
);

create table volunteer_hours (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles (id) on delete cascade,
  date        date not null,
  hours       numeric(4,1) not null check (hours > 0 and hours <= 24),
  activity    text not null,
  approved_by uuid references profiles (id) on delete set null,
  approved_at timestamptz
);
create index volunteer_hours_user_idx on volunteer_hours (user_id, date desc);

create table mentorships (
  id         uuid primary key default gen_random_uuid(),
  mentor_id  uuid not null references profiles (id) on delete cascade,
  mentee_id  uuid not null references profiles (id) on delete cascade,
  course_id  uuid references courses (id) on delete set null,
  started_at date not null default current_date,
  ended_at   date,
  notes      text,
  check (mentor_id <> mentee_id)
);
create unique index mentorships_unique_idx
  on mentorships (mentor_id, mentee_id, coalesce(course_id, '00000000-0000-0000-0000-000000000000'::uuid));
create index mentorships_mentor_idx on mentorships (mentor_id);

-- ── EVENTOS (antes que speaker_invitations por la FK) ─────
create table events (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  description  text,
  kind         text,
  starts_at    timestamptz not null,
  ends_at      timestamptz,
  location     text,
  is_online    boolean not null default true,
  meet_url     text,
  capacity     int,
  cover_url    text,
  is_published boolean not null default false
);
create index events_starts_idx on events (starts_at desc);

create table event_registrations (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references events (id) on delete cascade,
  user_id    uuid references profiles (id) on delete cascade,
  email      text,
  attended   boolean not null default false,
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);

-- ── SPEAKERS (§1.11) ──────────────────────────────────────
create table speaker_profiles (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references profiles (id) on delete set null,
  full_name       text not null,
  email           text not null,
  country         text not null default 'PE',
  region          text,
  expertise       text,
  topics          text[] not null default '{}',
  story           text,
  opportunities   text,
  talk_experience text,
  availability    text,
  linkedin_url    text,
  photo_url       text,
  is_approved     boolean not null default false,
  is_public       boolean not null default false,
  created_at      timestamptz not null default now()
);
create index speaker_profiles_public_idx on speaker_profiles (is_public) where is_public;

create table speaker_invitations (
  id          uuid primary key default gen_random_uuid(),
  speaker_id  uuid not null references speaker_profiles (id) on delete cascade,
  event_id    uuid references events (id) on delete set null,
  topic       text,
  proposed_at timestamptz,
  status      text not null default 'pendiente'
              check (status in ('pendiente','aceptada','rechazada','reprogramada')),
  created_at  timestamptz not null default now()
);

-- ── RED DE COLEGIOS Y TALLERES (§1.10) ────────────────────
create table school_applications (
  id             uuid primary key default gen_random_uuid(),
  school_name    text not null,
  region         text not null,
  province       text,
  director_name  text not null,
  contact_phone  text not null,
  contact_email  text not null,
  students_3to5  int,
  expectations   text,
  status         application_status not null default 'recibida',
  institution_id uuid references institutions (id) on delete set null,
  reviewed_by    uuid references profiles (id) on delete set null,
  created_at     timestamptz not null default now()
);
create index school_applications_status_idx on school_applications (status);

create table workshops (
  id             uuid primary key default gen_random_uuid(),
  institution_id uuid not null references institutions (id) on delete cascade,
  title          text not null,
  topic          text,
  scheduled_at   timestamptz,
  modality       text not null default 'presencial',
  grade          text,
  students_count int,
  status         workshop_status not null default 'solicitado',
  requested_by   uuid references profiles (id) on delete set null,
  created_at     timestamptz not null default now()
);
create index workshops_institution_idx on workshops (institution_id);

create table workshop_facilitators (
  workshop_id uuid not null references workshops (id) on delete cascade,
  user_id     uuid not null references profiles (id) on delete cascade,
  primary key (workshop_id, user_id)
);

-- Escolares: solo nombre y grado, sin cuenta ni PII sensible (§9.5).
create table workshop_attendees (
  id             uuid primary key default gen_random_uuid(),
  workshop_id    uuid not null references workshops (id) on delete cascade,
  student_name   text not null,
  grade          text,
  attended       boolean not null default true,
  certificate_id uuid references certificates (id) on delete set null
);
create index workshop_attendees_workshop_idx on workshop_attendees (workshop_id);

-- ── COMUNIDAD ─────────────────────────────────────────────
create table posts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles (id) on delete cascade,
  course_id   uuid references courses (id) on delete set null,
  content     text not null check (char_length(content) between 1 and 4000),
  media_urls  text[] not null default '{}',
  is_pinned   boolean not null default false,
  is_hidden   boolean not null default false,
  likes_count int not null default 0,
  created_at  timestamptz not null default now()
);
create index posts_created_idx on posts (created_at desc) where not is_hidden;

create table comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references posts (id) on delete cascade,
  user_id    uuid not null references profiles (id) on delete cascade,
  content    text not null check (char_length(content) between 1 and 2000),
  is_hidden  boolean not null default false,
  created_at timestamptz not null default now()
);
create index comments_post_idx on comments (post_id);

create table post_likes (
  post_id uuid not null references posts (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  primary key (post_id, user_id)
);

-- ── PROYECTOS DE INNOVACIÓN SOCIAL ────────────────────────
create table projects (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles (id) on delete cascade,
  course_id  uuid references courses (id) on delete set null,
  title      text not null,
  problem    text,
  solution   text,
  region     text,
  cover_url  text,
  is_public  boolean not null default false,
  created_at timestamptz not null default now()
);
create index projects_user_idx on projects (user_id);
