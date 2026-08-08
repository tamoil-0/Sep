import type { Metadata } from "next";
import { Building2, GraduationCap, Presentation } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import { Card, EmptyState } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { StatusBadge, PanelSection } from "@/components/app/data-views";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Mi colegio" };

export default async function DocenteMiColegioPage() {
  const user = await requireRole(["docente", "admin", "super_admin"]);
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("institution_id, institutions(id, name, type, region, province, is_verified, agreement_signed_at, students_count)")
    .eq("id", user.id)
    .maybeSingle();

  const inst = Array.isArray(profile?.institutions) ? profile?.institutions[0] : profile?.institutions;

  if (!inst) {
    return (
      <>
        <PageHeader title="Mi colegio" />
        <EmptyState
          icon={<Building2 className="size-5" />}
          title="Todavía no estás vinculado a un colegio"
          description="Si tu colegio ya es parte de la red SEP, escríbenos y te vinculamos. Si aún no lo es, puedes inscribirlo: es gratuito."
          action={<Button href="/colegios">Inscribir mi colegio</Button>}
        />
      </>
    );
  }

  const { data: workshops } = await supabase
    .from("workshops")
    .select("id, title, topic, scheduled_at, status, students_count")
    .eq("institution_id", inst.id)
    .order("scheduled_at", { ascending: false });

  const done = (workshops ?? []).filter((w) => w.status === "realizado");
  const students = done.reduce((s, w) => s + (w.students_count ?? 0), 0);

  return (
    <>
      <PageHeader title={inst.name} description={[inst.province, inst.region].filter(Boolean).join(", ")} />

      <KpiGrid>
        <Kpi label="Talleres realizados" value={done.length} icon={<Presentation className="size-4" />} />
        <Kpi label="Estudiantes alcanzados" value={students} icon={<GraduationCap className="size-4" />} />
        <Kpi label="Programados" value={(workshops ?? []).filter((w) => w.status === "confirmado").length} />
        <Kpi label="Convenio" value={inst.agreement_signed_at ? "Firmado" : "Pendiente"} />
      </KpiGrid>

      <PanelSection title="Talleres" action={{ label: "Solicitar uno nuevo", href: "/docente/talleres" }}>
        {(workshops?.length ?? 0) === 0 ? (
          <EmptyState
            icon={<Presentation className="size-5" />}
            title="Sin talleres todavía"
            description="Solicita el primero y coordinamos contigo en menos de 72 horas."
          />
        ) : (
          <Card className="p-0">
            <ul className="divide-y divide-line">
              {(workshops ?? []).map((w) => (
                <li key={w.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{w.title}</p>
                    <p className="mt-0.5 text-xs text-slate-ui">
                      {w.scheduled_at ? formatDate(w.scheduled_at) : "Fecha por coordinar"}
                      {w.students_count ? ` · ${w.students_count} estudiantes` : ""}
                    </p>
                  </div>
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

