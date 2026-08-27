"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { registerForEventAction } from "@/server/actions/learning";

export function EventRegisterButton({
  eventId,
  registered,
}: {
  eventId: string;
  registered: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState<{ text: string; ok: boolean } | null>(null);

  if (registered) {
    return (
      <p className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
        <Check className="size-4" />
        Ya estás inscrito
      </p>
    );
  }

  return (
    <div>
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setMsg(null);
          try {
            const r = await registerForEventAction(eventId);
            setMsg({ text: r.ok ? (r.message ?? "Inscripción confirmada.") : r.error, ok: r.ok });
            if (r.ok) router.refresh();
          } catch {
            setMsg({ text: "No pudimos conectarnos. Revisa tu conexión e inténtalo nuevamente.", ok: false });
          } finally {
            setBusy(false);
          }
        }}
        className="inline-flex min-h-control w-full items-center justify-center gap-2 rounded-sm bg-sep-600 text-sm font-medium text-white transition-colors hover:bg-sep-700 disabled:opacity-60"
      >
        {busy && <Loader2 className="size-4 animate-spin" />}
        Inscribirme
      </button>
      {msg && (
        <p className={msg.ok ? "mt-2 text-xs text-success" : "mt-2 text-xs text-danger"} role="status">
          {msg.text}
        </p>
      )}
    </div>
  );
}
