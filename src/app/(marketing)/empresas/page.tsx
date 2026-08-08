import type { Metadata } from "next";
import {
  ArrowRight,
  Building2,
  Check,
  ChartNoAxesCombined,
  Globe,
  Handshake,
  Users,
} from "lucide-react";
import {
  Badge,
  Card,
  Container,
  GoldUnderline,
  Section,
  SectionHeader,
} from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { b2bPackages } from "@/config/pricing";
import { formatSoles } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Para empresas y organizaciones",
  description:
    "Convierte tu inversión RSE en resultados medibles. Cohortes patrocinadas, becas, voluntariado corporativo y reportes de impacto alineados a los ODS.",
};

export default function EmpresasPage() {
  return (
    <>
      <section className="border-b border-line bg-surface-1">
        <Container size="wide" className="py-16 sm:py-20">
          <div className="max-w-2xl">
            <Badge tone="brand">
              <Building2 className="size-3.5" />
              Alianzas RSE
            </Badge>
            <h1 className="mt-5 font-display text-[2.5rem] font-bold leading-[1.08] text-ink sm:text-[3.25rem]">
              Convierte tu inversión social en{" "}
              <GoldUnderline>resultados medibles</GoldUnderline>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-ui">
              Somos el aliado que ejecuta en las regiones donde tu empresa quiere estar y
              te entrega las métricas que tu directorio necesita ver.
            </p>
            <Button
              href={siteConfig.contact.whatsappUrl}
              variant="gradient"
              size="lg"
              className="mt-8"
            >
              Hablar con el equipo
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </Container>
      </section>

      <Section>
        <Container size="wide">
          <SectionHeader
            eyebrow="Por qué SEP"
            title="Lo que resolvemos para tu área de sostenibilidad"
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Globe,
                title: "Alcance regional real",
                body: "10+ regiones fuera de Lima, con presencia validada en Áncash desde 2024.",
              },
              {
                icon: ChartNoAxesCombined,
                title: "Métricas verificables",
                body: "Jóvenes formados, horas, proyectos, colegios y asistencia registrada en plataforma.",
              },
              {
                icon: Handshake,
                title: "Alineación con ODS",
                body: "Reporte mapeado a los ODS 4, 8 y 10, listo para tu memoria anual.",
              },
              {
                icon: Users,
                title: "Pipeline de talento",
                body: "Acceso a jóvenes formados en liderazgo y metodologías ágiles.",
              },
            ].map((f) => (
              <Card key={f.title} className="p-6">
                <f.icon className="size-5 text-sep-600" />
                <h3 className="mt-4 font-display text-[0.9375rem] font-semibold text-ink">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-ui">{f.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="muted">
        <Container size="wide">
          <SectionHeader
            eyebrow="Paquetes"
            title="Formatos de alianza"
            description="Pago por programa completo. Todos incluyen certificación y reporte de impacto."
          />

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {b2bPackages.map((p) => (
              <Card key={p.slug} className="flex flex-col">
                <h3 className="font-display text-[1.0625rem] font-semibold text-ink">
                  {p.name}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-ui">{p.scope}</p>

                <p className="tabular mt-5 font-display text-[1.75rem] font-bold leading-none text-ink">
                  {"priceFrom" in p && p.priceFrom && (
                    <span className="text-sm font-medium text-slate-ui">Desde </span>
                  )}
                  {formatSoles(p.priceCents)}
                </p>

                <ul className="mt-5 flex-1 space-y-2 border-t border-line pt-5">
                  {p.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-2.5 text-sm text-graphite">
                      <Check className="mt-0.5 size-4 shrink-0 text-seed-500" />
                      {d}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-slate-ui">
            Precios referenciales. Cada alianza se ajusta al alcance y a las regiones
            donde tu empresa opera.
          </p>
        </Container>
      </Section>

      <section className="sep-gradient">
        <Container size="wide" className="py-16 text-center">
          <h2 className="mx-auto max-w-2xl font-display text-[2rem] font-bold leading-tight text-white">
            Conversemos sobre el impacto que quieres demostrar
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/75">
            Te enviamos una propuesta con alcance, métricas y cronograma en menos de una
            semana.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={siteConfig.contact.whatsappUrl} variant="gold" size="lg">
              Escribir por WhatsApp
            </Button>
            <Button
              href={`mailto:${siteConfig.contact.email}?subject=Alianza%20RSE%20con%20SEP`}
              variant="outline-white"
              size="lg"
            >
              Enviar correo
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
