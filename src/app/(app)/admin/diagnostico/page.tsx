import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarDays,
  ChartPie,
  ChevronRight,
  ClipboardCheck,
  Mail,
  MapPin,
  Sparkles,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import { Badge, Card, EmptyState } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import type { Json } from "@/types/database";

export const metadata: Metadata = { title: "Diagnóstico" };

const PROFILES = [
  { key: "universitario", label: "Estudiantes", singular: "Estudiante", emoji: "🎓" },
  { key: "docente", label: "Docentes", singular: "Docente", emoji: "📚" },
  { key: "empresa", label: "Organizaciones", singular: "Organización", emoji: "🏢" },
] as const;

const MODULES = ["Tu punto de partida", "Lo que quieres lograr", "Tus próximos pasos"];

type ProfileKey = (typeof PROFILES)[number]["key"];

function formatDate(value: string | null) {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatAnswer(answer: Json) {
  if (Array.isArray(answer)) return answer.map(String).join(" · ");
  if (typeof answer === "string" || typeof answer === "number") return String(answer);
  return "Sin respuesta";
}

export default async function AdminDiagnosticoPage({
  searchParams,
}: {
  searchParams: Promise<{ perfil?: string; lead?: string }>;
}) {
  await requireRole(["admin", "super_admin"]);
  const { perfil, lead: requestedLead } = await searchParams;
  const active: ProfileKey =
    PROFILES.find((profile) => profile.key === perfil)?.key ?? "universitario";
  const activeMeta = PROFILES.find((profile) => profile.key === active)!;
  const supabase = await createClient();

  const [allLeadsResult, leadsResult, resultsResult, questionsResult] = await Promise.all([
    supabase.from("survey_leads").select("profile, completed, user_id"),
    supabase
      .from("survey_leads")
      .select(
        "id, user_id, email, profile, region, utm_source, completed, completed_at, created_at",
      )
      .eq("profile", active)
      .eq("completed", true)
      .order("completed_at", { ascending: false, nullsFirst: false })
      .limit(150),
    supabase.rpc("diagnostic_results", { p_profile: active }),
    supabase
      .from("survey_questions")
      .select("id, number, question, tag, is_key")
      .eq("profile", active)
      .order("number"),
  ]);

  const allLeads = allLeadsResult.data ?? [];
  const leads = leadsResult.data ?? [];
  const results = resultsResult.data ?? [];
  const questions = questionsResult.data ?? [];
  const userIds = [...new Set(leads.flatMap((lead) => (lead.user_id ? [lead.user_id] : [])))];

  const { data: profileRows } = userIds.length
    ? await supabase
        .from("profiles")
        .select(
          "id, full_name, phone, region, university, career, current_situation, institution_id",
        )
        .in("id", userIds)
    : { data: [] };

  const profiles = new Map((profileRows ?? []).map((profile) => [profile.id, profile]));
  const institutionIds = [
    ...new Set(
      (profileRows ?? []).flatMap((profile) =>
        profile.institution_id ? [profile.institution_id] : [],
      ),
    ),
  ];
  const { data: institutionRows } = institutionIds.length
    ? await supabase.from("institutions").select("id, name").in("id", institutionIds)
    : { data: [] };
  const institutions = new Map(
    (institutionRows ?? []).map((institution) => [institution.id, institution.name]),
  );
  const selectedLead = requestedLead
    ? leads.find((lead) => lead.id === requestedLead) ?? null
    : null;

  const { data: selectedResponses } = selectedLead
    ? await supabase
        .from("survey_responses")
        .select("question_id, answer")
        .eq("lead_id", selectedLead.id)
    : { data: [] };

  const responseByQuestion = new Map(
    (selectedResponses ?? []).map((response) => [response.question_id, response.answer]),
  );
  const selectedProfile = selectedLead?.user_id
    ? profiles.get(selectedLead.user_id) ?? null
    : null;

  const groupedResults = new Map<
    number,
    { question: string; tag: string | null; isKey: boolean; options: typeof results }
  >();

  for (const result of results) {
    const question = groupedResults.get(result.question_number);
    if (question) question.options.push(result);
    else
      groupedResults.set(result.question_number, {
        question: result.question,
        tag: result.tag,
        isKey: result.is_key,
        options: [result],
      });
  }

  const accountResponses = allLeads.filter((lead) => lead.completed && lead.user_id).length;

  return (
    <>
      <PageHeader
        title="Diagnóstico de entrada"
        description="Revisa quién completó el diagnóstico, sus respuestas individuales y las tendencias de cada perfil."
      />

      <KpiGrid>
        <Kpi
          label="Diagnósticos completos"
          value={allLeads.filter((lead) => lead.completed).length}
          icon={<ClipboardCheck className="size-4" />}
        />
        <Kpi
          label="Cuentas registradas"
          value={accountResponses}
          hint="Vinculadas a un perfil SEP"
          icon={<Users className="size-4" />}
        />
        {PROFILES.map((profile) => (
          <Kpi
            key={profile.key}
            label={profile.label}
            value={
              allLeads.filter(
                (lead) => lead.profile === profile.key && lead.completed,
              ).length
            }
          />
        ))}
      </KpiGrid>

      <nav className="mt-8 flex gap-1.5 overflow-x-auto pb-1" aria-label="Tipo de perfil">
        {PROFILES.map((profile) => (
          <Link
            key={profile.key}
            href={`/admin/diagnostico?perfil=${profile.key}`}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              active === profile.key
                ? "bg-sep-600 text-white"
                : "bg-white text-graphite ring-1 ring-inset ring-line hover:bg-surface-2",
            )}
          >
            {profile.emoji} {profile.label}
          </Link>
        ))}
      </nav>

      <section className="mt-6" aria-labelledby="participants-title">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="participants-title" className="font-display text-xl font-semibold text-ink">
              Respuestas por persona
            </h2>
            <p className="mt-1 text-sm text-slate-ui">
              {leads.length} {leads.length === 1 ? "respuesta completa" : "respuestas completas"} en {activeMeta.label.toLowerCase()}.
            </p>
          </div>
          <Badge tone="brand">Últimas 150 respuestas</Badge>
        </div>

        {leads.length === 0 ? (
          <EmptyState
            icon={<UserRound className="size-5" />}
            title={`Aún no hay respuestas de ${activeMeta.label.toLowerCase()}`}
            description="Aparecerán aquí cuando una persona termine los tres módulos."
          />
        ) : (
          <Card className="overflow-hidden p-0">
            <div className="hidden grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_140px_32px] gap-4 border-b border-line bg-surface-1 px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-ui md:grid">
              <span>Participante</span>
              <span>Región</span>
              <span>Completado</span>
              <span className="sr-only">Ver</span>
            </div>
            <ul className="divide-y divide-line">
              {leads.map((lead) => {
                const account = lead.user_id ? profiles.get(lead.user_id) : null;
                const selected = selectedLead?.id === lead.id;
                const displayName = account?.full_name?.trim() || "Participante público";

                return (
                  <li key={lead.id}>
                    <Link
                      href={`/admin/diagnostico?perfil=${active}&lead=${lead.id}`}
                      aria-current={selected ? "true" : undefined}
                      className={cn(
                        "group grid gap-2 px-5 py-4 transition-colors hover:bg-surface-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_140px_32px] md:items-center md:gap-4",
                        selected && "bg-sep-50/70",
                      )}
                    >
                      <span className="min-w-0">
                        <span className="flex items-center gap-2 font-medium text-ink">
                          <span className="truncate">{displayName}</span>
                          {lead.user_id ? (
                            <Badge tone="seed" className="shrink-0">Cuenta SEP</Badge>
                          ) : (
                            <Badge tone="neutral" className="shrink-0">Público</Badge>
                          )}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-slate-ui">
                          {lead.email}
                        </span>
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-graphite">
                        <MapPin className="size-3.5 text-mist" />
                        {account?.region || lead.region || "No indicada"}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-slate-ui">
                        <CalendarDays className="size-3.5 text-mist md:hidden" />
                        {formatDate(lead.completed_at ?? lead.created_at)}
                      </span>
                      <ChevronRight className="hidden size-4 text-mist transition-transform group-hover:translate-x-0.5 group-hover:text-sep-600 md:block" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Card>
        )}
      </section>

      {selectedLead && (
        <section className="mt-6" aria-labelledby="response-detail-title">
          <Card className="overflow-hidden border-sep-200 p-0 shadow-[0_12px_36px_rgba(46,11,232,.08)]">
            <div className="sep-gradient px-5 py-6 text-white sm:px-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/65">
                    Respuesta individual · {activeMeta.singular}
                  </p>
                  <h2 id="response-detail-title" className="mt-1.5 font-display text-2xl font-semibold">
                    {selectedProfile?.full_name?.trim() || selectedLead.email}
                  </h2>
                </div>
                <Link
                  href={`/admin/diagnostico?perfil=${active}`}
                  aria-label="Cerrar detalle"
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <X className="size-4" />
                </Link>
              </div>

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/75">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="size-4 text-gold-500" /> {selectedLead.email}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4 text-gold-500" />
                  {selectedProfile?.region || selectedLead.region || "Región no indicada"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-4 text-gold-500" />
                  {formatDate(selectedLead.completed_at ?? selectedLead.created_at)}
                </span>
              </div>

              {selectedProfile && (
                <dl className="mt-5 grid gap-3 border-t border-white/15 pt-5 sm:grid-cols-3">
                  <div>
                    <dt className="text-xs text-white/55">Teléfono</dt>
                    <dd className="mt-0.5 text-sm">{selectedProfile.phone || "No indicado"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-white/55">
                      {active === "docente" ? "Institución" : "Universidad / organización"}
                    </dt>
                    <dd className="mt-0.5 text-sm">
                      {(selectedProfile.institution_id
                        ? institutions.get(selectedProfile.institution_id)
                        : null) || selectedProfile.university || "No indicada"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-white/55">Situación / especialidad</dt>
                    <dd className="mt-0.5 text-sm">
                      {selectedProfile.current_situation || selectedProfile.career || "No indicada"}
                    </dd>
                  </div>
                </dl>
              )}
            </div>

            <div className="space-y-7 px-5 py-7 sm:px-7">
              {MODULES.map((moduleTitle, moduleIndex) => {
                const moduleQuestions = questions.slice(moduleIndex * 5, moduleIndex * 5 + 5);
                return (
                  <div key={moduleTitle}>
                    <div className="mb-3 flex items-center gap-3">
                      <span className="flex size-7 items-center justify-center rounded-full bg-sep-50 text-xs font-semibold text-sep-700">
                        {moduleIndex + 1}
                      </span>
                      <h3 className="font-display text-lg font-semibold text-ink">{moduleTitle}</h3>
                    </div>
                    <dl className="space-y-2.5 sm:pl-10">
                      {moduleQuestions.map((question) => {
                        const answer = responseByQuestion.get(question.id);
                        return (
                          <div key={question.id} className="rounded-[11px] border border-line bg-surface-1 px-4 py-3.5">
                            <dt className="text-sm leading-relaxed text-slate-ui">
                              <span className="tabular mr-1.5 font-semibold text-sep-600">{question.number}.</span>
                              {question.question}
                            </dt>
                            <dd className="mt-1.5 text-sm font-medium leading-relaxed text-ink">
                              {answer === undefined ? "Sin respuesta" : formatAnswer(answer)}
                            </dd>
                          </div>
                        );
                      })}
                    </dl>
                  </div>
                );
              })}
            </div>
          </Card>
        </section>
      )}

      <section className="mt-10" aria-labelledby="trends-title">
        <div className="mb-4">
          <h2 id="trends-title" className="font-display text-xl font-semibold text-ink">
            Tendencias generales
          </h2>
          <p className="mt-1 text-sm text-slate-ui">
            Distribución agregada de las respuestas de {activeMeta.label.toLowerCase()}.
          </p>
        </div>

        <div className="space-y-4">
          {groupedResults.size === 0 ? (
            <EmptyState
              icon={<ChartPie className="size-5" />}
              title="Todavía no hay tendencias para este perfil"
              description="Los gráficos se calcularán cuando lleguen las primeras respuestas."
            />
          ) : (
            [...groupedResults.entries()].map(([number, question]) => {
              const max = Math.max(...question.options.map((option) => Number(option.votes)));
              return (
                <Card key={number} className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="tabular text-xs font-semibold text-gold-600">PREGUNTA {number}</p>
                      <h3 className="mt-1.5 font-display text-[1.0625rem] font-semibold leading-snug text-ink">
                        {question.question}
                      </h3>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      {question.isKey && (
                        <Badge tone="gold"><Sparkles className="size-3" /> Clave</Badge>
                      )}
                      {question.tag && <Badge tone="neutral">{question.tag}</Badge>}
                    </div>
                  </div>

                  <ul className="mt-5 space-y-2.5">
                    {question.options.map((option) => (
                      <li key={option.option_label}>
                        <div className="flex items-baseline justify-between gap-4 text-sm">
                          <span className="text-graphite">{option.option_label}</span>
                          <span className="tabular shrink-0 font-medium text-ink">
                            {option.pct}% <span className="text-xs font-normal text-mist">({option.votes})</span>
                          </span>
                        </div>
                        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-2">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              Number(option.votes) === max ? "sep-gradient" : "bg-sep-200",
                            )}
                            style={{ width: `${Math.max(2, Number(option.pct))}%` }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })
          )}
        </div>
      </section>
    </>
  );
}
