import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/page-header";
import { Badge, Card } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";

import { Check, FileSignature } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Convenio" };

const TERMS = [
  "SEP dicta los talleres sin costo para colegios de la red.",
  "El colegio facilita el aula, el horario y el permiso de los apoderados.",
  "Los facilitadores son universitarios formados por SEP, de la misma región.",
  "Cada estudiante que completa un taller recibe una constancia firmada por SEP.",
  "SEP entrega un reporte de impacto con métricas verificables al cierre del ciclo.",
  "Ninguna de las partes usa los datos de los estudiantes con fines comerciales.",
];

export default async function InstitucionConvenioPage() {
  const user = await requireRole(["institucion", "admin", "super_admin"]);
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("institutions(name, type, region, agreement_signed_at, agreement_url, is_verified)")
    .eq("id", user.id)
    .maybeSingle();

  const i = Array.isArray(profile?.institutions) ? profile?.institutions[0] : profile?.institutions;
  const signed = Boolean(i?.agreement_signed_at);

  return (
    <>
      <PageHeader
        title="Convenio"
        description="El acuerdo marco entre tu institución y SEP."
        action={signed ? <Badge tone="success">Vigente</Badge> : <Badge tone="warning">Pendiente</Badge>}
      />

      <Card className="overflow-hidden p-0">
        <div className="sep-gradient px-7 py-6 text-white">
          <FileSignature className="size-6 text-gold-500" />
          <h2 className="mt-4 font-display text-[1.5rem] font-semibold">
            {i?.name ?? "Tu institución"}
          </h2>
          <p className="mt-1 text-sm text-white/75">
            {signed
              ? `Convenio firmado el ${formatDate(i!.agreement_signed_at!)}`
              : "Aún no firmamos el convenio"}
          </p>
        </div>

        <div className="p-7">
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
            Qué acordamos
          </h3>
          <ul className="mt-4 space-y-2.5">
            {TERMS.map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-[0.9375rem] text-graphite">
                <Check className="mt-0.5 size-4 shrink-0 text-seed-500" />
                {t}
              </li>
            ))}
          </ul>

          {!signed && (
            <div className="mt-7 rounded-[12px] border border-warning/30 bg-warning-bg p-5">
              <p className="text-sm leading-relaxed text-graphite">
                Para formalizar el convenio, el equipo de alianzas de SEP coordina una
                reunión virtual de 30 minutos y envía el documento firmado digitalmente.
              </p>
              <Button href="/contacto" variant="primary" size="sm" className="mt-4">
                Coordinar la firma
              </Button>
            </div>
          )}
        </div>
      </Card>
    </>
  );
}

