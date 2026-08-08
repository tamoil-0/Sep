import type { Metadata } from "next";
import { ChartPie, Sparkles, Users } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import { Badge, Card, EmptyState } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Diagnóstico" };

const PROFILES = [
  { key: "universitario", label: "Universitarios", emoji: "🎓" },
  { key: "docente", label: "Docentes", emoji: "📚" },
  { key: "empresa", label: "Empresas", emoji: "🏢" },
] as const;

export default async function AdminDiagnosticoPage({
  searchParams,
}: {
  searchParams: Promise<{ perfil?: string }>;
}) {
  await requireRole(["admin", "super_admin"]);
  const { perfil } = await searchParams;

  const active =
    PROFILES.find((p) => p.key === perfil)?.key ?? "universitario";

  const supabase = await createClient();

  const [{ data: leads }, { data: results }] = await Promise.all([
    supabase.from("survey_leads").select("profile, region, completed"),
    supabase.rpc("diagnostic_results", { p_profile: active }),
  ]);

  const all = leads ?? [];
  const rows = results ?? [];

  // Agrupamos por pregunta manteniendo el orden que devuelve la función.
  const questions = new Map<
    number,
    { question: string; tag: string | null; isKey: boolean; options: typeof rows }
  >();

  for (const r of rows) {
    const q = questions.get(r.question_number);
    if (q) q.options.push(r);
    else
      questions.set(r.question_number, {
        question: r.question,
        tag: r.tag,
        isKey: r.is_key,
        options: [r],
      });
  }

  return (
    <>
      <PageHeader
        title="Diagnóstico"
        description="Las 45 preguntas que validan el modelo. Estas respuestas deciden qué construimos primero."
      />

      <KpiGrid>
        <Kpi
          label="Respuestas totales"
          value={all.filter((l) => l.completed).length}
          icon={<Users className="size-4" />}
        />
        {PROFILES.map((p) => (
          <Kpi
            key={p.key}
            label={p.label}
            value={all.filter((l) => l.profile === p.key && l.completed).length}
          />
        ))}
      </KpiGrid>

      {/* Selector de perfil */}
      <div className="mt-8 flex flex-wrap gap-1.5">
        {PROFILES.map((p) => (
          <a
            key={p.key}
            href={`/admin/diagnostico?perfil=${p.key}`}
            className={
              active === p.key
                ? "rounded-full bg-sep-600 px-4 py-2 text-sm font-medium text-white"
                : "rounded-full bg-white px-4 py-2 text-sm font-medium text-graphite ring-1 ring-inset ring-line transition-colors hover:bg-surface-2"
            }
          >
            {p.emoji} {p.label}
          </a>
        ))}
      </div>

      {/* Resultados */}
      <div className="mt-6 space-y-4">
        {questions.size === 0 ? (
          <EmptyState
            icon={<ChartPie className="size-5" />}
            title="Sin respuestas para este perfil"
            description="Comparte el enlace /conocenos para empezar a recibirlas."
          />
        ) : (
          [...questions.entries()].map(([number, q]) => {
            const max = Math.max(...q.options.map((o) => Number(o.votes)));
            return (
              <Card key={number} className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="tabular text-xs font-semibold text-gold-600">
                      PREGUNTA {number}
                    </p>
                    <h2 className="mt-1.5 font-display text-[1.0625rem] font-semibold leading-snug text-ink">
                      {q.question}
                    </h2>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    {q.isKey && (
                      <Badge tone="gold">
                        <Sparkles className="size-3" />
                        Clave
                      </Badge>
                    )}
                    {q.tag && <Badge tone="neutral">{q.tag}</Badge>}
                  </div>
                </div>

                <ul className="mt-5 space-y-2.5">
                  {q.options.map((o) => (
                    <li key={o.option_label}>
                      <div className="flex items-baseline justify-between gap-4 text-sm">
                        <span className="text-graphite">{o.option_label}</span>
                        <span className="tabular shrink-0 font-medium text-ink">
                          {o.pct}%{" "}
                          <span className="text-xs font-normal text-mist">
                            ({o.votes})
                          </span>
                        </span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-2">
                        <div
                          className={
                            Number(o.votes) === max
                              ? "h-full rounded-full sep-gradient"
                              : "h-full rounded-full bg-sep-200"
                          }
                          style={{ width: `${Math.max(2, Number(o.pct))}%` }}
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
    </>
  );
}
