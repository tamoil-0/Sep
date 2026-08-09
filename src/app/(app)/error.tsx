"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[sep] error no controlado en el panel:", error);
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[60dvh] max-w-xl items-center justify-center py-10">
      <div className="w-full rounded-3xl border border-line bg-white p-6 text-center shadow-[0_18px_60px_rgba(46,11,232,.08)] sm:p-9">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-50 text-danger">
          <AlertTriangle className="size-6" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-semibold text-ink">
          No pudimos cargar esta sección
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-ui">
          Tus datos están seguros. Puede ser un problema temporal de conexión; vuelve a
          intentarlo o regresa al panel principal.
        </p>

        {error.digest && (
          <p className="mt-3 text-xs text-mist">Código de incidente: {error.digest}</p>
        )}

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button type="button" onClick={reset}>
            <RotateCcw className="size-4" />
            Reintentar
          </Button>
          <Button href="/panel" variant="outline">
            Volver a mi panel
          </Button>
        </div>
      </div>
    </section>
  );
}
