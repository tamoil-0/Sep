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

