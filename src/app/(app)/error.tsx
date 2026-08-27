"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContextualHelp } from "@/components/ui/contextual-help";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[sep] error no controlado en el panel:", {
      name: error.name,
      digest: error.digest,
    });
  }, [error.digest, error.name]);

  return (
    <section className="mx-auto flex min-h-[60dvh] max-w-xl items-center justify-center py-10">
      <div className="w-full rounded-lg border border-line bg-white p-6 text-center sm:p-9">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-50 text-danger">
          <AlertTriangle className="size-6" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-semibold text-ink">
          No pudimos cargar esta sección
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-ui">
          No mostramos datos incompletos. Puede ser un problema temporal de conexión;
          vuelve a intentarlo o regresa al panel principal.
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
        <ContextualHelp
          className="mt-6"
          title="¿El problema continúa?"
          description="Escríbenos indicando qué sección abrías y, si aparece, el código de incidente."
        />
      </div>
    </section>
  );
}
