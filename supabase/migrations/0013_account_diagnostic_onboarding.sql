-- SEP · 0013 — Diagnóstico obligatorio para nuevas cuentas

-- Desde esta migración, los datos del registro no habilitan el panel por sí
-- solos. Las cuentas que ya existían conservan su estado actual.
alter table public.profiles
  alter column onboarding_done set default false;

-- Un diagnóstico público puede seguir siendo anónimo. Cuando proviene del
-- onboarding queda enlazado a la cuenta para que el equipo SEP vea el perfil
-- y sus respuestas en conjunto.
alter table public.survey_leads
  add column user_id uuid references public.profiles (id) on delete cascade,
  add column completed_at timestamptz;

create unique index survey_leads_user_idx
  on public.survey_leads (user_id)
  where user_id is not null;

update public.survey_leads
   set completed_at = created_at
 where completed = true and completed_at is null;

-- Aunque alguien intente modificar su perfil mediante la API, no puede
-- habilitar el panel sin un diagnóstico completo enlazado a su cuenta.
create or replace function public.guard_onboarding_completion()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.onboarding_done and not old.onboarding_done and not exists (
    select 1
      from survey_leads lead
     where lead.user_id = new.id
       and lead.completed
       and (
         select count(*) from survey_responses response
          where response.lead_id = lead.id
       ) = 15
  ) then
    raise exception 'INCOMPLETE_DIAGNOSTIC';
  end if;

  return new;
end;
$$;

create trigger profiles_guard_onboarding_completion
  before update of onboarding_done on public.profiles
  for each row execute function public.guard_onboarding_completion();

revoke execute on function public.guard_onboarding_completion() from public, anon, authenticated;

/**
 * Valida y guarda las 15 respuestas de la cuenta en una sola transacción.
 * Si una respuesta falla, no se crea ningún registro parcial y el panel sigue
 * bloqueado. El perfil del cuestionario se obtiene de los roles en Postgres;
 * el navegador nunca puede escogerlo ni suplantar a otra cuenta.
 */
create or replace function public.submit_account_diagnostic(p_answers jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_profile survey_profile;
  v_email text;
  v_region text;
  v_onboarding_done boolean;
  v_expected int;
  v_lead uuid;
  v_item jsonb;
  v_number int;
  v_answer jsonb;
  v_question survey_questions%rowtype;
  v_valid boolean;
begin
  if v_user is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select p.email, p.region, p.onboarding_done
    into v_email, v_region, v_onboarding_done
    from profiles p
   where p.id = v_user
   for update;

  if not found then
    raise exception 'PROFILE_NOT_FOUND';
  end if;

  if v_onboarding_done then
    raise exception 'DIAGNOSTIC_ALREADY_COMPLETED';
  end if;

  v_profile := case
    when exists (
      select 1 from user_roles
       where user_id = v_user and role = 'institucion' and revoked_at is null
    ) then 'empresa'::survey_profile
    when exists (
      select 1 from user_roles
       where user_id = v_user and role = 'docente' and revoked_at is null
    ) then 'docente'::survey_profile
    else 'universitario'::survey_profile
  end;

  select count(*) into v_expected
    from survey_questions
   where profile = v_profile;

  if v_expected <> 15 then
    raise exception 'DIAGNOSTIC_NOT_CONFIGURED';
  end if;

  if jsonb_typeof(p_answers) <> 'array'
     or jsonb_array_length(p_answers) <> v_expected then
    raise exception 'INCOMPLETE_DIAGNOSTIC';
  end if;

  if (
    select count(distinct (item ->> 'number')::int)
      from jsonb_array_elements(p_answers) as item
     where jsonb_typeof(item) = 'object'
       and coalesce(item ->> 'number', '') ~ '^[0-9]+$'
  ) <> v_expected then
    raise exception 'INCOMPLETE_DIAGNOSTIC';
  end if;

  -- Validación completa antes de escribir el lead o sus respuestas.
  for v_item in select * from jsonb_array_elements(p_answers) loop
    if jsonb_typeof(v_item) <> 'object'
       or coalesce(v_item ->> 'number', '') !~ '^[0-9]+$'
       or not (v_item ? 'answer') then
      raise exception 'INVALID_ANSWER';
    end if;

    v_number := (v_item ->> 'number')::int;
    v_answer := v_item -> 'answer';

    select * into v_question
      from survey_questions
     where profile = v_profile and number = v_number;

    if not found then
      raise exception 'INVALID_ANSWER';
    end if;

    if v_question.input_type = 'multiple' then
      if jsonb_typeof(v_answer) <> 'array' or jsonb_array_length(v_answer) = 0 then
        raise exception 'INVALID_ANSWER';
      end if;

      select coalesce(bool_and(
        jsonb_typeof(value) = 'string'
        and v_question.options ? (value #>> '{}')
      ), false)
        into v_valid
        from jsonb_array_elements(v_answer) as selected(value);
    else
      v_valid := jsonb_typeof(v_answer) = 'string'
        and length(trim(v_answer #>> '{}')) > 0
        and v_question.options ? (v_answer #>> '{}');
    end if;

    if not coalesce(v_valid, false) then
      raise exception 'INVALID_ANSWER';
    end if;
  end loop;

  select id into v_lead
    from survey_leads
   where user_id = v_user
   for update;

  if v_lead is null then
    select id into v_lead
      from survey_leads
     where lower(email) = lower(v_email) and profile = v_profile
     for update;
  end if;

  if v_lead is null then
    insert into survey_leads (
      user_id, email, profile, region, utm_source, completed
    ) values (
      v_user, lower(trim(v_email)), v_profile, v_region, 'registro', false
    ) returning id into v_lead;
  else
    update survey_leads
       set user_id = v_user,
           email = lower(trim(v_email)),
           profile = v_profile,
           region = v_region,
           utm_source = coalesce(utm_source, 'registro'),
           completed = false,
           completed_at = null
     where id = v_lead;
  end if;

  delete from survey_responses where lead_id = v_lead;

  for v_item in select * from jsonb_array_elements(p_answers) loop
    insert into survey_responses (lead_id, question_id, answer)
    select v_lead, id, v_item -> 'answer'
      from survey_questions
     where profile = v_profile
       and number = (v_item ->> 'number')::int;
  end loop;

  update survey_leads
     set completed = true,
         completed_at = now()
   where id = v_lead;

  update profiles
     set onboarding_done = true
   where id = v_user;

  return v_lead;
end;
$$;

revoke execute on function public.submit_account_diagnostic(jsonb) from public, anon;
grant execute on function public.submit_account_diagnostic(jsonb) to authenticated, service_role;
