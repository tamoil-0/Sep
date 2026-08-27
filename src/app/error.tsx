"use client";

import * as React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  React.useEffect(() => {
    console.error("[sep] error no controlado:", {
      name: error.name,
      digest: error.digest,
    });
  }, [error.digest, error.name]);

  return (
    <main id="contenido" className="flex min-h-[70dvh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-lg border border-line bg-white p-6 text-center  sm:p-9">
        <span className="mx-auto flex size-14 items-center justify-center rounded-lg bg-danger-bg text-danger"><AlertTriangle className="size-6" /></span>
        <h1 className="mt-5 font-display text-h2 font-semibold text-ink">No pudimos cargar esta página</h1>
        <p className="mt-3 text-body-sm text-slate-ui">Puede ser un problema temporal de conexión. Reintenta; si continúa, escríbenos y cuéntanos qué estabas intentando hacer.</p>
        {error.digest && <p className="mt-3 text-caption text-mist">Código de incidente: {error.digest}</p>}
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button type="button" onClick={reset}><RotateCcw />Reintentar</Button>
          <Button href="/" variant="outline">Ir al inicio</Button>
        </div>
        <a className="mt-5 inline-block text-body-sm font-medium text-sep-600 hover:underline" href={`mailto:${siteConfig.contact.email}`}>Contactar a soporte SEP</a>
      </div>
    </main>
  );
}
