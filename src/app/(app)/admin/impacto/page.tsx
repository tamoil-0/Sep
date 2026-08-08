import type { Metadata } from "next";
import {
  Award,
  ChartNoAxesCombined,
  GraduationCap,
  Globe,
  School,
  Users,
} from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import { Card, EmptyState } from "@/components/ui/primitives";
import { PrintButton } from "@/components/app/print-button";
import { formatDate, formatSoles } from "@/lib/utils";

export const metadata: Metadata = { title: "Reporte de impacto" };

export default async function AdminImpactoPage() {
  await requireRole(["admin", "super_admin"]);
  const supabase = await createClient();

  const [{ data: dash }, { data: regions }, { data: schools }, { data: volunteers }] =
    await Promise.all([
      supabase.rpc("admin_dashboard"),
      supabase.from("region_stats").select("*"),
      supabase.from("school_impact").select("*"),
      supabase.from("volunteer_leaderboard").select("*"),
    ]);

  const d = dash;
  const topRegions = (regions ?? []).slice(0, 8);
  const maxUsers = Math.max(1, ...topRegions.map((r) => Number(r.users)));

  return (
    <>
      <PageHeader
        title="Reporte de impacto"
        description="Las cifras que SEP puede defender ante un aliado, un fondo o su directorio."
        action={<PrintButton />}
      />

      {/* Cabecera imprimible */}
      <Card className="mb-6 overflow-hidden p-0">
        <div className="sep-gradient px-7 py-6 text-white">
          <p className="text-xs uppercase tracking-[0.14em] text-white/70">
            Semillero de Emprendedores Perú
          </p>
          <h2 className="mt-2 font-display text-[1.75rem] font-semibold">
            Reporte de impacto
          </h2>
          <p className="mt-1 text-sm text-white/75">
            Generado el {formatDate(new Date())} · Datos verificables en plataforma
          </p>
        </div>
      </Card>

      <KpiGrid>
        <Kpi
          label="Jóvenes formados"
          value={d?.users ?? 0}
          hint={`${d?.users_30d ?? 0} en los últimos 30 días`}
          icon={<Users className="size-4" />}
        />
        <Kpi
          label="Cursos completados"
          value={d?.completions ?? 0}
          hint={`de ${d?.enrollments ?? 0} inscripciones`}
          icon={<GraduationCap className="size-4" />}
        />
        <Kpi
          label="Certificados emitidos"
          value={d?.certificates ?? 0}
          icon={<Award className="size-4" />}
        />
        <Kpi
          label="Regiones alcanzadas"
          value={d?.regions ?? 0}
          icon={<Globe className="size-4" />}
        />
      </KpiGrid>

      <div className="mt-3">
        <KpiGrid>
          <Kpi
            label="Escolares impactados"
            value={d?.students_reached ?? 0}
            hint={`en ${d?.workshops ?? 0} talleres`}
            icon={<School className="size-4" />}
          />
          <Kpi label="Colegios en la red" value={d?.schools ?? 0} />
          <Kpi label="Voluntarios activos" value={d?.volunteers ?? 0} />
          <Kpi
            label="Ingresos por certificados"
            value={formatSoles(Number(d?.revenue_cents ?? 0))}
            icon={<ChartNoAxesCombined className="size-4" />}
          />
        </KpiGrid>
      </div>

      {/* Distribución territorial — el argumento central de SEP */}
      <section className="mt-8">
        <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
          Distribución territorial
        </h2>
        <Card>
          {topRegions.length === 0 ? (
            <EmptyState icon={<Globe className="size-5" />} title="Sin datos de región" />
          ) : (
            <ul className="space-y-3.5">
              {topRegions.map((r) => (
                <li key={r.region}>
                  <div className="flex items-baseline justify-between gap-4 text-sm">
                    <span className="font-medium text-ink">{r.region}</span>
                    <span className="tabular text-slate-ui">
                      {r.users}{" "}
                      <span className="text-xs text-mist">
                        ({r.students} est. · {r.mentors} ment.)
                      </span>
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-2">
                    <div
                      className="h-full rounded-full sep-gradient"
                      style={{ width: `${(Number(r.users) / maxUsers) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {/* Colegios */}
        <section>
          <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
            Impacto por colegio
          </h2>
          <Card className="p-0">
            {(schools?.length ?? 0) === 0 ? (
              <div className="p-6">
                <EmptyState icon={<School className="size-5" />} title="Sin colegios aún" />
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {(schools ?? []).map((s) => (
                  <li key={s.institution_id} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{s.name}</p>
                      <p className="truncate text-xs text-slate-ui">
                        {[s.province, s.region].filter(Boolean).join(", ")}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="tabular text-sm font-semibold text-ink">
                        {s.students_reached}
                      </p>
                      <p className="text-xs text-slate-ui">
                        {s.workshops_done} talleres
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>

        {/* Voluntarios */}
        <section>
          <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
            Horas de voluntariado
          </h2>
          <Card className="p-0">
            {(volunteers?.length ?? 0) === 0 ? (
              <div className="p-6">
                <EmptyState icon={<Users className="size-5" />} title="Sin voluntarios activos" />
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {(volunteers ?? []).map((v) => (
                  <li key={v.user_id} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{v.full_name}</p>
                      <p className="truncate text-xs text-slate-ui">
                        {v.region ?? "—"} · {v.mentees} mentorados
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="tabular text-sm font-semibold text-ink">
                        {v.approved_hours} h
                      </p>
                      {Number(v.pending_hours) > 0 && (
                        <p className="text-xs text-[#8A5A00]">
                          +{v.pending_hours} por aprobar
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>
      </div>

      {/* ODS */}
      <section className="mt-8">
        <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
          Alineación con los ODS
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            [4, "Educación de calidad"],
            [8, "Trabajo decente y crecimiento"],
            [10, "Reducción de las desigualdades"],
          ].map(([goal, name]) => (
            <Card key={goal} className="p-5">
              <p className="tabular font-display text-[1.75rem] font-bold leading-none sep-gradient-text">
                ODS {goal}
              </p>
              <p className="mt-2 text-sm font-medium text-ink">{name}</p>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
