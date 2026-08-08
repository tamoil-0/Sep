import type { Metadata } from "next";
import { ArrowRight, Sprout } from "lucide-react";
import {
  Badge,
  Card,
  Container,
  GoldUnderline,
  Section,
  SectionHeader,
} from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { impactChain, partners, problemStats, siteConfig } from "@/config/site";
import { initials } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "SEP nació el 7 de abril de 2024 en Casma, Áncash. Democratizamos metodologías ágiles para jóvenes de todas las regiones del Perú.",
};

const team = [
  { name: "Celeste Ulloa Jara", role: "Managing Director · Founder" },
  { name: "Diana Gamboa", role: "Content & Social Media Analyst" },
  { name: "Jhon Aracayo", role: "CTO" },
  { name: "Anabell Corales", role: "Talent Strategy Analyst" },
  { name: "Jennifer Lopez", role: "Learning Design Analyst" },
  { name: "Daniela Gamboa", role: "Program Coordination Analyst" },
  { name: "Astrid Verde", role: "Community Engagement Analyst" },
  { name: "Claudia Grados", role: "Recruitment & Onboarding Analyst" },
  { name: "Max Orihuela", role: "Partnerships Strategy Analyst" },
];

export default function NosotrosPage() {
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
          <div className="max-w-2xl">
            <Badge tone="white">Desde Casma, Áncash · 7 de abril de 2024</Badge>
            <h1 className="mt-5 font-display text-[2.5rem] font-bold leading-[1.08] text-white sm:text-[3.25rem]">
              Llevamos la innovación al{" "}
              <span className="text-gold-500">territorio del talento</span>, no al revés.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/80">
              SEP es la primera organización peruana especializada en programas de
              emprendimiento juvenil e innovación científico-tecnológica nacida fuera de
              Lima y pensada para regiones.
            </p>
          </div>
        </Container>
      </section>

      {/* Misión / Visión */}
      <Section>
        <Container size="wide">
          <div className="grid gap-5 lg:grid-cols-3">
            {[
              {
                label: "Misión",
                text: "Impulsar el desarrollo de jóvenes y emprendedores en los campos de la innovación y la tecnología.",
              },
              {
                label: "Visión",
                text: "Promover una educación descentralizada y construir un sistema económico basado en la generación de valor consciente.",
              },
              {
                label: "Lema",
                text: "Emprende hoy, lidera mañana.",
                highlight: true,
              },
            ].map((c) => (
              <Card
                key={c.label}
                className={c.highlight ? "border-gold-500/35 bg-[#FFFBF0]" : ""}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sep-600">
                  {c.label}
                </p>
                <p className="mt-3.5 text-[1.0625rem] leading-relaxed text-graphite">
                  {c.text}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Problema */}
      <Section tone="muted">
        <Container size="wide">
          <SectionHeader
            eyebrow="Por qué existimos"
            title={
              <>
                El talento está en regiones. Las{" "}
                <GoldUnderline>oportunidades</GoldUnderline> se quedan en Lima.
              </>
            }
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {problemStats.map((s) => (
              <Card key={s.title}>
                <p className="tabular font-display text-[3rem] font-bold leading-none sep-gradient-text">
                  {s.figure}
                </p>
                <h3 className="mt-5 text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-slate-ui">
                  {s.body}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Modelo */}
      <Section>
        <Container size="wide">
          <SectionHeader
            eyebrow="Nuestro modelo"
            title="Impacto en cadena"
            description="No formamos a una persona: formamos a quien formará a diez más en su propia comunidad."
            align="center"
          />
          <ol className="mt-12 grid gap-4 md:grid-cols-4">
            {impactChain.map((node, i) => (
              <li key={node.step} className="relative">
                <Card className="h-full">
                  <span className="tabular text-xs font-semibold tracking-[0.14em] text-gold-600">
                    0{i + 1}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-semibold text-ink">
                    {node.step}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-ui">
                    {node.detail}
                  </p>
                </Card>
                {i < impactChain.length - 1 && (
                  <ArrowRight
                    aria-hidden
                    className="absolute -right-3.5 top-1/2 hidden size-6 -translate-y-1/2 text-gold-500 md:block"
                  />
                )}
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Equipo */}
      <Section tone="muted">
        <Container size="wide">
          <SectionHeader
            eyebrow="El equipo"
            title="Quiénes sostenemos esto"
            description="Un equipo directivo joven más 12 voluntarios profesionales repartidos por el país."
          />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m) => (
              <li key={m.name}>
                <Card className="flex items-center gap-4 p-5">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full sep-gradient text-sm font-semibold text-white">
                    {initials(m.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-display text-[0.9375rem] font-semibold text-ink">
                      {m.name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-ui">{m.role}</p>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Aliados */}
      <Section>
        <Container size="wide">
          <SectionHeader
            eyebrow="Respaldo"
            title="Redes, alianzas y avales"
            align="center"
          />
          <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2.5">
            {partners.map((p) => (
              <li
                key={p.name}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm text-graphite"
              >
                {p.name}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Cierre */}
      <section className="sep-gradient">
        <Container size="wide" className="py-16 text-center">
          <Sprout className="mx-auto size-8 text-gold-500" />
          <h2 className="mx-auto mt-5 max-w-xl font-display text-[2rem] font-bold leading-tight text-white">
            ¿Quieres construir esto con nosotros?
          </h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/voluntariado" variant="gold" size="lg">
              Ser voluntario
            </Button>
            <Button href={siteConfig.contact.whatsappUrl} variant="outline-white" size="lg">
              Escríbenos por WhatsApp
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
