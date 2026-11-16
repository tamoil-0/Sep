import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, Clock } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { getCatalog, getMyEnrollments } from "@/server/queries/courses";
import { PageHeader } from "@/components/app/page-header";
import { Badge, Card, EmptyState, ProgressBar } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Mis cursos" };

export default async function MisCursosPage() {
  const user = await requireRole(["estudiante", "mentor", "admin", "super_admin"]);
  const [enrollments, catalog] = await Promise.all([getMyEnrollments(user.id), getCatalog()]);
  // Cursos que se pueden empezar ya: disponibles, primero los gratuitos.
  const startable = catalog
    .filter((c) => c.status === "disponible")
    .sort((a, b) => Number(b.is_free) - Number(a.is_free))
    .slice(0, 4);

  const active = enrollments.filter((e) => e.status === "activo");
  const completed = enrollments.filter((e) => e.status === "completado");

  return (
    <>
      <PageHeader
        title="Mis cursos"
        description="Todo lo que estás aprendiendo en SEP, en un solo lugar."
        action={
          <Button href="/estudiante/catalogo" variant="outline">
            Explorar catálogo
            <ArrowRight className="size-4" />
          </Button>
        }
      />

      {enrollments.length === 0 ? (
        <>
          {/* Vacío con dirección: los cursos que puede empezar hoy, a un clic. */}
          <EmptyState
            icon={<BookOpen className="size-5" />}
            title="Aún no te inscribes en ningún curso"
            description="Aquí verás los cursos en los que te inscribas, con tu avance. Empieza por uno de estos: son gratuitos."
          />
          {startable.length > 0 && (
            <section className="mt-6" aria-labelledby="empezar-titulo">
              <h2 id="empezar-titulo" className="mb-3 font-display text-h4 font-semibold text-ink">
                Puedes empezar hoy
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {startable.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/estudiante/curso/${c.slug}`}
                      className="tarjeta-viva group flex h-full items-center gap-4 rounded-md p-4"
                    >
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-violeta-600 text-white">
                        <BookOpen className="size-5" strokeWidth={1.75} aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium text-ink">{c.title}</span>
                        <span className="block text-caption text-slate-ui">
                          {c.total_hours} h · {c.sessions_count} sesiones · {c.is_free ? "Gratuito" : "Con costo"}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-1 text-body-sm font-medium text-acento">
                        Empezar
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-body-sm text-slate-ui">
                ¿Buscas otro tema?{" "}
                <Link href="/estudiante/catalogo" className="font-medium text-acento underline underline-offset-4">
                  Ver todo el catálogo
                </Link>
              </p>
            </section>
          )}
        </>
      ) : (
        <>
          {active.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-3.5 text-body-sm font-semibold tracking-eyebrow text-slate-ui">
                En progreso
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                {active.map((e) => {
                  const done = Math.round(
                    ((e.progress_pct ?? 0) / 100) * (e.course?.sessions_count ?? 6),
                  );
                  return (
                    <Card
                      key={e.id}
                      interactive
                      className="p-5"
                      as={Link}
                      {...{ href: `/estudiante/curso/${e.course?.slug}` }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Badge tone="brand">En progreso</Badge>
                          <h3 className="mt-2.5 truncate text-body leading-snug font-semibold text-ink">
                            {e.course?.title}
                          </h3>
                          <p className="mt-0.5 truncate text-body-sm text-slate-ui">
                            {e.course?.subtitle}
                          </p>
                        </div>
                        <span className="tabular shrink-0 text-body-lg font-semibold text-acento">
                          {e.progress_pct}%
                        </span>
                      </div>

                      <ProgressBar value={e.progress_pct} className="mt-4" />

                      <p className="mt-2.5 flex items-center gap-1.5 text-caption text-slate-ui">
                        <Clock className="size-3.5 text-mist" />
                        {done} de {e.course?.sessions_count} sesiones completadas
                      </p>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          {completed.length > 0 && (
            <section>
              <h2 className="mb-3.5 text-body-sm font-semibold tracking-eyebrow text-slate-ui">
                Completados
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                {completed.map((e) => (
                  <Card key={e.id} className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Badge tone="success">
                          <Check className="size-3.5" />
                          Completado
                        </Badge>
                        <h3 className="mt-2.5 truncate text-body leading-snug font-semibold text-ink">
                          {e.course?.title}
                        </h3>
                        <p className="mt-0.5 text-caption text-slate-ui">
                          {e.completed_at
                            ? `Terminado el ${formatDate(e.completed_at)}`
                            : ""}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        href="/estudiante/certificados"
                        variant="primary"
                        size="sm"
                      >
                        Obtener certificado
                      </Button>
                      <Button
                        href={`/estudiante/curso/${e.course?.slug}`}
                        variant="ghost"
                        size="sm"
                      >
                        Revisar contenido
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
