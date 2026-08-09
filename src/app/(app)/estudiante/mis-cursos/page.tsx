import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, Clock } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { getMyEnrollments } from "@/server/queries/courses";
import { PageHeader } from "@/components/app/page-header";
import { Badge, Card, EmptyState, ProgressBar } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Mis cursos" };

export default async function MisCursosPage() {
  const user = await requireRole(["estudiante", "mentor", "admin", "super_admin"]);
  const enrollments = await getMyEnrollments(user.id);

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
        <EmptyState
          icon={<BookOpen className="size-5" />}
          title="Aún no estás en ningún curso"
          description="Todos los cursos de SEP son gratuitos. Empieza por Design Thinking aplicado: 6 sesiones, 2 semanas."
          action={<Button href="/estudiante/catalogo">Ver el catálogo</Button>}
        />
      ) : (
        <>
          {active.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
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
                          <h3 className="mt-2.5 truncate font-display text-[1.0625rem] font-semibold text-ink">
                            {e.course?.title}
                          </h3>
                          <p className="mt-0.5 truncate text-sm text-slate-ui">
                            {e.course?.subtitle}
                          </p>
                        </div>
                        <span className="tabular shrink-0 font-display text-lg font-semibold text-sep-600">
                          {e.progress_pct}%
                        </span>
                      </div>

                      <ProgressBar value={e.progress_pct} className="mt-4" />

                      <p className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-ui">
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
              <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
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
                        <h3 className="mt-2.5 truncate font-display text-[1.0625rem] font-semibold text-ink">
                          {e.course?.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-ui">
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
