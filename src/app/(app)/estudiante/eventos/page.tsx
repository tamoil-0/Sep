import type { Metadata } from "next";
import { CalendarDays, MapPin, Video } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { now } from "@/lib/time";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import { Badge, Card, EmptyState } from "@/components/ui/primitives";
import { PanelSection } from "@/components/app/data-views";
import { EventRegisterButton } from "./register-button";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Eventos" };

export default async function EstudianteEventosPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const [{ data: events }, { data: mine }] = await Promise.all([
    supabase.from("events").select("*").eq("is_published", true).order("starts_at"),
    supabase.from("event_registrations").select("event_id, attended").eq("user_id", user.id),
  ]);

  const registered = new Map((mine ?? []).map((r) => [r.event_id, r]));
  const cutoff = now();
  const upcoming = (events ?? []).filter((e) => new Date(e.starts_at).getTime() >= cutoff);
  const past = (events ?? []).filter((e) => new Date(e.starts_at).getTime() < cutoff).reverse();

  return (
    <>
      <PageHeader title="Eventos" description="Demo Days, ferias y webinars abiertos a la comunidad." />

      <KpiGrid>
        <Kpi label="Próximos" value={upcoming.length} icon={<CalendarDays className="size-4" />} />
        <Kpi label="Mis inscripciones" value={mine?.length ?? 0} />
        <Kpi label="Asistidos" value={(mine ?? []).filter((r) => r.attended).length} />
        <Kpi label="Histórico" value={past.length} />
      </KpiGrid>

      <PanelSection title="Próximos eventos">
        {upcoming.length === 0 ? (
          <EmptyState
            icon={<CalendarDays className="size-5" />}
            title="No hay eventos programados"
            description="Te avisaremos por correo cuando abramos el próximo."
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {upcoming.map((e) => (
              <Card key={e.id} className="flex flex-col p-5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge tone="brand">{e.kind ?? "evento"}</Badge>
                  {e.is_online ? (
                    <Badge tone="seed"><Video className="size-3" />Virtual</Badge>
                  ) : (
                    <Badge tone="gold"><MapPin className="size-3" />Presencial</Badge>
                  )}
                </div>
                <h3 className="mt-3.5 font-display text-[1.0625rem] font-semibold text-ink">{e.title}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-ui">{e.description}</p>
                <p className="mt-4 text-xs capitalize text-slate-ui">{formatDateTime(e.starts_at)}</p>
                {e.location && <p className="mt-1 text-xs text-slate-ui">{e.location}</p>}
                <div className="mt-4">
                  <EventRegisterButton eventId={e.id} registered={registered.has(e.id)} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </PanelSection>

      {past.length > 0 && (
        <PanelSection title="Ya sucedieron">
          <Card className="p-0">
            <ul className="divide-y divide-line">
              {past.map((e) => (
                <li key={e.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{e.title}</p>
                    <p className="mt-0.5 text-xs capitalize text-slate-ui">{formatDateTime(e.starts_at)}</p>
                  </div>
                  {registered.get(e.id)?.attended && <Badge tone="success">Asististe</Badge>}
                </li>
              ))}
            </ul>
          </Card>
        </PanelSection>
      )}
    </>
  );
}

