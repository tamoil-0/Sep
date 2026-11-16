import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRight,
  Check,
  Building2,
  GraduationCap,
  Presentation,
  School,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Badge,
  Card,
  Container,
  Eyebrow,
  Skeleton,
  Section,
  SectionHeader,
} from "@/components/ui/primitives";
import { StatBlock } from "@/components/brand/illustrations";
import { CountUp } from "@/components/marketing/count-up";
import { CourseMedia } from "@/components/marketing/course-media";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { NewsCard } from "@/components/marketing/news-card";
import { NewsletterForm } from "@/components/marketing/newsletter-form";
import { ArrowLink } from "@/components/ui/arrow-link";
import { CertificateOptions } from "@/components/marketing/certificate-options";
import { Laptop, PantallaCertificado, PantallaLeccion, Telefono } from "@/components/maquetas/maquetas";
import { MotivoSemilla } from "@/components/brand/motivo-semilla";
import {
  ExperienceGallery,
  HeroPhoto,
  MediaImage,
  SEP_PHOTOS,
} from "@/components/marketing/real-photo";
import { faqs, impactStats, partners, siteConfig } from "@/config/site";
import { getCatalog } from "@/server/queries/courses";
import { courses } from "@/config/courses";
import { getPublishedPosts } from "@/server/queries/public-content";

// Los bloques con datos reales se resuelven por solicitud para no publicar un
// catálogo vacío si la fuente está temporalmente inaccesible durante el build.
export const dynamic = "force-dynamic";
import { formatSoles } from "@/lib/utils";
import { createPageMetadata, serializeJsonLd } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
  path: "/",
  keywords: [...siteConfig.seo.keywords],
  absoluteTitle: true,
});

/** ISR: la portada se sirve estática y se regenera cada 5 min. */
export const revalidate = 300;

const partnerCategoryLabels = {
  red: "Red",
  alianza: "Colaboración",
  mentoria: "Mentoría",
  premio: "Reconocimiento",
  aval: "Aval",
} as const;

// Curso que el hero ofrece: el primero disponible (datos estáticos: no frena la carga).
const cursoAbierto = courses.find((c) => c.status === "disponible") ?? courses[0];

export default function HomePage() {

  return (
    <>
      {/* ═══ 1 · HERO ═══════════════════════════════════════ */}
      <section className="theme-night halo relative overflow-hidden">
        <Container size="wide" className="relative">
          <div className="grid items-center gap-10 pb-12 pt-12 sm:pt-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14 lg:pb-16 lg:pt-20">
            <div className="max-w-2xl">
              <Eyebrow className="text-cian-500">Formación gratuita para jóvenes de todo el Perú</Eyebrow>

              {/* La oferta, dicha en la primera línea (feedback: «el hero tiene que vender»). */}
              <h1 className="mt-5 font-display text-h1 font-semibold text-ink sm:text-display">
                Aprende a emprender y liderar. Gratis, en vivo y desde tu región.
              </h1>

              <p className="mt-6 max-w-xl text-body-lg text-slate-ui">
                Cursos cortos de Design Thinking, Scrum y liderazgo con proyectos reales. Terminas con un
                certificado verificable y una red de jóvenes que, como tú, quieren cambiar su comunidad.
              </p>

              <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Button href="/registro" variant="neon" size="lg" prefetch>
                  Empieza gratis hoy <ArrowRight aria-hidden />
                </Button>
                <Button href="/cursos" variant="outline-white" size="lg" prefetch>
                  Ver los cursos
                </Button>
              </div>

              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-body-sm text-slate-ui">
                {["Acceso 100 % gratuito", "Certificado con código verificable", "+135 jóvenes capacitados"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="flex size-5 items-center justify-center rounded-full bg-turquesa-500 text-noche-900">
                      <Check className="size-3" strokeWidth={3} aria-hidden />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* La oferta concreta: el curso abierto ahora, a un clic. */}
            <div className="relative">
              <HeroPhoto />
              <Link
                href={`/cursos/${cursoAbierto.slug}`}
                className="tarjeta-viva group relative mt-2 block rounded-lg p-5 shadow-elevated lg:absolute lg:-bottom-6 lg:-left-10 lg:mt-0 lg:w-80"
              >
                <span className="flex items-center gap-2 text-caption font-medium text-success">
                  <span className="size-2 rounded-full bg-turquesa-500 motion-safe:animate-pulse" aria-hidden />
                  Inscripciones abiertas
                </span>
                <span className="mt-2 block font-display text-h4 font-semibold text-ink">{cursoAbierto.title}</span>
                <span className="mt-1 block text-body-sm text-slate-ui">
                  {cursoAbierto.sessionsCount} sesiones en vivo · {cursoAbierto.totalHours} horas · Gratis
                </span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-body-sm font-semibold text-acento">
                  Inscríbete
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
            </div>
          </div>

          {/* ═══ 2 · MÉTRICAS: dentro del hero, separadas por filetes ═══ */}
          <dl className="grid grid-cols-2 border-t border-line sm:grid-cols-3 lg:grid-cols-5">
            {impactStats.map((stat) => (
              <div
                key={stat.label}
                className="border-b border-line py-7 pr-4 sm:border-b-0 lg:border-l lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
              >
                <dd className="tabular font-display text-h1 font-semibold leading-none text-ink">
                  <CountUp
                    value={stat.value}
                    prefix={stat.prefix ?? ""}
                    suffix={stat.suffix ?? ""}
                  />
                </dd>
                <dt className="mt-3 text-body-sm leading-snug text-slate-ui">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ═══ 3 · ACTUALIDAD — se transmite aparte: el hero no espera a la base ═ */}
      <Suspense fallback={null}>
        <LatestNews />
      </Suspense>

      {/* ═══ 4 · PÚBLICOS ═════════════════════════════════════════════════ */}
      <Section id="publicos" tone="muted">
        <Container size="wide">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeader
                eyebrow="Una comunidad, distintas rutas"
                title="¿Para quién es SEP?"
                description="Del colegio a la universidad, y con quienes hacen posible ese camino. Elige tu punto de partida."
              />
            </div>

            {/* Filas-enlace: cada público es un solo clic, sin tarjetas repetidas. */}
            <ul className="divide-y divide-line border-y border-line">
              {[
                {
                  icon: GraduationCap,
                  title: "Jóvenes y universitarios",
                  body: "Cursos gratuitos, mentoría, voluntariado y programas para llevar una idea a un proyecto con impacto.",
                  cta: "Explorar cursos",
                  href: "/cursos",
                  tono: "bg-violeta-50 text-acento",
                },
                {
                  icon: School,
                  title: "Escolares",
                  body: "Talleres de innovación social en su propia aula, dictados por universitarios de su región.",
                  cta: "Conocer la red de colegios",
                  href: "/colegios",
                  tono: "bg-turquesa-50 text-turquesa-800",
                },
                {
                  icon: Presentation,
                  title: "Docentes y colegios",
                  body: "Formación en metodologías ágiles, recursos para el aula y facilitadores cercanos.",
                  cta: "Ver el programa docente",
                  href: "/docentes",
                  tono: "bg-noche-900 text-cian-500",
                },
                {
                  icon: Users,
                  title: "Voluntarios",
                  body: "Mentor, community manager u organizador de eventos. Con certificado y carta de recomendación.",
                  cta: "Ver los 3 roles",
                  href: "/voluntariado",
                  tono: "bg-turquesa-50 text-turquesa-800",
                },
                {
                  icon: Building2,
                  title: "Empresas y aliados",
                  body: "Programas de impacto juvenil en regiones, con métricas que tu directorio puede verificar.",
                  cta: "Crear una alianza",
                  href: "/empresas",
                  tono: "bg-violeta-50 text-acento",
                },
              ].map((audience) => (
                <li key={audience.title}>
                  <Link
                    href={audience.href}
                    className="group flex items-start gap-5 px-2 py-6 transition-colors duration-300 hover:bg-surface-1 sm:items-center sm:px-4"
                  >
                    <span className={`flex size-12 shrink-0 items-center justify-center rounded-full ${audience.tono}`}>
                      <audience.icon className="size-5" strokeWidth={1.75} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-h4 font-semibold text-ink transition-colors duration-300 group-hover:text-acento">
                        {audience.title}
                      </span>
                      <span className="mt-1 block max-w-prose text-body-sm leading-relaxed text-slate-ui">{audience.body}</span>
                      <span className="mt-2 block text-body-sm font-medium text-acento sm:hidden">{audience.cta}</span>
                    </span>
                    <span className="hidden shrink-0 items-center gap-2 text-body-sm font-medium text-acento sm:flex">
                      {audience.cta}
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* ═══ 5 · EL PROBLEMA ══════════════════════════════════════════════ */}
      <Section tone="night">
        <Container size="wide">
          <SectionHeader
            eyebrow="Por qué existimos"
            title={
              <>
                El talento está en regiones.
                <br />
                Las oportunidades se quedan en Lima.
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
              tone="neon"
            />
            <StatBlock
              figure="70%"
              label="Del talento vive en regiones"
              detail="Sin acceso a mentores ni referentes cercanos."
              tone="success"
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
            <Badge tone="success" className="w-fit sm:mb-1">
              Experiencias reales
            </Badge>
          </div>
          <div className="mt-10 sm:mt-12">
            <ExperienceGallery />
          </div>
        </Container>
      </Section>

      {/* Cómo funciona: la semilla de marca ES el diagrama (1 → 3 → 9). */}
      <Section>
        <Container size="wide">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <SectionHeader
                eyebrow="Cómo funciona"
                title="Formamos a quien formará a diez más"
                description="Cada universitario que se forma en SEP vuelve como mentor a los colegios de su propia comunidad. Así una persona se convierte en una red."
              />
              <ol className="mt-8 space-y-0 border-l border-line">
                {[
                  { title: "SEP abre la formación", detail: "Cursos gratuitos y 100 % virtuales, desde cualquier región." },
                  { title: "Universitarios que se forman", detail: "Aprenden Design Thinking, Scrum y liderazgo con proyectos reales." },
                  { title: "Mentores en su colegio", detail: "Llevan talleres a escolares de su propia comunidad." },
                  { title: "Proyectos que se quedan", detail: "Ideas locales que siguen andando sin depender de Lima." },
                ].map((step, i) => (
                  <li key={step.title} className="relative py-4 pl-8">
                    <span
                      aria-hidden
                      className="absolute -left-1.5 top-5.5 size-3 rounded-full bg-surface-0 ring-2 ring-violeta-500"
                    />
                    <p className="font-display text-body-lg font-semibold text-ink">
                      <span className="tabular mr-2 text-acento">{i + 1}</span>
                      {step.title}
                    </p>
                    <p className="mt-1 text-body-sm text-slate-ui">{step.detail}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="theme-night halo relative overflow-hidden rounded-lg p-8 sm:p-12">
              <MotivoSemilla
                className="mx-auto w-full max-w-sm"
                label="Diagrama: una semilla (SEP) forma a tres universitarios y cada uno forma a tres escolares: nueve nodos de impacto."
              />
              <p className="relative mt-4 text-center text-body-sm text-slate-ui">
                1 semilla → 3 mentores → 9 escolares, y la red sigue creciendo.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══ 5 · CURSOS — se transmite aparte con su propio esqueleto ═══ */}
      <Suspense fallback={<CoursesFallback />}>
        <CoursesSection />
      </Suspense>

      {/* ═══ 6 · SILP ═════════════════════════════════════ */}
      <Section tone="muted">
        <Container size="wide">
          <div className="overflow-hidden rounded-lg border border-line bg-white">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_320px]">
              <div className="p-8 sm:p-10">
                <Badge tone="neon">
                  <Sparkles className="size-3.5" />
                  Programa insignia
                </Badge>
                <h2 className="mt-4 font-display text-h2 font-semibold leading-tight text-ink">
                  Social Impact Leadership Program
                </h2>
                <p className="mt-3 max-w-lg text-body-sm leading-relaxed text-slate-ui">
                  Seis semanas para pasar de una idea a un proyecto que funciona en tu
                  región, con mentoría uno a uno.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-6">
                  <div>
                    <p className="tabular font-display text-h2 font-bold leading-none text-acento">
                      {formatSoles(20000)}
                    </p>
                    <p className="mt-1 text-caption text-slate-ui">Tarifa social</p>
                  </div>
                  <Button href="/silp" prefetch>
                    Ver el programa
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>

              <CourseMedia
                slug="silp"
                title="Social Impact Leadership Program"
                category="Programa insignia"
                className="h-full min-h-[220px] rounded-none"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══ 7 · LA PLATAFORMA POR DENTRO + CERTIFICADOS ═══ */}
      <Section className="overflow-hidden">
        <Container size="wide">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div data-reveal>
              <SectionHeader
                eyebrow="La plataforma por dentro"
                title="Aprender es gratis. Acreditarlo, opcional."
                description="Avanzas sesión por sesión desde el celular y, si quieres, certificas lo aprendido con un código que cualquiera puede verificar. Es lo que sostiene a SEP sin cobrar por la formación."
              />
              <CertificateOptions showVerification className="mt-8 grid gap-4 sm:grid-cols-2" />
            </div>

            {/* Maquetas con datos ficticios: no son capturas de usuarios reales. */}
            <div className="relative grid items-end gap-6 sm:grid-cols-[auto_1fr]" data-reveal style={{ transitionDelay: "120ms" }}>
              <Telefono label="Maqueta ilustrativa: la lección de un curso en el celular; el progreso avanza de 3 a 4 sesiones y aparece «¡Sesión 4 completada!»">
                <PantallaLeccion />
              </Telefono>
              <Laptop
                url="sep.pe/verificar/SEP-0000-EJEMPLO"
                label="Maqueta ilustrativa: un certificado SEP de ejemplo a nombre de «Ana Q.» con su código QR y el sello de verificado"
                className="hidden sm:block"
              >
                <PantallaCertificado />
              </Laptop>
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══ 9 · PRESENCIA EN EL ECOSISTEMA ═══════════════ */}
      <Section id="ecosistema" className="scroll-mt-20">
        <Container size="wide">
          <SectionHeader
            eyebrow="Ecosistema emprendedor"
            title="Conectados con iniciativas que movilizan talento"
            description="Estas piezas registran la participación de SEP como media partner. Los demás vínculos se muestran por tipo para no confundir colaboración, mentoría, aval o reconocimiento."
          />

          <div className="mt-10 grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
            <div className="grid gap-4 sm:grid-cols-2">
              <MediaImage
                src={SEP_PHOTOS.northStarMediaPartner}
                alt="Pieza oficial de North Star Fest que incluye a SEP como media partner"
                kind="poster"
                label="North Star Fest · Media partner"
                className="aspect-[4/5] min-h-0"
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 46vw, 92vw"
              />
              <MediaImage
                src={SEP_PHOTOS.innovationMediaPartner}
                alt="Pieza oficial de Innovation Challenge que presenta a SEP como media partner"
                kind="poster"
                label="Innovation Challenge · Media partner"
                className="aspect-[4/5] min-h-0"
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 46vw, 92vw"
              />
            </div>

            <Card className="p-6 sm:p-8">
              <p className="text-body-sm font-semibold tracking-eyebrow text-slate-ui">
                Vínculos registrados por SEP
              </p>
              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {partners.map((partner) => (
                  <li
                    key={partner.name}
                    className="flex min-w-0 items-center justify-between gap-3 rounded-sm border border-line bg-surface-1 px-3.5 py-3"
                  >
                    {partner.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={partner.logo} alt={partner.name} className="h-7 w-auto max-w-32 object-contain" loading="lazy" />
                    ) : (
                      <span className="min-w-0 text-body-sm font-medium text-graphite">{partner.name}</span>
                    )}
                    <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-caption font-medium text-acento ring-1 ring-inset ring-violeta-100">
                      {partnerCategoryLabels[partner.category]}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
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
              <ArrowLink href="/faq" prefetch={false} className="mt-6">
                Ver todas
              </ArrowLink>
            </div>

            <div>
              <Card id="newsletter" className="scroll-mt-24 lg:sticky lg:top-24">
                <h2 className="font-display text-h4 font-semibold text-ink">
                  Newsletter SEP
                </h2>
                <p className="mt-2 text-body-sm leading-relaxed text-slate-ui">
                  Convocatorias, becas, actividades y novedades de la comunidad SEP.
                </p>
                <div className="mt-5">
                  <NewsletterForm />
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══ CTA FINAL ════════════════════════════════════ */}
      <section className="theme-night halo relative overflow-hidden border-b border-line">
        <Container size="wide" className="relative py-20 text-center">
          <MotivoSemilla className="mx-auto mb-6 w-28 sm:w-36" label="Ilustración: la semilla de SEP se ramifica en una red." ciclo={8} />
          <h2 className="mx-auto max-w-3xl font-display text-h1 font-semibold text-white sm:text-display">
            ¿Listos para sembrar el cambio?
          </h2>
          <p className="mx-auto mt-5 max-w-md text-body-lg text-white/70">
            Crea tu cuenta y empieza tu primer curso esta semana.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/registro" variant="neon" size="lg" prefetch>
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
          __html: serializeJsonLd({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "EducationalOrganization",
                "@id": `${siteConfig.url}/#organization`,
                name: siteConfig.name,
                alternateName: [siteConfig.shortName, "Semillero de Emprendedores del Perú"],
                url: siteConfig.url,
                logo: {
                  "@type": "ImageObject",
                  url: `${siteConfig.url}/img/new_images/logo_original.png`,
                },
                email: siteConfig.contact.email,
                telephone: siteConfig.contact.whatsapp,
                foundingDate: siteConfig.founded,
                foundingLocation: {
                  "@type": "Place",
                  name: siteConfig.foundedPlace,
                },
                description: siteConfig.seo.description,
                areaServed: { "@type": "Country", name: "Perú" },
                address: {
                  "@type": "PostalAddress",
                  addressRegion: "Áncash",
                  addressCountry: "PE",
                },
                contactPoint: {
                  "@type": "ContactPoint",
                  contactType: "información y programas",
                  email: siteConfig.contact.email,
                  telephone: siteConfig.contact.whatsapp,
                  availableLanguage: "Spanish",
                },
                sameAs: Object.values(siteConfig.social),
              },
              {
                "@type": "WebSite",
                "@id": `${siteConfig.url}/#website`,
                url: siteConfig.url,
                name: siteConfig.name,
                alternateName: siteConfig.shortName,
                inLanguage: "es-PE",
                publisher: { "@id": `${siteConfig.url}/#organization` },
              },
            ],
          }),
        }}
      />
    </>
  );
}

/* ── Secciones con datos: cada una espera solo su consulta (streaming) ── */

async function LatestNews() {
  const posts = await getPublishedPosts();
  const latestPosts = posts.slice(0, 3);
  const newsFallbacks = [SEP_PHOTOS.community, SEP_PHOTOS.methodology, SEP_PHOTOS.workshop];
  return (
    <>
      {latestPosts.length > 0 && (
        <Section id="actualidad">
          <Container size="wide">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <SectionHeader
                eyebrow="Actualidad"
                title="Lo último en SEP"
                description="Noticias, aprendizajes y actividades recientes de nuestra comunidad."
              />
              <Button href="/blog" variant="outline" prefetch>
                Ver todas las noticias
                <ArrowRight className="size-4" />
              </Button>
            </div>

            <div className="mt-9">
              <NewsCard
                post={latestPosts[0]}
                fallbackImage={newsFallbacks[0]}
                variant="featured"
              />
            </div>

            {latestPosts.length > 1 && (
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {latestPosts.slice(1).map((post, index) => (
                  <NewsCard
                    key={post.id}
                    post={post}
                    fallbackImage={newsFallbacks[index + 1]}
                  />
                ))}
              </div>
            )}
          </Container>
        </Section>
      )}

    </>
  );
}

async function CoursesSection() {
  const catalog = await getCatalog();
  const courses = catalog.filter((c) => c.category !== "SILP").slice(0, 4);
  return (
    <>
      <Section>
        <Container size="wide">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeader
              eyebrow="Catálogo"
              title="Formación práctica para empezar"
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
                <CourseMedia
                  slug={course.slug}
                  title={course.title}
                  category={course.category}
                  coverUrl={course.cover_url}
                  className="aspect-[16/9] w-full"
                />

                <div className="mt-4 flex flex-1 flex-col px-1 pb-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {course.status === "disponible" ? (
                      <Badge tone="success">Disponible</Badge>
                    ) : (
                      <Badge tone="neutral">Pronto</Badge>
                    )}
                    {course.audience === "docente" && <Badge tone="neon">Docentes</Badge>}
                  </div>

                  <h3 className="mt-3 font-display text-body font-semibold leading-snug text-ink">
                    {course.title}
                  </h3>
                  <p className="mt-1.5 flex-1 text-body-sm leading-relaxed text-slate-ui">
                    {course.subtitle}
                  </p>

                  <p className="mt-4 flex items-center justify-between border-t border-line pt-3 text-body-sm">
                    <span className="font-medium text-turquesa-800">
                      {course.is_free ? "Acceso sin costo" : formatSoles(course.price_cents)}
                    </span>
                    <span className="text-caption text-slate-ui">
                      {course.total_hours} h · {course.sessions_count} sesiones
                    </span>
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

    </>
  );
}

function CoursesFallback() {
  return (
    <Section aria-busy>
      <Container size="wide">
        <Skeleton className="h-8 w-72 max-w-full" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-md border border-line bg-surface-0 p-3">
              <Skeleton className="aspect-[16/10] h-auto rounded-sm" />
              <Skeleton className="mt-4 h-4 w-3/4" />
              <Skeleton className="mt-2 h-3 w-1/2" />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
