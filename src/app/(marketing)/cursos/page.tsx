import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, Sprout } from "lucide-react";
import { getCatalog } from "@/server/queries/courses";
import { CourseCover } from "@/components/brand/illustrations";
import { Badge, Card, Container, Section, SectionHeader } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { COURSE_FORMAT } from "@/config/courses";
import { formatSoles } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { RealPhoto, SEP_PHOTOS } from "@/components/marketing/real-photo";

export const metadata: Metadata = {
  title: "Cursos gratuitos",
  description:
    "Design Thinking, Scrum para proyectos sociales, liderazgo regional y metodologías activas para docentes. 8 horas, 6 sesiones en vivo, 100 % virtual y gratuito.",
};

/** ISR: la página se sirve estática y se regenera cada 5 min. */
export const revalidate = 300;

export default async function CursosPage() {
  const courses = await getCatalog();

  return (
    <>
      <section className="border-b border-line bg-surface-1">
        <Container size="wide" className="py-16 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.86fr]">
          <div className="max-w-2xl">
            <Badge tone="seed">Catálogo abierto</Badge>
            <h1 className="mt-5 font-display text-[2.5rem] font-bold leading-[1.1] text-ink sm:text-[3.25rem]">
              Cursos gratuitos, siempre
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-ui">
              Metodologías ágiles y liderazgo llevados al terreno de la innovación social.
              Sin costo de acceso, sin importar tu región ni tu carrera.
            </p>
          </div>

          <RealPhoto
            src={SEP_PHOTOS.virtual}
            alt="Participantes de distintas regiones conectados a una formación virtual de SEP"
            priority
            label="Aula virtual SEP"
            className="aspect-[16/10] min-h-0"
          />
          </div>

          <dl className="mt-10 grid gap-6 rounded-[16px] border border-line bg-white p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
            {[
              ["Duración", `${COURSE_FORMAT.weeks} semanas`],
              ["Frecuencia", COURSE_FORMAT.frequency],
              ["Sesiones", `${COURSE_FORMAT.sessionsCount} de 2 horas`],
              ["Modalidad", COURSE_FORMAT.modality],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs uppercase tracking-[0.1em] text-slate-ui">
                  {label}
                </dt>
                <dd className="mt-1.5 text-[0.9375rem] font-medium text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <Section>
        <Container size="wide">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => {
              const available = c.status === "disponible";
              return (
                <Card
                  key={c.id}
                  interactive
                  className="group flex flex-col overflow-hidden border-transparent p-3 shadow-[0_8px_30px_-22px_rgba(18,16,28,.4)] hover:bg-surface-1/40 sm:p-4"
                  as={Link}
                  {...{ href: `/cursos/${c.slug}`, prefetch: true }}
                >
                  <CourseCover
                    pattern={
                      c.category === "SILP"
                        ? "silp"
                        : c.category === "Liderazgo"
                          ? "liderazgo"
                          : c.category === "Para docentes"
                            ? "docentes"
                            : "agiles"
                    }
                    className="mb-4 aspect-[16/9] w-full transition-transform duration-500 group-hover:scale-[1.015]"
                  />
                  <div className="flex flex-wrap items-center gap-1.5 px-1">
                    {available ? (
                      <Badge tone="seed">Disponible</Badge>
                    ) : (
                      <Badge tone="neutral">Próximamente</Badge>
                    )}
                    {c.audience === "docente" && <Badge tone="gold">Docentes</Badge>}
                    {c.category === "SILP" && <Badge tone="gold">Insignia</Badge>}
                  </div>

                  <div className="px-1">
                  <h2 className="mt-4 font-display text-[1.125rem] font-semibold leading-snug text-ink">
                    {c.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-ui">
                    {c.description}
                  </p>

                  <dl className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-line pt-4 text-xs text-slate-ui">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="size-3.5 text-mist" />
                      {c.total_hours} h
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="size-3.5 text-mist" />
                      {c.sessions_count} sesiones
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Sprout className="size-3.5 text-mist" />
                      {c.weeks} sem.
                    </span>
                  </dl>

                  <p className="mt-4 flex items-center justify-between text-sm">
                    <span className="font-medium text-seed-700">
                      {c.is_free ? "Gratuito" : formatSoles(c.price_cents)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sep-600">
                      Ver detalle
                      <ArrowRight className="size-3.5" />
                    </span>
                  </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section tone="muted">
        <Container size="wide">
          <SectionHeader
            eyebrow="Certificación"
            title="El curso es gratis. El certificado, opcional."
            description="Al completar las 6 sesiones puedes acreditar tu aprendizaje. Es lo que sostiene a SEP sin cobrar por la formación."
            align="center"
          />

          <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">
            {[
              { name: "Certificado SEP", price: 3000, issuer: "Semillero de Emprendedores Perú" },
              {
                name: "Certificado Internacional",
                price: 5000,
                issuer: "Instituto Internacional de Ingeniería",
                recommended: true,
              },
            ].map((c) => (
              <Card key={c.name} className="text-center">
                {c.recommended && <Badge tone="gold">Recomendado</Badge>}
                <h3 className="mt-3 font-display text-[1.0625rem] font-semibold text-ink">
                  {c.name}
                </h3>
                <p className="mt-1 text-xs text-slate-ui">{c.issuer}</p>
                <p className="tabular mt-4 font-display text-[2rem] font-bold leading-none sep-gradient-text">
                  {formatSoles(c.price)}
                </p>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button href="/registro" variant="gradient" size="lg">
              Crear cuenta y empezar
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </Container>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
