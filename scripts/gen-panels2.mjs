/** Segunda tanda: docente, mentor, institución, speaker y cuenta. */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const write = (p, b) => {
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, b.trimStart() + "\n");
};
const A = "src/app/(app)";

/* ═══════════════ DOCENTE ═══════════════ */

write(`${A}/docente/programa/page.tsx`, `
import type { Metadata } from "next";
import { BookOpen, Clock } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { getCourseWithProgress } from "@/server/queries/courses";
import { PageHeader } from "@/components/app/page-header";
import { Badge, Card, EmptyState, ProgressBar } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { PanelSection } from "@/components/app/data-views";

export const metadata: Metadata = { title: "Mi programa" };

const SLUG = "metodologias-agiles-en-el-aula";

export default async function DocenteProgramaPage() {
  const user = await requireRole(["docente", "admin", "super_admin"]);
  const data = await getCourseWithProgress(SLUG, user.id);

  if (!data) {
    return (
      <>
        <PageHeader title="Mi programa" />
        <EmptyState icon={<BookOpen className="size-5" />} title="El programa aún no está cargado" />
      </>
    );
  }

  const { course, enrollment, sessions } = data;

  return (
    <>
      <PageHeader
        title={course.title}
        description={course.description ?? undefined}
        action={
          enrollment ? undefined : (
            <Button href={\`/cursos/\${SLUG}\`} variant="outline">Ver detalle público</Button>
          )
        }
      />

      <Card>
        <div className="flex flex-wrap items-center gap-2">
          {course.status === "disponible" ? (
            <Badge tone="seed">Disponible</Badge>
          ) : (
            <Badge tone="neutral">Próximamente</Badge>
          )}
          <Badge tone="gold">Para docentes</Badge>
          <Badge tone="neutral">{course.total_hours} horas</Badge>
        </div>

        {enrollment ? (
          <>
            <div className="mt-5 flex items-center justify-between text-sm">
              <span className="font-medium text-ink">Tu progreso</span>
              <span className="tabular text-slate-ui">{enrollment.progress_pct}%</span>
            </div>
            <ProgressBar value={enrollment.progress_pct} className="mt-2.5" />
          </>
        ) : (
          <p className="mt-5 text-[0.9375rem] leading-relaxed text-slate-ui">
            Cuando abramos la próxima cohorte te avisaremos por correo. Mientras tanto,
            los recursos de aula ya están disponibles.
          </p>
        )}
      </Card>

      <PanelSection title="Contenido del programa">
        {sessions.length === 0 ? (
          <EmptyState
            icon={<Clock className="size-5" />}
            title="La malla se publica al abrir la cohorte"
            description="Serán 6 sesiones de 2 horas, interdiario, 100 % virtuales."
          />
        ) : (
          <Card className="p-0">
            <ul className="divide-y divide-line">
              {sessions.map((s) => (
                <li key={s.id} className="flex gap-4 p-5">
                  <span className="tabular flex size-8 shrink-0 items-center justify-center rounded-full bg-sep-50 text-xs font-semibold text-sep-600">
                    {s.number}
                  </span>
                  <div>
                    <p className="font-display text-[0.9375rem] font-semibold text-ink">{s.title}</p>
                    {s.subtitle && <p className="mt-0.5 text-xs text-slate-ui">{s.subtitle}</p>}
                    {s.description && (
                      <p className="mt-2 text-sm leading-relaxed text-graphite">{s.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </PanelSection>
    </>
  );
}
`);

write(`${A}/docente/recursos/page.tsx`, `
import type { Metadata } from "next";
import { Download, FolderOpen } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { PageHeader } from "@/components/app/page-header";
import { Badge, Card } from "@/components/ui/primitives";
import { PanelSection } from "@/components/app/data-views";

export const metadata: Metadata = { title: "Recursos para el aula" };

const RESOURCES = [
  { group: "Design Thinking", items: [
    { name: "Guía de sesión — 90 minutos", detail: "Plan completo con tiempos, materiales y preguntas guía.", level: "3ro a 5to" },
    { name: "Plantilla de mapa de empatía", detail: "Formato A3 para imprimir y trabajar en grupos de 4.", level: "Todos" },
    { name: "Kit de Crazy 8s", detail: "Fichas de ideación rápida con cronómetro imprimible.", level: "4to y 5to" },
  ]},
  { group: "Gestión del aula", items: [
    { name: "Tablero Kanban de clase", detail: "Para proyectos largos: por hacer, en curso, hecho.", level: "Todos" },
    { name: "Rúbrica por competencias", detail: "Evalúa proceso y no solo producto, con evidencia observable.", level: "Todos" },
    { name: "Formato de proyecto bimestral", detail: "Estructura de un proyecto de aula de 8 semanas.", level: "3ro a 5to" },
  ]},
  { group: "Contexto regional", items: [
    { name: "Banco de retos por región", detail: "Problemas reales de comunidades peruanas para trabajar en clase.", level: "Todos" },
    { name: "Casos de innovación juvenil", detail: "Historias de escolares que crearon soluciones en su barrio.", level: "Todos" },
  ]},
];

export default async function DocenteRecursosPage() {
  await requireRole(["docente", "admin", "super_admin"]);

  return (
    <>
      <PageHeader
        title="Recursos para el aula"
        description="Material probado en aulas reales de secundaria en regiones. Úsalo y adáptalo libremente."
      />

      {RESOURCES.map((g) => (
        <PanelSection key={g.group} title={g.group}>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {g.items.map((r) => (
              <Card key={r.name} className="flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-[9px] bg-gold-500/15 text-gold-700">
                    <FolderOpen className="size-4" />
                  </span>
                  <Badge tone="neutral">{r.level}</Badge>
                </div>
                <h3 className="mt-3.5 text-[0.9375rem] font-medium leading-snug text-ink">{r.name}</h3>
                <p className="mt-1.5 flex-1 text-xs leading-relaxed text-slate-ui">{r.detail}</p>
                <p className="mt-4 inline-flex items-center gap-1.5 border-t border-line pt-3 text-xs text-mist">
                  <Download className="size-3.5" />
                  Se habilita al abrir la cohorte docente
                </p>
              </Card>
            ))}
          </div>
        </PanelSection>
      ))}

      <Card className="mt-8 border-sep-200 bg-sep-50/40">
        <p className="text-sm leading-relaxed text-graphite">
          <strong className="font-medium text-ink">¿Te falta algo?</strong> Escríbenos qué
          material necesitas para tu clase y lo diseñamos con el equipo de aprendizaje.
        </p>
      </Card>
    </>
  );
}
`);

write(`${A}/docente/mi-colegio/page.tsx`, `
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
                      {w.students_count ? \` · \${w.students_count} estudiantes\` : ""}
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
`);

write(`${A}/docente/talleres/page.tsx`, `
import type { Metadata } from "next";
import { CalendarPlus } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/page-header";
import { Card, EmptyState } from "@/components/ui/primitives";
import { StatusBadge, PanelSection } from "@/components/app/data-views";
import { WorkshopRequestForm } from "./request-form";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Solicitar taller" };

export default async function DocenteTalleresPage() {
  const user = await requireRole(["docente", "admin", "super_admin"]);
  const supabase = await createClient();

  const [{ data: profile }, { data: mine }] = await Promise.all([
    supabase.from("profiles").select("institution_id, institutions(name)").eq("id", user.id).maybeSingle(),
    supabase
      .from("workshops")
      .select("id, title, topic, scheduled_at, status, students_count, grade")
      .eq("requested_by", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const inst = Array.isArray(profile?.institutions) ? profile?.institutions[0] : profile?.institutions;

  return (
    <>
      <PageHeader
        title="Solicitar un taller"
        description="Universitarios formados por SEP van a tu aula. Sin costo para el colegio."
      />

      <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
        <Card className="lg:sticky lg:top-6 lg:self-start">
          <h2 className="font-display text-[1.125rem] font-semibold text-ink">Nueva solicitud</h2>
          <p className="mt-1.5 text-sm text-slate-ui">
            {inst?.name ? \`Para \${inst.name}\` : "Primero vincula tu colegio en Mi colegio."}
          </p>
          <div className="mt-6">
            <WorkshopRequestForm
              institutionId={profile?.institution_id ?? null}
              institutionName={inst?.name ?? null}
            />
          </div>
        </Card>

        <div>
          <PanelSection title="Mis solicitudes" className="mt-0">
            {(mine?.length ?? 0) === 0 ? (
              <EmptyState
                icon={<CalendarPlus className="size-5" />}
                title="Aún no solicitaste ningún taller"
                description="Completa el formulario y te contactamos en menos de 72 horas."
              />
            ) : (
              <Card className="p-0">
                <ul className="divide-y divide-line">
                  {(mine ?? []).map((w) => (
                    <li key={w.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">{w.title}</p>
                        <p className="mt-0.5 text-xs text-slate-ui">
                          {w.grade ?? "—"}
                          {w.students_count ? \` · \${w.students_count} estudiantes\` : ""}
                          {w.scheduled_at ? \` · \${formatDate(w.scheduled_at)}\` : ""}
                        </p>
                      </div>
                      <StatusBadge status={w.status} />
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </PanelSection>
        </div>
      </div>
    </>
  );
}
`);

write(`${A}/docente/certificados/page.tsx`, `
import type { Metadata } from "next";
import { Award, Download, ShieldCheck } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { getMyCertificates } from "@/server/queries/payments";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import { Card, EmptyState } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/app/copy-button";
import { PanelSection } from "@/components/app/data-views";
import { formatDate } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Mis certificados" };

export default async function DocenteCertificadosPage() {
  const user = await requireRole(["docente", "admin", "super_admin"]);
  const certs = await getMyCertificates(user.id);
  const issued = certs.filter((c) => c.status === "emitido" && !c.revoked_at);

  return (
    <>
      <PageHeader
        title="Mis certificados"
        description="Sirven para tu legajo y tu escala magisterial. Cada uno lleva código público de verificación."
      />

      <KpiGrid>
        <Kpi label="Emitidos" value={issued.length} icon={<Award className="size-4" />} />
        <Kpi label="En proceso" value={certs.filter((c) => c.status === "pendiente").length} />
        <Kpi label="Total" value={certs.length} />
        <Kpi label="Verificables" value={issued.length} icon={<ShieldCheck className="size-4" />} />
      </KpiGrid>

      <PanelSection title="Obtenidos">
        {issued.length === 0 ? (
          <EmptyState
            icon={<Award className="size-5" />}
            title="Todavía no tienes certificados"
            description="Completa el programa docente y podrás obtener el tuyo desde S/30."
            action={<Button href="/docente/programa">Ver mi programa</Button>}
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {issued.map((c) => (
              <Card key={c.id} className="overflow-hidden p-0">
                <div className="sep-gradient px-5 py-4">
                  <p className="font-display text-[0.9375rem] font-semibold text-white">{c.type?.name}</p>
                  <p className="mt-0.5 text-xs text-white/65">{c.type?.issuer}</p>
                </div>
                <div className="p-5">
                  {c.courseTitle && <p className="text-sm font-medium text-ink">{c.courseTitle}</p>}
                  <p className="mt-0.5 text-xs text-slate-ui">
                    Emitido el {c.issued_at ? formatDate(c.issued_at) : "—"}
                  </p>
                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-surface-1 px-3 py-2">
                    <ShieldCheck className="size-4 shrink-0 text-seed-500" />
                    <code className="tabular flex-1 truncate text-xs font-medium text-ink">
                      {c.verification_code}
                    </code>
                    <CopyButton value={\`\${siteConfig.url}/verificar/\${c.verification_code}\`} label="Copiar enlace" />
                  </div>
                  <Button href={\`/api/certificados/\${c.id}/pdf\`} variant="primary" size="sm" className="mt-4 w-full">
                    <Download className="size-4" />
                    Descargar PDF
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </PanelSection>
    </>
  );
}
`);

console.log("docente listo");
