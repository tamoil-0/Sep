"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CheckCheck, Loader2 } from "lucide-react";
import { markAllReadAction } from "@/server/actions/profile";
import { useToast } from "@/components/ui/toast";

export function MarkAllReadButton() {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);
  const toast = useToast();

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          const result = await markAllReadAction();
          toast({
            title: result.ok ? (result.message ?? "Notificaciones actualizadas") : "No pudimos actualizar las notificaciones",
            description: result.ok ? undefined : result.error,
            tone: result.ok ? "success" : "error",
          });
          if (result.ok) router.refresh();
        } catch {
          toast({ title: "No pudimos conectarnos", description: "Revisa tu conexión e inténtalo nuevamente.", tone: "error" });
        } finally {
          setBusy(false);
        }
      }}
      className="inline-flex min-h-control items-center gap-2 rounded-sm border border-line bg-white px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-1 disabled:opacity-60"
    >
      {busy ? <Loader2 className="size-4 animate-spin" /> : <CheckCheck className="size-4" />}
      Marcar todo como leído
    </button>
  );
}
