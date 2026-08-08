import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/page-header";
import { Badge, Card, EmptyState } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";

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

