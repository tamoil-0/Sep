"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function EnrollCta({
  slug,
  available,
}: {
  slug: string;
  available: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function enroll() {
    setBusy(true);
    setError(null);
    try {
      const { enrollAction } = await import("@/server/actions/learning");
      const result = await enrollAction(slug);
      if (result.ok) router.refresh();
      else setError(result.error);
    } catch {
      setError("No pudimos conectarnos. Revisa tu conexión e inténtalo nuevamente.");
    } finally {
      setBusy(false);
    }
  }

  if (!available) {
    return (
      <p className="text-sm text-slate-ui">
        Este curso aún no está abierto. Te avisaremos cuando abra la próxima cohorte.
      </p>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-graphite">
          El curso es <strong className="font-medium text-ink">gratuito</strong>. Solo el
          certificado tiene costo, y es opcional.
        </p>
        <button
          type="button"
          onClick={enroll}
          disabled={busy}
          className="inline-flex min-h-control items-center justify-center gap-2 rounded-sm bg-sep-600 px-5 text-sm font-medium text-white  transition-colors  disabled:opacity-60"
        >
          {busy && <Loader2 className="size-4 animate-spin" />}
          Inscribirme gratis
        </button>
      </div>

      {error && (
        <p className="mt-3 rounded-sm border border-danger/25 bg-danger-bg px-3.5 py-2.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
