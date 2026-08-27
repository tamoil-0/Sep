import { ArrowRight, Award, Users } from "lucide-react";
import { createPageMetadata } from "@/lib/seo";
import { ProgramHero, ProgramModuleList } from "@/components/marketing/program";
import { RealPhoto, SEP_PHOTOS } from "@/components/marketing/real-photo";
import { Button } from "@/components/ui/button";
import { Card, Container, Section, SectionHeader } from "@/components/ui/primitives";
import { silpPricing } from "@/config/pricing";
import { formatSoles } from "@/lib/utils";

export const metadata = createPageMetadata({
  title: "SILP — Social Impact Leadership Program",
  description:
    "Seis semanas de formación en liderazgo social. Diseñas y ejecutas un proyecto de impacto real en tu región con acompañamiento de mentores. Tarifa social S/200.",
  path: "/silp",
  keywords: ["liderazgo social Perú", "SILP", "proyectos de impacto social"],
});

const modules = [
  {
    number: 1,
    theme: "Liderazgo productivo",
    result: "Reconoce tus fortalezas y conecta tu propósito personal con una causa social.",
    duration: "1 semana",
  },
  {
    number: 2,
    theme: "Diagnóstico de tu comunidad",
    result: "Valida una problemática real mediante observación, conversaciones y mapeo de actores.",
    duration: "1 semana",
  },
  {
    number: 3,
    theme: "Diseño de la solución",
    result: "Convierte las necesidades de tu audiencia en un prototipo inicial de iniciativa.",
    duration: "1 semana",
  },
  {
    number: 4,
    theme: "Formulación del proyecto",
    result: "Define objetivos, actividades, tiempos, materiales e indicadores de impacto.",
    duration: "1 semana",
  },
  {
    number: 5,
    theme: "Redes de apoyo",
    result: "Mapea aliados y diseña estrategias concretas de acercamiento y colaboración.",
    duration: "1 semana",
  },
  {
    number: 6,
    theme: "Storytelling y pitch",
    result: "Presenta tu iniciativa con una historia clara, presencia y materiales utilizables.",
    duration: "1 semana",
  },
];

export default function SilpPage() {
  return (
    <>
      <ProgramHero
        eyebrow="Programa insignia"
        title="Social Impact Leadership Program"
        description="Seis semanas para convertir una causa que te importa en una iniciativa de impacto aplicable en tu región, con acompañamiento de la comunidad SEP."
        facts={["6 semanas", "18 sesiones en vivo", "Proyecto aplicado", "Certificado incluido"]}
        primaryAction={{ label: "Conocer el programa", href: "#programa" }}
        secondaryAction={{ label: "Ver tarifa social", href: "#postular" }}
        aside={
          <RealPhoto
            src={SEP_PHOTOS.workshop}
            alt="Participantes de SEP desarrollando un reto colaborativo"
            priority
            label="Liderazgo en acción"
            className="aspect-[4/3] min-h-0 border-white/20"
            imageClassName="object-[50%_42%]"
            sizes="(min-width: 1024px) 42vw, 100vw"
          />
        }
      />

      <ProgramModuleList
        id="programa"
        eyebrow="El recorrido"
        title="Seis semanas, un proyecto que puedes ejecutar"
        description="Cada módulo resuelve una decisión concreta. El resultado de una semana se convierte en el punto de partida de la siguiente."
        modules={modules}
      />

      <Section id="postular" tone="muted">
        <Container size="wide" className="grid items-start gap-8 lg:grid-cols-[1fr_24rem] lg:gap-16">
          <SectionHeader
            eyebrow="Tarifa social · Red SEP"
            title="Una inversión clara, sin cuotas ocultas"
            description="El programa completo incluye acompañamiento, Demo Day, certificado y acceso a la red de egresados."
          />

          <Card className="p-0">
            <div className="border-b border-line p-5">
              <p className="text-caption font-semibold uppercase tracking-[0.12em] text-slate-ui">
                Programa completo
              </p>
              <p className="tabular mt-2 font-display text-h1 font-semibold leading-none text-ink">
                {formatSoles(20000)}
              </p>
            </div>
            <ul className="divide-y divide-line px-5">
              {silpPricing.tiers.map((tier) => (
                <li key={tier.label} className="flex items-center justify-between gap-4 py-3 text-body-sm">
                  <span className="text-graphite">{tier.label}</span>
                  <span className="tabular font-semibold text-ink">
                    {tier.priceCents === 0 ? "Gratis" : formatSoles(tier.priceCents)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-t border-line p-5">
              <Button href="/registro" className="w-full">
                Postular al SILP <ArrowRight />
              </Button>
              <p className="mt-3 flex items-start gap-2 text-caption leading-relaxed text-slate-ui">
                <Award className="mt-0.5 size-icon-sm shrink-0 text-gold-700" />
                Los voluntarios activos de SEP acceden sin costo.
              </p>
            </div>
          </Card>
        </Container>
      </Section>

      <Section>
        <Container size="narrow" className="border-l-2 border-sep-600 pl-6 sm:pl-8">
          <Users className="size-icon-xl text-sep-700" />
          <h2 className="mt-4 font-display text-h3 font-semibold text-ink">
            El SILP abre la ruta hacia la mentoría
          </h2>
          <p className="mt-3 max-w-[65ch] text-body text-slate-ui">
            Los egresados pueden postular como Mentor Junior de SEP y continuar su desarrollo dentro del ecosistema.
          </p>
          <Button href="/voluntariado/mentor" variant="outline" className="mt-6">
            Ver el rol de mentor
          </Button>
        </Container>
      </Section>
    </>
  );
}
