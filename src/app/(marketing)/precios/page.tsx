import type { Metadata } from "next";
import { ArrowRight, Check, HeartHandshake, Info, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Badge,
  Card,
  Container,
  GoldUnderline,
  Section,
  SectionHeader,
} from "@/components/ui/primitives";
import {
  b2bPackages,
  certificateTypes,
  donationAmounts,
  membershipPlans,
  paymentMethods,
  silpPricing,
} from "@/config/pricing";
import { formatSoles } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Precios y certificados",
  description:
    "Los cursos de SEP son gratuitos siempre. Certificado SEP S/30, certificado internacional S/50, SILP desde S/200, membresías y programas institucionales.",
};

function ProposedTag() {
  return (
    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-warning-bg px-2 py-0.5 text-[0.625rem] font-medium text-[#8A5A00]">
      <Info className="size-3" />
      Propuesta
    </span>
  );
}

export default function PreciosPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-line bg-surface-1">
        <Container size="wide" className="py-16 text-center sm:py-20">
          <Badge tone="seed">Transparencia total</Badge>
          <h1 className="mx-auto mt-5 max-w-3xl font-display text-[2.5rem] font-bold leading-[1.1] text-ink sm:text-[3.25rem]">
            Aprender es <GoldUnderline>gratis</GoldUnderline>. Siempre.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-ui">
            Nunca cobramos por la formación. Lo que se paga es la acreditación, la
            profundidad o el servicio institucional — y eso es lo que sostiene a SEP.
          </p>
        </Container>
      </section>

      {/* Cursos */}
      <Section>
        <Container size="wide">
          <Card className="flex flex-wrap items-center justify-between gap-6 border-seed-400/40 bg-[#F5FBEF] p-8">
            <div>
              <Badge tone="seed">Todo el catálogo</Badge>
              <h2 className="mt-3.5 font-display text-[1.75rem] font-semibold text-ink">
                Cursos: S/ 0
              </h2>
              <p className="mt-2 max-w-xl text-[0.9375rem] leading-relaxed text-slate-ui">
                Design Thinking aplicado, Scrum para proyectos sociales, Liderazgo e
                impacto regional y Metodologías ágiles en el aula. 8 horas cada uno,
                6 sesiones en vivo, 100 % virtual, sin costo de acceso.
              </p>
            </div>
            <Button href="/cursos" variant="primary">
              Ver el catálogo
              <ArrowRight className="size-4" />
            </Button>
          </Card>
        </Container>
      </Section>

      {/* Certificados */}
      <Section tone="muted" id="certificados">
        <Container size="wide">
          <SectionHeader
            eyebrow="Certificados"
            title="Acredita tu aprendizaje"
            description="Opcional al terminar cualquier curso. Cada certificado lleva un código único verificable públicamente."
            align="center"
          />

          <div className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-2">
            {certificateTypes.map((cert) => (
              <Card
                key={cert.slug}
                className={
                  cert.recommended
                    ? "relative border-sep-200 shadow-[0_8px_32px_rgba(46,11,232,.09)]"
                    : ""
                }
              >
                {cert.recommended && (
                  <span className="absolute -top-3 left-6 rounded-full bg-gold-500 px-3 py-1 text-[0.6875rem] font-semibold text-ink">
                    Recomendado
                  </span>
                )}
                <h3 className="font-display text-lg font-semibold text-ink">
                  {cert.name}
                </h3>
                <p className="mt-1 text-xs text-slate-ui">{cert.issuer}</p>
                <p className="tabular mt-5 font-display text-[2.25rem] font-bold leading-none text-ink">
                  {formatSoles(cert.priceCents)}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-ui">
                  {cert.description}
                </p>
                <ul className="mt-5 space-y-2.5 border-t border-line pt-5">
                  {cert.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-graphite">
                      <Check className="mt-0.5 size-4 shrink-0 text-seed-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* SILP */}
      <Section>
        <Container size="wide">
          <SectionHeader
            eyebrow="Programa insignia"
            title={silpPricing.name}
            description={`${silpPricing.duration} de formación completa en liderazgo social, con proyecto de impacto real y mentoría.`}
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {silpPricing.tiers.map((tier) => (
              <Card key={tier.label} className="text-center">
                <p className="text-sm text-slate-ui">
                  {tier.label}
                  {!tier.confirmed && <ProposedTag />}
                </p>
                <p className="tabular mt-3 font-display text-[2rem] font-bold leading-none sep-gradient-text">
                  {tier.priceCents === 0 ? "Gratis" : formatSoles(tier.priceCents)}
                </p>
              </Card>
            ))}
          </div>

          <p className="mt-5 flex items-start gap-2 text-sm text-slate-ui">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-gold-600" />
            Los voluntarios activos de SEP acceden al SILP sin costo. Es parte de lo que
            reciben por sostener la red.
          </p>
        </Container>
      </Section>

      {/* Membresías */}
      <Section tone="muted" id="membresias">
        <Container size="wide">
          <SectionHeader
            eyebrow="Membresías"
            title="Crece con acompañamiento"
            description="La membresía Semilla es gratuita para siempre. Los planes de pago añaden certificados incluidos y mentoría."
            align="center"
          />

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {membershipPlans.map((plan) => (
                <Card
                  key={plan.slug}
                  className={
                    plan.highlight
                      ? "relative flex flex-col border-sep-300 shadow-[0_8px_32px_rgba(46,11,232,.1)]"
                      : "flex flex-col"
                  }
                >
                  {plan.highlight && (
                    <span className="absolute -top-3 left-6 rounded-full sep-gradient px-3 py-1 text-[0.6875rem] font-semibold text-white">
                      El más elegido
                    </span>
                  )}

                  <p className="text-2xl leading-none">{plan.emoji}</p>
                  <h3 className="mt-3 font-display text-lg font-semibold text-ink">
                    {plan.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-ui">{plan.tagline}</p>

                  <p className="tabular mt-5 font-display text-[1.875rem] font-bold leading-none text-ink">
                    {plan.priceCents === 0 ? "Gratis" : formatSoles(plan.priceCents)}
                  </p>
                  <p className="mt-1 text-xs text-slate-ui">
                    {plan.months === 0
                      ? "Para siempre"
                      : `${plan.months} meses · ${formatSoles(
                          Math.round(plan.priceCents / plan.months),
                        )}/mes`}
                    {!plan.confirmed && <ProposedTag />}
                  </p>

                  <ul className="mt-5 flex-1 space-y-2.5 border-t border-line pt-5">
                    {plan.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-sm text-graphite">
                        <Check className="mt-0.5 size-4 shrink-0 text-seed-500" />
                        {b}
                      </li>
                    ))}
                  </ul>

                  <Button
                    href="/registro"
                    variant={plan.highlight ? "gradient" : "outline"}
                    size="sm"
                    className="mt-6 w-full"
                  >
                    {plan.priceCents === 0 ? "Empezar gratis" : "Elegir plan"}
                  </Button>
                </Card>
              ))}
          </div>

          <Card className="mt-5 flex flex-wrap items-center justify-between gap-5 border-gold-500/35 bg-[#FFFBF0]">
            <div>
              <h3 className="font-display text-lg font-semibold text-ink">
                ⭐ Membresía de voluntario — gratis
              </h3>
              <p className="mt-1.5 max-w-2xl text-sm text-slate-ui">
                Todo lo del plan Bosque sin costo, mientras estés activo como mentor,
                community manager u organizador de eventos.
              </p>
            </div>
            <Button href="/voluntariado" variant="outline">
              Ver voluntariado
            </Button>
          </Card>
        </Container>
      </Section>

      {/* B2B */}
      <Section id="empresas">
        <Container size="wide">
          <SectionHeader
            eyebrow="Programas institucionales"
            title="Para colegios, universidades y empresas"
            description="Pago por programa completo. Incluye siempre certificación y reporte de impacto con métricas verificables."
          />

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {b2bPackages.map((pkg) => (
              <Card key={pkg.slug} className="flex flex-col">
                <h3 className="font-display text-[1.0625rem] font-semibold text-ink">
                  {pkg.name}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-ui">{pkg.scope}</p>

                <p className="tabular mt-5 font-display text-[1.75rem] font-bold leading-none text-ink">
                  {"priceFrom" in pkg && pkg.priceFrom && (
                    <span className="text-sm font-medium text-slate-ui">Desde </span>
                  )}
                  {formatSoles(pkg.priceCents)}
                </p>
                <p className="mt-1 text-xs text-slate-ui">
                  <ProposedTag />
                </p>

                <ul className="mt-5 flex-1 space-y-2 border-t border-line pt-5">
                  {pkg.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-2.5 text-sm text-graphite">
                      <Check className="mt-0.5 size-4 shrink-0 text-seed-500" />
                      {d}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>

          <Card className="mt-5 flex flex-wrap items-center justify-between gap-5 border-seed-400/40 bg-[#F5FBEF]">
            <div>
              <h3 className="font-display text-lg font-semibold text-ink">
                Colegios de la red SEP: siempre gratis
              </h3>
              <p className="mt-1.5 max-w-2xl text-sm text-slate-ui">
                Si tu colegio se suma a la red sin patrocinio, los talleres no cuestan
                nada. Es el corazón del impacto social de SEP y no se toca.
              </p>
            </div>
            <Button href="/colegios" variant="outline">
              Inscribir mi colegio
            </Button>
          </Card>
        </Container>
      </Section>

      {/* Donaciones + métodos de pago */}
      <Section tone="muted">
        <Container size="wide">
          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="p-8">
              <div className="flex size-11 items-center justify-center rounded-[12px] bg-gold-500/15 text-gold-700">
                <HeartHandshake className="size-5" />
              </div>
              <h2 className="mt-5 font-display text-[1.5rem] font-semibold text-ink">
                Donar
              </h2>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-slate-ui">
                Tu donación ayuda a que jóvenes de regiones que nadie está atendiendo
                accedan a formación, mentoría y talleres.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {donationAmounts.map((a) => (
                  <span
                    key={a}
                    className="tabular rounded-[10px] border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink"
                  >
                    {formatSoles(a)}
                  </span>
                ))}
                <span className="rounded-[10px] border border-dashed border-line px-4 py-2.5 text-sm text-slate-ui">
                  Otro monto
                </span>
              </div>

              <p className="mt-3 text-xs text-slate-ui">Donación única o mensual.</p>

              <Button href="/donaciones" variant="gradient" className="mt-6">
                Quiero donar
              </Button>
            </Card>

            <Card className="p-8">
              <h2 className="font-display text-[1.5rem] font-semibold text-ink">
                Cómo puedes pagar
              </h2>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-slate-ui">
                Elegimos los métodos que la gente realmente usa en el Perú.
              </p>

              <ul className="mt-6 divide-y divide-line">
                {paymentMethods.map((m) => (
                  <li key={m.slug} className="flex items-center justify-between py-3.5">
                    <span className="text-sm font-medium text-ink">{m.label}</span>
                    <Badge tone={m.auto ? "success" : "neutral"}>
                      {m.auto ? "Confirmación automática" : "Confirmación en 24 h"}
                    </Badge>
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-xs leading-relaxed text-slate-ui">
                Con Yape o Plin subes la captura de tu operación y el equipo de SEP la
                valida. Con tarjeta, la confirmación es inmediata.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Nota de transparencia */}
      <Section className="py-12">
        <Container size="narrow">
          <Card className="border-line bg-surface-1">
            <div className="flex items-start gap-3.5">
              <Info className="mt-0.5 size-5 shrink-0 text-slate-ui" />
              <div>
                <h2 className="font-display text-[0.9375rem] font-semibold text-ink">
                  Sobre los precios marcados como propuesta
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-ui">
                  Los precios de certificados y la tarifa social del SILP están
                  confirmados. Los de membresías y programas institucionales son una
                  propuesta que estamos calibrando con las respuestas del{" "}
                  <a href="/conocenos" className="text-sep-600 hover:underline">
                    diagnóstico público
                  </a>
                  . Preferimos decirlo antes que fingir certeza.
                </p>
              </div>
            </div>
          </Card>
        </Container>
      </Section>
    </>
  );
}
