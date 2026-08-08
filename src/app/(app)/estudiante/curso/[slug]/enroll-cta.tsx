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
    const { enrollAction } = await import("@/server/actions/learning");
    const result = await enrollAction(slug);
    setBusy(false);

    if (result.ok) router.refresh();
    else setError(result.error);
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
          className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] sep-gradient px-5 text-sm font-medium text-white shadow-[0_4px_16px_rgba(46,11,232,.2)] transition-all hover:shadow-[0_8px_24px_rgba(46,11,232,.28)] disabled:opacity-60"
        >
          {busy && <Loader2 className="size-4 animate-spin" />}
          Inscribirme gratis
        </button>
      </div>

      {error && (
        <p className="mt-3 rounded-[10px] border border-danger/25 bg-danger-bg px-3.5 py-2.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
