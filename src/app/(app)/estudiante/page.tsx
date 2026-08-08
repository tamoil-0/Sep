import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarDays,
  Clock,
  MessageSquare,
  Video,
} from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import { Badge, Card, EmptyState, ProgressBar } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { formatSoles, initials } from "@/lib/utils";
import { certificateTypes } from "@/config/pricing";

export const metadata: Metadata = { title: "Mi panel" };

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

export default async function EstudiantePage() {
  const user = await requireRole(["estudiante", "mentor", "admin", "super_admin"]);
  const supabase = await createClient();

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("id, progress_pct, status, course_id, courses(slug, title, subtitle, sessions_count)")
    .eq("user_id", user.id)
    .order("enrolled_at", { ascending: false });

  const { count: certificatesCount } = await supabase
    .from("certificates")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "emitido");

  const active = (enrollments ?? []).filter((e) => e.status === "activo");
  const hoursDone = (enrollments ?? []).reduce(
    (sum, e) => sum + Math.round(((e.progress_pct ?? 0) / 100) * 8),
    0,
  );

  return (
    <>
      <PageHeader
        title={
          <>
            {greeting()}, {user.fullName.split(" ")[0] || "🌱"} 🌱
          </>
        }
        description={
          user.region
            ? `Construyendo desde ${user.region}.`
            : "Bienvenid@ a tu ruta SEP."
        }
        action={
          <Badge tone="brand">
            <span className="size-1.5 rounded-full bg-seed-500" />
            Plan Semilla
          </Badge>
        }
      />

      <KpiGrid>
        <Kpi
          label="Cursos en progreso"
          value={active.length}
          icon={<BookOpen className="size-4" />}
        />
        <Kpi
          label="Certificados"
          value={certificatesCount ?? 0}
          icon={<Award className="size-4" />}
        />
        <Kpi
          label="Horas completadas"
          value={`${hoursDone} h`}
          icon={<Clock className="size-4" />}
        />
        <Kpi
          label="Regiones activas"
          value="10+"
          hint="En toda la comunidad SEP"
          icon={<CalendarDays className="size-4" />}
        />
      </KpiGrid>

      {/* Continúa aprendiendo */}
      <section className="mt-8">
        <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
          Continúa aprendiendo
        </h2>

        {active.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="size-5" />}
            title="Aún no estás en ningún curso"
            description="Todos los cursos de SEP son gratuitos. Empieza por Design Thinking aplicado."
            action={
              <Button href="/estudiante/catalogo">
                Explorar el catálogo
                <ArrowRight className="size-4" />
              </Button>
            }
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {active.map((e) => {
              const course = Array.isArray(e.courses) ? e.courses[0] : e.courses;
              const done = Math.round(((e.progress_pct ?? 0) / 100) * (course?.sessions_count ?? 6));
              return (
                <Card
                  key={e.id}
                  interactive
                  className="p-5"
                  as={Link}
                  {...{ href: `/estudiante/curso/${course?.slug ?? ""}` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-display text-[0.9375rem] font-semibold text-ink">
                        {course?.title}
                      </h3>
                      <p className="mt-0.5 truncate text-xs text-slate-ui">
                        {course?.subtitle}
                      </p>
                    </div>
                    <span className="tabular shrink-0 text-sm font-semibold text-sep-600">
                      {e.progress_pct}%
                    </span>
                  </div>
                  <ProgressBar value={e.progress_pct ?? 0} className="mt-4" />
                  <p className="mt-2.5 text-xs text-slate-ui">
                    Sesión {Math.min(done + 1, course?.sessions_count ?? 6)} de{" "}
                    {course?.sessions_count ?? 6}
                  </p>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <div className="mt-8 grid gap-3 lg:grid-cols-2">
        {/* Próxima sesión */}
        <Card className="p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
            <Video className="size-4" />
            Próxima sesión en vivo
          </div>
          <div className="mt-4 rounded-[12px] border border-line bg-surface-1 p-4">
            <p className="text-sm font-medium text-ink">
              Aún no hay sesiones programadas
            </p>
            <p className="mt-1 text-xs text-slate-ui">
              Cuando te inscribas a un curso, aquí verás el enlace de tu próxima sesión.
            </p>
          </div>
        </Card>

        {/* Comunidad */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
              <MessageSquare className="size-4" />
              Comunidad SEP
            </div>
            <Link
              href="/estudiante/comunidad"
              className="text-xs font-medium text-sep-600 hover:underline"
            >
              Ver todo
            </Link>
          </div>

          <ul className="mt-4 space-y-3.5">
            {[
              {
                name: "Andrea N.",
                region: "Arequipa",
                text: "Compartí mi prototipo de DT con mi colegio. Fue increíble verlos reaccionar.",
              },
              {
                name: "Ricardo M.",
                region: "Cusco",
                text: "¿Alguien se suma al grupo de práctica de Scrum antes del Demo Day?",
              },
            ].map((p) => (
              <li key={p.name} className="flex gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full sep-gradient text-[0.625rem] font-semibold text-white">
                  {initials(p.name)}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-ink">
                    {p.name} · <span className="font-normal text-slate-ui">{p.region}</span>
                  </p>
                  <p className="mt-0.5 text-[0.8125rem] leading-relaxed text-slate-ui">
                    {p.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Certificados */}
      <section className="mt-8">
        <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
          Certificados al finalizar
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {certificateTypes.map((c) => (
            <Card key={c.slug} className="flex items-start justify-between gap-4 p-5">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-[0.9375rem] font-semibold text-ink">
                    {c.name}
                  </h3>
                  {c.recommended && <Badge tone="gold">Recomendado</Badge>}
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-ui">
                  {c.description}
                </p>
              </div>
              <p className="tabular shrink-0 font-display text-lg font-semibold text-ink">
                {formatSoles(c.priceCents)}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
