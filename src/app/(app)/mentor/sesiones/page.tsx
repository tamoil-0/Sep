import type { Metadata } from "next";
import { CalendarDays, Video } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { now } from "@/lib/time";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import { Badge, Card, EmptyState } from "@/components/ui/primitives";
import { PanelSection, StatusBadge } from "@/components/app/data-views";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Sesiones" };

export default async function MentorSesionesPage() {
  const user = await requireRole(["mentor", "admin", "super_admin"]);
  const supabase = await createClient();

  const [{ data: workshops }, { data: sessions }] = await Promise.all([
    supabase
      .from("workshop_facilitators")
      .select("workshop_id, workshops(id, title, topic, scheduled_at, status, students_count, modality, institutions(name, region))")
      .eq("user_id", user.id),
    supabase
      .from("course_sessions")
      .select("id, number, title, subtitle, scheduled_at, meet_url, status, courses(title)")
      .not("scheduled_at", "is", null)
      .order("scheduled_at")
      .limit(20),
  ]);

  const talleres = (workshops ?? [])
    .map((w) => (Array.isArray(w.workshops) ? w.workshops[0] : w.workshops))
    .filter(Boolean);

  const cutoff = now();
  const proximas = (sessions ?? []).filter(
    (s) => s.scheduled_at && new Date(s.scheduled_at).getTime() >= cutoff,
  );

  return (
    <>
      <PageHeader
        title="Sesiones"
        description="Los talleres que facilitas y las sesiones en vivo del catálogo."
      />

      <KpiGrid>
        <Kpi label="Talleres asignados" value={talleres.length} icon={<CalendarDays className="size-4" />} />
        <Kpi label="Realizados" value={talleres.filter((t) => t?.status === "realizado").length} />
        <Kpi label="Por venir" value={talleres.filter((t) => t?.status === "confirmado").length} />
        <Kpi label="Sesiones en vivo" value={proximas.length} icon={<Video className="size-4" />} />
      </KpiGrid>

      <PanelSection title="Talleres que facilitas">
        {talleres.length === 0 ? (
          <EmptyState
            icon={<CalendarDays className="size-5" />}
            title="Sin talleres asignados"
            description="El equipo te asignará talleres en colegios de tu región."
          />
        ) : (
          <Card className="p-0">
            <ul className="divide-y divide-line">
              {talleres.map((t) => {
                const inst = t && (Array.isArray(t.institutions) ? t.institutions[0] : t.institutions);
                return (
                  <li key={t!.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{t!.title}</p>
                      <p className="mt-0.5 text-xs text-slate-ui">
                        {inst?.name ?? "—"}
                        {t!.scheduled_at ? ` · ${formatDateTime(t!.scheduled_at)}` : ""}
                        {t!.students_count ? ` · ${t!.students_count} estudiantes` : ""}
                      </p>
                    </div>
                    <Badge tone="neutral">{t!.modality}</Badge>
                    <StatusBadge status={t!.status} />
                  </li>
                );
              })}
            </ul>
          </Card>
        )}
      </PanelSection>

      <PanelSection title="Próximas sesiones del catálogo">
        {proximas.length === 0 ? (
          <EmptyState icon={<Video className="size-5" />} title="Sin sesiones programadas" />
        ) : (
          <Card className="p-0">
            <ul className="divide-y divide-line">
              {proximas.map((s) => {
                const c = Array.isArray(s.courses) ? s.courses[0] : s.courses;
                return (
                  <li key={s.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                    <span className="tabular flex size-8 shrink-0 items-center justify-center rounded-full bg-sep-50 text-xs font-semibold text-sep-600">
                      {s.number}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{s.title}</p>
                      <p className="mt-0.5 text-xs capitalize text-slate-ui">
                        {c?.title} · {s.scheduled_at ? formatDateTime(s.scheduled_at) : ""}
                      </p>
                    </div>
                    {s.meet_url && (
                      <a
                        href={s.meet_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[8px] bg-sep-600 px-3.5 text-sm font-medium text-white hover:bg-sep-700"
                      >
                        <Video className="size-3.5" />
                        Unirme
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </Card>
        )}
      </PanelSection>
    </>
  );
}

