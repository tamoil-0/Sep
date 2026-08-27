"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

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
  const toast = useToast();

  React.useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <button
      type="button"
      aria-label={copied ? `${label}: copiado` : label}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          toast({ title: "Enlace copiado", tone: "success" });
        } catch {
          toast({
            title: "No pudimos copiar el enlace",
            description: "Selecciona el texto y cópialo manualmente.",
            tone: "error",
          });
        }
      }}
      className={cn(
        "inline-flex size-control items-center justify-center rounded-sm text-slate-ui transition-colors hover:bg-surface-2 hover:text-ink",
        copied && "text-success",
        className,
      )}
    >
      {copied ? <Check className="size-icon-sm" /> : <Copy className="size-icon-sm" />}
      <span className="sr-only" aria-live="polite">{copied ? "Enlace copiado" : ""}</span>
    </button>
  );
}
