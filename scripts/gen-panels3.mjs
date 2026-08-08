/** Tercera tanda: mentor, institución, speaker y cuenta. */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const write = (p, b) => {
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, b.trimStart() + "\n");
};
const A = "src/app/(app)";

/* ═══════════════ MENTOR ═══════════════ */

write(`${A}/mentor/mentorados/page.tsx`, `
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
              ? \`\${Math.round(active.reduce((s, r) => s + (byMentee.get(r.mentee_id)?.progress ?? 0), 0) / active.length)}%\`
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
`);

write(`${A}/mentor/sesiones/page.tsx`, `
import type { Metadata } from "next";
import { CalendarDays, Video } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
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

  const now = Date.now();
  const proximas = (sessions ?? []).filter(
    (s) => s.scheduled_at && new Date(s.scheduled_at).getTime() >= now,
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
                        {t!.scheduled_at ? \` · \${formatDateTime(t!.scheduled_at)}\` : ""}
                        {t!.students_count ? \` · \${t!.students_count} estudiantes\` : ""}
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
`);

write(`${A}/mentor/canal/page.tsx`, `
import type { Metadata } from "next";
import { MessagesSquare } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import { Card, EmptyState } from "@/components/ui/primitives";
import { PanelSection } from "@/components/app/data-views";
import { initials, relativeTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Canal de mentores" };

const RESOURCES = [
  { title: "Cómo dar feedback que no desanima", detail: "Tres formatos que funcionan con jóvenes de 18 a 24 años." },
  { title: "Qué hacer cuando tu mentorado se desconecta", detail: "Señales tempranas y cómo retomar el vínculo." },
  { title: "Guía de la primera sesión 1:1", detail: "Preguntas para conocer su proyecto sin interrogarlo." },
  { title: "Cerrar bien una mentoría", detail: "Cómo despedirse dejando autonomía y no dependencia." },
];

export default async function MentorCanalPage() {
  const user = await requireRole(["mentor", "admin", "super_admin"]);
  const supabase = await createClient();

  const [{ data: mentors }, { data: posts }] = await Promise.all([
    supabase.from("volunteer_leaderboard").select("*").limit(20),
    supabase
      .from("posts")
      .select("id, content, created_at, profiles(full_name, region)")
      .eq("is_pinned", true)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const team = mentors ?? [];

  return (
    <>
      <PageHeader
        title="Canal de mentores"
        description="Espacio cerrado del equipo de voluntariado: recursos, avisos y quiénes somos."
      />

      <KpiGrid>
        <Kpi label="Mentores activos" value={team.length} icon={<MessagesSquare className="size-4" />} />
        <Kpi label="Horas aprobadas" value={team.reduce((s, m) => s + Number(m.approved_hours ?? 0), 0)} />
        <Kpi label="Mentorados" value={team.reduce((s, m) => s + Number(m.mentees ?? 0), 0)} />
        <Kpi label="Tu región" value={user.region ?? "—"} />
      </KpiGrid>

      <PanelSection title="Avisos del equipo">
        {(posts?.length ?? 0) === 0 ? (
          <EmptyState icon={<MessagesSquare className="size-5" />} title="Sin avisos por ahora" />
        ) : (
          <div className="space-y-3">
            {(posts ?? []).map((p) => {
              const a = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles;
              return (
                <Card key={p.id} className="p-5">
                  <div className="flex gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full sep-gradient text-xs font-semibold text-white">
                      {initials(a?.full_name ?? "?")}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm">
                        <span className="font-medium text-ink">{a?.full_name}</span>
                        <span className="ml-2 text-xs text-mist">{relativeTime(p.created_at)}</span>
                      </p>
                      <p className="mt-1.5 whitespace-pre-line text-[0.9375rem] leading-relaxed text-graphite">
                        {p.content}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </PanelSection>

      <PanelSection title="Formación en mentoría">
        <div className="grid gap-3 md:grid-cols-2">
          {RESOURCES.map((r) => (
            <Card key={r.title} className="p-5">
              <h3 className="text-[0.9375rem] font-medium text-ink">{r.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-ui">{r.detail}</p>
            </Card>
          ))}
        </div>
      </PanelSection>

      <PanelSection title="El equipo">
        <Card className="p-0">
          <ul className="divide-y divide-line">
            {team.map((m) => (
              <li key={m.user_id} className="flex items-center gap-3 px-5 py-3.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full sep-gradient text-xs font-semibold text-white">
                  {initials(m.full_name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{m.full_name}</p>
                  <p className="truncate text-xs text-slate-ui">
                    {m.region ?? "—"} · {m.mentees} mentorados
                  </p>
                </div>
                <p className="tabular shrink-0 text-sm font-semibold text-ink">
                  {m.approved_hours} h
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </PanelSection>
    </>
  );
}
`);

console.log("mentor listo");
