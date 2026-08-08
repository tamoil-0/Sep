/** Quinta tanda: speaker y cuenta. */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const write = (p, b) => {
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, b.trimStart() + "\n");
};
const A = "src/app/(app)";

const head = `
import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import { Badge, Card, EmptyState } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { PanelSection } from "@/components/app/data-views";
`;

/* ═══════════════ SPEAKER ═══════════════ */

write(`${A}/speaker/perfil/page.tsx`, `${head}
import { Globe, Mic, UserRound } from "lucide-react";

export const metadata: Metadata = { title: "Mi perfil de speaker" };

export default async function SpeakerPerfilPage() {
  const user = await requireRole(["speaker", "admin", "super_admin"]);
  const supabase = await createClient();

  const { data: s } = await supabase
    .from("speaker_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!s) {
    return (
      <>
        <PageHeader title="Mi perfil de speaker" />
        <EmptyState
          icon={<Mic className="size-5" />}
          title="Todavía no tienes perfil de speaker"
          description="Regístrate en la red pública y el equipo lo revisará antes de publicarlo."
          action={<Button href="/speakers">Crear mi perfil</Button>}
        />
      </>
    );
  }

  const fields: [string, string | null][] = [
    ["Nombre público", s.full_name],
    ["Correo de contacto", s.email],
    ["País", s.country === "PE" ? "Perú" : s.country],
    ["Región o ciudad", s.region],
    ["Expertise", s.expertise],
    ["Experiencia dando charlas", s.talk_experience],
    ["Disponibilidad", s.availability],
    ["LinkedIn", s.linkedin_url],
  ];

  return (
    <>
      <PageHeader
        title="Mi perfil de speaker"
        description="Así te ve la comunidad en la red pública de SEP."
        action={
          s.is_public && s.is_approved ? (
            <Badge tone="success"><Globe className="size-3" />Visible en la red</Badge>
          ) : (
            <Badge tone="warning">En revisión</Badge>
          )
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
            Datos del perfil
          </h2>
          <dl className="mt-4 divide-y divide-line">
            {fields.map(([label, value]) => (
              <div key={label} className="flex flex-wrap justify-between gap-3 py-3">
                <dt className="text-sm text-slate-ui">{label}</dt>
                <dd className="max-w-[60%] text-right text-sm font-medium text-ink">
                  {value ?? "—"}
                </dd>
              </div>
            ))}
          </dl>
        </Card>

        <div className="space-y-5">
          <Card>
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
              Mis temas
            </h2>
            {s.topics?.length ? (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {s.topics.map((t: string) => (
                  <Badge key={t} tone="brand">{t}</Badge>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-ui">Sin temas registrados.</p>
            )}
          </Card>

          {s.story && (
            <Card>
              <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
                Mi historia
              </h2>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-graphite">{s.story}</p>
            </Card>
          )}

          <Card className="border-sep-200 bg-sep-50/40">
            <div className="flex items-start gap-3">
              <UserRound className="mt-0.5 size-5 shrink-0 text-sep-600" />
              <p className="text-sm leading-relaxed text-graphite">
                Para actualizar tu perfil escríbenos. Los cambios los revisa el equipo antes
                de publicarlos, para mantener la calidad de la red.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
`);

write(`${A}/speaker/invitaciones/page.tsx`, `${head}
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
                        {i.event.location ? \` · \${i.event.location}\` : ""}
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
`);

write(`${A}/speaker/participaciones/page.tsx`, `${head}
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

  const now = Date.now();
  const past = rows.filter((r) => r.event?.starts_at && new Date(r.event.starts_at).getTime() < now);
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
                      {r.event?.location ? \` · \${r.event.location}\` : ""}
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
`);

console.log("speaker listo");
