import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  BadgeCheck,
  Clock,
  CircleAlert,
  CircleCheck,
  ShieldCheck,
} from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { getOrderForCheckout } from "@/server/queries/payments";
import { generatePaymentQr } from "@/lib/payments/yape";
import { Badge, Card } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { formatSoles } from "@/lib/utils";
import { VoucherForm } from "./voucher-form";
import { CopyButton } from "@/components/app/copy-button";

export const metadata: Metadata = {
  title: "Completar pago",
  robots: { index: false, follow: false },
};

const statusMeta = {
  pendiente: {
    tone: "neutral" as const,
    label: "Esperando tu pago",
    icon: Clock,
  },
  en_revision: {
    tone: "warning" as const,
    label: "En revisión",
    icon: Clock,
  },
  pagado: { tone: "success" as const, label: "Pagado", icon: CircleCheck },
  rechazado: { tone: "danger" as const, label: "Rechazado", icon: CircleAlert },
  reembolsado: { tone: "neutral" as const, label: "Reembolsado", icon: CircleAlert },
};

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const user = await requireUser();

  const checkout = await getOrderForCheckout(orderId, user.id);
  if (!checkout) notFound();

  const { order, payment, itemName, itemDetail } = checkout;
  const qr = await generatePaymentQr({
    orderId: order.id,
    amountCents: order.amount_cents,
    concept: itemName,
  });

  const meta = statusMeta[order.status] ?? statusMeta.pendiente;
  const isPaid = order.status === "pagado";
  const isReviewing = order.status === "en_revision";
  const canPay = !isPaid && !isReviewing;

  return (
    <>
      <Link
        href="/estudiante/certificados"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-ui transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        Volver a mis certificados
      </Link>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        {/* ── Columna principal ── */}
        <div className="order-2 lg:order-1">
          {isPaid && (
            <Card className="mb-5 border-success/25 bg-success-bg">
              <div className="flex items-start gap-3.5">
                <CircleCheck className="mt-0.5 size-5 shrink-0 text-success" />
                <div>
                  <h2 className="font-display text-[1.0625rem] font-semibold text-ink">
                    Pago confirmado
                  </h2>
                  <p className="mt-1 text-sm text-graphite">
                    Tu certificado ya fue emitido. Puedes descargarlo desde tu panel.
                  </p>
                  <Button
                    href="/estudiante/certificados"
                    variant="primary"
                    size="sm"
                    className="mt-4"
                  >
                    Ver mi certificado
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {isReviewing && (
            <Card className="mb-5 border-warning/30 bg-warning-bg">
              <div className="flex items-start gap-3.5">
                <Clock className="mt-0.5 size-5 shrink-0 text-[#8A5A00]" />
                <div>
                  <h2 className="font-display text-[1.0625rem] font-semibold text-ink">
                    Estamos revisando tu pago
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-graphite">
                    Recibimos tu comprobante con el código{" "}
                    <span className="tabular font-medium">
                      {payment?.operation_code}
                    </span>
                    . El equipo de SEP lo valida en menos de 24 horas y te avisamos por
                    correo. No necesitas volver a pagar.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {order.status === "rechazado" && payment?.reject_reason && (
            <Card className="mb-5 border-danger/25 bg-danger-bg">
              <div className="flex items-start gap-3.5">
                <CircleAlert className="mt-0.5 size-5 shrink-0 text-danger" />
                <div>
                  <h2 className="font-display text-[1.0625rem] font-semibold text-ink">
                    No pudimos validar tu pago
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-graphite">
                    {payment.reject_reason}
                  </p>
                  <p className="mt-2 text-sm text-graphite">
                    Vuelve a enviar el comprobante con la captura completa.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {canPay && (
            <>
              {/* Paso 1 — Yape / Plin */}
              <Card className="p-0">
                <div className="border-b border-line px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-7 items-center justify-center rounded-full sep-gradient text-xs font-semibold text-white">
                      1
                    </span>
                    <h2 className="font-display text-[1.0625rem] font-semibold text-ink">
                      Paga con Yape, Plin o transferencia
                    </h2>
                  </div>
                </div>

                <div className="grid gap-6 p-6 sm:grid-cols-[auto_1fr]">
                  <div className="mx-auto sm:mx-0">
                    <div className="rounded-[14px] border border-line bg-white p-3">
                      <Image
                        src={qr.dataUri}
                        alt="Código QR para pagar con Yape o Plin"
                        width={192}
                        height={192}
                        unoptimized
                        className="size-48"
                      />
                    </div>
                    <p className="mt-2.5 text-center text-xs text-mist">
                      Escanea desde tu app
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.1em] text-slate-ui">
                        Número
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <p className="tabular font-display text-lg font-semibold text-ink">
                          {qr.number}
                        </p>
                        <CopyButton value={qr.number} label="Copiar número" />
                      </div>
                      <p className="mt-0.5 text-xs text-slate-ui">{qr.holder}</p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.1em] text-slate-ui">
                        Monto exacto
                      </p>
                      <p className="tabular mt-1 font-display text-[1.75rem] font-bold leading-none sep-gradient-text">
                        {formatSoles(order.amount_cents)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.1em] text-slate-ui">
                        Referencia — escríbela en el mensaje
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <code className="tabular rounded-lg bg-surface-2 px-2.5 py-1 text-sm font-semibold text-ink">
                          {qr.reference}
                        </code>
                        <CopyButton value={qr.reference} label="Copiar referencia" />
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-ui">
                        Es lo que nos permite encontrar tu pago sin preguntarte nada.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Paso 2 — Voucher */}
              <Card className="mt-4 p-0">
                <div className="border-b border-line px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-7 items-center justify-center rounded-full sep-gradient text-xs font-semibold text-white">
                      2
                    </span>
                    <h2 className="font-display text-[1.0625rem] font-semibold text-ink">
                      Sube tu comprobante
                    </h2>
                  </div>
                </div>

                <div className="p-6">
                  <VoucherForm orderId={order.id} />
                </div>
              </Card>

              {/* Alternativa: tarjeta */}
              <Card className="mt-4 border-dashed">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display text-[0.9375rem] font-semibold text-ink">
                      ¿Prefieres pagar con tarjeta?
                    </h3>
                    <p className="mt-1 text-sm text-slate-ui">
                      Con Culqi la confirmación es inmediata: no esperas revisión.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" disabled title="Próximamente">
                    Pagar con tarjeta
                  </Button>
                </div>
              </Card>
            </>
          )}
        </div>

        {/* ── Resumen ── */}
        <aside className="order-1 lg:order-2">
          <Card className="lg:sticky lg:top-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
              Resumen
            </h2>

            <div className="mt-4 border-b border-line pb-4">
              <p className="font-display text-[1.0625rem] font-semibold text-ink">
                {itemName}
              </p>
              {itemDetail && (
                <p className="mt-0.5 text-sm text-slate-ui">{itemDetail}</p>
              )}
            </div>

            <div className="flex items-baseline justify-between py-4">
              <span className="text-sm text-slate-ui">Total</span>
              <span className="tabular font-display text-[1.75rem] font-bold leading-none text-ink">
                {formatSoles(order.amount_cents)}
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-line pt-4">
              <span className="text-sm text-slate-ui">Estado</span>
              <Badge tone={meta.tone}>
                <meta.icon className="size-3.5" />
                {meta.label}
              </Badge>
            </div>

            <p className="tabular mt-4 text-xs text-mist">
              Orden {qr.reference}
            </p>

            <div className="mt-6 space-y-2.5 border-t border-line pt-5">
              {[
                { icon: ShieldCheck, text: "Pago verificado por el equipo de SEP" },
                { icon: BadgeCheck, text: "Certificado con código público de verificación" },
                { icon: Clock, text: "Confirmación en menos de 24 horas" },
              ].map((f) => (
                <p
                  key={f.text}
                  className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-ui"
                >
                  <f.icon className="mt-0.5 size-4 shrink-0 text-seed-500" />
                  {f.text}
                </p>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </>
  );
}
