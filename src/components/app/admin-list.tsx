import { Inbox } from "lucide-react";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import { DataTable, EmptyState } from "@/components/app/data-views";
import type { AdminView } from "@/app/(app)/admin/_registry";

/**
 * Renderiza una vista de listado del panel de administración a partir de su
 * declaración en `_registry`. Cada pantalla queda en tres líneas y todas se
 * ven exactamente igual.
 */
export async function AdminList({ view }: { view: AdminView }) {
  const { rows, kpis } = await view.load();

  return (
    <>
      <PageHeader title={view.title} description={view.description} />

      <KpiGrid>
        {kpis.map((k) => (
          <Kpi key={k.label} label={k.label} value={k.value} hint={k.hint} />
        ))}
      </KpiGrid>

      <div className="mt-8">
        <DataTable
          rows={rows}
          columns={view.columns}
          caption={view.title}
          empty={
            <EmptyState
              icon={<Inbox className="size-5" />}
              title={view.emptyTitle}
              description={view.emptyDescription}
            />
          }
        />
      </div>
    </>
  );
}
