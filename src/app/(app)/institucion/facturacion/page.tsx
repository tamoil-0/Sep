import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import { Card, EmptyState } from "@/components/ui/primitives";

import { PanelSection, StatusBadge } from "@/components/app/data-views";

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

