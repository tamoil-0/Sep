"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { CargandoSEP } from "@/components/ui/cargando-sep";
import { useRouter } from "next/navigation";

export function EnrollCta({
  slug,
  available,
}: {
  slug: string;
  available: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);
  // La carga de marca sigue visible hasta que el aula termina de actualizarse.
  const [refreshing, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  async function enroll() {
    setBusy(true);
    setError(null);
    try {
      const { enrollAction } = await import("@/server/actions/learning");
      const result = await enrollAction(slug);
      if (result.ok) startTransition(() => router.refresh());
      else setError(result.error);
    } catch {
      setError("No pudimos conectarnos. Revisa tu conexión e inténtalo nuevamente.");
    } finally {
      setBusy(false);
    }
  }

  if (!available) {
    return (
      <p className="text-body-sm text-slate-ui">
        Este curso aún no está abierto. Te avisaremos cuando abra la próxima cohorte.
      </p>
    );
  }

  return (
    <div>
      {(busy || refreshing) && <CargandoSEP variant="overlay" mensaje="Inscribiéndote en el curso…" />}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-body-sm text-graphite">
          El curso es <strong className="font-medium text-ink">gratuito</strong>. Solo el
          certificado tiene costo, y es opcional.
        </p>
        <Button onClick={enroll} loading={busy || refreshing}>
          Inscribirme gratis
        </Button>
      </div>

      {error && (
        <p className="mt-3 rounded-sm border border-danger/25 bg-danger-bg px-3.5 py-2.5 text-body-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
