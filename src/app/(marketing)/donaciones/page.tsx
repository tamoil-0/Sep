import { createPageMetadata } from "@/lib/seo";
import { HeartHandshake, School, Sprout, Users } from "lucide-react";
import {
  Card,
  Container,
  Section,
  SectionHeader,
} from "@/components/ui/primitives";
import { DonationForm } from "./donation-form";
import { SupportQrDialog } from "@/components/marketing/support-qr-dialog";

// Estática con ISR: no lee la petición; se sirve desde la CDN.
export const dynamic = "force-static";
export const revalidate = 300;

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
      <section className="theme-night halo relative overflow-hidden">
        <Container size="wide" className="py-16 sm:py-20">
          <div className="max-w-2xl">
            <HeartHandshake className="size-9 text-turquesa-800" />
            <h1 className="mt-5 font-display text-h1 font-bold leading-[1.08] text-ink sm:text-display">
              Tu donación llega a{" "}
              quien nadie está atendiendo
            </h1>
            <p className="mt-5 text-body-lg leading-relaxed text-slate-ui">
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
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-turquesa-100 text-turquesa-800">
                        <i.icon className="size-5" />
                      </span>
                      <div>
                        <p className="tabular font-display text-body-lg font-semibold text-ink">
                          {i.amount}
                        </p>
                        <p className="mt-0.5 text-body-sm leading-relaxed text-slate-ui">
                          {i.text}
                        </p>
                      </div>
                    </Card>
                  </li>
                ))}
              </ul>

              <Card className="mt-8 border-violeta-200 bg-violeta-50/40">
                <h2 className="font-display text-body leading-snug font-semibold text-ink">
                  Transparencia
                </h2>
                <p className="mt-2 text-body-sm leading-relaxed text-graphite">
                  SEP es una organización juvenil reconocida por SENAJU. Cada año
                  publicamos cuántos jóvenes formamos, en qué regiones y con qué
                  resultados. Si donas, recibes ese reporte antes que nadie.
                </p>
              </Card>
            </div>

            <Card className="lg:sticky lg:top-24 lg:self-start">
              <h2 className="font-display text-h4 font-semibold text-ink">
                Hacer una donación
              </h2>
              <p className="mt-1.5 text-body-sm text-slate-ui">
                Única o mensual. Por Yape, Plin o transferencia.
              </p>

              <div className="mt-6">
                <DonationForm />
              </div>
              <div className="mt-6 flex flex-col items-start gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-body-sm text-slate-ui">¿Prefieres compartirlo? Muestra el QR de «Apoya hoy».</p>
                <SupportQrDialog />
              </div>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
