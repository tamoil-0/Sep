import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRight,
  Building2,
  GraduationCap,
  Presentation,
  School,
  Sprout,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Badge,
  Card,
  Container,
  AccentUnderline,
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

export default function HomePage() {

  return (
    <>
      {/* ═══ 1 · HERO ═══════════════════════════════════════ */}
      <section className="theme-night halo relative overflow-hidden">
        <Container size="wide" className="relative">
          <div className="grid items-center gap-10 pb-12 pt-12 sm:pt-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14 lg:pb-16 lg:pt-20">
            <div className="max-w-2xl">
              <MotivoSemilla className="-ml-3 mb-2 w-20 lg:hidden" ciclo={8} />
              <Eyebrow className="text-cian-500">Desde las regiones del Perú</Eyebrow>

              <h1 className="mt-5 font-display text-h1 font-semibold text-ink sm:text-display">
                Ideas jóvenes que se convierten en proyectos con impacto.
              </h1>

              <p className="mt-6 max-w-xl text-body-lg text-slate-ui">
                Cursos gratuitos de Design Thinking, Scrum y liderazgo, 100 % virtuales. Te formas, y
                luego llevas lo aprendido a los colegios de tu propia región.
              </p>

              <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Button href="/registro" variant="neon" size="lg" prefetch>
                  Crea tu cuenta gratis <ArrowRight aria-hidden />
                </Button>
                <Button href="/nosotros" variant="outline-white" size="lg" prefetch>
                  Conoce SEP
                </Button>
              </div>
              <p className="mt-5 text-body-sm text-slate-ui">
                ¿Quieres sostener esta red?{" "}
                <Link href="/donaciones" className="enlace-trazo font-medium text-ink">
                  Apoya a SEP con una donación
                </Link>
              </p>
            </div>

            <HeroPhoto />
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
          <SectionHeader
            eyebrow="Una comunidad, distintas rutas"
            title="¿Para quién es SEP?"
            description="Impulsamos el emprendimiento desde la etapa escolar hasta la universidad y articulamos a quienes hacen posible ese recorrido."
            align="center"
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: GraduationCap,
                title: "Jóvenes y universitarios",
                body: "Cursos, mentoría, voluntariado y programas para convertir una idea en un proyecto de impacto.",
                cta: "Explorar cursos",
                href: "/cursos",
              },
              {
                icon: School,
                title: "Escolares",
                body: "Talleres prácticos de innovación social que llegan a sus aulas a través de la red de colegios SEP.",
                cta: "Conocer la red",
                href: "/colegios",
              },
              {
                icon: Presentation,
                title: "Docentes y colegios",
                body: "Formación, recursos y facilitadores de su propia región para fortalecer experiencias de aprendizaje.",
                cta: "Ver programa docente",
                href: "/docentes",
              },
              {
                icon: Building2,
                title: "Empresas y aliados",
                body: "Programas de impacto juvenil con alcance regional, alianzas y resultados verificables.",
                cta: "Crear una alianza",
                href: "/empresas",
              },
            ].map((audience) => (
              <Card key={audience.title} interactive className="relative flex h-full flex-col p-6">
                <span className="flex size-11 items-center justify-center rounded-md bg-violeta-50 text-acento">
                  <audience.icon className="size-5" />
                </span>
                <h3 className="mt-5 font-display text-body-lg leading-snug font-semibold text-ink">
                  {audience.title}
                </h3>
                <p className="mt-2 flex-1 text-body-sm leading-relaxed text-slate-ui">
                  {audience.body}
                </p>
                <ArrowLink href={audience.href} stretched className="mt-5">
                  {audience.cta}
                </ArrowLink>
              </Card>
            ))}
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
                Las <AccentUnderline>oportunidades</AccentUnderline> se quedan en Lima.
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

      <Section>
        <Container size="wide">
          <SectionHeader
            eyebrow="Cómo funciona"
            title="Formamos a quien formará a diez más"
            description="Los universitarios que capacitamos vuelven como mentores a los colegios de su propia comunidad."
            align="center"
          />

          {/* Cadena de 4 etapas: es una secuencia real, por eso va numerada.
              La línea con degradado une las etapas en escritorio. */}
          <ol className="relative mx-auto mt-14 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            <div
              aria-hidden
              className="absolute left-[12%] right-[12%] top-7 hidden h-px grad-marca opacity-60 lg:block"
            />
            {[
              { icon: Sparkles, title: "SEP", detail: "Diseña la formación y la abre en línea para todo el país." },
              { icon: GraduationCap, title: "Universitarios", detail: "Aprenden desde cualquier región y se vuelven mentores." },
              { icon: School, title: "Escolares", detail: "Reciben talleres de mentores de su propia comunidad." },
              { icon: Sprout, title: "Impacto", detail: "Proyectos locales que siguen andando sin depender de Lima." },
            ].map(({ icon: Icon, title, detail }, i) => (
              <li key={title} className="relative flex flex-col items-start lg:items-center lg:text-center">
                <span className="relative flex size-14 items-center justify-center rounded-full border border-violeta-200 bg-surface-0 text-acento shadow-soft">
                  <Icon aria-hidden className="size-6" />
                  <span className="tabular absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-violeta-600 text-caption font-semibold text-white">
                    {i + 1}
                  </span>
                </span>
                <p className="mt-5 font-display text-h4 font-semibold text-ink">{title}</p>
                <p className="mt-2 max-w-60 text-body-sm text-slate-ui">{detail}</p>
              </li>
            ))}
          </ol>
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
                tone: "neon" as const,
              },
              {
                icon: School,
                title: "Inscribe tu colegio",
                body: "Universitarios de tu región dictan talleres a tus estudiantes. Gratis.",
                cta: "Inscribir colegio",
                href: "/colegios",
                tone: "success" as const,
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
              <Card key={c.title} interactive className="relative flex flex-col p-6">
                <span
                  className={`flex size-11 items-center justify-center rounded-md ${
                    c.tone === "neon"
                      ? "bg-noche-900 text-cian-500"
                      : c.tone === "success"
                        ? "bg-turquesa-50 text-turquesa-800"
                        : "bg-violeta-50 text-acento"
                  }`}
                >
                  <c.icon className="size-5" />
                </span>

                <h3 className="mt-5 font-display text-h4 font-semibold text-ink">
                  {c.title}
                </h3>
                <p className="mt-2 flex-1 text-body-sm leading-relaxed text-slate-ui">
                  {c.body}
                </p>

                <ArrowLink href={c.href} prefetch={false} stretched className="mt-5">
                  {c.cta}
                </ArrowLink>
              </Card>
            ))}
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
