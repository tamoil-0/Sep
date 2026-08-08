import type { Metadata } from "next";
import { MapPin, UsersRound } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import { Badge, Card, EmptyState, ProgressBar } from "@/components/ui/primitives";
import { PanelSection } from "@/components/app/data-views";
import { formatDate, initials } from "@/lib/utils";

export const metadata: Metadata = { title: "Mis mentorados" };

export default async function MentoradosPage() {
  const user = await requireRole(["mentor", "admin", "super_admin"]);
  const supabase = await createClient();

  const { data } = await supabase
    .from("mentorships")
    .select("id, started_at, ended_at, notes, mentee_id, profiles!mentorships_mentee_id_fkey(full_name, region, university, career)")
    .eq("mentor_id", user.id)
    .order("started_at", { ascending: false });

  const rows = (data ?? []).map((m) => ({
    ...m,
    mentee: Array.isArray(m.profiles) ? m.profiles[0] : m.profiles,
  }));

  const menteeIds = rows.map((r) => r.mentee_id);
  const { data: enrollments } = menteeIds.length
    ? await supabase
        .from("enrollments")
        .select("user_id, progress_pct, status, courses(title)")
        .in("user_id", menteeIds)
    : { data: [] };

  const byMentee = new Map<string, { progress: number; course: string }>();
  for (const e of enrollments ?? []) {
    const c = Array.isArray(e.courses) ? e.courses[0] : e.courses;
    const prev = byMentee.get(e.user_id);
    if (!prev || e.progress_pct > prev.progress) {
      byMentee.set(e.user_id, { progress: e.progress_pct, course: c?.title ?? "—" });
    }
  }

  const active = rows.filter((r) => !r.ended_at);

  return (
    <>
      <PageHeader
        title="Mis mentorados"
        description="Las personas que acompañas. Su avance real, no lo que crees que están haciendo."
      />

      <KpiGrid>
        <Kpi label="Activos" value={active.length} icon={<UsersRound className="size-4" />} />
        <Kpi label="Histórico" value={rows.length} />
        <Kpi
          label="Progreso medio"
          value={
            active.length
              ? `${Math.round(active.reduce((s, r) => s + (byMentee.get(r.mentee_id)?.progress ?? 0), 0) / active.length)}%`
              : "—"
          }
        />
        <Kpi label="Regiones" value={new Set(active.map((r) => r.mentee?.region).filter(Boolean)).size} />
      </KpiGrid>

      <PanelSection title="Acompañamiento activo">
        {active.length === 0 ? (
          <EmptyState
            icon={<UsersRound className="size-5" />}
            title="Aún no tienes mentorados asignados"
            description="El equipo de SEP te asignará jóvenes cuando abra la próxima cohorte."
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {active.map((m) => {
              const prog = byMentee.get(m.mentee_id);
              return (
                <Card key={m.id} className="p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full sep-gradient text-xs font-semibold text-white">
                      {initials(m.mentee?.full_name ?? "?")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-[0.9375rem] font-semibold text-ink">
                        {m.mentee?.full_name}
                      </p>
                      <p className="truncate text-xs text-slate-ui">
                        {[m.mentee?.career, m.mentee?.university].filter(Boolean).join(" · ") || "—"}
                      </p>
                    </div>
                    {m.mentee?.region && (
                      <Badge tone="neutral">
                        <MapPin className="size-3" />
                        {m.mentee.region}
                      </Badge>
                    )}
                  </div>

                  {prog && (
                    <div className="mt-4">
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="text-slate-ui">{prog.course}</span>
                        <span className="tabular font-medium text-ink">{prog.progress}%</span>
                      </div>
                      <ProgressBar value={prog.progress} className="mt-1.5" />
                    </div>
                  )}

                  {m.notes && (
                    <p className="mt-4 rounded-[10px] bg-surface-1 p-3.5 text-sm leading-relaxed text-graphite">
                      {m.notes}
                    </p>
                  )}

                  <p className="mt-3 text-xs text-mist">Desde el {formatDate(m.started_at)}</p>
                </Card>
              );
            })}
          </div>
        )}
      </PanelSection>
    </>
  );
}

