import { createPageMetadata } from "@/lib/seo";
import { Quote } from "lucide-react";
import {
  Badge,
  Card,
  Container,
  Section,
  SectionHeader,
} from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { webinarSurveyStats, webinarTestimonials } from "@/config/testimonials";
import { getPublicProjects } from "@/server/queries/public-content";
import { RealPhoto, SEP_PHOTOS } from "@/components/marketing/real-photo";

export const metadata = createPageMetadata({
  title: "Testimonios",
  description:
    "Opiniones reales de jóvenes de 13 regiones del Perú en los webinars de SEP: 59 respuestas y una experiencia promedio de 4,7 sobre 5.",
  path: "/testimonios",
  keywords: ["jóvenes emprendedores Perú", "historias de emprendimiento", "testimonios SEP"],
});

// Estática con ISR: no lee la petición (cookies ni parámetros) y sus datos son públicos.
export const dynamic = "force-static";
export const revalidate = 300;

const stats = [
  { value: String(webinarSurveyStats.responses), label: `respuestas en ${webinarSurveyStats.webinars} webinars` },
  { value: `${webinarSurveyStats.averageExperience}/5`, label: "experiencia promedio" },
  { value: webinarSurveyStats.recommendShare, label: "recomendaría los webinars de SEP" },
  { value: String(webinarSurveyStats.regions), label: "regiones del Perú entre quienes respondieron" },
];

export default async function TestimoniosPage() {
  const projects = await getPublicProjects();

  return (
    <>
      <section className="theme-night halo relative overflow-hidden">
        <Container size="wide" className="py-14 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <SectionHeader
            as="h1"
            eyebrow="La comunidad"
            title="Lo que dicen quienes ya pasaron por aquí"
            description={`Respuestas textuales de las encuestas de satisfacción de nuestros webinars (${webinarSurveyStats.period}). Publicamos rol, región y sesión; no nombres.`}
          />
          <RealPhoto
            src={SEP_PHOTOS.community}
            alt="Comunidad SEP reunida al terminar una experiencia de aprendizaje"
            priority
            label="La comunidad detrás de las historias"
            className="aspect-[16/10] min-h-0"
            imageClassName="object-[50%_76%]"
          />
          </div>
        </Container>
      </section>

      <Section>
        <Container size="wide">
          {/* Cifras agregadas de las mismas encuestas: prueba social con fuente. */}
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 border-b border-line pb-10 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dd className="tabular font-display text-h2 font-semibold text-ink">{s.value}</dd>
                <dt className="mt-1 text-body-sm text-slate-ui">{s.label}</dt>
              </div>
            ))}
          </dl>

          <h2 className="sr-only">Lo que nos escribieron</h2>
          <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {webinarTestimonials.map((t) => (
              <li key={t.quote} className="min-w-0">
                <figure className="relative flex h-full flex-col overflow-hidden rounded-md border border-line bg-surface-0 p-6">
                  <span aria-hidden className="absolute left-0 top-0 h-full w-1 grad-marca" />
                  <Quote aria-hidden className="size-5 text-violeta-500" strokeWidth={1.75} />
                  <blockquote className="mt-4 flex-1 text-body leading-relaxed text-graphite">
                    «{t.quote}»
                  </blockquote>
                  <figcaption className="mt-6 border-t border-line pt-4">
                    <p className="text-body-sm font-medium text-ink">
                      {t.role} · {t.region}
                    </p>
                    <p className="mt-0.5 text-caption text-mist">
                      Webinar «{t.webinar}» ·{" "}
                      <time dateTime={t.date}>{formatDate(t.date)}</time>
                    </p>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-caption text-mist">
            Citas textuales de la encuesta de satisfacción posterior a cada sesión ({webinarSurveyStats.responses}{" "}
            respuestas, escala de 1 a 5). Solo se corrigieron tildes y mayúsculas.
          </p>
        </Container>
      </Section>

      {projects.length > 0 && (
        <Section tone="muted">
          <Container size="wide">
            <SectionHeader
              eyebrow="Proyectos"
              title="Lo que están construyendo"
              description="Cada uno nació en un curso de SEP y hoy se ejecuta en su propia comunidad."
            />

            <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <li key={p.id} className="min-w-0">
                  <Card className="flex h-full flex-col p-6">
                    {p.region && <Badge tone="brand">{p.region}</Badge>}
                    <h3 className="mt-3.5 font-display text-body leading-snug font-semibold text-ink">
                      {p.title}
                    </h3>
                    {p.problem && (
                      <p className="mt-3 text-caption font-medium tracking-eyebrow text-slate-ui">
                        El problema
                      </p>
                    )}
                    {p.problem && (
                      <p className="mt-1 text-body-sm leading-relaxed text-slate-ui">
                        {p.problem}
                      </p>
                    )}
                    {p.solution && (
                      <>
                        <p className="mt-3 text-caption font-medium tracking-eyebrow text-turquesa-800">
                          La solución
                        </p>
                        <p className="mt-1 flex-1 text-body-sm leading-relaxed text-graphite">
                          {p.solution}
                        </p>
                      </>
                    )}
                  </Card>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <Section className="py-14">
        <Container size="narrow">
          <Card className="text-center">
            <h2 className="font-display text-h3 font-semibold text-ink">
              La próxima historia puede ser la tuya
            </h2>
            <p className="mx-auto mt-2.5 max-w-md text-body-sm text-slate-ui">
              Los cursos son gratuitos y empiezan cada mes. No importa tu región ni tu
              punto de partida.
            </p>
            <Button href="/registro" variant="primary" className="mt-6">
              Crear mi cuenta gratis
            </Button>
          </Card>
        </Container>
      </Section>
    </>
  );
}
