"use client";

import { Printer } from "lucide-react";

export function PrintButton({ label = "Imprimir / Guardar PDF" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-control items-center gap-2 rounded-sm bg-sep-600 px-4 text-sm font-medium text-white transition-colors hover:bg-sep-700 print:hidden"
    >
      <Printer className="size-4" />
      {label}
    </button>
  );
}
