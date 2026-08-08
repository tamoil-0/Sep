import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import { Badge, Card, EmptyState } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { PanelSection, StatusBadge } from "@/components/app/data-views";

import { Presentation } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Talleres" };

export default async function InstitucionTalleresPage() {
  const user = await requireRole(["institucion", "admin", "super_admin"]);
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles").select("institution_id").eq("id", user.id).maybeSingle();

  if (!profile?.institution_id) {
    return (
      <>
        <PageHeader title="Talleres" />
        <EmptyState
          icon={<Presentation className="size-5" />}
          title="Sin institución vinculada"
          action={<Button href="/institucion/perfil">Ver mi perfil</Button>}
        />
      </>
    );
  }

  const { data: workshops } = await supabase
    .from("workshops")
    .select("id, title, topic, scheduled_at, modality, grade, students_count, status")
    .eq("institution_id", profile.institution_id)
    .order("scheduled_at", { ascending: false });

  const rows = workshops ?? [];
  const done = rows.filter((w) => w.status === "realizado");

  return (
    <>
      <PageHeader
        title="Talleres"
        description="Todo lo que SEP ha dictado o tiene programado en tu institución."
        action={<Button href="/contacto" variant="outline">Solicitar un taller</Button>}
      />

      <KpiGrid>
        <Kpi label="Total" value={rows.length} icon={<Presentation className="size-4" />} />
        <Kpi label="Realizados" value={done.length} />
        <Kpi label="Programados" value={rows.filter((w) => w.status === "confirmado").length} />
        <Kpi label="Estudiantes" value={done.reduce((s, w) => s + (w.students_count ?? 0), 0)} />
      </KpiGrid>

      <PanelSection title="Historial">
        {rows.length === 0 ? (
          <EmptyState
            icon={<Presentation className="size-5" />}
            title="Sin talleres todavía"
            description="Escríbenos y coordinamos el primero. Para colegios de la red no tiene costo."
          />
        ) : (
          <Card className="p-0">
            <ul className="divide-y divide-line">
              {rows.map((w) => (
                <li key={w.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{w.title}</p>
                    <p className="mt-0.5 text-xs text-slate-ui">
                      {w.grade ?? "—"}
                      {w.students_count ? ` · ${w.students_count} estudiantes` : ""}
                      {w.scheduled_at ? ` · ${formatDate(w.scheduled_at)}` : " · fecha por coordinar"}
                    </p>
                  </div>
                  <Badge tone="neutral">{w.modality}</Badge>
                  <StatusBadge status={w.status} />
                </li>
              ))}
            </ul>
          </Card>
        )}
      </PanelSection>
    </>
  );
}

