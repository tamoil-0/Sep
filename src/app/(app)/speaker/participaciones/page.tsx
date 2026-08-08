import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { now } from "@/lib/time";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import { Badge, Card, EmptyState } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { PanelSection } from "@/components/app/data-views";

import { Award, Mic, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Mis participaciones" };

export default async function SpeakerParticipacionesPage() {
  const user = await requireRole(["speaker", "admin", "super_admin"]);
  const supabase = await createClient();

  const { data: sp } = await supabase
    .from("speaker_profiles").select("id, full_name").eq("user_id", user.id).maybeSingle();

  const { data: invites } = sp?.id
    ? await supabase
        .from("speaker_invitations")
        .select("id, topic, proposed_at, status, events(title, starts_at, location, capacity)")
        .eq("speaker_id", sp.id)
        .eq("status", "aceptada")
    : { data: [] };

  const rows = (invites ?? []).map((i) => ({
    ...i,
    event: Array.isArray(i.events) ? i.events[0] : i.events,
  }));

  const cutoff = now();
  const past = rows.filter((r) => r.event?.starts_at && new Date(r.event.starts_at).getTime() < cutoff);
  const reach = rows.reduce((s, r) => s + (r.event?.capacity ?? 0), 0);

  return (
    <>
      <PageHeader
        title="Mis participaciones"
        description="Tu historial como speaker de SEP."
      />

      <KpiGrid>
        <Kpi label="Charlas confirmadas" value={rows.length} icon={<Mic className="size-4" />} />
        <Kpi label="Ya realizadas" value={past.length} />
        <Kpi label="Alcance acumulado" value={reach || "—"} icon={<Users className="size-4" />} />
        <Kpi label="Constancias" value={past.length} icon={<Award className="size-4" />} />
      </KpiGrid>

      <PanelSection title="Historial">
        {rows.length === 0 ? (
          <EmptyState
            icon={<Mic className="size-5" />}
            title="Aún no tienes participaciones"
            description="Cuando aceptes tu primera invitación, aparecerá aquí junto con tu constancia."
            action={<Button href="/speaker/invitaciones" variant="outline">Ver invitaciones</Button>}
          />
        ) : (
          <Card className="p-0">
            <ul className="divide-y divide-line">
              {rows.map((r) => (
                <li key={r.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">
                      {r.topic ?? r.event?.title ?? "Charla SEP"}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-ui">
                      {r.event?.starts_at ? formatDate(r.event.starts_at) : "Por coordinar"}
                      {r.event?.location ? ` · ${r.event.location}` : ""}
                    </p>
                  </div>
                  {r.event?.capacity ? <Badge tone="neutral">{r.event.capacity} asistentes</Badge> : null}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </PanelSection>

      <Card className="mt-8 border-gold-500/35 bg-[#FFFBF0]">
        <div className="flex items-start gap-3.5">
          <Award className="mt-0.5 size-5 shrink-0 text-gold-700" />
          <div>
            <h3 className="font-display text-[1.0625rem] font-semibold text-ink">
              Tu constancia de speaker
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-graphite">
              SEP emite una constancia por cada participación. Escríbenos al terminar tu
              charla y te la enviamos con su código de verificación pública.
            </p>
          </div>
        </div>
      </Card>
    </>
  );
}

