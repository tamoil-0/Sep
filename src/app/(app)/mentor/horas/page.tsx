import type { Metadata } from "next";
import { Check, Clock, Hourglass } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import { Badge, Card, EmptyState } from "@/components/ui/primitives";
import { formatDate } from "@/lib/utils";
import { HoursForm } from "./hours-form";

export const metadata: Metadata = { title: "Mis horas de voluntariado" };

export default async function MentorHorasPage() {
  const user = await requireRole(["mentor", "admin", "super_admin"]);
  const supabase = await createClient();

  const { data: hours } = await supabase
    .from("volunteer_hours")
    .select("id, date, hours, activity, approved_at")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(80);

  const rows = hours ?? [];
  const approved = rows.filter((h) => h.approved_at);
  const pending = rows.filter((h) => !h.approved_at);

  const sum = (list: typeof rows) => list.reduce((s, h) => s + Number(h.hours), 0);

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const thisMonth = rows.filter((h) => new Date(h.date) >= monthStart);

  return (
    <>
      <PageHeader
        title="Mis horas de voluntariado"
        description="Registra lo que haces. Las horas aprobadas alimentan tu certificado y tu carta de recomendación."
      />

      <KpiGrid>
        <Kpi
          label="Horas aprobadas"
          value={`${sum(approved)} h`}
          icon={<Check className="size-4" />}
        />
        <Kpi
          label="Por aprobar"
          value={`${sum(pending)} h`}
          icon={<Hourglass className="size-4" />}
        />
        <Kpi label="Este mes" value={`${sum(thisMonth)} h`} icon={<Clock className="size-4" />} />
        <Kpi label="Registros" value={rows.length} />
      </KpiGrid>

      <div className="mt-8 grid gap-5 lg:grid-cols-[380px_1fr]">
        <Card className="lg:sticky lg:top-6 lg:self-start">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
            Registrar horas
          </h2>
          <HoursForm />
        </Card>

        <div>
          <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
            Historial
          </h2>

          {rows.length === 0 ? (
            <EmptyState
              icon={<Clock className="size-5" />}
              title="Aún no registras horas"
              description="Cada sesión de mentoría, taller o coordinación cuenta. Regístralas apenas las hagas."
            />
          ) : (
            <Card className="overflow-hidden p-0">
              <ul className="divide-y divide-line">
                {rows.map((h) => (
                  <li key={h.id} className="flex items-start gap-4 px-5 py-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-ink">
                          {formatDate(h.date)}
                        </p>
                        <Badge tone={h.approved_at ? "success" : "warning"}>
                          {h.approved_at ? "Aprobadas" : "Por aprobar"}
                        </Badge>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-graphite">
                        {h.activity}
                      </p>
                    </div>
                    <p className="tabular shrink-0 font-display text-lg font-semibold text-ink">
                      {h.hours} h
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
