-- ═══════════════════════════════════════════════════════════
-- SEP · 0009 — Vistas y analítica
--
-- Agregaciones pesadas resueltas en Postgres, no en Node:
-- una consulta en vez de N. Todas las vistas son
-- `security_invoker = on`, así que respetan el RLS de quien
-- consulta — no abren una puerta trasera.
-- ═══════════════════════════════════════════════════════════

-- ── Cursos con métricas de inscripción ────────────────────
create or replace view public.course_stats
with (security_invoker = on) as
select
  c.id,
  c.slug,
  c.title,
  c.status,
  c.audience,
  c.category,
  c.sessions_count,
  count(distinct e.id)                                          as enrollments,
  count(distinct e.id) filter (where e.status = 'completado')    as completions,
  coalesce(round(avg(e.progress_pct)), 0)::int                   as avg_progress,
  case
    when count(e.id) = 0 then 0
    else round(
      count(e.id) filter (where e.status = 'completado')::numeric * 100 / count(e.id)
    )::int
  end                                                            as completion_rate
from courses c
left join enrollments e on e.course_id = c.id
group by c.id;

-- ── Distribución geográfica ───────────────────────────────
create or replace view public.region_stats
with (security_invoker = on) as
select
  coalesce(p.region, 'Sin especificar')                        as region,
  count(*)                                                     as users,
  count(*) filter (where ur.role = 'estudiante')               as students,
  count(*) filter (where ur.role = 'docente')                  as teachers,
  count(*) filter (where ur.role = 'mentor')                   as mentors
from profiles p
left join user_roles ur on ur.user_id = p.id and ur.revoked_at is null
group by 1
order by 2 desc;

-- ── Embudo de certificados ────────────────────────────────
create or replace view public.certificate_stats
with (security_invoker = on) as
select
  ct.id,
  ct.name,
  ct.issuer,
  ct.price_cents,
  count(c.id)                                        as total,
  count(c.id) filter (where c.status = 'emitido')     as issued,
  count(c.id) filter (where c.status = 'pendiente')   as pending,
  count(c.id) filter (where c.status = 'revocado')    as revoked,
  coalesce(
    sum(ct.price_cents) filter (where c.status = 'emitido'), 0
  )::bigint                                           as revenue_cents
from certificate_types ct
left join certificates c on c.certificate_type_id = ct.id
group by ct.id;

-- ── Ingresos por mes ──────────────────────────────────────
create or replace view public.revenue_by_month
with (security_invoker = on) as
select
  date_trunc('month', p.paid_at)::date         as month,
  o.item_type,
  count(*)                                      as transactions,
  sum(p.amount_cents)::bigint                   as total_cents
from payments p
join orders o on o.id = p.order_id
where p.status = 'pagado' and p.paid_at is not null
group by 1, 2
order by 1 desc;

-- ── Impacto en colegios (para el reporte institucional) ───
create or replace view public.school_impact
with (security_invoker = on) as
select
  i.id                                                        as institution_id,
  i.name,
  i.region,
  i.province,
  count(distinct w.id) filter (where w.status = 'realizado')   as workshops_done,
  count(distinct wa.id)                                        as students_reached,
  count(distinct wf.user_id)                                   as facilitators,
  max(w.scheduled_at)                                          as last_workshop
from institutions i
left join workshops w              on w.institution_id = i.id
left join workshop_attendees wa    on wa.workshop_id = w.id and wa.attended
left join workshop_facilitators wf on wf.workshop_id = w.id
where i.type = 'colegio'
group by i.id;

-- ── Ranking de voluntarios por horas aprobadas ────────────
create or replace view public.volunteer_leaderboard
with (security_invoker = on) as
select
  vp.user_id,
  p.full_name,
  p.region,
  vp.type,
  vp.started_at,
  coalesce(sum(vh.hours) filter (where vh.approved_at is not null), 0)  as approved_hours,
  coalesce(sum(vh.hours) filter (where vh.approved_at is null), 0)      as pending_hours,
  count(distinct m.mentee_id)                                          as mentees
from volunteer_profiles vp
join profiles p            on p.id = vp.user_id
left join volunteer_hours vh on vh.user_id = vp.user_id
left join mentorships m      on m.mentor_id = vp.user_id and m.ended_at is null
where vp.is_active
group by vp.user_id, p.full_name, p.region, vp.type, vp.started_at;


-- ═══════════════════════════════════════════════════════════
-- FUNCIONES DE ANALÍTICA (solo admin)
-- ═══════════════════════════════════════════════════════════

/** KPIs globales del panel de administración en una sola llamada. */
create or replace function public.admin_dashboard()
returns jsonb
language plpgsql
security definer
stable
set search_path = public
as $$
declare
  v jsonb;
begin
  if not is_admin() then
    raise exception 'FORBIDDEN';
  end if;

  select jsonb_build_object(
    'users',            (select count(*) from profiles),
    'users_30d',        (select count(*) from profiles where created_at > now() - interval '30 days'),
    'enrollments',      (select count(*) from enrollments),
    'completions',      (select count(*) from enrollments where status = 'completado'),
    'certificates',     (select count(*) from certificates where status = 'emitido'),
    'revenue_cents',    (select coalesce(sum(amount_cents), 0) from payments where status = 'pagado'),
    'pending_payments', (select count(*) from payments where status = 'en_revision'),
    'pending_apps',     (select count(*) from volunteer_applications where status in ('recibida','en_revision')),
    'pending_schools',  (select count(*) from school_applications where status in ('recibida','en_revision')),
    'pending_speakers', (select count(*) from speaker_profiles where not is_approved),
    'schools',          (select count(*) from institutions where type = 'colegio' and is_verified),
    'workshops',        (select count(*) from workshops where status = 'realizado'),
    'students_reached', (select count(*) from workshop_attendees where attended),
    'volunteers',       (select count(*) from volunteer_profiles where is_active),
    'newsletter',       (select count(*) from newsletter_subscribers where unsubscribed_at is null),
    'diagnostic_leads', (select count(*) from survey_leads where completed),
    'donations_cents',  (select coalesce(sum(amount_cents), 0) from donations where status = 'pagado'),
    'regions',          (select count(distinct region) from profiles where region is not null)
  ) into v;

  return v;
end;
$$;

/** Resultados agregados del diagnóstico, listos para graficar. */
create or replace function public.diagnostic_results(p_profile survey_profile)
returns table (
  question_number int,
  question        text,
  tag             text,
  is_key          boolean,
  option_label    text,
  votes           bigint,
  pct             numeric
)
language plpgsql
security definer
stable
set search_path = public
as $$
begin
  if not is_admin() then
    raise exception 'FORBIDDEN';
  end if;

  return query
  with expanded as (
    -- Postgres no permite una función set-returning dentro de un CASE.
    -- El truco: envolver la respuesta escalar en un array de un elemento y
    -- pasar el CASE como *argumento* de jsonb_array_elements_text.
    select
      q.number,
      q.question,
      q.tag,
      q.is_key,
      x.label
    from survey_responses r
    join survey_questions q on q.id = r.question_id
    cross join lateral (
      select jsonb_array_elements_text(
               case
                 when jsonb_typeof(r.answer) = 'array' then r.answer
                 else jsonb_build_array(r.answer)
               end
             ) as label
    ) x
    where q.profile = p_profile
  ),
  totals as (
    select number, count(*) as total from expanded group by number
  )
  select
    e.number,
    e.question,
    e.tag,
    e.is_key,
    e.label,
    count(*)::bigint,
    round(count(*)::numeric * 100 / nullif(t.total, 0), 1)
  from expanded e
  join totals t on t.number = e.number
  group by e.number, e.question, e.tag, e.is_key, e.label, t.total
  order by e.number, count(*) desc;
end;
$$;

/** Reporte de impacto de una institución — el entregable clave para RSE. */
create or replace function public.institution_impact_report(p_institution_id uuid)
returns jsonb
language plpgsql
security definer
stable
set search_path = public
as $$
declare
  v jsonb;
begin
  if not is_admin() and p_institution_id is distinct from my_institution_id() then
    raise exception 'FORBIDDEN';
  end if;

  select jsonb_build_object(
    'institution', (select jsonb_build_object(
                      'name', name, 'type', type, 'region', region,
                      'province', province, 'agreement_signed_at', agreement_signed_at)
                    from institutions where id = p_institution_id),
    'workshops_total',    (select count(*) from workshops where institution_id = p_institution_id),
    'workshops_done',     (select count(*) from workshops
                            where institution_id = p_institution_id and status = 'realizado'),
    'students_reached',   (select count(*) from workshop_attendees wa
                            join workshops w on w.id = wa.workshop_id
                           where w.institution_id = p_institution_id and wa.attended),
    'certificates_issued',(select count(*) from workshop_attendees wa
                            join workshops w on w.id = wa.workshop_id
                           where w.institution_id = p_institution_id
                             and wa.certificate_id is not null),
    'facilitators',       (select count(distinct wf.user_id) from workshop_facilitators wf
                            join workshops w on w.id = wf.workshop_id
                           where w.institution_id = p_institution_id),
    'timeline',           (select coalesce(jsonb_agg(jsonb_build_object(
                              'title', title, 'date', scheduled_at,
                              'students', students_count, 'status', status
                            ) order by scheduled_at desc), '[]'::jsonb)
                           from workshops where institution_id = p_institution_id),
    'sdg',                jsonb_build_array(
                            jsonb_build_object('goal', 4,  'name', 'Educación de calidad'),
                            jsonb_build_object('goal', 8,  'name', 'Trabajo decente y crecimiento económico'),
                            jsonb_build_object('goal', 10, 'name', 'Reducción de las desigualdades'))
  ) into v;

  return v;
end;
$$;

grant execute on function public.admin_dashboard()                    to authenticated;
grant execute on function public.diagnostic_results(survey_profile)   to authenticated;
grant execute on function public.institution_impact_report(uuid)      to authenticated;
