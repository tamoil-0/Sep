"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Diálogo sobre `<dialog>` nativo con `showModal()` (REDISEÑO §5):
 * foco atrapado y `Esc` los da el navegador; el foco vuelve al botón que lo
 * abrió; título enlazado con `aria-labelledby`. Animación en globals.css
 * (`dialog.dialogo`): entra en 200 ms, sale en 150 ms, hoja inferior en móvil
 * y sin movimiento con `prefers-reduced-motion`.
 *
 * Controlado: `open` + `onClose`.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  const ref = React.useRef<HTMLDialogElement>(null);
  const titleId = React.useId();
  const descId = React.useId();
  const opener = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      opener.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={cn("dialogo theme-light", className)}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onClose={() => {
        opener.current?.focus();
        onClose();
      }}
      onCancel={(e) => {
        // Esc: cierra por la vía controlada.
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // Clic en el fondo (el propio <dialog>, fuera del contenido) cierra.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[inherit] flex-col">
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 id={titleId} className="font-display text-h4 font-semibold text-ink">
              {title}
            </h2>
            {description && (
              <p id={descId} className="mt-1 text-body-sm text-slate-ui">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="-mr-2 -mt-1 flex size-control shrink-0 items-center justify-center rounded-full text-slate-ui transition-colors hover:bg-surface-2 hover:text-ink"
            aria-label="Cerrar"
          >
            <X className="size-icon-md" aria-hidden strokeWidth={1.75} />
          </button>
        </header>
        {children && <div className="overflow-y-auto px-5 py-5 sm:px-6">{children}</div>}
        {footer && (
          <footer className="flex flex-col-reverse gap-2 border-t border-line px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            {footer}
          </footer>
        )}
      </div>
    </dialog>
  );
}
