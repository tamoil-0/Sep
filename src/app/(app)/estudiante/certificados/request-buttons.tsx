"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { createOrderAction } from "@/server/actions/payments";
import { formatSoles } from "@/lib/utils";
import { FormAlert } from "@/components/forms/field";
import { cn } from "@/lib/utils";

interface CertType {
  id: string;
  name: string;
  issuer: string;
  priceCents: number;
  kind: string;
  owned: boolean;
}

export function RequestCertificateButtons({
  enrollmentId,
  types,
}: {
  enrollmentId: string;
  types: CertType[];
}) {
  const router = useRouter();
  const [loading, setLoading] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function request(typeId: string) {
    setLoading(typeId);
    setError(null);

    const result = await createOrderAction({
      itemType: "certificate",
      itemId: typeId,
      refId: enrollmentId,
    });

    if (result.ok) {
      router.push(`/pagar/${result.data}`);
    } else {
      setError(result.error);
      setLoading(null);
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-3">
          <FormAlert tone="error">{error}</FormAlert>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {types.map((t) => (
          <button
            key={t.id}
            type="button"
            disabled={t.owned || loading !== null}
            onClick={() => request(t.id)}
            className={cn(
              "group flex items-start justify-between gap-3 rounded-[12px] border p-4 text-left transition-all",
              t.owned
                ? "cursor-default border-success/30 bg-success-bg"
                : "border-line bg-white hover:border-sep-300 hover:shadow-[0_6px_20px_rgba(46,11,232,.08)] disabled:opacity-60",
            )}
          >
            <div className="min-w-0">
              <p className="text-[0.9375rem] font-medium text-ink">{t.name}</p>
              <p className="mt-0.5 truncate text-xs text-slate-ui">{t.issuer}</p>
              {t.owned && (
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-success">
                  <Check className="size-3.5" />
                  Ya lo tienes
                </p>
              )}
            </div>

            <div className="shrink-0 text-right">
              <p className="tabular font-display text-lg font-semibold text-ink">
                {formatSoles(t.priceCents)}
              </p>
              {!t.owned && (
                <p className="mt-1 text-xs font-medium text-sep-600">
                  {loading === t.id ? (
                    <Loader2 className="ml-auto size-3.5 animate-spin" />
                  ) : (
                    "Obtener →"
                  )}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
