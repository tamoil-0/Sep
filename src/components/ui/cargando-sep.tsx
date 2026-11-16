import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

/**
 * Pantalla de carga de marca (feedback de voluntarios: «que se note, elegante,
 * con SEP girando»). El logo queda quieto y legible; lo que gira es un anillo
 * de luz a su alrededor, y debajo una frase que dice qué está pasando.
 * Respeta `prefers-reduced-motion` (el anillo se queda quieto) y se anuncia
 * a lectores de pantalla.
 *
 * - `variant="panel"`: ocupa el área de contenido del panel.
 * - `variant="overlay"`: cubre la pantalla (p. ej. al inscribirse en un curso).
 */
export function CargandoSEP({
  mensaje = "Cargando…",
  variant = "panel",
  className,
}: {
  mensaje?: string;
  variant?: "panel" | "overlay";
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "flex flex-col items-center justify-center gap-5 text-center",
        variant === "overlay"
          ? "fixed inset-0 z-50 bg-surface-1/85 backdrop-blur-sm"
          : "min-h-96",
        className,
      )}
    >
      <div className="cargando-sep relative grid size-28 place-items-center">
        <span aria-hidden className="cargando-sep__anillo absolute inset-0 rounded-full" />
        <span className="relative grid size-20 place-items-center rounded-full bg-surface-0 shadow-elevated">
          <Logo className="h-8" />
        </span>
      </div>
      <p className="font-display text-body-lg font-semibold text-ink">{mensaje}</p>
    </div>
  );
}
