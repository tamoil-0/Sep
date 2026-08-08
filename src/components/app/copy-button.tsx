"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function CopyButton({
  value,
  label = "Copiar",
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <button
      type="button"
      aria-label={label}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
        } catch {
          /* el navegador puede bloquearlo sin HTTPS; no rompemos nada */
        }
      }}
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-lg text-slate-ui transition-colors hover:bg-surface-2 hover:text-ink",
        copied && "text-success",
        className,
      )}
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-3.5" />}
    </button>
  );
}
