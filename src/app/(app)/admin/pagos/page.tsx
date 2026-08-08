import type { Metadata } from "next";
import { CreditCard, Clock, CircleCheck, CircleX, Wallet } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { getPaymentsToReview } from "@/server/queries/payments";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import { EmptyState } from "@/components/ui/primitives";
import { formatSoles } from "@/lib/utils";
import { PaymentQueue } from "./payment-queue";

export const metadata: Metadata = { title: "Conciliación de pagos" };

export default async function AdminPagosPage() {
  await requireRole(["admin", "super_admin"]);
  const payments = await getPaymentsToReview();

  const toReview = payments.filter((p) => p.status === "en_revision");
  const approved = payments.filter((p) => p.status === "pagado");
  const rejected = payments.filter((p) => p.status === "rechazado");
  const total = approved.reduce((s, p) => s + p.amount_cents, 0);

  return (
    <>
      <PageHeader
        title="Conciliación de pagos"
        description="Valida los comprobantes de Yape y Plin. Al aprobar, el certificado se emite automáticamente."
      />

      <KpiGrid>
        <Kpi
          label="Por revisar"
          value={toReview.length}
          hint={toReview.length ? "Requieren tu atención" : "Todo al día"}
          icon={<Clock className="size-4" />}
        />
        <Kpi label="Aprobados" value={approved.length} icon={<CircleCheck className="size-4" />} />
        <Kpi label="Rechazados" value={rejected.length} icon={<CircleX className="size-4" />} />
        <Kpi
          label="Total recaudado"
          value={formatSoles(total)}
          icon={<Wallet className="size-4" />}
        />
      </KpiGrid>

      <section className="mt-8">
        {payments.length === 0 ? (
          <EmptyState
            icon={<CreditCard className="size-5" />}
            title="Todavía no hay pagos"
            description="Cuando alguien suba un comprobante de Yape o Plin, aparecerá aquí para que lo valides."
          />
        ) : (
          <PaymentQueue
            payments={payments.map((p) => ({
              id: p.id,
              method: p.method,
              amountCents: p.amount_cents,
              status: p.status,
              operationCode: p.operation_code,
              voucherUrl: p.voucher_url,
              createdAt: p.created_at,
              paidAt: p.paid_at,
              rejectReason: p.reject_reason,
              itemType: p.order?.item_type ?? "—",
              buyerName: p.buyer?.full_name ?? "—",
              buyerEmail: p.buyer?.email ?? "—",
              buyerRegion: p.buyer?.region ?? null,
            }))}
          />
        )}
      </section>
    </>
  );
}
