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
import { assertQueryResults } from "@/lib/supabase/query";

export const metadata: Metadata = { title: "Mi panel" };

function greeting() {
  // Hora de Lima: el servidor (Vercel) corre en UTC.
  const h = Number(
    new Intl.DateTimeFormat("es-PE", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: "America/Lima",
    }).format(new Date()),
  );
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

export default async function EstudiantePage() {
  const user = await requireRole(["estudiante", "mentor", "admin", "super_admin"]);
  const supabase = await createClient();

  const enrollmentsResult = await supabase
    .from("enrollments")
    .select("id, progress_pct, status, course_id, courses(slug, title, subtitle, sessions_count)")
    .eq("user_id", user.id)
    .order("enrolled_at", { ascending: false });
  assertQueryResults("estudiante:panel:inscripciones", enrollmentsResult);
  const enrollments = enrollmentsResult.data;

  const certificatesResult = await supabase
    .from("certificates")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "emitido");
  assertQueryResults("estudiante:panel:certificados", certificatesResult);
  const certificatesCount = certificatesResult.count;

  // Últimas publicaciones reales de la comunidad (antes eran textos de ejemplo fijos).
  const postsResult = await supabase
    .from("posts")
    .select("id, content, profiles:public_profiles!posts_user_id_fkey(full_name, region)")
    .eq("is_hidden", false)
    .order("created_at", { ascending: false })
    .limit(2);
  assertQueryResults("estudiante:panel:comunidad", postsResult);
  const latestPosts = (postsResult.data ?? []).map((p) => {
    const author = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles;
    // «Nombre A.»: basta para reconocerse en la comunidad sin exponer el nombre completo.
    const [first = "Miembro", last] = (author?.full_name ?? "").trim().split(/\s+/);
    return {
      id: p.id,
      name: last ? `${first} ${last[0]}.` : first || "Miembro SEP",
      region: author?.region ?? null,
      text: p.content,
    };
  });

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
            {greeting()}
            {user.fullName.split(" ")[0] ? `, ${user.fullName.split(" ")[0]}` : ""}
          </>
        }
        description={
          user.region
            ? `Construyendo desde ${user.region}.`
            : "Bienvenid@ a tu ruta SEP."
        }
        action={
          <Badge tone="brand">
            <span className="size-1.5 rounded-full bg-turquesa-800" />
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
          label="Regiones en SEP"
          value="13"
          hint="Con participantes en los webinars"
          icon={<CalendarDays className="size-4" />}
        />
      </KpiGrid>

      {/* Continúa aprendiendo */}
      <section className="mt-8">
        <h2 className="mb-3.5 text-body-sm font-semibold tracking-eyebrow text-slate-ui">
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
                      <h3 className="truncate text-body-sm leading-snug font-semibold text-ink">
                        {course?.title}
                      </h3>
                      <p className="mt-0.5 truncate text-caption text-slate-ui">
                        {course?.subtitle}
                      </p>
                    </div>
                    <span className="tabular shrink-0 text-body-sm font-semibold text-acento">
                      {e.progress_pct}%
                    </span>
                  </div>
                  <ProgressBar value={e.progress_pct ?? 0} className="mt-4" />
                  <p className="mt-2.5 text-caption text-slate-ui">
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
          <div className="flex items-center gap-2 text-body-sm font-semibold tracking-eyebrow text-slate-ui">
            <Video className="size-4" />
            Próxima sesión en vivo
          </div>
          <div className="mt-4 rounded-md border border-line bg-surface-1 p-4">
            <p className="text-body-sm font-medium text-ink">
              Aún no hay sesiones programadas
            </p>
            <p className="mt-1 text-caption text-slate-ui">
              Cuando te inscribas a un curso, aquí verás el enlace de tu próxima sesión.
            </p>
          </div>
        </Card>

        {/* Comunidad */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-body-sm font-semibold tracking-eyebrow text-slate-ui">
              <MessageSquare className="size-4" />
              Comunidad SEP
            </div>
            <Link
              href="/estudiante/comunidad"
              className="relative text-caption font-medium text-acento hover:underline after:absolute after:-inset-x-2 after:-inset-y-3.5 after:content-['']"
            >
              Ver todo
            </Link>
          </div>

          {latestPosts.length === 0 ? (
            <p className="mt-4 text-body-sm text-slate-ui">
              Todavía no hay publicaciones. Sé la primera persona en contar qué estás construyendo.
            </p>
          ) : (
            <ul className="mt-4 space-y-3.5">
              {latestPosts.map((p) => (
                <li key={p.id} className="flex gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-violeta-700 text-caption font-semibold text-white">
                    {initials(p.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-caption font-medium text-ink">
                      {p.name}
                      {p.region && <span className="font-normal text-slate-ui"> · {p.region}</span>}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-body-sm leading-relaxed text-slate-ui">
                      {p.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Certificados */}
      <section className="mt-8">
        <h2 className="mb-3.5 text-body-sm font-semibold tracking-eyebrow text-slate-ui">
          Certificados al finalizar
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {certificateTypes.map((c) => (
            <Card key={c.slug} className="flex items-start justify-between gap-4 p-5">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-body-sm leading-snug font-semibold text-ink">
                    {c.name}
                  </h3>
                  {c.recommended && <Badge tone="neon">Recomendado</Badge>}
                </div>
                <p className="mt-1.5 text-caption leading-relaxed text-slate-ui">
                  {c.description}
                </p>
              </div>
              <p className="tabular shrink-0 text-body-lg font-semibold text-ink">
                {formatSoles(c.priceCents)}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
