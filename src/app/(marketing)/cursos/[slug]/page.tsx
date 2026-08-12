import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CalendarDays,
  Check,
  Clock,
  Repeat,
  Video,
} from "lucide-react";
import { createPublicClient } from "@/lib/supabase/public";
import { getCatalog, getCourseBySlug } from "@/server/queries/courses";
import { Badge, Card, Container, Section } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { CourseMedia } from "@/components/marketing/course-media";
import { formatSoles } from "@/lib/utils";
import { siteConfig } from "@/config/site";

/** ISR: se regenera cada 5 min en lugar de consultar la BD en cada visita. */
export const revalidate = 300;

/** Prerrenderiza una página por curso en el build; las nuevas se generan al vuelo. */
export async function generateStaticParams() {
  const courses = await getCatalog();
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "Curso no encontrado" };

  return {
    title: course.title,
    description: course.description ?? undefined,
    alternates: { canonical: `/cursos/${slug}` },
  };
}

export default async function CursoPublicoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const supabase = createPublicClient();
  const { data: sessions } = await supabase
    .from("course_sessions")
    .select("id, number, week, title, subtitle, description")
    .eq("course_id", course.id)
    .order("number");

  const weeks = [...new Set((sessions ?? []).map((s) => s.week))].sort();
  const available = course.status === "disponible";

  return (
    <>
      <section className="border-b border-line bg-surface-1">
        <Container size="wide" className="py-14">
          <Link
            href="/cursos"
            className="inline-flex items-center gap-1.5 text-sm text-slate-ui transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-4" />
            Todos los cursos
          </Link>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {available ? (
                  <Badge tone="seed">Disponible</Badge>
                ) : (
                  <Badge tone="neutral">Próximamente</Badge>
                )}
                {course.category && <Badge tone="neutral">{course.category}</Badge>}
                {course.is_free && <Badge tone="gold">Gratuito</Badge>}
              </div>

              <h1 className="mt-4 font-display text-[2.25rem] font-bold leading-[1.1] text-ink sm:text-[2.75rem]">
                {course.title}
              </h1>
              {course.subtitle && (
                <p className="mt-2 text-lg text-slate-ui">{course.subtitle}</p>
              )}
              {course.description && (
                <p className="mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-graphite">
                  {course.description}
                </p>
              )}

              <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-ui">
                <span className="inline-flex items-center gap-2">
                  <Clock className="size-4 text-mist" />
                  {course.total_hours} horas totales
                </span>
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="size-4 text-mist" />
                  {course.sessions_count} sesiones de 2 h
                </span>
                <span className="inline-flex items-center gap-2">
                  <Repeat className="size-4 text-mist" />
                  {course.frequency}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Video className="size-4 text-mist" />
                  100 % virtual
                </span>
              </dl>
            </div>

            <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <CourseMedia
                slug={course.slug}
                title={course.title}
                category={course.category}
                coverUrl={course.cover_url}
                priority
                className="aspect-[16/10] w-full"
              />
              <Card>
                <p className="tabular font-display text-[2.25rem] font-bold leading-none text-ink">
                  {course.is_free ? "Gratis" : formatSoles(course.price_cents)}
                </p>
                <p className="mt-1.5 text-sm text-slate-ui">
                  {course.is_free
                    ? "Acceso completo sin costo"
                    : "Tarifa social para la red SEP"}
                </p>

                <ul className="mt-5 space-y-2.5 border-y border-line py-5">
                  {[
                    "Sesiones en vivo con facilitadores",
                    "Materiales y plantillas descargables",
                    "Acceso a la comunidad SEP",
                    "Certificado opcional desde S/30",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-graphite">
                      <Check className="mt-0.5 size-4 shrink-0 text-seed-500" />
                      {f}
                    </li>
                  ))}
                </ul>

              <Button
                href="/registro"
                variant={available ? "gradient" : "outline"}
                className="mt-5 w-full"
              >
                  {available
                    ? course.is_free
                      ? "Inscribirme gratis"
                      : "Crear cuenta y continuar"
                    : "Avísenme cuando abra"}
                  <ArrowRight className="size-4" />
                </Button>

                <p className="mt-3 text-center text-xs text-mist">
                  Necesitas una cuenta gratuita de SEP.
                </p>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {(sessions?.length ?? 0) > 0 && (
        <Section>
          <Container size="wide">
            <h2 className="font-display text-[1.75rem] font-semibold text-ink">
              Qué vas a aprender
            </h2>

            <div className="mt-8 space-y-6">
              {weeks.map((week) => (
                <div key={week}>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-gold-600">
                    Semana {week}
                  </p>
                  <ul className="divide-y divide-line overflow-hidden rounded-[14px] border border-line bg-white">
                    {(sessions ?? [])
                      .filter((s) => s.week === week)
                      .map((s) => (
                        <li key={s.id} className="flex gap-4 p-5">
                          <span className="tabular flex size-8 shrink-0 items-center justify-center rounded-full bg-sep-50 text-xs font-semibold text-sep-600">
                            {s.number}
                          </span>
                          <div>
                            <p className="font-display text-[0.9375rem] font-semibold text-ink">
                              {s.title}
                            </p>
                            {s.subtitle && (
                              <p className="mt-0.5 text-xs text-slate-ui">{s.subtitle}</p>
                            )}
                            {s.description && (
                              <p className="mt-2 text-sm leading-relaxed text-graphite">
                                {s.description}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section tone="muted" className="py-14">
        <Container size="narrow">
          <Card className="text-center">
            <Award className="mx-auto size-8 text-gold-600" />
            <h2 className="mt-4 font-display text-[1.5rem] font-semibold text-ink">
              Al terminar, acredítalo
            </h2>
            <p className="mx-auto mt-2.5 max-w-md text-[0.9375rem] leading-relaxed text-slate-ui">
              Certificado SEP por {formatSoles(3000)} o certificado con aval del Instituto
              Internacional de Ingeniería por {formatSoles(5000)}. Ambos con código público
              de verificación.
            </p>
            <Button href="/precios" variant="outline" className="mt-6">
              Ver todos los precios
            </Button>
          </Card>
        </Container>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            name: course.title,
            description: course.description,
            url: `${siteConfig.url}/cursos/${course.slug}`,
            provider: {
              "@type": "EducationalOrganization",
              name: siteConfig.name,
              sameAs: siteConfig.url,
            },
            isAccessibleForFree: course.is_free,
            inLanguage: "es-PE",
            timeRequired: `PT${course.total_hours}H`,
          }),
        }}
      />
    </>
  );
}
