import { createPageMetadata, serializeJsonLd } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, Clock, Sprout } from "lucide-react";
import { getCatalog } from "@/server/queries/courses";
import { CourseMedia } from "@/components/marketing/course-media";
import {
  Badge,
  Card,
  Container,
  EmptyState,
  Section,
  SectionHeader,
} from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { COURSE_FORMAT } from "@/config/courses";
import { cn, formatSoles } from "@/lib/utils";
import { CertificateOptions } from "@/components/marketing/certificate-options";
import { siteConfig } from "@/config/site";
import { RealPhoto, SEP_PHOTOS } from "@/components/marketing/real-photo";

export const metadata = createPageMetadata({
  title: "Cursos de emprendimiento y liderazgo",
  description:
    "Cursos y programas de Design Thinking, Scrum, liderazgo regional y metodologías activas para docentes. Revisa la modalidad, disponibilidad y condiciones de cada propuesta.",
  path: "/cursos",
  keywords: ["cursos de emprendimiento", "Design Thinking Perú", "Scrum Perú"],
});

export const dynamic = "force-dynamic";

/** ISR: la página se sirve estática y se regenera cada 5 min. */

export default async function CursosPage() {
  const courses = await getCatalog();

  return (
    <>
      <section className="theme-night halo relative overflow-hidden">
        <Container size="wide" className="py-10 md:py-14 lg:py-16">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.86fr] lg:gap-12">
          <div className="max-w-2xl">
            <Badge tone="success">Catálogo abierto</Badge>
            <h1 className="mt-4 font-display text-h1 font-semibold text-ink lg:text-hero">
              Cursos para convertir ideas en acción
            </h1>
            <p className="mt-4 max-w-prose text-body-lg text-slate-ui">
              Metodologías ágiles y liderazgo llevados al terreno de la innovación social.
              Encuentra opciones abiertas a distintas regiones y etapas de aprendizaje.
            </p>
          </div>

          <RealPhoto
            src={SEP_PHOTOS.communityTeam}
            alt="Comunidad juvenil reunida durante una actividad de formación"
            label="Formación dentro y fuera del aula"
            className="hidden aspect-[16/10] min-h-0 lg:block"
            imageClassName="object-[50%_46%]"
          />
          </div>

          {/* Formato común a todos los cursos (antes parecía la ficha de uno solo). */}
          <div className="mt-9 rounded-md border border-line bg-surface-0 p-5 sm:p-6">
            <p className="text-body-sm font-medium text-acento">Así es cada curso</p>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-4">
              {[
                { label: "Duración", value: `${COURSE_FORMAT.weeks} semanas · ${COURSE_FORMAT.totalHours} horas`, icon: CalendarDays },
                { label: "Ritmo", value: COURSE_FORMAT.frequency, icon: Clock },
                { label: "Sesiones en vivo", value: `${COURSE_FORMAT.sessionsCount} de ${COURSE_FORMAT.sessionMinutes} minutos`, icon: BookOpen },
                { label: "Costo", value: "Acceso gratuito; el certificado es opcional", icon: Sprout },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="relative pl-8">
                  <Icon className="absolute left-0 top-0.5 size-5 text-cian-500" strokeWidth={1.75} aria-hidden />
                  <dt className="text-caption text-slate-ui">{label}</dt>
                  <dd className="mt-0.5 text-body-sm font-medium text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      <Section>
        <Container size="wide">
          <SectionHeader
            eyebrow="Catálogo"
            title="Cursos de emprendimiento y liderazgo"
            description={`${courses.length} ${courses.length === 1 ? "opción" : "opciones"} entre cursos y programas.`}
          />

          {courses.length === 0 ? (
            <div className="mt-10">
              <EmptyState
                icon={<BookOpen aria-hidden className="size-5" />}
                title="Aún no hay cursos publicados"
                description="Estamos preparando la próxima convocatoria. Crea tu cuenta y te avisaremos cuando abra."
                action={
                  <Button href="/registro" variant="outline">
                    Crear cuenta
                  </Button>
                }
              />
            </div>
          ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...courses]
              .sort((a, b) => Number(b.status === "disponible") - Number(a.status === "disponible"))
              .map((c, index) => {
              const available = c.status === "disponible";
              // El primer curso disponible se destaca: ocupa dos columnas con la foto al lado.
              const destacado = available && index === 0;
              return (
                <Card
                  key={c.id}
                  interactive
                  className={cn(
                    "group flex flex-col overflow-hidden p-4",
                    destacado && "sm:col-span-2 lg:grid lg:grid-cols-[1.15fr_1fr] lg:gap-6",
                    !available && "opacity-90",
                  )}
                  as={Link}
                  {...{ href: `/cursos/${c.slug}`, prefetch: true }}
                >
                  <CourseMedia
                    slug={c.slug}
                    title={c.title}
                    category={c.category}
                    coverUrl={c.cover_url}
                    className={cn(
                      "mb-4 aspect-[16/9] w-full transition-transform duration-300 group-hover:scale-[1.015]",
                      destacado && "lg:mb-0 lg:aspect-auto lg:h-full lg:min-h-72",
                    )}
                  />
                  <div className="flex flex-1 flex-col">
                  <div className="flex flex-wrap items-center gap-1.5 px-1">
                    {available ? (
                      <Badge tone="success">Disponible</Badge>
                    ) : (
                      <Badge tone="neutral">Próximamente</Badge>
                    )}
                    {c.audience === "docente" && <Badge tone="neon">Docentes</Badge>}
                    {c.category === "SILP" && <Badge tone="neon">Insignia</Badge>}
                  </div>

                  <div className="flex flex-1 flex-col px-1">
                  <h3 className={cn("mt-4 font-display font-semibold leading-snug text-ink", destacado ? "text-h3" : "text-body-lg")}>
                    {c.title}
                  </h3>
                  <p className="mt-2 flex-1 text-body-sm leading-relaxed text-slate-ui">
                    {c.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-line pt-4 text-caption text-slate-ui">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock aria-hidden className="size-icon-sm text-mist" />
                      {c.total_hours} h
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays aria-hidden className="size-icon-sm text-mist" />
                      {c.sessions_count} sesiones
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Sprout aria-hidden className="size-icon-sm text-mist" />
                      {c.weeks} sem.
                    </span>
                  </div>

                  <p className="mt-4 flex items-center justify-between text-body-sm">
                    <span className="font-medium text-turquesa-800">
                      {c.is_free ? "Gratuito" : formatSoles(c.price_cents)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-acento">
                      Ver detalle
                      <ArrowRight aria-hidden className="size-icon-sm" />
                    </span>
                  </p>
                  </div>
                  </div>
                </Card>
              );
            })}
          </div>
          )}
        </Container>
      </Section>

      {/* Clases 100 % virtuales: fotos reales de sesiones por Zoom */}
      <Section>
        <Container size="wide">
          <SectionHeader
            eyebrow="100 % virtual"
            title="Clases en vivo, desde cualquier región"
            description="Las sesiones son por videollamada: te conectas desde tu ciudad y trabajas en equipo con jóvenes de otras regiones."
          />
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              { src: SEP_PHOTOS.virtualSession, alt: "Sesión virtual de SEP con participantes conectados por videollamada", label: "Sesión en vivo" },
              { src: SEP_PHOTOS.virtualTeams, alt: "Participantes de distintas regiones en una clase virtual de SEP", label: "Equipos de varias regiones" },
              { src: SEP_PHOTOS.virtualClass, alt: "Diapositiva de una clase virtual sobre cómo validar una idea con un producto mínimo viable", label: "Contenido práctico" },
            ].map((f, i) => (
              <div key={f.src} data-reveal style={{ transitionDelay: `${i * 60}ms` }}>
                <RealPhoto src={f.src} alt={f.alt} label={f.label} className="aspect-[16/10] min-h-0" sizes="(min-width: 640px) 33vw, 100vw" />
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="muted">
        <Container size="wide">
          <SectionHeader
            eyebrow="Certificación"
            title="En los cursos gratuitos, el certificado es opcional."
            description="Al completar las sesiones puedes acreditar tu aprendizaje según las condiciones de cada curso."
            align="center"
          />

          <CertificateOptions className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2" />

          <div className="mt-8 text-center">
            <Button href="/registro" variant="primary" size="lg">
              Crear cuenta y empezar
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </Container>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: courses.map((c, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "Course",
                name: c.title,
                description: c.description,
                url: `${siteConfig.url}/cursos/${c.slug}`,
                provider: {
                  "@type": "EducationalOrganization",
                  name: siteConfig.name,
                  sameAs: siteConfig.url,
                },
                isAccessibleForFree: c.is_free,
              },
            })),
          }),
        }}
      />
    </>
  );
}
