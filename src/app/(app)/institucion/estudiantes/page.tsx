import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import { Badge, Card, EmptyState } from "@/components/ui/primitives";

import { PanelSection } from "@/components/app/data-views";

import { GraduationCap, ShieldCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Estudiantes" };

/** Anonimiza el apellido: los escolares son menores de edad (Ley 29733). */
function anonymize(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return parts[0] ?? "—";
  return `${parts[0]} ${parts[1][0]}.`;
}

export default async function InstitucionEstudiantesPage() {
  const user = await requireRole(["institucion", "admin", "super_admin"]);
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles").select("institution_id").eq("id", user.id).maybeSingle();

  if (!profile?.institution_id) {
    return (
      <>
        <PageHeader title="Estudiantes" />
        <EmptyState icon={<GraduationCap className="size-5" />} title="Sin institución vinculada" />
      </>
    );
  }

  const { data: workshops } = await supabase
    .from("workshops")
    .select("id, title, scheduled_at, grade")
    .eq("institution_id", profile.institution_id)
    .order("scheduled_at", { ascending: false });

  const ids = (workshops ?? []).map((w) => w.id);
  const { data: attendees } = ids.length
    ? await supabase
        .from("workshop_attendees")
        .select("id, workshop_id, student_name, grade, attended, certificate_id")
        .in("workshop_id", ids)
    : { data: [] };

  const rows = attendees ?? [];
  const byWorkshop = new Map((workshops ?? []).map((w) => [w.id, w]));
  const withCert = rows.filter((a) => a.certificate_id).length;

  return (
    <>
      <PageHeader
        title="Estudiantes"
        description="Asistencia registrada en los talleres. Los nombres se muestran anonimizados."
      />

      <KpiGrid>
        <Kpi label="Registros" value={rows.length} icon={<GraduationCap className="size-4" />} />
        <Kpi label="Asistieron" value={rows.filter((a) => a.attended).length} />
        <Kpi label="Con constancia" value={withCert} icon={<ShieldCheck className="size-4" />} />
        <Kpi label="Talleres" value={workshops?.length ?? 0} />
      </KpiGrid>

      <Card className="mt-8 border-sep-200 bg-sep-50/40">
        <p className="text-sm leading-relaxed text-graphite">
          <strong className="font-medium text-ink">Sobre la privacidad:</strong> son menores
          de edad, así que SEP no crea cuentas para ellos ni guarda más que su nombre y grado,
          bajo responsabilidad del colegio y con consentimiento del apoderado. Aquí los ves
          anonimizados conforme a la Ley N.º 29733.
        </p>
      </Card>

      <PanelSection title="Asistencia">
        {rows.length === 0 ? (
          <EmptyState
            icon={<GraduationCap className="size-5" />}
            title="Sin asistencia registrada"
            description="Aparecerá después del primer taller realizado."
          />
        ) : (
          <Card className="p-0">
            <ul className="divide-y divide-line">
              {rows.slice(0, 120).map((a) => {
                const w = byWorkshop.get(a.workshop_id);
                return (
                  <li key={a.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">
                        {anonymize(a.student_name)}
                      </p>
                      <p className="truncate text-xs text-slate-ui">
                        {a.grade ?? w?.grade ?? "—"}
                        {w?.scheduled_at ? ` · ${formatDate(w.scheduled_at)}` : ""}
                      </p>
                    </div>
                    {a.certificate_id && <Badge tone="success">Constancia</Badge>}
                    {a.attended ? <Badge tone="seed">Asistió</Badge> : <Badge tone="neutral">Faltó</Badge>}
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

