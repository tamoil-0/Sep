import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Award,
  CalendarDays,
  Clock,
  Repeat,
  Video,
} from "lucide-react";
import { BackLink } from "@/components/ui/arrow-link";
import { requireRole } from "@/lib/auth/session";
import { getCourseWithProgress } from "@/server/queries/courses";
import { Badge, Card, ProgressBar } from "@/components/ui/primitives";
import { MotivoSemilla } from "@/components/brand/motivo-semilla";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import { SessionList } from "./session-list";
import { EnrollCta } from "./enroll-cta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const user = await requireRole(["estudiante", "mentor", "admin", "super_admin"]);
  const data = await getCourseWithProgress(slug, user.id);
  return { title: data?.course.title ?? "Curso" };
}

export default async function CursoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await requireRole(["estudiante", "mentor", "admin", "super_admin"]);

  const data = await getCourseWithProgress(slug, user.id);
  if (!data) notFound();

  const { course, enrollment, sessions } = data;
  const doneCount = sessions.filter((s) => s.isCompleted).length;
  const nextSession = sessions.find((s) => !s.isCompleted);
  const weeks = [...new Set(sessions.map((s) => s.week))].sort();

  return (
    <>
      <BackLink href="/estudiante/mis-cursos" className="mb-6">Mis cursos</BackLink>

      {/* Cabecera */}
      <Card className="p-0">
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-2">
            {enrollment ? (
              enrollment.status === "completado" ? (
                <Badge tone="success">Completado</Badge>
              ) : (
                <Badge tone="brand">En progreso · {enrollment.progress_pct}%</Badge>
              )
            ) : (
              <Badge tone="neutral">No inscrito</Badge>
            )}
            {course.category && <Badge tone="neutral">{course.category}</Badge>}
            {course.is_free && <Badge tone="success">Gratuito</Badge>}
          </div>

          <h1 className="mt-3.5 text-h2 font-semibold leading-tight text-ink">
            {course.title}
          </h1>
          {course.subtitle && (
            <p className="mt-1 text-body-sm text-slate-ui">{course.subtitle}</p>
          )}
          {course.description && (
            <p className="mt-3 max-w-2xl text-body-sm leading-relaxed text-graphite">
              {course.description}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-body-sm text-slate-ui">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4 text-mist" />
              {course.total_hours} horas
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4 text-mist" />
              {course.sessions_count} sesiones de {Math.round((course.total_hours * 60) / Math.max(1, course.sessions_count))} min
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Repeat className="size-4 text-mist" />
              {course.frequency}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Video className="size-4 text-mist" />
              100 % virtual
            </span>
          </div>
        </div>

        {enrollment ? (
          <div className="border-t border-line bg-surface-1 px-6 py-5">
            <div className="flex items-center justify-between">
              <p className="text-body-sm font-medium text-ink">Tu progreso</p>
              <p className="tabular text-body-sm text-slate-ui">
                {doneCount} / {sessions.length} sesiones
              </p>
            </div>
            <ProgressBar value={enrollment.progress_pct} className="mt-3" />

            {nextSession ? (
              <p className="mt-3 text-body-sm text-slate-ui">
                Siguiente: <span className="text-ink">Sesión {nextSession.number} — {nextSession.title}</span>
                {nextSession.scheduled_at && (
                  <> · {formatDateTime(nextSession.scheduled_at)}</>
                )}
              </p>
            ) : (
              /* Celebración discreta: el motivo de marca se dibuja una vez (sin bucle de pulso). */
              <div className="theme-night halo mt-4 flex flex-wrap items-center gap-4 overflow-hidden rounded-md px-4 py-4 sm:px-5">
                <MotivoSemilla
                  className="motivo-logro -my-2 h-16 w-16 shrink-0"
                  label="Ilustración: la semilla de SEP se ramifica, celebrando el curso completado."
                />
                <div className="min-w-0 flex-1 basis-48">
                  <p className="flex items-center gap-1.5 font-display text-body-lg font-semibold text-ink">
                    <Award className="size-5 shrink-0 text-cian-500" aria-hidden /> ¡Completaste el curso!
                  </p>
                  <p className="mt-0.5 text-body-sm text-slate-ui">Ya puedes obtener tu certificado con código verificable.</p>
                </div>
                <Button href="/estudiante/certificados" variant="neon" size="sm">
                  Obtener certificado
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="border-t border-line bg-surface-1 px-6 py-5">
            <EnrollCta slug={course.slug} available={course.status === "disponible"} />
          </div>
        )}
      </Card>

      {/* Sesiones */}
      <section className="mt-8">
        <h2 className="mb-3.5 text-body-sm font-semibold tracking-eyebrow text-slate-ui">
          Contenido del curso
        </h2>

        <div className="space-y-5">
          {weeks.map((week) => (
            <div key={week}>
              <p className="mb-2.5 text-body-sm font-medium text-graphite">
                Semana {week}
              </p>
              <SessionList
                courseSlug={course.slug}
                enrolled={!!enrollment}
                sessions={sessions
                  .filter((s) => s.week === week)
                  .map((s) => ({
                    id: s.id,
                    number: s.number,
                    title: s.title,
                    subtitle: s.subtitle,
                    description: s.description,
                    scheduledAt: s.scheduled_at,
                    meetUrl: s.meet_url,
                    status: s.status,
                    isCompleted: s.isCompleted,
                  }))}
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
