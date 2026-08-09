import type { Metadata } from "next";
import { ArrowRight, Award, Check, Sparkles, Users } from "lucide-react";
import {
  Badge,
  Card,
  Container,
  Section,
  SectionHeader,
} from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { silpPricing } from "@/config/pricing";
import { formatSoles } from "@/lib/utils";
import { RealPhoto, SEP_PHOTOS } from "@/components/marketing/real-photo";

export const metadata: Metadata = {
  title: "SILP — Social Impact Leadership Program",
  description:
    "Seis semanas de formación en liderazgo social. Diseñas y ejecutas un proyecto de impacto real en tu región con acompañamiento de mentores. Tarifa social S/200.",
};

const modules = [
  {
    week: 1,
    title: "Liderazgo productivo",
    detail: "Autodiagnóstico, estilos de liderazgo y gestión de tu propia energía.",
  },
  {
    week: 2,
    title: "Diagnóstico de tu comunidad",
    detail: "Salir a la calle: entrevistas, observación y mapeo de actores reales.",
  },
  {
    week: 3,
    title: "Diseño de la solución",
    detail: "Design Thinking aplicado a tu problema, con prototipo de baja fidelidad.",
  },
  {
    week: 4,
    title: "Gestión ágil del proyecto",
    detail: "Scrum para equipos voluntarios: backlog, sprints y tablero visual.",
  },
  {
    week: 5,
    title: "Sostenibilidad y aliados",
    detail: "Cómo financiar tu proyecto y conseguir aliados institucionales.",
  },
  {
    week: 6,
    title: "Pitch y Demo Day",
    detail: "Preparas y presentas tu proyecto ante mentores, aliados y tu comunidad.",
  },
];

export default function SilpPage() {
  return (
    <>
      <section className="relative overflow-hidden sep-gradient">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
            backgroundSize: "34px 34px",
          }}
        />
        <Container size="wide" className="relative py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <Badge tone="white">
                <Sparkles className="size-3.5" />
                Programa insignia
              </Badge>
              <h1 className="mt-5 font-display text-[2.5rem] font-bold leading-[1.08] text-white sm:text-[3.25rem]">
                Social Impact Leadership Program
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">
                Seis semanas para pasar de <span className="text-gold-500">tener una idea</span> a
                ejecutar un proyecto de impacto real en tu región, acompañado por mentores
                que ya lo hicieron.
              </p>

              <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
                {[
                  "6 semanas · 18 sesiones en vivo",
                  "Proyecto real, no un caso de estudio",
                  "Mentoría 1:1 durante todo el programa",
                  "Presentación en el Demo Day",
                  "Certificado incluido",
                  "Acceso vitalicio a la red de egresados",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[0.9375rem] text-white/85">
                    <Check className="mt-0.5 size-4 shrink-0 text-gold-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <RealPhoto
                src={SEP_PHOTOS.workshop}
                alt="Participantes de SEP desarrollando un reto colaborativo"
                priority
                label="Liderazgo en acción"
                className="mt-8 aspect-[16/7] min-h-48 border border-white/20"
                imageClassName="object-[50%_42%]"
                sizes="(min-width: 1024px) 55vw, 100vw"
              />
            </div>

            <Card className="lg:sticky lg:top-24 lg:self-start">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-ui">
                Tarifa social · Red SEP
              </p>
              <p className="tabular mt-2 font-display text-[2.75rem] font-bold leading-none sep-gradient-text">
                {formatSoles(20000)}
              </p>
              <p className="mt-2 text-sm text-slate-ui">
                El programa completo. Sin cuotas ocultas.
              </p>

              <ul className="mt-6 space-y-3 border-y border-line py-5">
                {silpPricing.tiers.map((t) => (
                  <li key={t.label} className="flex items-center justify-between gap-3">
                    <span className="text-sm text-graphite">{t.label}</span>
                    <span className="tabular text-sm font-semibold text-ink">
                      {t.priceCents === 0 ? "Gratis" : formatSoles(t.priceCents)}
                    </span>
                  </li>
                ))}
              </ul>

              <Button href="/registro" variant="gradient" className="mt-6 w-full">
                Postular al SILP
                <ArrowRight className="size-4" />
              </Button>

              <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-slate-ui">
                <Award className="mt-0.5 size-3.5 shrink-0 text-gold-600" />
                Los voluntarios activos de SEP acceden sin costo.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      <Section>
        <Container size="wide">
          <SectionHeader
            eyebrow="El programa"
            title="Seis semanas, seis módulos"
            description="Cada semana avanzas un tramo concreto de tu proyecto. Al final tienes algo real, no un diploma."
          />

          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((m) => (
              <li key={m.week}>
                <Card className="h-full p-6">
                  <span className="tabular text-xs font-semibold tracking-[0.14em] text-gold-600">
                    SEMANA {m.week}
                  </span>
                  <h3 className="mt-3 font-display text-[1.0625rem] font-semibold text-ink">
                    {m.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-ui">{m.detail}</p>
                </Card>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="muted">
        <Container size="narrow">
          <Card className="text-center">
            <Users className="mx-auto size-8 text-sep-600" />
            <h2 className="mt-4 font-display text-[1.5rem] font-semibold text-ink">
              El SILP es la puerta a la mentoría
            </h2>
            <p className="mx-auto mt-2.5 max-w-lg text-[0.9375rem] leading-relaxed text-slate-ui">
              Solo los egresados del SILP pueden postular como Mentor Junior de SEP. Es el
              primer nivel formal de mentoría dentro del ecosistema, con certificado y
              carta de recomendación institucional.
            </p>
            <Button href="/voluntariado/mentor" variant="outline" className="mt-6">
              Ver el rol de mentor
            </Button>
          </Card>
        </Container>
      </Section>
    </>
  );
}
