"use client";

import * as React from "react";
import { Loader2, Mail } from "lucide-react";
import { requestPasswordChangeAction } from "@/server/actions/profile";

export function PasswordResetButton({ email }: { email: string }) {
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState<{ text: string; ok: boolean } | null>(null);

  return (
    <div>
      <button
        type="button"
        disabled={busy || Boolean(msg?.ok)}
        onClick={async () => {
          setBusy(true);
          setMsg(null);
          try {
            const r = await requestPasswordChangeAction();
            setMsg({ text: r.ok ? (r.message ?? "Enlace enviado.") : r.error, ok: r.ok });
          } catch {
            setMsg({
              text: "No pudimos conectarnos. Revisa tu conexión e inténtalo nuevamente.",
              ok: false,
            });
          } finally {
            setBusy(false);
          }
        }}
        className="inline-flex min-h-control items-center gap-2 rounded-sm border border-line bg-white px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-1 disabled:opacity-50"
      >
        {busy ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />}
        Enviar enlace a {email}
      </button>
      {msg && (
        <p className={msg.ok ? "mt-2.5 text-sm text-success" : "mt-2.5 text-sm text-danger"}>
          {msg.text}
        </p>
      )}
    </div>
  );
}
