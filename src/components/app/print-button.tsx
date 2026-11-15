"use client";

import { Printer } from "lucide-react";

export function PrintButton({ label = "Imprimir / Guardar PDF" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-control items-center gap-2 rounded-sm bg-violeta-600 px-4 text-body-sm font-medium text-white transition-colors hover:bg-violeta-700 print:hidden"
    >
      <Printer className="size-4" />
      {label}
    </button>
  );
}
