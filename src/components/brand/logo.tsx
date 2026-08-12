import Image from "next/image";

import { cn } from "@/lib/utils";

export const ORIGINAL_LOGO_SRC = "/img/new_images/logo_original.png";

/**
 * Logotipo oficial entregado por SEP. El contenedor recorta únicamente el
 * espacio transparente del PNG; no altera sus proporciones ni sus trazos.
 */
export function Logo({
  className,
  variant = "color",
}: {
  className?: string;
  variant?: "color" | "white" | "ink";
  /** Se conserva para compatibilidad: el lema ya forma parte del logo oficial. */
  showTagline?: boolean;
}) {
  return (
    <span
      className={cn(
        "relative inline-block h-10 shrink-0 overflow-hidden align-middle",
        variant === "white" &&
          "rounded-[9px] bg-white shadow-[0_8px_24px_-14px_rgba(18,16,28,.55)] ring-1 ring-inset ring-white/60",
        className,
      )}
      style={{ aspectRatio: "412 / 275" }}
    >
      <Image
        src={ORIGINAL_LOGO_SRC}
        alt="Semillero de Emprendedores Perú"
        width={500}
        height={500}
        sizes="160px"
        className={cn(
          "pointer-events-none absolute max-w-none select-none",
          variant === "ink" && "brightness-0",
        )}
        style={{
          width: variant === "white" ? "104.6%" : "121.36%",
          height: "auto",
          left: variant === "white" ? "-2.3%" : "-10.92%",
          top: variant === "white" ? "-28.2%" : "-41.82%",
        }}
      />
    </span>
  );
}

/** Presentación institucional con el nombre completo junto al logo oficial. */
export function OrganizationLockup({
  className,
  variant = "color",
}: {
  className?: string;
  variant?: "color" | "white" | "ink";
}) {
  const inverted = variant === "white";

  return (
    <span className={cn("inline-flex items-center gap-3 sm:gap-4", className)}>
      <Logo className="h-12 shrink-0 sm:h-14" variant={variant} />
      <span
        aria-hidden
        className={cn(
          "border-l pl-3 text-left font-display text-[0.72rem] font-semibold uppercase leading-[1.35] tracking-[0.08em] sm:pl-4 sm:text-[0.82rem]",
          inverted ? "border-white/30 text-white/90" : "border-line text-graphite",
        )}
      >
        Semillero de
        <br />
        Emprendedores Perú
      </span>
    </span>
  );
}

/**
 * Uso compacto del isotipo. Se toma directamente de la esquina superior del
 * mismo PNG oficial para evitar una reinterpretación distinta de la marca.
 */
export function Isotipo({
  className,
  variant = "color",
}: {
  className?: string;
  variant?: "color" | "white" | "ink";
}) {
  return (
    <span
      className={cn(
        "relative inline-block size-10 shrink-0 overflow-hidden",
        variant === "white" && "rounded-full bg-white",
        className,
      )}
      aria-label="SEP"
      role="img"
    >
      <Image
        src={ORIGINAL_LOGO_SRC}
        alt=""
        aria-hidden
        width={500}
        height={500}
        sizes="64px"
        className={cn(
          "pointer-events-none absolute max-w-none select-none",
          variant === "ink" && "brightness-0",
        )}
        style={{
          width: "476%",
          height: "auto",
          left: "-347%",
          top: "-100%",
        }}
      />
    </span>
  );
}
