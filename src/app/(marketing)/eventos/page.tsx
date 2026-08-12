import type { Metadata } from "next";
import { CalendarDays, MapPin, Video } from "lucide-react";
import { getPublishedEvents } from "@/server/queries/events";
import {
  Badge,
  Card,
  Container,
  EmptyState,
  Section,
  SectionHeader,
} from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import { RealPhoto, SEP_PHOTOS } from "@/components/marketing/real-photo";

export const metadata: Metadata = {
  title: "Eventos",
  description:
    "Demo Days, ferias de innovación escolar, webinars y talleres abiertos de SEP. Participación gratuita desde cualquier región.",
};

/** ISR: la página se sirve estática y se regenera cada 5 min. */
export const revalidate = 300;

const kindLabels: Record<string, string> = {
  demo_day: "Demo Day",
  webinar: "Webinar",
  taller: "Taller",
  feria: "Feria",
};

export default async function EventosPage() {
  const { upcoming, past } = await getPublishedEvents();

  return (
    <>
      <section className="border-b border-line bg-surface-1">
        <Container size="wide" className="py-14 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.86fr]">
          <SectionHeader
            eyebrow="Agenda"
            title="Eventos SEP"
            description="Demo Days, ferias escolares, webinars y talleres abiertos. Participar es gratis y no importa desde dónde te conectes."
          />
          <RealPhoto
            src={SEP_PHOTOS.eventPresence}
            alt="Espacio de un encuentro de innovación con presencia visual de SEP"
            priority
            label="Participación en el ecosistema emprendedor"
            className="aspect-[16/10] min-h-0"
            imageClassName="object-[50%_50%]"
          />
          </div>
        </Container>
      </section>

      <Section>
        <Container size="wide">
          <h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
            Próximos
          </h2>

          {upcoming.length === 0 ? (
            <EmptyState
              icon={<CalendarDays className="size-5" />}
              title="No hay eventos programados por ahora"
              description="Suscríbete al newsletter para conocer las próximas actividades."
              action={<Button href="/#newsletter">Suscribirme</Button>}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {upcoming.map((e) => (
                <Card key={e.id} className="relative flex flex-col overflow-hidden border-sep-100 p-6 shadow-[0_12px_36px_-26px_rgba(46,11,232,.45)]">
                  <span className="absolute inset-x-0 top-0 h-1 sep-gradient" />
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="brand">{kindLabels[e.kind ?? ""] ?? "Evento"}</Badge>
                    {e.is_online ? (
                      <Badge tone="seed">
                        <Video className="size-3.5" />
                        Virtual
                      </Badge>
                    ) : (
                      <Badge tone="gold">
                        <MapPin className="size-3.5" />
                        Presencial
                      </Badge>
                    )}
                  </div>

                  <h3 className="mt-4 font-display text-[1.25rem] font-semibold leading-snug text-ink">
                    {e.title}
                  </h3>
                  <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-slate-ui">
                    {e.description}
                  </p>

                  <dl className="mt-5 space-y-1.5 border-t border-line pt-4 text-sm text-slate-ui">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="size-4 text-mist" />
                      <span className="capitalize">{formatDateTime(e.starts_at)}</span>
                    </div>
                    {e.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-mist" />
                        {e.location}
                      </div>
                    )}
                  </dl>

                  <Button href="/registro" variant="primary" size="sm" className="mt-5">
                    Registrarme
                  </Button>
                </Card>
              ))}
            </div>
          )}

          {past.length > 0 && (
            <>
              <h2 className="mb-6 mt-14 text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
                Ya sucedieron
              </h2>
              <ul className="divide-y divide-line overflow-hidden rounded-[14px] border border-line bg-white">
                {past.map((e) => (
                  <li key={e.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[0.9375rem] font-medium text-ink">
                        {e.title}
                      </p>
                      <p className="mt-0.5 text-xs capitalize text-slate-ui">
                        {formatDateTime(e.starts_at)}
                        {e.location ? ` · ${e.location}` : ""}
                      </p>
                    </div>
                    <Badge tone="neutral">{kindLabels[e.kind ?? ""] ?? "Evento"}</Badge>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Container>
      </Section>
    </>
  );
}
