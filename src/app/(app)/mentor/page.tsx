import type { Metadata } from "next";
import { CalendarDays, Clock, MessagesSquare, UsersRound } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import { Badge, Card, EmptyState, ProgressBar } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Panel de mentor" };

export default async function MentorPage() {
  const user = await requireRole(["mentor", "admin", "super_admin"]);
  const supabase = await createClient();

  const [{ data: volunteer }, { data: mentorships }, { data: hours }] =
    await Promise.all([
      supabase
        .from("volunteer_profiles")
        .select("type, started_at, hours_committed")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("mentorships")
        .select("id, mentee_id, started_at, profiles!mentorships_mentee_id_fkey(full_name, region)")
        .eq("mentor_id", user.id)
        .is("ended_at", null),
      supabase
        .from("volunteer_hours")
        .select("hours, date")
        .eq("user_id", user.id)
        .gte("date", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10)),
    ]);

  const monthHours = (hours ?? []).reduce((s, h) => s + Number(h.hours), 0);
  const committed = (volunteer?.hours_committed ?? 4) * 4;

  const typeLabels: Record<string, string> = {
    mentor_junior: "Mentor Junior",
    mentor_senior: "Mentor Senior",
    community_manager: "Community Manager",
    event_organizer: "Organizador de eventos",
  };

  return (
    <>
      <PageHeader
        title={`Hola, ${user.fullName.split(" ")[0] || "mentor"}`}
        description="Gracias por sostener la red. Aquí está tu mes."
        action={
          <Badge tone="gold">
            {typeLabels[volunteer?.type ?? "mentor_junior"] ?? "Voluntario SEP"}
          </Badge>
        }
      />

      <KpiGrid>
        <Kpi
          label="Mentorados activos"
          value={mentorships?.length ?? 0}
          icon={<UsersRound className="size-4" />}
        />
        <Kpi
          label="Horas este mes"
          value={`${monthHours} h`}
          hint={`Compromiso: ${committed} h`}
          icon={<Clock className="size-4" />}
        />
        <Kpi label="Sesiones agendadas" value={0} icon={<CalendarDays className="size-4" />} />
        <Kpi
          label="Voluntario desde"
          value={
            volunteer?.started_at
              ? new Date(volunteer.started_at).toLocaleDateString("es-PE", {
                  month: "short",
                  year: "numeric",
                })
              : "—"
          }
        />
      </KpiGrid>

      <section className="mt-8 grid gap-3 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
              Mis mentorados
            </h2>
            <Button href="/mentor/mentorados" variant="link" size="sm">
              Ver todos
            </Button>
          </div>

          {!mentorships?.length ? (
            <div className="mt-4">
              <EmptyState
                icon={<UsersRound className="size-5" />}
                title="Aún no tienes mentorados asignados"
                description="El equipo de SEP te asignará universitarios cuando abra la próxima cohorte."
              />
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-line">
              {mentorships.map((m) => {
                const p = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles;
                return (
                  <li key={m.id} className="flex items-center justify-between gap-4 py-3.5">
                    <div>
                      <p className="text-sm font-medium text-ink">{p?.full_name}</p>
                      <p className="text-xs text-slate-ui">{p?.region}</p>
                    </div>
                    <Button href="/mentor/mentorados" variant="ghost" size="sm">
                      Ver ficha
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
            Progreso del mes
          </h2>
          <p className="tabular mt-4 font-display text-[2rem] font-semibold leading-none text-ink">
            {monthHours}
            <span className="text-lg text-slate-ui"> / {committed} h</span>
          </p>
          <ProgressBar
            value={committed ? (monthHours / committed) * 100 : 0}
            className="mt-4"
            tone="gold"
          />
          <p className="mt-3 text-xs leading-relaxed text-slate-ui">
            Tus horas registradas y aprobadas alimentan tu certificado de voluntariado y
            tu carta de recomendación institucional.
          </p>
          <Button href="/mentor/horas" variant="outline" size="sm" className="mt-4 w-full">
            Registrar horas
          </Button>
        </Card>
      </section>

      <section className="mt-8">
        <Card className="flex flex-wrap items-center justify-between gap-5 border-sep-200 bg-sep-50/40 p-6">
          <div className="flex items-start gap-3.5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-white text-sep-600 ring-1 ring-inset ring-line">
              <MessagesSquare className="size-5" />
            </span>
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">
                Canal privado de mentores
              </h2>
              <p className="mt-1 max-w-lg text-sm text-slate-ui">
                Comunidad cerrada con recursos, casos reales y sesiones de formación
                exclusivas en mentoría.
              </p>
            </div>
          </div>
          <Button href="/mentor/canal" variant="primary">
            Entrar al canal
          </Button>
        </Card>
      </section>
    </>
  );
}
