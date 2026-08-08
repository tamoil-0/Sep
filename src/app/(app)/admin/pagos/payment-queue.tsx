"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Eye,
  Loader2,
  MapPin,
  Receipt,
  X,
} from "lucide-react";
import { reviewPaymentAction, getVoucherUrlAction } from "@/server/actions/payments";
import { Badge, Card } from "@/components/ui/primitives";
import { Textarea } from "@/components/forms/field";
import { formatSoles, relativeTime, initials } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PaymentRow {
  id: string;
  method: string;
  amountCents: number;
  status: string;
  operationCode: string | null;
  voucherUrl: string | null;
  createdAt: string;
  paidAt: string | null;
  rejectReason: string | null;
  itemType: string;
  buyerName: string;
  buyerEmail: string;
  buyerRegion: string | null;
}

const methodLabels: Record<string, string> = {
  yape: "Yape",
  plin: "Plin",
  culqi_card: "Tarjeta",
  transferencia: "Transferencia",
  gratuito: "Gratuito",
};

const itemLabels: Record<string, string> = {
  certificate: "Certificado",
  membership: "Membresía",
  silp: "SILP",
  b2b_program: "Programa B2B",
};

const statusTone = {
  en_revision: "warning",
  pagado: "success",
  rechazado: "danger",
  pendiente: "neutral",
  reembolsado: "neutral",
} as const;

const statusLabel: Record<string, string> = {
  en_revision: "Por revisar",
  pagado: "Aprobado",
  rechazado: "Rechazado",
  pendiente: "Pendiente",
  reembolsado: "Reembolsado",
};

const TABS = [
  { key: "en_revision", label: "Por revisar" },
  { key: "pagado", label: "Aprobados" },
  { key: "rechazado", label: "Rechazados" },
  { key: "all", label: "Todos" },
] as const;

export function PaymentQueue({ payments }: { payments: PaymentRow[] }) {
  const router = useRouter();
  const [tab, setTab] = React.useState<string>("en_revision");
  const [busy, setBusy] = React.useState<string | null>(null);
  const [rejecting, setRejecting] = React.useState<string | null>(null);
  const [reason, setReason] = React.useState("");
  const [feedback, setFeedback] = React.useState<{ id: string; text: string; ok: boolean } | null>(null);
  const [voucher, setVoucher] = React.useState<{ url: string; row: PaymentRow } | null>(null);

  const visible =
    tab === "all" ? payments : payments.filter((p) => p.status === tab);

  const counts = React.useMemo(
    () => ({
      en_revision: payments.filter((p) => p.status === "en_revision").length,
      pagado: payments.filter((p) => p.status === "pagado").length,
      rechazado: payments.filter((p) => p.status === "rechazado").length,
      all: payments.length,
    }),
    [payments],
  );

  async function openVoucher(row: PaymentRow) {
    if (!row.voucherUrl) return;
    setBusy(row.id);
    const result = await getVoucherUrlAction(row.voucherUrl);
    setBusy(null);
    if (result.ok) setVoucher({ url: result.data, row });
    else setFeedback({ id: row.id, text: result.error, ok: false });
  }

  async function review(id: string, approve: boolean) {
    setBusy(id);
    const result = await reviewPaymentAction(id, approve, approve ? undefined : reason);
    setBusy(null);

    if (result.ok) {
      setFeedback({ id, text: result.message ?? "Listo.", ok: true });
      setRejecting(null);
      setReason("");
      router.refresh();
    } else {
      setFeedback({ id, text: result.error, ok: false });
    }
  }

  return (
    <>
      {/* Pestañas */}
      <div className="mb-5 flex flex-wrap gap-1.5">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              tab === t.key
                ? "bg-sep-600 text-white"
                : "bg-white text-graphite ring-1 ring-inset ring-line hover:bg-surface-2",
            )}
          >
            {t.label}
            <span
              className={cn(
                "tabular ml-1.5",
                tab === t.key ? "text-white/70" : "text-mist",
              )}
            >
              {counts[t.key as keyof typeof counts]}
            </span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <Card className="py-10 text-center">
          <p className="text-sm text-slate-ui">Nada por aquí.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {visible.map((p) => (
            <Card key={p.id} className="p-0">
              <div className="flex flex-wrap items-start gap-4 p-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full sep-gradient text-xs font-semibold text-white">
                  {initials(p.buyerName)}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-[0.9375rem] font-semibold text-ink">
                      {p.buyerName}
                    </p>
                    <Badge tone={statusTone[p.status as keyof typeof statusTone] ?? "neutral"}>
                      {statusLabel[p.status] ?? p.status}
                    </Badge>
                    <Badge tone="neutral">{methodLabels[p.method] ?? p.method}</Badge>
                  </div>

                  <p className="mt-1 truncate text-xs text-slate-ui">
                    {p.buyerEmail}
                    {p.buyerRegion && (
                      <>
                        {" · "}
                        <MapPin className="inline size-3" /> {p.buyerRegion}
                      </>
                    )}
                  </p>

                  <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-xs">
                    <div>
                      <dt className="inline text-slate-ui">Concepto: </dt>
                      <dd className="inline font-medium text-ink">
                        {itemLabels[p.itemType] ?? p.itemType}
                      </dd>
                    </div>
                    <div>
                      <dt className="inline text-slate-ui">Operación: </dt>
                      <dd className="tabular inline font-medium text-ink">
                        {p.operationCode ?? "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="inline text-slate-ui">Recibido: </dt>
                      <dd className="inline font-medium text-ink">
                        {relativeTime(p.createdAt)}
                      </dd>
                    </div>
                  </dl>

                  {p.rejectReason && (
                    <p className="mt-2.5 rounded-lg bg-danger-bg px-3 py-2 text-xs leading-relaxed text-danger">
                      {p.rejectReason}
                    </p>
                  )}

                  {feedback?.id === p.id && (
                    <p
                      className={cn(
                        "mt-2.5 rounded-lg px-3 py-2 text-xs leading-relaxed",
                        feedback.ok
                          ? "bg-success-bg text-success"
                          : "bg-danger-bg text-danger",
                      )}
                      role="status"
                    >
                      {feedback.text}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <p className="tabular font-display text-xl font-semibold text-ink">
                    {formatSoles(p.amountCents)}
                  </p>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex flex-wrap items-center gap-2 border-t border-line px-5 py-3">
                {p.voucherUrl && (
                  <button
                    type="button"
                    onClick={() => openVoucher(p)}
                    disabled={busy === p.id}
                    className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-line bg-white px-3.5 text-sm text-graphite transition-colors hover:bg-surface-2 disabled:opacity-50"
                  >
                    {busy === p.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                    Ver comprobante
                  </button>
                )}

                {p.status === "en_revision" && (
                  <>
                    <button
                      type="button"
                      onClick={() => review(p.id, true)}
                      disabled={busy === p.id}
                      className="inline-flex h-9 items-center gap-2 rounded-[8px] bg-success px-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      <Check className="size-4" />
                      Aprobar y emitir
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRejecting(rejecting === p.id ? null : p.id);
                        setReason("");
                      }}
                      className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-danger/30 bg-white px-3.5 text-sm font-medium text-danger transition-colors hover:bg-danger-bg"
                    >
                      <X className="size-4" />
                      Rechazar
                    </button>
                  </>
                )}
              </div>

              {rejecting === p.id && (
                <div className="border-t border-line bg-surface-1 p-5">
                  <label
                    htmlFor={`reason-${p.id}`}
                    className="mb-1.5 block text-sm font-medium text-graphite"
                  >
                    ¿Por qué rechazas el pago? Se lo enviamos tal cual al estudiante.
                  </label>
                  <Textarea
                    id={`reason-${p.id}`}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Ej. El código de operación no coincide con ningún movimiento recibido."
                    rows={3}
                  />
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => review(p.id, false)}
                      disabled={busy === p.id || reason.trim().length < 10}
                      className="inline-flex h-9 items-center gap-2 rounded-[8px] bg-danger px-4 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      {busy === p.id && <Loader2 className="size-4 animate-spin" />}
                      Confirmar rechazo
                    </button>
                    <button
                      type="button"
                      onClick={() => setRejecting(null)}
                      className="inline-flex h-9 items-center rounded-[8px] px-4 text-sm text-graphite hover:bg-surface-2"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Visor del comprobante */}
      {voucher && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-5 backdrop-blur-sm"
          onClick={() => setVoucher(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Comprobante de pago"
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-[16px] bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <Receipt className="size-4 text-slate-ui" />
                <div>
                  <p className="text-sm font-medium text-ink">{voucher.row.buyerName}</p>
                  <p className="tabular text-xs text-slate-ui">
                    {methodLabels[voucher.row.method]} ·{" "}
                    {formatSoles(voucher.row.amountCents)} · Op.{" "}
                    {voucher.row.operationCode}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setVoucher(null)}
                className="rounded-lg p-2 text-slate-ui hover:bg-surface-2"
                aria-label="Cerrar"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5">
              {voucher.url.includes(".pdf") ? (
                <iframe
                  src={voucher.url}
                  title="Comprobante"
                  className="h-[60vh] w-full rounded-lg border border-line"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={voucher.url}
                  alt="Comprobante de pago"
                  className="mx-auto max-h-[60vh] rounded-lg border border-line object-contain"
                />
              )}
              <p className="mt-3 text-center text-xs text-mist">
                Enlace temporal: caduca en 5 minutos.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
