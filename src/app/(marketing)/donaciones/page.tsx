import { createPageMetadata } from "@/lib/seo";
import { HeartHandshake, School, Sprout, Users } from "lucide-react";
import {
  Card,
  Container,
  GoldUnderline,
  Section,
  SectionHeader,
} from "@/components/ui/primitives";
import { DonationForm } from "./donation-form";

export const metadata = createPageMetadata({
  title: "Dona y apoya a jóvenes emprendedores",
  description:
    "Tu donación lleva formación, mentoría y talleres a jóvenes de regiones del Perú que nadie más está atendiendo.",
  path: "/donaciones",
  keywords: ["donar educación Perú", "apoyar jóvenes emprendedores", "donaciones SEP"],
});

const impact = [
  {
    icon: Sprout,
    amount: "S/ 10",
    text: "Cubre el material de un estudiante en un taller escolar.",
  },
  {
    icon: School,
    amount: "S/ 50",
    text: "Financia el traslado de un mentor universitario a un colegio de su región.",
  },
  {
    icon: Users,
    amount: "S/ 200",
    text: "Beca completa del SILP para un joven que no puede pagarlo.",
  },
];

export default function DonacionesPage() {
  return (
    <>
      <section className="border-b border-line bg-surface-1">
        <Container size="wide" className="py-16 sm:py-20">
          <div className="max-w-2xl">
            <HeartHandshake className="size-9 text-gold-600" />
            <h1 className="mt-5 font-display text-[2.5rem] font-bold leading-[1.08] text-ink sm:text-[3.25rem]">
              Tu donación llega a{" "}
              <GoldUnderline>quien nadie está atendiendo</GoldUnderline>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-ui">
              El 100 % de lo que recibimos se usa en formación, mentoría y talleres en
              regiones. Publicamos un reporte de impacto anual con cifras verificables.
            </p>
          </div>
        </Container>
      </section>

      <Section>
        <Container size="wide">
          <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
            <div>
              <SectionHeader
                eyebrow="Qué logra tu aporte"
                title="Impacto concreto, no promesas"
              />

              <ul className="mt-10 space-y-4">
                {impact.map((i) => (
                  <li key={i.amount}>
                    <Card className="flex items-start gap-4 p-5">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-gold-500/15 text-gold-700">
                        <i.icon className="size-5" />
                      </span>
                      <div>
                        <p className="tabular font-display text-lg font-semibold text-ink">
                          {i.amount}
                        </p>
                        <p className="mt-0.5 text-[0.9375rem] leading-relaxed text-slate-ui">
                          {i.text}
                        </p>
                      </div>
                    </Card>
                  </li>
                ))}
              </ul>

              <Card className="mt-8 border-sep-200 bg-sep-50/40">
                <h2 className="font-display text-[1.0625rem] font-semibold text-ink">
                  Transparencia
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-graphite">
                  SEP es una organización juvenil reconocida por SENAJU. Cada año
                  publicamos cuántos jóvenes formamos, en qué regiones y con qué
                  resultados. Si donas, recibes ese reporte antes que nadie.
                </p>
              </Card>
            </div>

            <Card className="lg:sticky lg:top-24 lg:self-start">
              <h2 className="font-display text-[1.25rem] font-semibold text-ink">
                Hacer una donación
              </h2>
              <p className="mt-1.5 text-sm text-slate-ui">
                Única o mensual. Por Yape, Plin o transferencia.
              </p>

              <div className="mt-6">
                <DonationForm />
              </div>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
