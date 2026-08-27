"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Mail, Phone, X } from "lucide-react";
import { updateSchoolApplicationAction } from "@/server/actions/admin";
import { Badge, Card, EmptyState } from "@/components/ui/primitives";
import { StatusBadge } from "@/components/app/data-views";
import { relativeTime, cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

interface SchoolApp {
  id: string;
  schoolName: string;
  location: string;
  directorName: string;
  phone: string;
  email: string;
  students: number | null;
  expectations: string | null;
  status: string;
  createdAt: string;
}

export function SchoolQueue({ applications }: { applications: SchoolApp[] }) {
  const router = useRouter();
  const [busy, setBusy] = React.useState<string | null>(null);
  const [msg, setMsg] = React.useState<{ text: string; ok: boolean } | null>(null);
  const [confirming, setConfirming] = React.useState<{ id: string; status: "aprobada" | "rechazada" } | null>(null);
  const toast = useToast();

  React.useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 5000);
    return () => clearTimeout(t);
  }, [msg]);

  async function act(id: string, status: "en_revision" | "aprobada" | "rechazada") {
    setBusy(id);
    try {
      const r = await updateSchoolApplicationAction(id, status);
      const text = r.ok ? (r.message ?? "Cambio guardado.") : r.error;
      setMsg({ text, ok: r.ok });
      toast({ title: text, tone: r.ok ? "success" : "error" });
      if (r.ok) router.refresh();
    } catch {
      const text = "No pudimos conectarnos. Revisa tu conexión e inténtalo nuevamente.";
      setMsg({ text, ok: false });
      toast({ title: "No se guardó el cambio", description: text, tone: "error" });
    } finally {
      setBusy(null);
      setConfirming(null);
    }
  }

  if (applications.length === 0) {
    return (
      <EmptyState
        icon={<Check className="size-5" />}
        title="Sin solicitudes pendientes"
        description="Las nuevas llegan desde el formulario público de /colegios."
      />
    );
  }

  return (
    <>
      {msg && (
        <div
          role="status"
          className={cn(
            "mb-4 rounded-sm px-4 py-3 text-sm",
            msg.ok
              ? "border border-success/25 bg-success-bg text-success"
              : "border border-danger/25 bg-danger-bg text-danger",
          )}
        >
          {msg.text}
        </div>
      )}

      <div className="space-y-3">
        {applications.map((a) => (
          <Card key={a.id} className="p-5">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-body font-semibold text-ink">
                  {a.schoolName}
                </p>
                <StatusBadge status={a.status} />
                {a.students ? (
                  <Badge tone="neutral">{a.students} estudiantes</Badge>
                ) : null}
              </div>

              <p className="mt-1 text-sm text-slate-ui">
                {a.location} · {a.directorName}
              </p>

              <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-ui">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="size-3.5" />
                  {a.email}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="size-3.5" />
                  {a.phone}
                </span>
                <span>{relativeTime(a.createdAt)}</span>
              </div>

              {a.expectations && (
                <p className="mt-3 rounded-sm bg-surface-1 p-3.5 text-sm leading-relaxed text-graphite">
                  {a.expectations}
                </p>
              )}
            </div>

            {a.status !== "aprobada" && a.status !== "rechazada" && (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                <button
                  type="button"
                  disabled={busy === a.id}
                  onClick={() => setConfirming({ id: a.id, status: "aprobada" })}
                  className="inline-flex min-h-control items-center gap-1.5 rounded-sm bg-success px-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                >
                  {busy === a.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Check className="size-4" />
                  )}
                  Aprobar e incorporar
                </button>
                <button
                  type="button"
                  disabled={busy === a.id}
                  onClick={() => act(a.id, "en_revision")}
                  className="inline-flex min-h-control items-center rounded-sm border border-line px-3.5 text-sm text-graphite transition-colors hover:bg-surface-2 disabled:opacity-40"
                >
                  Marcar en revisión
                </button>
                <button
                  type="button"
                  disabled={busy === a.id}
                  onClick={() => setConfirming({ id: a.id, status: "rechazada" })}
                  className="inline-flex min-h-control items-center gap-1.5 rounded-sm border border-danger/30 px-3.5 text-sm font-medium text-danger transition-colors hover:bg-danger-bg disabled:opacity-40"
                >
                  <X className="size-4" />
                  Rechazar
                </button>
              </div>
            )}
            {confirming?.id === a.id && (
              <div className={cn(
                "mt-3 rounded-sm border p-4",
                confirming.status === "rechazada"
                  ? "border-danger/25 bg-danger-bg"
                  : "border-success/25 bg-success-bg",
              )}>
                <p className="text-body-sm font-semibold text-ink">
                  {confirming.status === "rechazada"
                    ? `Rechazar la solicitud de ${a.schoolName}`
                    : `Aprobar e incorporar a ${a.schoolName}`}
                </p>
                <p className="mt-1 text-caption text-graphite">
                  {confirming.status === "rechazada"
                    ? "La solicitud quedará cerrada como rechazada. Verifica la información antes de continuar."
                    : "La institución pasará al estado aprobado dentro del seguimiento administrativo."}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busy === a.id}
                    onClick={() => void act(a.id, confirming.status)}
                    className={cn(
                      "min-h-control rounded-sm px-4 text-body-sm font-semibold text-white disabled:opacity-50",
                      confirming.status === "rechazada" ? "bg-danger" : "bg-success",
                    )}
                  >
                    {confirming.status === "rechazada" ? "Confirmar rechazo" : "Aprobar e incorporar"}
                  </button>
                  <button type="button" onClick={() => setConfirming(null)} className="min-h-control rounded-sm px-4 text-body-sm font-semibold text-graphite hover:bg-white">
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </>
  );
}
