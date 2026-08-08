/**
 * Genera las pantallas de panel que faltaban.
 *
 * Se usa una sola vez: escribe archivos reales que luego se editan a mano.
 * Está en scripts/ y no en src/ porque no forma parte del build.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const write = (path, body) => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, body.trimStart() + "\n");
};

const A = "src/app/(app)";

/* ═══════════════ ESTUDIANTE ═══════════════ */

write(`${A}/estudiante/eventos/page.tsx`, `
import type { Metadata } from "next";
import { CalendarDays, MapPin, Video } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
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
  const now = Date.now();
  const upcoming = (events ?? []).filter((e) => new Date(e.starts_at).getTime() >= now);
  const past = (events ?? []).filter((e) => new Date(e.starts_at).getTime() < now).reverse();

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
`);

write(`${A}/estudiante/eventos/register-button.tsx`, `
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { registerForEventAction } from "@/server/actions/learning";

export function EventRegisterButton({
  eventId,
  registered,
}: {
  eventId: string;
  registered: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  if (registered) {
    return (
      <p className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
        <Check className="size-4" />
        Ya estás inscrito
      </p>
    );
  }

  return (
    <div>
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          const r = await registerForEventAction(eventId);
          setBusy(false);
          setMsg(r.ok ? (r.message ?? "Listo.") : r.error);
          if (r.ok) router.refresh();
        }}
        className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-[8px] bg-sep-600 text-sm font-medium text-white transition-colors hover:bg-sep-700 disabled:opacity-60"
      >
        {busy && <Loader2 className="size-4 animate-spin" />}
        Inscribirme
      </button>
      {msg && <p className="mt-2 text-xs text-slate-ui">{msg}</p>}
    </div>
  );
}
`);

write(`${A}/estudiante/membresia/page.tsx`, `
import type { Metadata } from "next";
import { Check, Sprout } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { getActiveMembership, getMembershipPlans } from "@/server/queries/payments";
import { PageHeader } from "@/components/app/page-header";
import { Badge, Card } from "@/components/ui/primitives";
import { PanelSection } from "@/components/app/data-views";
import { formatDate, formatSoles } from "@/lib/utils";

export const metadata: Metadata = { title: "Mi membresía" };

export default async function MembresiaPage() {
  const user = await requireUser();
  const [membership, plans] = await Promise.all([
    getActiveMembership(user.id),
    getMembershipPlans(),
  ]);

  const currentSlug = membership?.plan?.slug ?? "semilla";

  return (
    <>
      <PageHeader
        title="Mi membresía"
        description="Los cursos son gratis siempre. La membresía añade certificados incluidos y mentoría."
      />

      <Card className="overflow-hidden p-0">
        <div className="sep-gradient px-7 py-6 text-white">
          <p className="text-xs uppercase tracking-[0.12em] text-white/70">Tu plan actual</p>
          <h2 className="mt-2 font-display text-[1.75rem] font-semibold">
            {membership?.plan?.name ?? "Semilla"}
          </h2>
          <p className="mt-1 text-sm text-white/75">
            {membership
              ? \`Vigente hasta el \${formatDate(membership.ends_at)}\`
              : "Gratuito, para siempre"}
          </p>
        </div>
      </Card>

      <PanelSection title="Planes disponibles">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((p) => {
            const isCurrent = p.slug === currentSlug;
            const benefits = Array.isArray(p.benefits) ? (p.benefits as string[]) : [];
            return (
              <Card
                key={p.id}
                className={isCurrent ? "flex flex-col border-sep-300 bg-sep-50/40" : "flex flex-col"}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-[1.0625rem] font-semibold text-ink">{p.name}</h3>
                  {isCurrent && <Badge tone="brand">Actual</Badge>}
                </div>

                <p className="tabular mt-4 font-display text-[1.75rem] font-bold leading-none text-ink">
                  {p.price_cents === 0 ? "Gratis" : formatSoles(p.price_cents)}
                </p>
                <p className="mt-1 text-xs text-slate-ui">
                  {p.duration_months === 0 ? "Para siempre" : \`\${p.duration_months} meses\`}
                </p>

                <ul className="mt-5 flex-1 space-y-2 border-t border-line pt-4">
                  {benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-graphite">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-seed-500" />
                      {b}
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      </PanelSection>

      <Card className="mt-8 border-gold-500/35 bg-[#FFFBF0]">
        <div className="flex items-start gap-3.5">
          <Sprout className="mt-0.5 size-5 shrink-0 text-gold-700" />
          <div>
            <h3 className="font-display text-[1.0625rem] font-semibold text-ink">
              Los voluntarios tienen todo gratis
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-graphite">
              Si eres mentor, community manager u organizador activo, accedes a todos los
              beneficios sin pagar nada, por tu servicio a SEP.
            </p>
          </div>
        </div>
      </Card>
    </>
  );
}
`);

write(`${A}/estudiante/proyectos/page.tsx`, `
import type { Metadata } from "next";
import { Lightbulb, MapPin } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import { Badge, Card, EmptyState } from "@/components/ui/primitives";
import { PanelSection } from "@/components/app/data-views";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Mis proyectos" };

export default async function ProyectosPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const [{ data: mine }, { data: others }] = await Promise.all([
    supabase.from("projects").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase
      .from("projects")
      .select("id, title, problem, solution, region, profiles(full_name)")
      .eq("is_public", true)
      .neq("user_id", user.id)
      .limit(6),
  ]);

  const rows = mine ?? [];

  return (
    <>
      <PageHeader
        title="Mis proyectos"
        description="Lo que estás construyendo con lo aprendido. Los proyectos nacen en la sesión 6 de cada curso."
      />

      <KpiGrid>
        <Kpi label="Mis proyectos" value={rows.length} icon={<Lightbulb className="size-4" />} />
        <Kpi label="Públicos" value={rows.filter((p) => p.is_public).length} />
        <Kpi label="Tu región" value={user.region ?? "—"} icon={<MapPin className="size-4" />} />
        <Kpi label="De la comunidad" value={others?.length ?? 0} />
      </KpiGrid>

      <PanelSection title="Mis proyectos">
        {rows.length === 0 ? (
          <EmptyState
            icon={<Lightbulb className="size-5" />}
            title="Aún no registras ningún proyecto"
            description="En la última sesión de cada curso diseñas un proyecto para tu comunidad. Ahí aparecerá."
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {rows.map((p) => (
              <Card key={p.id} className="p-5">
                <div className="flex flex-wrap items-center gap-1.5">
                  {p.region && <Badge tone="brand">{p.region}</Badge>}
                  {p.is_public ? <Badge tone="seed">Público</Badge> : <Badge tone="neutral">Privado</Badge>}
                </div>
                <h3 className="mt-3 font-display text-[1.0625rem] font-semibold text-ink">{p.title}</h3>
                {p.problem && (
                  <>
                    <p className="mt-3 text-xs uppercase tracking-[0.08em] text-slate-ui">El problema</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-ui">{p.problem}</p>
                  </>
                )}
                {p.solution && (
                  <>
                    <p className="mt-3 text-xs uppercase tracking-[0.08em] text-seed-700">La solución</p>
                    <p className="mt-1 text-sm leading-relaxed text-graphite">{p.solution}</p>
                  </>
                )}
                <p className="mt-4 text-xs text-mist">Creado el {formatDate(p.created_at)}</p>
              </Card>
            ))}
          </div>
        )}
      </PanelSection>

      {(others?.length ?? 0) > 0 && (
        <PanelSection title="De la comunidad">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {(others ?? []).map((p) => {
              const author = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles;
              return (
                <Card key={p.id} className="p-5">
                  {p.region && <Badge tone="neutral">{p.region}</Badge>}
                  <h3 className="mt-3 font-display text-[0.9375rem] font-semibold text-ink">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-ui">{p.solution}</p>
                  <p className="mt-3 text-xs text-mist">{author?.full_name}</p>
                </Card>
              );
            })}
          </div>
        </PanelSection>
      )}
    </>
  );
}
`);

console.log("estudiante listo");
