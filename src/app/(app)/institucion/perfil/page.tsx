import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/page-header";
import { Badge, Card, EmptyState } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";

import { Building2, Mail, MapPin, Phone } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Perfil institucional" };

export default async function InstitucionPerfilPage() {
  const user = await requireRole(["institucion", "admin", "super_admin"]);
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("institution_id, institutions(*)")
    .eq("id", user.id)
    .maybeSingle();

  const i = Array.isArray(profile?.institutions) ? profile?.institutions[0] : profile?.institutions;

  if (!i) {
    return (
      <>
        <PageHeader title="Perfil institucional" />
        <EmptyState
          icon={<Building2 className="size-5" />}
          title="Aún no tienes institución vinculada"
          description="Escríbenos y vinculamos tu cuenta con tu institución para que puedas gestionar talleres y reportes."
          action={<Button href="/contacto">Escribirnos</Button>}
        />
      </>
    );
  }

  const fields: [string, string | number | null][] = [
    ["Nombre", i.name],
    ["Tipo", i.type],
    ["RUC", i.ruc],
    ["Región", i.region],
    ["Provincia", i.province],
    ["Distrito", i.district],
    ["Dirección", i.address],
    ["Estudiantes", i.students_count],
    ["Sitio web", i.website],
  ];

  return (
    <>
      <PageHeader
        title="Perfil institucional"
        description="Los datos que aparecen en tus reportes y constancias."
        action={
          i.is_verified ? <Badge tone="success">Verificada</Badge> : <Badge tone="warning">Verificación pendiente</Badge>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
            Datos de la institución
          </h2>
          <dl className="mt-4 divide-y divide-line">
            {fields.map(([label, value]) => (
              <div key={label} className="flex flex-wrap justify-between gap-3 py-3">
                <dt className="text-sm text-slate-ui">{label}</dt>
                <dd className="text-sm font-medium text-ink">{value ?? "—"}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-mist">
            Para corregir algún dato escríbenos: los cambios en instituciones verificadas
            los aplica el equipo de SEP para mantener la trazabilidad de los convenios.
          </p>
        </Card>

        <div className="space-y-5">
          <Card>
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
              Contacto registrado
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Building2 className="mt-0.5 size-4 shrink-0 text-mist" />
                <span>
                  <span className="block font-medium text-ink">{i.contact_name ?? "—"}</span>
                  <span className="block text-xs text-slate-ui">{i.contact_role ?? ""}</span>
                </span>
              </li>
              <li className="flex items-center gap-2.5 text-graphite">
                <Mail className="size-4 shrink-0 text-mist" />
                {i.contact_email ?? "—"}
              </li>
              <li className="flex items-center gap-2.5 text-graphite">
                <Phone className="size-4 shrink-0 text-mist" />
                {i.contact_phone ?? "—"}
              </li>
              <li className="flex items-center gap-2.5 text-graphite">
                <MapPin className="size-4 shrink-0 text-mist" />
                {[i.province, i.region].filter(Boolean).join(", ") || "—"}
              </li>
            </ul>
          </Card>

          <Card>
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">Convenio</h2>
            <p className="mt-3 text-sm text-graphite">
              {i.agreement_signed_at
                ? `Firmado el ${formatDate(i.agreement_signed_at)}`
                : "Todavía sin convenio firmado."}
            </p>
            <Button href="/institucion/convenio" variant="outline" size="sm" className="mt-4 w-full">
              Ver convenio
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
}

