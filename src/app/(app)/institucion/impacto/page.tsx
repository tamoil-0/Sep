import type { Metadata } from "next";
import {
  Award,
  Building2,
  ChartNoAxesCombined,
  GraduationCap,
  Presentation,
  Printer,
  Users,
} from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import { Badge, Card, EmptyState } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { PrintButton } from "@/components/app/print-button";

export const metadata: Metadata = { title: "Reporte de impacto" };

export default async function ImpactoPage() {
  const user = await requireRole(["institucion", "admin", "super_admin"]);
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("institution_id")
    .eq("id", user.id)
    .single();

  if (!profile?.institution_id) {
    return (
      <>
        <PageHeader title="Reporte de impacto" />
        <EmptyState
          icon={<Building2 className="size-5" />}
          title="Aún no tienes institución vinculada"
          description="Completa tu perfil institucional para generar el reporte con tus métricas."
          action={<Button href="/institucion/perfil">Completar perfil</Button>}
        />
      </>
    );
  }

  const { data, error } = await supabase.rpc("institution_impact_report", {
    p_institution_id: profile.institution_id,
  });

  if (error || !data) {
    return (
      <>
        <PageHeader title="Reporte de impacto" />
        <EmptyState
          icon={<ChartNoAxesCombined className="size-5" />}
          title="No pudimos generar el reporte"
          description="Inténtalo de nuevo en unos minutos o escríbenos si el problema persiste."
        />
      </>
    );
  }

  const report = data;
  const inst = report.institution;

  return (
    <>
      <PageHeader
        title="Reporte de impacto"
        description="Métricas verificables de tu alianza con SEP. Listo para presentar a tu directorio."
        action={<PrintButton />}
      />

      {/* Cabecera imprimible */}
      <Card className="mb-5 overflow-hidden p-0 print:border-0">
        <div className="sep-gradient px-7 py-6 text-white">
          <p className="text-xs uppercase tracking-[0.14em] text-white/70">
            Reporte de impacto social
          </p>
          <h2 className="mt-2 font-display text-[1.75rem] font-semibold leading-tight">
            {inst?.name ?? "Institución"}
          </h2>
          <p className="mt-1 text-sm text-white/75">
            {[inst?.province, inst?.region].filter(Boolean).join(", ")}
            {inst?.agreement_signed_at &&
              ` · Convenio firmado el ${formatDate(inst.agreement_signed_at)}`}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 px-7 py-4">
          <p className="text-xs text-slate-ui">
            Generado el {formatDate(new Date())} · Semillero de Emprendedores Perú
          </p>
          <Badge tone="seed">Datos verificables en plataforma</Badge>
        </div>
      </Card>

      <KpiGrid>
        <Kpi
          label="Talleres realizados"
          value={report.workshops_done}
          hint={`${report.workshops_total} programados en total`}
          icon={<Presentation className="size-4" />}
        />
        <Kpi
          label="Estudiantes impactados"
          value={report.students_reached}
          icon={<GraduationCap className="size-4" />}
        />
        <Kpi
          label="Constancias emitidas"
          value={report.certificates_issued}
          icon={<Award className="size-4" />}
        />
        <Kpi
          label="Universitarios facilitadores"
          value={report.facilitators}
          icon={<Users className="size-4" />}
        />
      </KpiGrid>

      {/* Línea de tiempo */}
      <section className="mt-8">
        <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
          Línea de tiempo
        </h2>

        {report.timeline.length === 0 ? (
          <EmptyState
            icon={<Presentation className="size-5" />}
            title="Aún no hay talleres registrados"
            description="Solicita tu primer taller y aquí verás el historial completo."
          />
        ) : (
          <Card className="overflow-hidden p-0">
            <ul className="divide-y divide-line">
              {report.timeline.map((w, i) => (
                <li key={`${w.title}-${i}`} className="flex items-center gap-4 px-5 py-4">
                  <span
                    className={
                      w.status === "realizado"
                        ? "size-2 shrink-0 rounded-full bg-seed-500"
                        : "size-2 shrink-0 rounded-full bg-mist"
                    }
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{w.title}</p>
                    <p className="mt-0.5 text-xs text-slate-ui">
                      {w.date ? formatDate(w.date) : "Fecha por coordinar"}
                      {w.students ? ` · ${w.students} estudiantes` : ""}
                    </p>
                  </div>
                  <Badge tone={w.status === "realizado" ? "success" : "neutral"}>
                    {w.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </section>

      {/* ODS */}
      <section className="mt-8">
        <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
          Alineación con los Objetivos de Desarrollo Sostenible
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {report.sdg.map((g) => (
            <Card key={g.goal} className="p-5">
              <p className="tabular font-display text-[2rem] font-bold leading-none sep-gradient-text">
                ODS {g.goal}
              </p>
              <p className="mt-2.5 text-sm font-medium text-ink">{g.name}</p>
            </Card>
          ))}
        </div>
      </section>

      <p className="mt-8 flex items-start gap-2 text-xs leading-relaxed text-slate-ui">
        <Printer className="mt-0.5 size-4 shrink-0 text-mist" />
        Usa «Imprimir» y elige «Guardar como PDF» para obtener el documento listo para
        enviar. Todas las cifras provienen de registros de asistencia verificados en la
        plataforma.
      </p>
    </>
  );
}
