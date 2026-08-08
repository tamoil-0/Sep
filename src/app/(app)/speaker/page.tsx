import type { Metadata } from "next";
import { Globe, Mail, Mic, UserRound } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import { Badge, Card, EmptyState } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Panel de speaker" };

export default async function SpeakerPage() {
  const user = await requireRole(["speaker", "admin", "super_admin"]);
  const supabase = await createClient();

  const { data: speaker } = await supabase
    .from("speaker_profiles")
    .select("id, expertise, topics, region, country, is_approved, is_public")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: invitations } = speaker?.id
    ? await supabase
        .from("speaker_invitations")
        .select("id, topic, status, proposed_at")
        .eq("speaker_id", speaker.id)
        .order("created_at", { ascending: false })
        .limit(5)
    : { data: null };

  const pending = (invitations ?? []).filter((i) => i.status === "pendiente");
  const accepted = (invitations ?? []).filter((i) => i.status === "aceptada");

  return (
    <>
      <PageHeader
        title={`Hola, ${user.fullName.split(" ")[0] || "speaker"}`}
        description={speaker?.expertise ?? "Completa tu perfil para aparecer en la red pública."}
        action={
          speaker?.is_approved ? (
            <Badge tone="success">Perfil aprobado</Badge>
          ) : (
            <Badge tone="warning">En revisión</Badge>
          )
        }
      />

      <KpiGrid>
        <Kpi label="Invitaciones pendientes" value={pending.length} icon={<Mail className="size-4" />} />
        <Kpi label="Charlas confirmadas" value={accepted.length} icon={<Mic className="size-4" />} />
        <Kpi label="Jóvenes alcanzables" value="1,000+" hint="En 10+ regiones" icon={<Globe className="size-4" />} />
        <Kpi
          label="Perfil público"
          value={speaker?.is_public ? "Visible" : "Oculto"}
          icon={<UserRound className="size-4" />}
        />
      </KpiGrid>

      <section className="mt-8">
        <div className="mb-3.5 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
            Invitaciones
          </h2>
          <Button href="/speaker/invitaciones" variant="link" size="sm">
            Ver todas
          </Button>
        </div>

        {!invitations?.length ? (
          <EmptyState
            icon={<Mail className="size-5" />}
            title="No tienes invitaciones por ahora"
            description="Cuando el equipo de SEP te invite a una charla o taller, aparecerá aquí para que aceptes o propongas otra fecha."
            action={
              <Button href="/speaker/perfil" variant="outline">
                Completar mi perfil
              </Button>
            }
          />
        ) : (
          <Card className="p-0">
            <ul className="divide-y divide-line">
              {invitations.map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">
                      {i.topic ?? "Charla SEP"}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-ui">
                      {i.proposed_at
                        ? new Date(i.proposed_at).toLocaleDateString("es-PE", {
                            day: "numeric",
                            month: "long",
                          })
                        : "Fecha por coordinar"}
                    </p>
                  </div>
                  <Badge tone={i.status === "aceptada" ? "success" : "neutral"}>
                    {i.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </section>

      {speaker?.topics?.length ? (
        <section className="mt-8">
          <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
            Mis temas
          </h2>
          <div className="flex flex-wrap gap-2">
            {speaker.topics.map((t) => (
              <Badge key={t} tone="brand">
                {t}
              </Badge>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
