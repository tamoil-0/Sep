"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CheckCheck, Loader2 } from "lucide-react";
import { markAllReadAction } from "@/server/actions/profile";

export function MarkAllReadButton() {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await markAllReadAction();
        setBusy(false);
        router.refresh();
      }}
      className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-line bg-white px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-1 disabled:opacity-60"
    >
      {busy ? <Loader2 className="size-4 animate-spin" /> : <CheckCheck className="size-4" />}
      Marcar todo como leído
    </button>
  );
}

