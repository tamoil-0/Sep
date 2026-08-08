import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import { Card, EmptyState } from "@/components/ui/primitives";

import { PanelSection } from "@/components/app/data-views";

import { Check, Clock, Mail } from "lucide-react";
import { StatusBadge } from "@/components/app/data-views";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Invitaciones" };

export default async function SpeakerInvitacionesPage() {
  const user = await requireRole(["speaker", "admin", "super_admin"]);
  const supabase = await createClient();

  const { data: sp } = await supabase
    .from("speaker_profiles").select("id").eq("user_id", user.id).maybeSingle();

  const { data: invites } = sp?.id
    ? await supabase
        .from("speaker_invitations")
        .select("id, topic, proposed_at, status, events(title, starts_at, location, is_online)")
        .eq("speaker_id", sp.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  const rows = (invites ?? []).map((i) => ({
    ...i,
    event: Array.isArray(i.events) ? i.events[0] : i.events,
  }));

  const pending = rows.filter((r) => r.status === "pendiente");

  return (
    <>
      <PageHeader
        title="Invitaciones"
        description="Charlas y talleres a los que SEP te ha invitado."
      />

      <KpiGrid>
        <Kpi label="Pendientes" value={pending.length} icon={<Clock className="size-4" />} />
        <Kpi label="Aceptadas" value={rows.filter((r) => r.status === "aceptada").length} icon={<Check className="size-4" />} />
        <Kpi label="Total" value={rows.length} icon={<Mail className="size-4" />} />
        <Kpi label="Alcance estimado" value="1,000+" hint="jóvenes en 10+ regiones" />
      </KpiGrid>

      <PanelSection title="Todas las invitaciones">
        {rows.length === 0 ? (
          <EmptyState
            icon={<Mail className="size-5" />}
            title="Sin invitaciones por ahora"
            description="Cuando el equipo te invite a una charla aparecerá aquí para que la aceptes o propongas otra fecha."
          />
        ) : (
          <div className="space-y-3">
            {rows.map((i) => (
              <Card key={i.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[1.0625rem] font-semibold text-ink">
                      {i.topic ?? "Charla SEP"}
                    </p>
                    {i.event && (
                      <p className="mt-1 text-sm text-slate-ui">
                        {i.event.title}
                        {i.event.location ? ` · ${i.event.location}` : ""}
                      </p>
                    )}
                    <p className="mt-2 text-xs capitalize text-slate-ui">
                      {i.proposed_at ? formatDateTime(i.proposed_at) : "Fecha por coordinar"}
                    </p>
                  </div>
                  <StatusBadge status={i.status} />
                </div>

                {i.status === "pendiente" && (
                  <p className="mt-4 rounded-[10px] bg-surface-1 px-4 py-3 text-sm text-graphite">
                    Para confirmar o proponer otra fecha, responde el correo que te enviamos
                    o escríbenos por WhatsApp. Así queda registro de la coordinación.
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </PanelSection>
    </>
  );
}

