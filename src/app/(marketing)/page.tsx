import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  GraduationCap,
  HeartHandshake,
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
  GoldUnderline,
  Section,
  SectionHeader,
} from "@/components/ui/primitives";
import { DotGrid, ImpactChainIllustration, StatBlock } from "@/components/brand/illustrations";
import { CountUp } from "@/components/marketing/count-up";
import { CourseMedia } from "@/components/marketing/course-media";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { NewsCard } from "@/components/marketing/news-card";
import { NewsletterForm } from "@/components/marketing/newsletter-form";
import {
  ExperienceGallery,
  HeroPhoto,
  MediaImage,
  SEP_PHOTOS,
} from "@/components/marketing/real-photo";
import { OrganizationLockup } from "@/components/brand/logo";
import { faqs, impactStats, partners, siteConfig } from "@/config/site";
import { getCatalog } from "@/server/queries/courses";
import { getPublishedPosts } from "@/server/queries/public-content";
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

export default async function HomePage() {
  const [catalog, posts] = await Promise.all([getCatalog(), getPublishedPosts()]);
  const courses = catalog.filter((c) => c.category !== "SILP").slice(0, 4);
  const latestPosts = posts.slice(0, 3);
  const newsFallbacks = [SEP_PHOTOS.community, SEP_PHOTOS.methodology, SEP_PHOTOS.workshop];

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
          <div className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:py-20">
            <div className="max-w-2xl">
              <OrganizationLockup variant="white" />

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-gold-500 sm:text-sm">
                Emprendimiento y liderazgo juvenil desde las regiones del Perú
              </p>

              <h1 className="mt-4 font-display text-[2.35rem] font-bold leading-[1.06] tracking-[-0.035em] text-white sm:text-[3.35rem] lg:text-[3.65rem]">
                Ideas jóvenes que se convierten en
                <span className="text-gold-500"> proyectos con impacto.</span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/78 sm:text-lg">
                Formamos a jóvenes y universitarios con herramientas prácticas, y conectamos
                ese talento con escolares, docentes y comunidades de todo el Perú.
              </p>

              <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Button href="/apoya-hoy" variant="gold" size="lg" prefetch>
                  <HeartHandshake className="size-5" />
                  Apoya hoy
                  <ArrowRight className="size-4" />
                </Button>
                <Button href="/nosotros" variant="outline-white" size="lg" prefetch>
                  Conoce SEP
                </Button>
              </div>

              <div className="mt-7 flex max-w-xl items-start gap-3 rounded-[14px] border border-white/20 bg-white/10 px-4 py-3 text-left backdrop-blur-sm sm:items-center sm:px-5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-sep-700">
                  <BadgeCheck className="size-4" />
                </span>
                <p className="text-sm leading-relaxed text-white/80">
                  Organización juvenil reconocida por la
                  <strong className="font-semibold text-white">
                    {" "}Secretaría Nacional de la Juventud (SENAJU)
                  </strong>
                  .
                </p>
              </div>
            </div>

            <HeroPhoto />
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

      {/* ═══ 3 · ACTUALIDAD — solo aparece cuando hay contenido publicado ═ */}
      {latestPosts.length > 0 && (
        <Section id="actualidad" className="py-14 sm:py-20">
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
                priority
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
              <Card key={audience.title} interactive className="flex h-full flex-col p-6">
                <span className="flex size-11 items-center justify-center rounded-[12px] bg-sep-50 text-sep-700">
                  <audience.icon className="size-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-ink">
                  {audience.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-ui">
                  {audience.body}
                </p>
                <Link
                  href={audience.href}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-sep-600 hover:text-sep-800 hover:underline"
                >
                  {audience.cta}
                  <ArrowRight className="size-3.5" />
                </Link>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* ═══ 5 · EL PROBLEMA ══════════════════════════════════════════════ */}
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
                    <span className="font-medium text-seed-700">
                      {course.is_free ? "Acceso sin costo" : formatSoles(course.price_cents)}
                    </span>
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
                issuer: "Semillero de Emprendedores Perú",
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
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-ui">
                Vínculos registrados por SEP
              </p>
              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {partners.map((partner) => (
                  <li
                    key={partner.name}
                    className="flex min-w-0 items-center justify-between gap-3 rounded-[10px] border border-line bg-surface-1 px-3.5 py-3"
                  >
                    <span className="min-w-0 text-sm font-medium text-graphite">
                      {partner.name}
                    </span>
                    <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[0.6875rem] font-medium text-sep-700 ring-1 ring-inset ring-sep-100">
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
              <Card id="newsletter" className="scroll-mt-24 lg:sticky lg:top-24">
                <h2 className="font-display text-[1.25rem] font-semibold text-ink">
                  Newsletter SEP
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-ui">
                  Convocatorias, becas, actividades y novedades de la comunidad SEP.
                </p>
                <div className="mt-5">
                  <NewsletterForm />
                </div>
                <p className="mt-4 text-xs text-mist">
                  Puedes darte de baja cuando quieras.
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
