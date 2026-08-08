import type { Metadata } from "next";
import {
  ArrowRight,
  Building2,
  ChartNoAxesCombined,
  FileSignature,
  GraduationCap,
  Globe,
  Presentation,
} from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import { Badge, Card, EmptyState } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Panel institucional" };

export default async function InstitucionPage() {
  const user = await requireRole(["institucion", "admin", "super_admin"]);
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("institution_id, institutions(id, name, type, region, is_verified, agreement_signed_at)")
    .eq("id", user.id)
    .single();

  const institution = Array.isArray(profile?.institutions)
    ? profile?.institutions[0]
    : profile?.institutions;

  const { data: workshops } = institution?.id
    ? await supabase
        .from("workshops")
        .select("id, title, status, scheduled_at, students_count")
        .eq("institution_id", institution.id)
        .order("scheduled_at", { ascending: false })
        .limit(5)
    : { data: null };

  const done = (workshops ?? []).filter((w) => w.status === "realizado");
  const students = done.reduce((s, w) => s + (w.students_count ?? 0), 0);
  const isCompany = institution?.type === "empresa" || institution?.type === "ong";

  return (
    <>
      <PageHeader
        title={institution?.name ?? "Mi institución"}
        description={
          institution
            ? `${institution.region} · ${institution.type}`
            : "Completa tu perfil institucional para empezar."
        }
        action={
          institution?.is_verified ? (
            <Badge tone="success">Institución verificada</Badge>
          ) : (
            <Badge tone="warning">Verificación pendiente</Badge>
          )
        }
      />

      <KpiGrid>
        {isCompany ? (
          <>
            <Kpi label="Cohortes patrocinadas" value={0} icon={<GraduationCap className="size-4" />} />
            <Kpi label="Jóvenes formados" value={students} icon={<Building2 className="size-4" />} />
            <Kpi label="Regiones alcanzadas" value={0} icon={<Globe className="size-4" />} />
            <Kpi label="ODS alineados" value="4, 8, 10" icon={<ChartNoAxesCombined className="size-4" />} />
          </>
        ) : (
          <>
            <Kpi label="Talleres realizados" value={done.length} icon={<Presentation className="size-4" />} />
            <Kpi label="Estudiantes impactados" value={students} icon={<GraduationCap className="size-4" />} />
            <Kpi
              label="Talleres programados"
              value={(workshops ?? []).filter((w) => w.status === "confirmado").length}
            />
            <Kpi
              label="Convenio"
              value={institution?.agreement_signed_at ? "Firmado" : "Pendiente"}
              icon={<FileSignature className="size-4" />}
            />
          </>
        )}
      </KpiGrid>

      <section className="mt-8">
        <div className="mb-3.5 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
            Talleres
          </h2>
          <Button href="/institucion/talleres" variant="link" size="sm">
            Ver todos
          </Button>
        </div>

        {!workshops?.length ? (
          <EmptyState
            icon={<Presentation className="size-5" />}
            title="Todavía no hay talleres"
            description="Solicita tu primer taller y el equipo de SEP te contactará en menos de 72 horas para coordinarlo."
            action={
              <Button href="/institucion/talleres">
                Solicitar un taller
                <ArrowRight className="size-4" />
              </Button>
            }
          />
        ) : (
          <Card className="p-0">
            <ul className="divide-y divide-line">
              {workshops.map((w) => (
                <li key={w.id} className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{w.title}</p>
                    <p className="mt-0.5 text-xs text-slate-ui">
                      {w.scheduled_at
                        ? new Date(w.scheduled_at).toLocaleDateString("es-PE", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "Fecha por coordinar"}
                      {w.students_count ? ` · ${w.students_count} estudiantes` : ""}
                    </p>
                  </div>
                  <Badge
                    tone={
                      w.status === "realizado"
                        ? "success"
                        : w.status === "confirmado"
                          ? "brand"
                          : "neutral"
                    }
                  >
                    {w.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </section>

      <section className="mt-8">
        <Card className="flex flex-wrap items-center justify-between gap-5 border-sep-200 bg-sep-50/40 p-6">
          <div className="flex items-start gap-3.5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-white text-sep-600 ring-1 ring-inset ring-line">
              <ChartNoAxesCombined className="size-5" />
            </span>
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">
                Reporte de impacto
              </h2>
              <p className="mt-1 max-w-lg text-sm text-slate-ui">
                Descarga un PDF con métricas verificables, fotos, testimonios y el mapeo a
                los Objetivos de Desarrollo Sostenible. Listo para presentar a tu
                directorio.
              </p>
            </div>
          </div>
          <Button href="/institucion/impacto" variant="primary">
            Generar reporte
          </Button>
        </Card>
      </section>
    </>
  );
}
