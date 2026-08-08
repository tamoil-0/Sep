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
  const [msg, setMsg] = React.useState<string | null>(null);

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
          const r = await registerForEventAction(eventId);
          setBusy(false);
          setMsg(r.ok ? (r.message ?? "Listo.") : r.error);
          if (r.ok) router.refresh();
        }}
        className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-[8px] bg-sep-600 text-sm font-medium text-white transition-colors hover:bg-sep-700 disabled:opacity-60"
      >
        {busy && <Loader2 className="size-4 animate-spin" />}
        Inscribirme
      </button>
      {msg && <p className="mt-2 text-xs text-slate-ui">{msg}</p>}
    </div>
  );
}

