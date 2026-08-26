import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarDays,
  ChartPie,
  ChevronRight,
  ClipboardCheck,
  FileSpreadsheet,
  HeartHandshake,
  Mail,
  MapPin,
  Search,
  Sparkles,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import { Badge, Card, EmptyState } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import {
  DIAGNOSTIC_MODULES,
  DIAGNOSTIC_PROFILES,
  ORIGIN_LABELS,
  loadDiagnostic,
  loadDiagnosticCounts,
  type DiagnosticDataset,
  type DiagnosticOrigin,
} from "@/server/queries/diagnostic";
import type { SurveyProfileDb } from "@/types/database";

export const metadata: Metadata = { title: "Diagnóstico" };

/** Tope de filas en pantalla. La descarga en Excel llega mucho más lejos. */
const VISIBLE_LIMIT = 500;

function formatDate(value: string | null) {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default async function AdminDiagnosticoPage({
  searchParams,
}: {
  searchParams: Promise<{
    perfil?: string;
    lead?: string;
    origen?: string;
    q?: string;
    datos?: string;
  }>;
}) {
  await requireRole(["admin", "super_admin"]);
  const { perfil, lead: requestedLead, origen, q, datos } = await searchParams;

  const active: SurveyProfileDb =
    DIAGNOSTIC_PROFILES.find((profile) => profile.key === perfil)?.key ?? "universitario";
  const activeMeta = DIAGNOSTIC_PROFILES.find((profile) => profile.key === active)!;
  const origin: DiagnosticOrigin =
    origen === "feria" || origen === "cuenta" || origen === "publico" ? origen : "todos";
  const dataset: DiagnosticDataset = datos === "todos" ? "todos" : "reales";
  const search = q?.trim() ?? "";

  const [counts, snapshot] = await Promise.all([
    loadDiagnosticCounts(dataset),
    // Misma función que alimenta la descarga: lo que se ve es lo que se baja.
    loadDiagnostic({ profiles: [active], origin, search, dataset }),
  ]);

  const participants = snapshot.participants;
  const visible = participants.slice(0, VISIBLE_LIMIT);
  const questions = snapshot.questions
    .filter((question) => question.profile === active)
    .sort((a, b) => a.number - b.number);

  const selected = requestedLead
    ? participants.find((participant) => participant.id === requestedLead) ?? null
    : null;

  const groupedTrends = new Map<
    number,
    { question: string; tag: string | null; isKey: boolean; options: typeof snapshot.trends }
  >();

  for (const trend of snapshot.trends) {
    const group = groupedTrends.get(trend.number);
    if (group) group.options.push(trend);
    else
      groupedTrends.set(trend.number, {
        question: trend.question,
        tag: trend.tag,
        isKey: trend.isKey,
        options: [trend],
      });
  }

  /** Conserva los filtros al navegar y al descargar. */
  const query = (overrides: Record<string, string | undefined> = {}) => {
    const params = new URLSearchParams({ perfil: active });
    if (origin !== "todos") params.set("origen", origin);
    if (search) params.set("q", search);
    if (dataset !== "reales") params.set("datos", dataset);
    for (const [key, value] of Object.entries(overrides)) {
      if (value === undefined) params.delete(key);
      else params.set(key, value);
    }
    return params.toString();
  };

  return (
    <>
      <PageHeader
        title="Diagnóstico de entrada"
        description="Revisa quién completó el diagnóstico, sus respuestas individuales y las tendencias de cada perfil."
        action={
          <div className="flex flex-wrap gap-2">
            <a
              href={`/api/admin/diagnostico/export?${query()}`}
              className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-sep-600 px-4 text-sm font-medium text-white transition-colors hover:bg-sep-700"
            >
              <FileSpreadsheet className="size-4" />
              Descargar Excel
            </a>
            <a
              href={`/api/admin/diagnostico/export?${query({ perfil: "todos" })}`}
              className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-white px-4 text-sm font-medium text-graphite ring-1 ring-inset ring-line transition-colors hover:bg-surface-1"
            >
              Los tres perfiles
            </a>
          </div>
        }
      />

      <KpiGrid>
        <Kpi
          label="Diagnósticos completos"
          value={counts.total}
          hint={dataset === "reales" ? "Respuestas reales" : "Incluye demostración"}
          icon={<ClipboardCheck className="size-4" />}
        />
        <Kpi
          label="Cuentas registradas"
          value={counts.withAccount}
          hint="Vinculadas a un perfil SEP"
          icon={<Users className="size-4" />}
        />
        <Kpi
          label="Participaciones de feria"
          value={counts.fair}
          hint="Ingreso rápido · Apoya hoy"
          icon={<HeartHandshake className="size-4" />}
        />
        {DIAGNOSTIC_PROFILES.map((profile) => (
          <Kpi
            key={profile.key}
            label={profile.label}
            value={counts.byProfile[profile.key]}
          />
        ))}
      </KpiGrid>

      <nav className="mt-8 flex gap-1.5 overflow-x-auto pb-1" aria-label="Tipo de perfil">
        {DIAGNOSTIC_PROFILES.map((profile) => (
          <Link
            key={profile.key}
            href={`/admin/diagnostico?${query({ perfil: profile.key, lead: undefined })}`}
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
              {participants.length}{" "}
              {participants.length === 1 ? "respuesta completa" : "respuestas completas"} en{" "}
              {activeMeta.label.toLowerCase()}.
              {snapshot.demoExcluded > 0 && (
                <> Se ocultan {snapshot.demoExcluded} de demostración.</>
              )}
            </p>
          </div>
          {participants.length > VISIBLE_LIMIT && (
            <Badge tone="brand">Mostrando las {VISIBLE_LIMIT} más recientes</Badge>
          )}
        </div>

        <form
          method="get"
          className="mb-4 grid gap-2 rounded-[14px] border border-line bg-white p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-[minmax(0,1fr)_180px_210px_auto]"
        >
          <input type="hidden" name="perfil" value={active} />
          <label className="relative block">
            <span className="sr-only">Buscar participante</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mist" />
            <input
              type="search"
              name="q"
              defaultValue={search}
              placeholder="Buscar nombre, correo o región"
              className="h-11 w-full rounded-[10px] border border-line bg-surface-1 pl-10 pr-3 text-sm text-ink outline-none transition focus:border-sep-400 focus:bg-white focus:ring-4 focus:ring-sep-50"
            />
          </label>
          <label>
            <span className="sr-only">Filtrar por origen</span>
            <select
              name="origen"
              defaultValue={origin}
              className="h-11 w-full rounded-[10px] border border-line bg-surface-1 px-3 text-sm text-graphite outline-none transition focus:border-sep-400 focus:bg-white focus:ring-4 focus:ring-sep-50"
            >
              <option value="todos">Todos los orígenes</option>
              <option value="feria">{ORIGIN_LABELS.feria}</option>
              <option value="cuenta">{ORIGIN_LABELS.cuenta}</option>
              <option value="publico">{ORIGIN_LABELS.publico}</option>
            </select>
          </label>
          <label>
            <span className="sr-only">Conjunto de datos</span>
            <select
              name="datos"
              defaultValue={dataset}
              className="h-11 w-full rounded-[10px] border border-line bg-surface-1 px-3 text-sm text-graphite outline-none transition focus:border-sep-400 focus:bg-white focus:ring-4 focus:ring-sep-50"
            >
              <option value="reales">Solo respuestas reales</option>
              <option value="todos">Incluir datos de demostración</option>
            </select>
          </label>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-sep-600 px-5 text-sm font-medium text-white transition hover:bg-sep-700"
          >
            Aplicar filtros
          </button>
        </form>

        {visible.length === 0 ? (
          <EmptyState
            icon={<UserRound className="size-5" />}
            title={
              search || origin !== "todos"
                ? "No encontramos coincidencias"
                : `Aún no hay respuestas de ${activeMeta.label.toLowerCase()}`
            }
            description={
              search || origin !== "todos"
                ? "Prueba otro nombre o muestra todos los orígenes."
                : "Aparecerán aquí cuando una persona termine los tres módulos."
            }
            action={
              search || origin !== "todos" ? (
                <Link
                  href={`/admin/diagnostico?perfil=${active}`}
                  className="text-sm font-medium text-sep-600 hover:underline"
                >
                  Limpiar filtros
                </Link>
              ) : undefined
            }
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
              {visible.map((person) => (
                <li key={person.id}>
                  <Link
                    href={`/admin/diagnostico?${query({ lead: person.id })}`}
                    aria-current={selected?.id === person.id ? "true" : undefined}
                    className={cn(
                      "group grid gap-2 px-5 py-4 transition-colors hover:bg-surface-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_140px_32px] md:items-center md:gap-4",
                      selected?.id === person.id && "bg-sep-50/70",
                    )}
                  >
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 font-medium text-ink">
                        <span className="truncate">{person.name}</span>
                        {person.origin === "feria" ? (
                          <Badge tone="gold" className="shrink-0">
                            Feria
                          </Badge>
                        ) : person.origin === "cuenta" ? (
                          <Badge tone="seed" className="shrink-0">
                            Cuenta SEP
                          </Badge>
                        ) : (
                          <Badge tone="neutral" className="shrink-0">
                            Público
                          </Badge>
                        )}
                        {person.isDemo && (
                          <Badge tone="neutral" className="shrink-0">
                            Demo
                          </Badge>
                        )}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-slate-ui">
                        {person.email || "Participación rápida · sin cuenta"}
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-graphite">
                      <MapPin className="size-3.5 text-mist" />
                      {person.region || "No indicada"}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-slate-ui">
                      <CalendarDays className="size-3.5 text-mist md:hidden" />
                      {formatDate(person.completedAt)}
                    </span>
                    <ChevronRight className="hidden size-4 text-mist transition-transform group-hover:translate-x-0.5 group-hover:text-sep-600 md:block" />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </section>

      {selected && (
        <section className="mt-6" aria-labelledby="response-detail-title">
          <Card className="overflow-hidden border-sep-200 p-0 shadow-[0_12px_36px_rgba(46,11,232,.08)]">
            <div className="sep-gradient px-5 py-6 text-white sm:px-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/65">
                    Respuesta individual · {activeMeta.singular}
                  </p>
                  <h2
                    id="response-detail-title"
                    className="mt-1.5 font-display text-2xl font-semibold"
                  >
                    {selected.name}
                  </h2>
                </div>
                <Link
                  href={`/admin/diagnostico?${query({ lead: undefined })}`}
                  aria-label="Cerrar detalle"
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <X className="size-4" />
                </Link>
              </div>

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/75">
                {selected.email ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="size-4 text-gold-500" /> {selected.email}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5">
                    <HeartHandshake className="size-4 text-gold-500" /> Participación de feria
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4 text-gold-500" />
                  {selected.region || "Región no indicada"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-4 text-gold-500" />
                  {formatDate(selected.completedAt)}
                </span>
              </div>

              {(selected.phone || selected.organization || selected.situation) && (
                <dl className="mt-5 grid gap-3 border-t border-white/15 pt-5 sm:grid-cols-3">
                  <div>
                    <dt className="text-xs text-white/55">Teléfono</dt>
                    <dd className="mt-0.5 text-sm">{selected.phone || "No indicado"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-white/55">{activeMeta.organizationHeader}</dt>
                    <dd className="mt-0.5 text-sm">{selected.organization || "No indicada"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-white/55">Situación / especialidad</dt>
                    <dd className="mt-0.5 text-sm">{selected.situation || "No indicada"}</dd>
                  </div>
                </dl>
              )}
            </div>

            <div className="space-y-7 px-5 py-7 sm:px-7">
              {DIAGNOSTIC_MODULES.map((moduleTitle, moduleIndex) => {
                const moduleQuestions = questions.slice(moduleIndex * 5, moduleIndex * 5 + 5);
                return (
                  <div key={moduleTitle}>
                    <div className="mb-3 flex items-center gap-3">
                      <span className="flex size-7 items-center justify-center rounded-full bg-sep-50 text-xs font-semibold text-sep-700">
                        {moduleIndex + 1}
                      </span>
                      <h3 className="font-display text-lg font-semibold text-ink">
                        {moduleTitle}
                      </h3>
                    </div>
                    <dl className="space-y-2.5 sm:pl-10">
                      {moduleQuestions.map((question) => {
                        const answer = selected.answers[question.number] ?? [];
                        return (
                          <div
                            key={question.id}
                            className="rounded-[11px] border border-line bg-surface-1 px-4 py-3.5"
                          >
                            <dt className="text-sm leading-relaxed text-slate-ui">
                              <span className="tabular mr-1.5 font-semibold text-sep-600">
                                {question.number}.
                              </span>
                              {question.question}
                            </dt>
                            <dd className="mt-1.5 text-sm font-medium leading-relaxed text-ink">
                              {answer.length ? answer.join(" · ") : "Sin respuesta"}
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
            Distribución de las {participants.length} respuestas de{" "}
            {activeMeta.label.toLowerCase()} que pasan los filtros de arriba.
          </p>
        </div>

        <div className="space-y-4">
          {groupedTrends.size === 0 ? (
            <EmptyState
              icon={<ChartPie className="size-5" />}
              title="Todavía no hay tendencias para este perfil"
              description="Los gráficos se calcularán cuando lleguen las primeras respuestas."
            />
          ) : (
            [...groupedTrends.entries()].map(([number, question]) => {
              const max = Math.max(...question.options.map((option) => option.votes));
              return (
                <Card key={number} className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="tabular text-xs font-semibold text-gold-600">
                        PREGUNTA {number}
                      </p>
                      <h3 className="mt-1.5 font-display text-[1.0625rem] font-semibold leading-snug text-ink">
                        {question.question}
                      </h3>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      {question.isKey && (
                        <Badge tone="gold">
                          <Sparkles className="size-3" /> Clave
                        </Badge>
                      )}
                      {question.tag && <Badge tone="neutral">{question.tag}</Badge>}
                    </div>
                  </div>

                  <ul className="mt-5 space-y-2.5">
                    {question.options.map((option) => (
                      <li key={option.option}>
                        <div className="flex items-baseline justify-between gap-4 text-sm">
                          <span className="text-graphite">{option.option}</span>
                          <span className="tabular shrink-0 font-medium text-ink">
                            {option.pct}%{" "}
                            <span className="text-xs font-normal text-mist">({option.votes})</span>
                          </span>
                        </div>
                        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-2">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              option.votes === max ? "sep-gradient" : "bg-sep-200",
                            )}
                            style={{ width: `${Math.max(2, option.pct)}%` }}
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
