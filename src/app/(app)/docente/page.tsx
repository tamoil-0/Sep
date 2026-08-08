import type { Metadata } from "next";
import { ArrowRight, Award, BookOpen, FolderOpen, School, Users } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import { Card, EmptyState } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Panel docente" };

const resources = [
  {
    title: "Guía de sesión — Design Thinking en el aula",
    detail: "Plan de 90 min con actividades y materiales imprimibles.",
  },
  {
    title: "Plantilla de mapa de empatía",
    detail: "Formato A3 listo para trabajar en grupos de 4 estudiantes.",
  },
  {
    title: "Rúbrica de evaluación por competencias",
    detail: "Alineada al Currículo Nacional para proyectos de innovación.",
  },
  {
    title: "Kit de Crazy 8s",
    detail: "Fichas y cronómetro para la dinámica de ideación rápida.",
  },
];

export default async function DocentePage() {
  const user = await requireRole(["docente", "admin", "super_admin"]);

  return (
    <>
      <PageHeader
        title={`Hola, ${user.fullName.split(" ")[0] || "docente"}`}
        description="Tu espacio para llevar metodologías activas a tu aula."
        action={
          <Button href="/docente/talleres">
            Solicitar taller para mi aula
            <ArrowRight className="size-4" />
          </Button>
        }
      />

      <KpiGrid>
        <Kpi label="Programa docente" value="0%" hint="Metodologías ágiles en el aula" icon={<BookOpen className="size-4" />} />
        <Kpi label="Talleres solicitados" value={0} icon={<School className="size-4" />} />
        <Kpi label="Estudiantes impactados" value={0} icon={<Users className="size-4" />} />
        <Kpi label="Certificados" value={0} icon={<Award className="size-4" />} />
      </KpiGrid>

      <section className="mt-8">
        <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
          Mi programa
        </h2>
        <EmptyState
          icon={<BookOpen className="size-5" />}
          title="El programa docente abre pronto"
          description="«Metodologías ágiles en el aula»: 6 sesiones, 8 horas, 100 % virtual y gratuito. Te avisaremos cuando abra la primera cohorte."
          action={<Button href="/estudiante/catalogo" variant="outline">Ver el catálogo</Button>}
        />
      </section>

      <section className="mt-8">
        <div className="mb-3.5 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
            Recursos para el aula
          </h2>
          <Button href="/docente/recursos" variant="link" size="sm">
            Ver todos
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {resources.map((r) => (
            <Card key={r.title} interactive className="flex gap-3.5 p-5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-[9px] bg-gold-500/15 text-gold-700">
                <FolderOpen className="size-4" />
              </span>
              <div>
                <h3 className="text-[0.9375rem] font-medium leading-snug text-ink">
                  {r.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-ui">{r.detail}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <Card className="flex flex-wrap items-center justify-between gap-5 border-sep-200 bg-sep-50/40 p-6">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">
              ¿Tu colegio quiere recibir a nuestros voluntarios?
            </h2>
            <p className="mt-1.5 max-w-lg text-sm text-slate-ui">
              Inscribe tu colegio a la red SEP y conecta a tus estudiantes con
              universitarios líderes de su propia región. Completamente gratuito.
            </p>
          </div>
          <Button href="/colegios" variant="primary">
            Inscribir mi colegio
          </Button>
        </Card>
      </section>
    </>
  );
}
