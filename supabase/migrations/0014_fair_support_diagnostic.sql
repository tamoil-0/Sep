-- SEP · 0014 — Participación rápida para ferias y activaciones presenciales

-- Las respuestas de feria no necesitan cuenta ni correo. Conservamos el mismo
-- modelo de preguntas/respuestas para que también alimenten las tendencias.
alter table public.survey_leads
  alter column email drop not null,
  add column full_name text;

create index survey_leads_source_created_idx
  on public.survey_leads (utm_source, created_at desc);

/**
 * Recibe las 15 respuestas universitarias desde la experiencia "Apoya hoy".
 * La Server Action invoca esta función con service_role después de validar el
 * nombre, el honeypot y el límite amplio pensado para una red compartida.
 */
create or replace function public.submit_fair_diagnostic(
  p_full_name text,
  p_answers jsonb,
  p_source text default 'apoya_hoy'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_lead uuid;
  v_expected int;
  v_item jsonb;
  v_number int;
  v_answer jsonb;
  v_question survey_questions%rowtype;
  v_valid boolean;
begin
  p_full_name := trim(regexp_replace(coalesce(p_full_name, ''), '\s+', ' ', 'g'));

  if length(p_full_name) < 2 or length(p_full_name) > 120 then
    raise exception 'INVALID_NAME';
  end if;

  if p_source not in ('apoya_hoy', 'feria') then
    p_source := 'apoya_hoy';
  end if;

  select count(*) into v_expected
    from survey_questions
   where profile = 'universitario';

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

  -- Se valida el conjunto completo antes de escribir una sola fila.
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
     where profile = 'universitario'
       and number = v_number;

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

  insert into survey_leads (
    full_name, email, profile, utm_source, completed, completed_at
  ) values (
    p_full_name, null, 'universitario', p_source, true, now()
  ) returning id into v_lead;

  for v_item in select * from jsonb_array_elements(p_answers) loop
    insert into survey_responses (lead_id, question_id, answer)
    select v_lead, id, v_item -> 'answer'
      from survey_questions
     where profile = 'universitario'
       and number = (v_item ->> 'number')::int;
  end loop;

  return v_lead;
end;
$$;

revoke execute on function public.submit_fair_diagnostic(text, jsonb, text)
  from public, anon, authenticated;
grant execute on function public.submit_fair_diagnostic(text, jsonb, text)
  to service_role;
