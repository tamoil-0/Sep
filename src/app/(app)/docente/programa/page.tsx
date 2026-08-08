import type { Metadata } from "next";
import { BookOpen, Clock } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { getCourseWithProgress } from "@/server/queries/courses";
import { PageHeader } from "@/components/app/page-header";
import { Badge, Card, EmptyState, ProgressBar } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { PanelSection } from "@/components/app/data-views";

export const metadata: Metadata = { title: "Mi programa" };

const SLUG = "metodologias-agiles-en-el-aula";

export default async function DocenteProgramaPage() {
  const user = await requireRole(["docente", "admin", "super_admin"]);
  const data = await getCourseWithProgress(SLUG, user.id);

  if (!data) {
    return (
      <>
        <PageHeader title="Mi programa" />
        <EmptyState icon={<BookOpen className="size-5" />} title="El programa aún no está cargado" />
      </>
    );
  }

  const { course, enrollment, sessions } = data;

  return (
    <>
      <PageHeader
        title={course.title}
        description={course.description ?? undefined}
        action={
          enrollment ? undefined : (
            <Button href={`/cursos/${SLUG}`} variant="outline">Ver detalle público</Button>
          )
        }
      />

      <Card>
        <div className="flex flex-wrap items-center gap-2">
          {course.status === "disponible" ? (
            <Badge tone="seed">Disponible</Badge>
          ) : (
            <Badge tone="neutral">Próximamente</Badge>
          )}
          <Badge tone="gold">Para docentes</Badge>
          <Badge tone="neutral">{course.total_hours} horas</Badge>
        </div>

        {enrollment ? (
          <>
            <div className="mt-5 flex items-center justify-between text-sm">
              <span className="font-medium text-ink">Tu progreso</span>
              <span className="tabular text-slate-ui">{enrollment.progress_pct}%</span>
            </div>
            <ProgressBar value={enrollment.progress_pct} className="mt-2.5" />
          </>
        ) : (
          <p className="mt-5 text-[0.9375rem] leading-relaxed text-slate-ui">
            Cuando abramos la próxima cohorte te avisaremos por correo. Mientras tanto,
            los recursos de aula ya están disponibles.
          </p>
        )}
      </Card>

      <PanelSection title="Contenido del programa">
        {sessions.length === 0 ? (
          <EmptyState
            icon={<Clock className="size-5" />}
            title="La malla se publica al abrir la cohorte"
            description="Serán 6 sesiones de 2 horas, interdiario, 100 % virtuales."
          />
        ) : (
          <Card className="p-0">
            <ul className="divide-y divide-line">
              {sessions.map((s) => (
                <li key={s.id} className="flex gap-4 p-5">
                  <span className="tabular flex size-8 shrink-0 items-center justify-center rounded-full bg-sep-50 text-xs font-semibold text-sep-600">
                    {s.number}
                  </span>
                  <div>
                    <p className="font-display text-[0.9375rem] font-semibold text-ink">{s.title}</p>
                    {s.subtitle && <p className="mt-0.5 text-xs text-slate-ui">{s.subtitle}</p>}
                    {s.description && (
                      <p className="mt-2 text-sm leading-relaxed text-graphite">{s.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </PanelSection>
    </>
  );
}

