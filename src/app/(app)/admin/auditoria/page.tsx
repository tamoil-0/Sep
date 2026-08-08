import type { Metadata } from "next";
import { Lock, ShieldCheck } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import { DataTable, ComingSoon, EmptyState } from "@/components/app/data-views";
import { Badge } from "@/components/ui/primitives";
import { formatDateTime, initials } from "@/lib/utils";

export const metadata: Metadata = { title: "Auditoría" };

export default async function AdminAuditoriaPage() {
  const user = await requireRole(["admin", "super_admin"]);

  // El log es la última defensa: si un admin cualquiera pudiera leerlo,
  // también podría estudiar cómo evadirlo. Solo super_admin.
  if (!user.roles.includes("super_admin")) {
    return (
      <>
        <PageHeader title="Auditoría" />
        <ComingSoon
          icon={<Lock className="size-6" />}
          title="Solo para super administradores"
          description="El registro contiene quién hizo qué y cuándo, incluidos cambios de rol y aprobaciones de pago. Por diseño, solo un super administrador puede leerlo."
        />
      </>
    );
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("audit_log")
    .select("id, action, entity, entity_id, created_at, ip, profiles(full_name, email)")
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = (data ?? []).map((a) => ({
    ...a,
    actor: Array.isArray(a.profiles) ? a.profiles[0] : a.profiles,
  }));

  return (
    <>
      <PageHeader
        title="Auditoría"
        description="Registro inmutable. Nadie puede editarlo ni borrarlo, ni siquiera tú."
      />

      <KpiGrid>
        <Kpi label="Eventos" value={rows.length} icon={<ShieldCheck className="size-4" />} />
        <Kpi label="Cambios de rol" value={rows.filter((r) => r.entity === "user_roles").length} />
        <Kpi label="Pagos" value={rows.filter((r) => r.entity === "payments").length} />
        <Kpi label="Actores" value={new Set(rows.map((r) => r.actor?.email).filter(Boolean)).size} />
      </KpiGrid>

      <div className="mt-8">
        <DataTable
          rows={rows}
          empty={<EmptyState icon={<ShieldCheck className="size-5" />} title="Sin eventos registrados" />}
          columns={[
            {
              key: "a",
              header: "Quién",
              render: (r) =>
                r.actor ? (
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-2 text-[0.625rem] font-semibold text-graphite">
                      {initials(r.actor.full_name ?? "?")}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink">{r.actor.full_name}</p>
                      <p className="truncate text-xs text-slate-ui">{r.actor.email}</p>
                    </div>
                  </div>
                ) : (
                  <span className="text-mist">sistema</span>
                ),
            },
            { key: "ac", header: "Acción", render: (r) => <Badge tone="neutral">{r.action}</Badge> },
            { key: "e", header: "Entidad", render: (r) => r.entity },
            { key: "ip", header: "IP", render: (r) => <span className="tabular text-xs">{String(r.ip ?? "—")}</span> },
            { key: "t", header: "Cuándo", render: (r) => <span className="capitalize">{formatDateTime(r.created_at)}</span> },
          ]}
        />
      </div>
    </>
  );
}
