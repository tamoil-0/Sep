-- ═══════════════════════════════════════════════════════════
-- SEP · 0005 — Funciones, triggers y helpers de RBAC
-- Plan Maestro §8.4
-- ═══════════════════════════════════════════════════════════

-- ── Helpers de RBAC ───────────────────────────────────────
-- `stable` + `security definer` para que las políticas RLS puedan
-- consultar user_roles sin recursión infinita.

create or replace function public.has_role(check_role user_role)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
      and role = check_role
      and revoked_at is null
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
      and role in ('admin','super_admin')
      and revoked_at is null
  );
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
      and role = 'super_admin'
      and revoked_at is null
  );
$$;

/** Instituciones a las que pertenece el usuario actual. */
create or replace function public.my_institution_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select institution_id from public.profiles where id = auth.uid();
$$;

-- ── Alta de usuario ───────────────────────────────────────
-- Crea el perfil y asigna el rol base declarado en el registro.
-- Solo acepta los 3 tipos de cuenta con registro abierto (§5.1):
-- nadie puede autoasignarse `admin` manipulando el metadata.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested text;
  base_role user_role;
begin
  insert into public.profiles (id, email, full_name, region, newsletter_opt_in,
                               terms_accepted_at, privacy_accepted_at)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'region', ''),
    coalesce((new.raw_user_meta_data ->> 'newsletter_opt_in')::boolean, false),
    now(),
    now()
  );

  requested := new.raw_user_meta_data ->> 'account_type';
  base_role := case
                 when requested in ('estudiante','docente','institucion')
                   then requested::user_role
                 else 'estudiante'::user_role
               end;

  insert into public.user_roles (user_id, role) values (new.id, base_role);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── updated_at automático ─────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- ── Progreso del curso ────────────────────────────────────
create or replace function public.recalc_progress()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  total int;
  done  int;
  e_id  uuid;
begin
  e_id := coalesce(new.enrollment_id, old.enrollment_id);

  select c.sessions_count
    into total
    from public.enrollments en
    join public.courses c on c.id = en.course_id
   where en.id = e_id;

  select count(*)
    into done
    from public.session_progress
   where enrollment_id = e_id
     and completed_at is not null;

  update public.enrollments
     set progress_pct = least(100, round(done::numeric * 100 / nullif(total, 0)))::int,
         status       = case when done >= total then 'completado'::enrollment_status
                             else status end,
         completed_at = case when done >= total then coalesce(completed_at, now())
                             else completed_at end
   where id = e_id;

  return coalesce(new, old);
end;
$$;

create trigger trg_recalc_progress
  after insert or update or delete on public.session_progress
  for each row execute function public.recalc_progress();

-- ── Contador de likes ─────────────────────────────────────
create or replace function public.sync_likes_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.posts
     set likes_count = (select count(*) from public.post_likes
                         where post_id = coalesce(new.post_id, old.post_id))
   where id = coalesce(new.post_id, old.post_id);
  return coalesce(new, old);
end;
$$;

create trigger trg_sync_likes
  after insert or delete on public.post_likes
  for each row execute function public.sync_likes_count();

-- ── Código de verificación de certificado ─────────────────
create or replace function public.gen_verification_code()
returns text
language sql
volatile
as $$
  select 'SEP-' || to_char(now(), 'YYYY') || '-' ||
         upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
$$;

create or replace function public.set_verification_code()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.verification_code is null or new.verification_code = '' then
    new.verification_code := public.gen_verification_code();
  end if;
  return new;
end;
$$;

create trigger trg_certificate_code
  before insert on public.certificates
  for each row execute function public.set_verification_code();

-- ── Verificación pública de certificado ───────────────────
-- Devuelve solo lo mínimo: no expone email ni datos personales.
create or replace function public.verify_certificate(code text)
returns table (
  holder_name   text,
  course_title  text,
  certificate   text,
  issuer        text,
  issued_at     timestamptz,
  is_valid      boolean
)
language sql
security definer
stable
set search_path = public
as $$
  select
    p.full_name,
    coalesce(c.title, 'Programa SEP'),
    ct.name,
    ct.issuer,
    cert.issued_at,
    (cert.status = 'emitido' and cert.revoked_at is null)
  from public.certificates cert
  join public.profiles p          on p.id = cert.user_id
  join public.certificate_types ct on ct.id = cert.certificate_type_id
  left join public.enrollments e   on e.id = cert.enrollment_id
  left join public.courses c       on c.id = e.course_id
  where upper(cert.verification_code) = upper(code);
$$;

grant execute on function public.verify_certificate(text) to anon, authenticated;

-- ── Auditoría automática de cambios de rol ────────────────
create or replace function public.audit_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_log (actor_id, action, entity, entity_id, before_data, after_data)
  values (
    auth.uid(),
    tg_op,
    'user_roles',
    coalesce(new.id, old.id)::text,
    case when tg_op in ('UPDATE','DELETE') then to_jsonb(old) end,
    case when tg_op in ('INSERT','UPDATE') then to_jsonb(new) end
  );
  return coalesce(new, old);
end;
$$;

create trigger trg_audit_roles
  after insert or update or delete on public.user_roles
  for each row execute function public.audit_role_change();
