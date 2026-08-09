import type { Metadata } from "next";
import { ArrowRight, Check, FolderOpen, GraduationCap, School } from "lucide-react";
import {
  Badge,
  Card,
  Container,
  GoldUnderline,
  Section,
  SectionHeader,
} from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { RealPhoto, SEP_PHOTOS } from "@/components/marketing/real-photo";

export const metadata: Metadata = {
  title: "Programa para docentes",
  description:
    "Metodologías activas listas para tu aula: Design Thinking, ABP y Scrum aplicados al entorno escolar. 8 horas, 100 % virtual y gratuito.",
};

const resources = [
  "Guía de sesión de Design Thinking para 90 minutos",
  "Plantilla de mapa de empatía en A3",
  "Rúbrica de evaluación por competencias",
  "Kit de Crazy 8s con fichas imprimibles",
  "Formato de proyecto de aula bimestral",
  "Banco de retos reales por región",
];

export default function DocentesPage() {
  return (
    <>
      <section className="border-b border-line bg-surface-1">
        <Container size="wide" className="py-16 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.85fr]">
            <div className="max-w-2xl">
            <Badge tone="gold">
              <GraduationCap className="size-3.5" />
              Gratuito para docentes
            </Badge>
            <h1 className="mt-5 font-display text-[2.5rem] font-bold leading-[1.08] text-ink sm:text-[3.25rem]">
              Metodologías activas que{" "}
              <GoldUnderline>puedes usar el lunes</GoldUnderline>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-ui">
              No teoría pedagógica: plantillas, guías y dinámicas probadas en aulas reales
              de secundaria en regiones del Perú.
            </p>
            <Button href="/registro/docente" variant="gradient" size="lg" className="mt-8">
              Crear mi cuenta de docente
              <ArrowRight className="size-4" />
            </Button>
            </div>
            <RealPhoto
              src={SEP_PHOTOS.methodology}
              alt="Jóvenes aplicando metodologías activas durante un taller"
              priority
              label="Metodologías que se practican"
              className="aspect-[4/3] min-h-0"
            />
          </div>
        </Container>
      </section>

      <Section>
        <Container size="wide">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <SectionHeader
                eyebrow="El programa"
                title="Metodologías ágiles en el aula"
                description="6 sesiones de 2 horas, interdiario, 100 % virtual. Al terminar tienes diseñado un proyecto real para tu próximo bimestre."
              />

              <ul className="mt-8 space-y-3">
                {[
                  "Design Thinking adaptado a estudiantes de 3ro a 5to",
                  "Aprendizaje basado en proyectos (ABP)",
                  "Scrum para gestionar proyectos largos con tu clase",
                  "Evaluación por competencias con evidencia observable",
                  "Cómo motivar a estudiantes en contextos de región",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[0.9375rem] text-graphite">
                    <Check className="mt-0.5 size-4 shrink-0 text-seed-500" />
                    {f}
                  </li>
                ))}
              </ul>

              <Card className="mt-8 border-sep-200 bg-sep-50/40">
                <p className="text-sm leading-relaxed text-graphite">
                  <strong className="font-medium text-ink">Certificado opcional:</strong>{" "}
                  S/30 con aval de SEP o S/50 con aval del Instituto Internacional de
                  Ingeniería. Muchos docentes lo usan para su legajo y su escala magisterial.
                </p>
              </Card>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
                Recursos descargables
              </p>
              <ul className="mt-5 space-y-2.5">
                {resources.map((r) => (
                  <li
                    key={r}
                    className="flex items-center gap-3 rounded-[10px] border border-line bg-white px-4 py-3.5"
                  >
                    <FolderOpen className="size-4 shrink-0 text-gold-600" />
                    <span className="text-sm text-graphite">{r}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-mist">
                Disponibles en tu panel al crear la cuenta de docente.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="muted">
        <Container size="narrow">
          <Card className="text-center">
            <School className="mx-auto size-8 text-seed-500" />
            <h2 className="mt-4 font-display text-[1.5rem] font-semibold text-ink">
              Y también podemos ir a tu colegio
            </h2>
            <p className="mx-auto mt-2.5 max-w-lg text-[0.9375rem] leading-relaxed text-slate-ui">
              Universitarios formados por SEP dictan talleres presenciales gratuitos a tus
              estudiantes, en tu propia región. Sin costo para el colegio.
            </p>
            <Button href="/colegios" variant="primary" className="mt-6">
              Inscribir mi colegio a la red
              <ArrowRight className="size-4" />
            </Button>
          </Card>
        </Container>
      </Section>
    </>
  );
}
