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

