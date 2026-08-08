/** Cuarta tanda: institución, speaker y cuenta. */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const write = (p, b) => {
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, b.trimStart() + "\n");
};
const A = "src/app/(app)";

const instHeader = `
import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import { Badge, Card, EmptyState } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { PanelSection, StatusBadge } from "@/components/app/data-views";
`;

/* ═══════════════ INSTITUCIÓN ═══════════════ */

write(`${A}/institucion/perfil/page.tsx`, `${instHeader}
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
                ? \`Firmado el \${formatDate(i.agreement_signed_at)}\`
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
`);

write(`${A}/institucion/talleres/page.tsx`, `${instHeader}
import { Presentation } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Talleres" };

export default async function InstitucionTalleresPage() {
  const user = await requireRole(["institucion", "admin", "super_admin"]);
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles").select("institution_id").eq("id", user.id).maybeSingle();

  if (!profile?.institution_id) {
    return (
      <>
        <PageHeader title="Talleres" />
        <EmptyState
          icon={<Presentation className="size-5" />}
          title="Sin institución vinculada"
          action={<Button href="/institucion/perfil">Ver mi perfil</Button>}
        />
      </>
    );
  }

  const { data: workshops } = await supabase
    .from("workshops")
    .select("id, title, topic, scheduled_at, modality, grade, students_count, status")
    .eq("institution_id", profile.institution_id)
    .order("scheduled_at", { ascending: false });

  const rows = workshops ?? [];
  const done = rows.filter((w) => w.status === "realizado");

  return (
    <>
      <PageHeader
        title="Talleres"
        description="Todo lo que SEP ha dictado o tiene programado en tu institución."
        action={<Button href="/contacto" variant="outline">Solicitar un taller</Button>}
      />

      <KpiGrid>
        <Kpi label="Total" value={rows.length} icon={<Presentation className="size-4" />} />
        <Kpi label="Realizados" value={done.length} />
        <Kpi label="Programados" value={rows.filter((w) => w.status === "confirmado").length} />
        <Kpi label="Estudiantes" value={done.reduce((s, w) => s + (w.students_count ?? 0), 0)} />
      </KpiGrid>

      <PanelSection title="Historial">
        {rows.length === 0 ? (
          <EmptyState
            icon={<Presentation className="size-5" />}
            title="Sin talleres todavía"
            description="Escríbenos y coordinamos el primero. Para colegios de la red no tiene costo."
          />
        ) : (
          <Card className="p-0">
            <ul className="divide-y divide-line">
              {rows.map((w) => (
                <li key={w.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{w.title}</p>
                    <p className="mt-0.5 text-xs text-slate-ui">
                      {w.grade ?? "—"}
                      {w.students_count ? \` · \${w.students_count} estudiantes\` : ""}
                      {w.scheduled_at ? \` · \${formatDate(w.scheduled_at)}\` : " · fecha por coordinar"}
                    </p>
                  </div>
                  <Badge tone="neutral">{w.modality}</Badge>
                  <StatusBadge status={w.status} />
                </li>
              ))}
            </ul>
          </Card>
        )}
      </PanelSection>
    </>
  );
}
`);

write(`${A}/institucion/estudiantes/page.tsx`, `${instHeader}
import { GraduationCap, ShieldCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Estudiantes" };

/** Anonimiza el apellido: los escolares son menores de edad (Ley 29733). */
function anonymize(name: string) {
  const parts = name.trim().split(/\\s+/);
  if (parts.length < 2) return parts[0] ?? "—";
  return \`\${parts[0]} \${parts[1][0]}.\`;
}

export default async function InstitucionEstudiantesPage() {
  const user = await requireRole(["institucion", "admin", "super_admin"]);
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles").select("institution_id").eq("id", user.id).maybeSingle();

  if (!profile?.institution_id) {
    return (
      <>
        <PageHeader title="Estudiantes" />
        <EmptyState icon={<GraduationCap className="size-5" />} title="Sin institución vinculada" />
      </>
    );
  }

  const { data: workshops } = await supabase
    .from("workshops")
    .select("id, title, scheduled_at, grade")
    .eq("institution_id", profile.institution_id)
    .order("scheduled_at", { ascending: false });

  const ids = (workshops ?? []).map((w) => w.id);
  const { data: attendees } = ids.length
    ? await supabase
        .from("workshop_attendees")
        .select("id, workshop_id, student_name, grade, attended, certificate_id")
        .in("workshop_id", ids)
    : { data: [] };

  const rows = attendees ?? [];
  const byWorkshop = new Map((workshops ?? []).map((w) => [w.id, w]));
  const withCert = rows.filter((a) => a.certificate_id).length;

  return (
    <>
      <PageHeader
        title="Estudiantes"
        description="Asistencia registrada en los talleres. Los nombres se muestran anonimizados."
      />

      <KpiGrid>
        <Kpi label="Registros" value={rows.length} icon={<GraduationCap className="size-4" />} />
        <Kpi label="Asistieron" value={rows.filter((a) => a.attended).length} />
        <Kpi label="Con constancia" value={withCert} icon={<ShieldCheck className="size-4" />} />
        <Kpi label="Talleres" value={workshops?.length ?? 0} />
      </KpiGrid>

      <Card className="mt-8 border-sep-200 bg-sep-50/40">
        <p className="text-sm leading-relaxed text-graphite">
          <strong className="font-medium text-ink">Sobre la privacidad:</strong> son menores
          de edad, así que SEP no crea cuentas para ellos ni guarda más que su nombre y grado,
          bajo responsabilidad del colegio y con consentimiento del apoderado. Aquí los ves
          anonimizados conforme a la Ley N.º 29733.
        </p>
      </Card>

      <PanelSection title="Asistencia">
        {rows.length === 0 ? (
          <EmptyState
            icon={<GraduationCap className="size-5" />}
            title="Sin asistencia registrada"
            description="Aparecerá después del primer taller realizado."
          />
        ) : (
          <Card className="p-0">
            <ul className="divide-y divide-line">
              {rows.slice(0, 120).map((a) => {
                const w = byWorkshop.get(a.workshop_id);
                return (
                  <li key={a.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">
                        {anonymize(a.student_name)}
                      </p>
                      <p className="truncate text-xs text-slate-ui">
                        {a.grade ?? w?.grade ?? "—"}
                        {w?.scheduled_at ? \` · \${formatDate(w.scheduled_at)}\` : ""}
                      </p>
                    </div>
                    {a.certificate_id && <Badge tone="success">Constancia</Badge>}
                    {a.attended ? <Badge tone="seed">Asistió</Badge> : <Badge tone="neutral">Faltó</Badge>}
                  </li>
                );
              })}
            </ul>
          </Card>
        )}
      </PanelSection>
    </>
  );
}
`);

write(`${A}/institucion/convenio/page.tsx`, `${instHeader}
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
              ? \`Convenio firmado el \${formatDate(i!.agreement_signed_at!)}\`
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
`);

write(`${A}/institucion/facturacion/page.tsx`, `${instHeader}
import { Receipt, Wallet } from "lucide-react";
import { formatDate, formatSoles } from "@/lib/utils";

export const metadata: Metadata = { title: "Facturación" };

export default async function InstitucionFacturacionPage() {
  const user = await requireRole(["institucion", "admin", "super_admin"]);
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles").select("institution_id, institutions(name, ruc)").eq("id", user.id).maybeSingle();

  const inst = Array.isArray(profile?.institutions) ? profile?.institutions[0] : profile?.institutions;

  const { data: orders } = profile?.institution_id
    ? await supabase
        .from("orders")
        .select("id, item_type, amount_cents, status, created_at")
        .eq("institution_id", profile.institution_id)
        .order("created_at", { ascending: false })
    : { data: [] };

  const rows = orders ?? [];
  const paid = rows.filter((o) => o.status === "pagado");

  return (
    <>
      <PageHeader
        title="Facturación"
        description="Órdenes y comprobantes de tus programas con SEP."
      />

      <KpiGrid>
        <Kpi label="Total facturado" value={formatSoles(paid.reduce((s, o) => s + o.amount_cents, 0))} icon={<Wallet className="size-4" />} />
        <Kpi label="Órdenes" value={rows.length} icon={<Receipt className="size-4" />} />
        <Kpi label="Pagadas" value={paid.length} />
        <Kpi label="RUC" value={inst?.ruc ?? "—"} />
      </KpiGrid>

      <PanelSection title="Historial">
        {rows.length === 0 ? (
          <EmptyState
            icon={<Receipt className="size-5" />}
            title="Sin órdenes registradas"
            description="Los talleres para colegios de la red no tienen costo, así que es normal que esto esté vacío."
          />
        ) : (
          <Card className="p-0">
            <ul className="divide-y divide-line">
              {rows.map((o) => (
                <li key={o.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{o.item_type}</p>
                    <p className="mt-0.5 text-xs text-slate-ui">{formatDate(o.created_at)}</p>
                  </div>
                  <p className="tabular text-sm font-semibold text-ink">{formatSoles(o.amount_cents)}</p>
                  <StatusBadge status={o.status} />
                </li>
              ))}
            </ul>
          </Card>
        )}
      </PanelSection>
    </>
  );
}
`);

console.log("institucion listo");
