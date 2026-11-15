import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  CreditCard,
  Gift,
  GraduationCap,
  HandHeart,
  Mail,
  MapPin,
  Mic,
  Presentation,
  School,
  ShieldCheck,
  Users,
  ClipboardCheck,
} from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import { Badge } from "@/components/ui/primitives";
import { CountUp } from "@/components/marketing/count-up";
import { assertQueryResults } from "@/lib/supabase/query";
import { cn, formatSoles } from "@/lib/utils";

export const metadata: Metadata = { title: "Administración" };

/**
 * Panel de administración (REDISEÑO §8.5): primero lo que pide acción, luego
 * las métricas con contexto, después cursos y regiones, y al final el impacto.
 * Datos: `admin_dashboard()` (migración 0009) y las vistas `course_stats` y
 * `region_stats`. Solo presentación: no cambia ninguna regla de negocio.
 */
export default async function AdminPage() {
  const user = await requireRole(["admin", "super_admin"]);
  const supabase = await createClient();

  const [dashResult, coursesResult, regionsResult] = await Promise.all([
    supabase.rpc("admin_dashboard"),
    supabase.from("course_stats").select("id, title, enrollments, completions, completion_rate"),
    supabase.from("region_stats").select("region, users"),
  ]);
  assertQueryResults("admin:panel", dashResult, coursesResult, regionsResult);
  const d = dashResult.data!;
  const isSuper = user.roles.includes("super_admin");
  const firstName = (user.fullName ?? "").trim().split(/\s+/)[0];

  const courses = [...(coursesResult.data ?? [])].sort((a, b) => b.enrollments - a.enrollments).slice(0, 6);
  const maxEnroll = Math.max(1, ...courses.map((c) => c.enrollments));
  const regions = [...(regionsResult.data ?? [])].filter((r) => r.region).sort((a, b) => b.users - a.users).slice(0, 7);
  const maxUsers = Math.max(1, ...regions.map((r) => r.users));

  const pendientes = [
    { label: "Pagos por revisar", hint: "Comprobantes de Yape y Plin", value: d.pending_payments, href: "/admin/pagos", icon: CreditCard },
    { label: "Postulaciones", hint: "Voluntarios por evaluar", value: d.pending_apps, href: "/admin/postulaciones", icon: ClipboardCheck },
    { label: "Colegios", hint: "Solicitudes de inscripción", value: d.pending_schools, href: "/admin/colegios", icon: School },
    { label: "Speakers", hint: "Perfiles por aprobar", value: d.pending_speakers, href: "/admin/postulaciones", icon: Mic },
  ];
  const totalPendiente = pendientes.reduce((s, p) => s + p.value, 0);

  const impacto = [
    { label: "Talleres realizados", value: d.workshops, icon: Presentation },
    { label: "Escolares alcanzados", value: d.students_reached, icon: GraduationCap },
    { label: "Voluntarios activos", value: d.volunteers, icon: HandHeart },
    { label: "En el newsletter", value: d.newsletter, icon: Mail },
    { label: "Diagnósticos completos", value: d.diagnostic_leads, icon: CheckCircle2 },
    { label: "Donaciones", value: formatSoles(d.donations_cents), icon: Gift },
  ];

  return (
    <>
      <PageHeader
        title={firstName ? `Hola, ${firstName}` : "Panel de administración"}
        description={
          totalPendiente > 0
            ? `Tienes ${totalPendiente} ${totalPendiente === 1 ? "tarea pendiente" : "tareas pendientes"}. Empieza por lo que está en ámbar.`
            : "Todo al día. Aquí tienes el estado general de la plataforma."
        }
        action={<Badge className="self-start" tone={isSuper ? "neon" : "neutral"}>{isSuper ? "Super administrador" : "Administrador"}</Badge>}
      />

      {/* 1 · Lo que pide acción */}
      <section aria-labelledby="pendientes-titulo">
        <h2 id="pendientes-titulo" className="mb-3 text-body-sm font-medium text-slate-ui">
          Requiere tu atención
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {pendientes.map((p, i) => {
            const alDia = p.value === 0;
            return (
              <li key={p.label} data-reveal style={{ transitionDelay: `${i * 60}ms` }}>
                <Link
                  href={p.href}
                  className={cn(
                    "tarjeta-viva group relative flex h-full items-center gap-4 overflow-hidden rounded-md p-4",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn("absolute inset-y-0 left-0 w-1", alDia ? "bg-turquesa-500" : "bg-warning")}
                  />
                  <span
                    className={cn(
                      "flex size-11 shrink-0 items-center justify-center rounded-full",
                      alDia ? "bg-success-bg text-success" : "bg-warning-bg text-warning",
                    )}
                  >
                    <p.icon className="size-5" aria-hidden strokeWidth={1.75} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-body-sm font-medium text-ink">{p.label}</span>
                    <span className="block text-caption text-mist">{alDia ? "Al día" : p.hint}</span>
                  </span>
                  <span className="tabular font-display text-h3 font-semibold text-ink">{p.value}</span>
                  <ArrowRight
                    aria-hidden
                    className="size-4 shrink-0 text-mist transition-transform duration-300 group-hover:translate-x-1 group-hover:text-acento"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 2 · Métricas con contexto */}
      <div className="mt-8">
        <KpiGrid>
          <Kpi
            tone="destacada"
            label="Usuarios registrados"
            value={<CountUp value={d.users} />}
            hint={`+${d.users_30d} en los últimos 30 días`}
            icon={<Users className="size-4" />}
          />
          <Kpi
            label="Inscripciones"
            value={<CountUp value={d.enrollments} />}
            hint={`${d.completions} cursos completados`}
            icon={<BookOpen className="size-4" />}
          />
          <Kpi
            label="Certificados emitidos"
            value={<CountUp value={d.certificates} />}
            hint={`${d.schools} colegios verificados`}
            icon={<Award className="size-4" />}
          />
          <Kpi
            label="Ingresos confirmados"
            value={formatSoles(d.revenue_cents)}
            hint={`Usuarios de ${d.regions} regiones`}
            icon={<CreditCard className="size-4" />}
          />
        </KpiGrid>
      </div>

      {/* 3 · Cursos y regiones */}
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <section className="rounded-md border border-line bg-surface-0 p-5" data-reveal aria-labelledby="cursos-titulo">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="cursos-titulo" className="font-display text-h4 font-semibold text-ink">Inscripciones por curso</h2>
            <Link href="/admin/cursos" className="enlace-trazo text-body-sm font-medium text-acento">Ver cursos</Link>
          </div>
          {courses.length === 0 ? (
            <p className="mt-4 text-body-sm text-slate-ui">Todavía no hay inscripciones.</p>
          ) : (
            <ul className="mt-5 space-y-4">
              {courses.map((c) => (
                <li key={c.id}>
                  <div className="flex items-baseline justify-between gap-3 text-body-sm">
                    <span className="min-w-0 truncate text-ink">{c.title}</span>
                    <span className="tabular shrink-0 text-slate-ui">
                      {c.enrollments} · <span className="text-success">{Math.round(c.completion_rate)} % completa</span>
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-2" aria-hidden>
                    <div className="barra-progreso h-full rounded-full grad-marca" style={{ width: `${(c.enrollments / maxEnroll) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-md border border-line bg-surface-0 p-5" data-reveal style={{ transitionDelay: "80ms" }} aria-labelledby="regiones-titulo">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="regiones-titulo" className="font-display text-h4 font-semibold text-ink">Usuarios por región</h2>
            <Link href="/admin/impacto" className="enlace-trazo text-body-sm font-medium text-acento">Ver impacto</Link>
          </div>
          {regions.length === 0 ? (
            <p className="mt-4 text-body-sm text-slate-ui">Aún no hay regiones registradas.</p>
          ) : (
            <ul className="mt-5 space-y-3">
              {regions.map((r) => (
                <li key={r.region} className="grid grid-cols-[7rem_1fr_auto] items-center gap-3 text-body-sm">
                  <span className="flex min-w-0 items-center gap-1.5 truncate text-ink">
                    <MapPin className="size-3.5 shrink-0 text-turquesa-700" aria-hidden /> {r.region}
                  </span>
                  <span className="h-2 overflow-hidden rounded-full bg-surface-2" aria-hidden>
                    <span className="barra-progreso block h-full rounded-full bg-turquesa-700" style={{ width: `${(r.users / maxUsers) * 100}%` }} />
                  </span>
                  <span className="tabular w-8 text-right text-slate-ui">{r.users}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* 4 · Impacto */}
      <section className="theme-night halo mt-8 overflow-hidden rounded-md p-5 sm:p-6" data-reveal aria-labelledby="impacto-titulo">
        <h2 id="impacto-titulo" className="text-body-sm font-medium text-violeta-300">
          Impacto en territorio
        </h2>
        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 xl:grid-cols-6">
          {impacto.map((it) => (
            <div key={it.label}>
              <dt className="flex items-center gap-1.5 text-caption text-slate-ui">
                <it.icon className="size-3.5 text-cian-500" aria-hidden /> {it.label}
              </dt>
              <dd className="tabular mt-1 font-display text-h3 font-semibold text-ink">{it.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="mt-6 flex items-start gap-2 text-caption text-mist">
        <ShieldCheck className="mt-0.5 size-3.5 shrink-0" aria-hidden />
        Toda asignación o revocación de roles queda registrada en la auditoría con tu identidad, IP y marca de tiempo.
      </p>
    </>
  );
}
