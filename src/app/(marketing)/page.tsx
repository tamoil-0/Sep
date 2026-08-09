import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  School,
  Sparkles,
  Users,
} from "lucide-react";

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
  AvatarStack,
  CourseCover,
  DotGrid,
  ImpactChainIllustration,
  StatBlock,
  type CoursePattern,
} from "@/components/brand/illustrations";
import { CountUp } from "@/components/marketing/count-up";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { NewsletterForm } from "@/components/marketing/newsletter-form";
import { ExperienceGallery, HeroPhoto } from "@/components/marketing/real-photo";
import { faqs, impactStats, partners, siteConfig } from "@/config/site";
import { getCatalog } from "@/server/queries/courses";
import { formatSoles } from "@/lib/utils";

/** ISR: la portada se sirve estática y se regenera cada 5 min. */
export const revalidate = 300;

const patternFor = (category: string | null): CoursePattern => {
  if (category === "SILP") return "silp";
  if (category === "Liderazgo") return "liderazgo";
  if (category === "Para docentes") return "docentes";
  return "agiles";
};

export default async function HomePage() {
  const catalog = await getCatalog();
  const courses = catalog.filter((c) => c.category !== "SILP").slice(0, 4);

  return (
    <>
      {/* ═══ 1 · HERO ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden sep-gradient">
        <DotGrid tone="dark" className="opacity-90" />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-40 size-[560px] rounded-full bg-white/10 blur-3xl"
        />

        <Container size="wide" className="relative">
          <div className="grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:py-24">
            <div>
              <Badge tone="white">
                <BadgeCheck className="size-3.5" />
                Reconocidos por SENAJU
              </Badge>

              <h1 className="mt-6 font-display text-[2.75rem] font-bold leading-[1.02] tracking-[-0.035em] text-white sm:text-[4rem] lg:text-[4.5rem]">
                Emprende hoy,
                <br />
                <span className="text-gold-500">lidera mañana.</span>
              </h1>

              <p className="mt-6 max-w-md text-lg leading-relaxed text-white/75">
                Formación en metodologías ágiles para jóvenes de todas las regiones del
                Perú. Gratis, siempre.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href="/registro" variant="gold" size="lg" prefetch>
                  Empezar gratis
                  <ArrowRight className="size-4" />
                </Button>
                <Button href="/cursos" variant="outline-white" size="lg" prefetch>
                  Ver los cursos
                </Button>
              </div>

              <div className="mt-10 flex items-center gap-4">
                <AvatarStack initials={["AN", "RM", "LV", "KQ"]} extra={131} />
                <p className="text-sm text-white/65">
                  <strong className="font-semibold text-white">+135 jóvenes</strong> ya
                  se formaron con SEP
                </p>
              </div>
            </div>

            <div className="relative mt-2 w-full lg:mt-0">
              <HeroPhoto />
            </div>
          </div>
        </Container>

        {/* ═══ 2 · MÉTRICAS ════════════════════════════════ */}
        <div className="relative border-t border-white/12">
          <Container size="wide">
            <dl className="grid grid-cols-2 gap-y-8 py-10 sm:grid-cols-3 lg:grid-cols-5">
              {impactStats.map((stat) => (
                <div key={stat.label}>
                  <dd className="tabular font-display text-[1.875rem] font-semibold leading-none text-gold-500">
                    <CountUp
                      value={stat.value}
                      prefix={"prefix" in stat ? stat.prefix : ""}
                      suffix={"suffix" in stat ? stat.suffix : ""}
                    />
                  </dd>
                  <dt className="mt-2 text-[0.8125rem] leading-snug text-white/60">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </Container>
        </div>
      </section>

      {/* ═══ 3 · EL PROBLEMA — cifras, no párrafos ═════════ */}
      <Section>
        <Container size="wide">
          <SectionHeader
            eyebrow="Por qué existimos"
            title={
              <>
                El talento está en regiones.
                <br />
                Las <GoldUnderline>oportunidades</GoldUnderline> se quedan en Lima.
              </>
            }
          />

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <StatBlock
              figure="80%"
              label="Concentración en Lima"
              detail="De los programas de innovación del país."
            />
            <StatBlock
              figure="9×"
              label="Menos probabilidad de éxito"
              detail="Para un emprendedor fuera de la capital."
              tone="gold"
            />
            <StatBlock
              figure="70%"
              label="Del talento vive en regiones"
              detail="Sin acceso a mentores ni referentes cercanos."
              tone="seed"
            />
          </div>
        </Container>
      </Section>

      {/* ═══ 4 · CADENA DE IMPACTO — un solo gráfico ══════ */}
      <Section tone="muted" className="overflow-hidden">
        <Container size="wide">
          <div className="grid items-end gap-6 sm:grid-cols-[1fr_auto]">
            <SectionHeader
              eyebrow="Esto es SEP"
              title="Ideas que salen del papel"
              description="Talleres, equipos y proyectos construidos por jóvenes desde sus propias regiones. Personas reales aprendiendo juntas, no fotografías de catálogo."
            />
            <Badge tone="seed" className="w-fit sm:mb-1">
              Experiencias reales
            </Badge>
          </div>
          <div className="mt-10 sm:mt-12">
            <ExperienceGallery />
          </div>
        </Container>
      </Section>

      <Section>
        <Container size="wide">
          <SectionHeader
            eyebrow="Cómo funciona"
            title="Formamos a quien formará a diez más"
            description="Los universitarios que capacitamos vuelven como mentores a los colegios de su propia comunidad."
            align="center"
          />

          <div className="mx-auto mt-12 max-w-4xl">
            <ImpactChainIllustration />
            <ol className="mt-4 grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
              {[
                ["SEP", "Plataforma virtual"],
                ["Universitarios", "De cualquier región"],
                ["Escolares", "En sus comunidades"],
                ["Impacto", "Que se sostiene solo"],
              ].map(([title, detail]) => (
                <li key={title}>
                  <p className="font-display text-[0.9375rem] font-semibold text-ink">
                    {title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-ui">{detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      {/* ═══ 5 · CURSOS — con portada visual ═══════════════ */}
      <Section>
        <Container size="wide">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeader
              eyebrow="Catálogo"
              title="Cursos gratuitos, siempre"
              description="8 horas · 6 sesiones en vivo · 100 % virtual."
            />
            <Button href="/cursos" variant="outline" prefetch>
              Ver catálogo
              <ArrowRight className="size-4" />
            </Button>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((course) => (
              <Card
                key={course.id}
                interactive
                className="flex flex-col p-4"
                as={Link}
                {...{ href: `/cursos/${course.slug}`, prefetch: true }}
              >
                <CourseCover
                  pattern={patternFor(course.category)}
                  className="aspect-[16/9] w-full"
                />

                <div className="mt-4 flex flex-1 flex-col px-1 pb-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {course.status === "disponible" ? (
                      <Badge tone="seed">Disponible</Badge>
                    ) : (
                      <Badge tone="neutral">Pronto</Badge>
                    )}
                    {course.audience === "docente" && <Badge tone="gold">Docentes</Badge>}
                  </div>

                  <h3 className="mt-3 font-display text-[1.0625rem] font-semibold leading-snug text-ink">
                    {course.title}
                  </h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-ui">
                    {course.subtitle}
                  </p>

                  <p className="mt-4 flex items-center justify-between border-t border-line pt-3 text-sm">
                    <span className="font-medium text-seed-700">Gratuito</span>
                    <span className="text-xs text-slate-ui">
                      {course.total_hours} h · {course.sessions_count} sesiones
                    </span>
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* ═══ 6 · SILP ═════════════════════════════════════ */}
      <Section tone="muted" className="py-14">
        <Container size="wide">
          <div className="overflow-hidden rounded-[20px] border border-line bg-white">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_320px]">
              <div className="p-8 sm:p-10">
                <Badge tone="gold">
                  <Sparkles className="size-3.5" />
                  Programa insignia
                </Badge>
                <h2 className="mt-4 font-display text-[1.875rem] font-semibold leading-tight text-ink">
                  Social Impact Leadership Program
                </h2>
                <p className="mt-3 max-w-lg text-[0.9375rem] leading-relaxed text-slate-ui">
                  Seis semanas para pasar de una idea a un proyecto que funciona en tu
                  región, con mentoría uno a uno.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-6">
                  <div>
                    <p className="tabular font-display text-[1.75rem] font-bold leading-none sep-gradient-text">
                      {formatSoles(20000)}
                    </p>
                    <p className="mt-1 text-xs text-slate-ui">Tarifa social</p>
                  </div>
                  <Button href="/silp" variant="gradient" prefetch>
                    Ver el programa
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>

              <CourseCover pattern="silp" className="h-full min-h-[200px] rounded-none" />
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══ 7 · CERTIFICADOS ═════════════════════════════ */}
      <Section>
        <Container size="wide">
          <SectionHeader
            eyebrow="Certificación"
            title="Aprender es gratis. Acreditarlo, opcional."
            description="Es lo que sostiene a SEP sin cobrar por la formación."
            align="center"
          />

          <div className="mx-auto mt-12 grid max-w-2xl gap-4 sm:grid-cols-2">
            {[
              {
                name: "Certificado SEP",
                issuer: "Reconocido por SENAJU",
                price: 3000,
              },
              {
                name: "Certificado Internacional",
                issuer: "Instituto Internacional de Ingeniería",
                price: 5000,
                recommended: true,
              },
            ].map((c) => (
              <Card
                key={c.name}
                className={
                  c.recommended
                    ? "relative border-sep-200 shadow-[0_8px_32px_rgba(46,11,232,.09)]"
                    : ""
                }
              >
                {c.recommended && (
                  <span className="absolute -top-3 left-6 rounded-full bg-gold-500 px-3 py-1 text-[0.6875rem] font-semibold text-ink">
                    Recomendado
                  </span>
                )}
                <p className="tabular font-display text-[2.25rem] font-bold leading-none text-ink">
                  {formatSoles(c.price)}
                </p>
                <h3 className="mt-4 font-display text-[1.0625rem] font-semibold text-ink">
                  {c.name}
                </h3>
                <p className="mt-1 text-xs text-slate-ui">{c.issuer}</p>
                <p className="mt-4 flex items-center gap-2 border-t border-line pt-4 text-xs text-slate-ui">
                  <Check className="size-3.5 text-seed-500" />
                  Código de verificación público
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* ═══ 8 · TRES CAMINOS ═════════════════════════════ */}
      <Section tone="muted">
        <Container size="wide">
          <SectionHeader
            eyebrow="Súmate"
            title="Hay más de una forma de entrar"
            align="center"
          />

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Users,
                title: "Sé voluntario",
                body: "Mentor, community manager u organizador. Con certificación y carta de recomendación.",
                cta: "Ver los 3 roles",
                href: "/voluntariado",
                tone: "gold" as const,
              },
              {
                icon: School,
                title: "Inscribe tu colegio",
                body: "Universitarios de tu región dictan talleres a tus estudiantes. Gratis.",
                cta: "Inscribir colegio",
                href: "/colegios",
                tone: "seed" as const,
              },
              {
                icon: Building2,
                title: "Alía tu empresa",
                body: "Convierte tu inversión RSE en métricas verificables alineadas a los ODS.",
                cta: "Hablar con el equipo",
                href: "/empresas",
                tone: "brand" as const,
              },
            ].map((c) => (
              <Card key={c.title} interactive className="flex flex-col p-7">
                <span
                  className={`flex size-11 items-center justify-center rounded-[12px] ${
                    c.tone === "gold"
                      ? "bg-gold-500/15 text-gold-700"
                      : c.tone === "seed"
                        ? "bg-seed-500/15 text-seed-700"
                        : "bg-sep-50 text-sep-600"
                  }`}
                >
                  <c.icon className="size-5" />
                </span>

                <h3 className="mt-5 font-display text-[1.25rem] font-semibold text-ink">
                  {c.title}
                </h3>
                <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-slate-ui">
                  {c.body}
                </p>

                <Link
                  href={c.href}
                  prefetch={false}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-sep-600 hover:underline"
                >
                  {c.cta}
                  <ArrowRight className="size-3.5" />
                </Link>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* ═══ 9 · TESTIMONIO + ALIADOS ═════════════════════ */}
      <Section>
        <Container size="wide">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
            <Card className="p-8 sm:p-10">
              <p className="font-display text-[1.375rem] leading-relaxed text-ink">
                “Compartí mi prototipo con mi colegio y los escolares llegaron con ideas
                increíbles para su barrio. Nunca subestimen a un chico de 15 años con una
                hoja en blanco.”
              </p>
              <div className="mt-7 flex items-center gap-3 border-t border-line pt-6">
                <span className="flex size-11 items-center justify-center rounded-full sep-gradient text-sm font-semibold text-white">
                  AN
                </span>
                <div>
                  <p className="text-sm font-medium text-ink">Andrea Núñez</p>
                  <p className="text-xs text-slate-ui">Mentora SEP · Arequipa</p>
                </div>
              </div>
              <Link
                href="/testimonios"
                prefetch={false}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-sep-600 hover:underline"
              >
                Ver más historias
                <ArrowRight className="size-3.5" />
              </Link>
            </Card>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-ui">
                Respaldo y alianzas
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {partners.map((p) => (
                  <li
                    key={p.name}
                    className="rounded-full border border-line bg-white px-3.5 py-2 text-[0.8125rem] text-graphite"
                  >
                    {p.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══ 10 · FAQ + NEWSLETTER ════════════════════════ */}
      <Section tone="muted">
        <Container size="wide">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <SectionHeader eyebrow="Preguntas frecuentes" title="Lo que suelen preguntarnos" />
              <div className="mt-8">
                <FaqAccordion items={faqs.slice(0, 5)} />
              </div>
              <Link
                href="/faq"
                prefetch={false}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-sep-600 hover:underline"
              >
                Ver todas
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <div>
              <Card className="lg:sticky lg:top-24">
                <h2 className="font-display text-[1.25rem] font-semibold text-ink">
                  Newsletter SEP
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-ui">
                  Convocatorias, becas y eventos. Te enteras 48 horas antes que en redes.
                </p>
                <div className="mt-5">
                  <NewsletterForm />
                </div>
                <p className="mt-4 text-xs text-mist">
                  1,200+ suscriptores · 2 ediciones al mes
                </p>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══ CTA FINAL ════════════════════════════════════ */}
      <section className="relative overflow-hidden sep-gradient">
        <DotGrid tone="dark" />
        <Container size="wide" className="relative py-20 text-center">
          <h2 className="mx-auto max-w-2xl font-display text-[2.25rem] font-bold leading-tight text-white sm:text-[3rem]">
            ¿Listos para sembrar el cambio?
          </h2>
          <p className="mx-auto mt-5 max-w-md text-lg text-white/70">
            Crea tu cuenta y empieza tu primer curso esta semana.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/registro" variant="gold" size="lg" prefetch>
              Crear cuenta gratis
              <ArrowRight className="size-4" />
            </Button>
            <Button href={siteConfig.contact.whatsappUrl} variant="outline-white" size="lg">
              Escríbenos por WhatsApp
            </Button>
          </div>
        </Container>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: siteConfig.name,
            alternateName: siteConfig.shortName,
            url: siteConfig.url,
            email: siteConfig.contact.email,
            telephone: siteConfig.contact.whatsapp,
            foundingDate: siteConfig.founded,
            description: siteConfig.description,
            address: {
              "@type": "PostalAddress",
              addressRegion: "Áncash",
              addressCountry: "PE",
            },
            sameAs: Object.values(siteConfig.social),
          }),
        }}
      />
    </>
  );
}
