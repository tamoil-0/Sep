import { cn } from "@/lib/utils";

/**
 * Wordmark "sep" — reconstrucción vectorial del logotipo oficial.
 * El isotipo es el brote/lazo que remata la "p".
 */
export function Logo({
  className,
  variant = "color",
  showTagline = false,
}: {
  className?: string;
  variant?: "color" | "white" | "ink";
  showTagline?: boolean;
}) {
  const fill =
    variant === "white" ? "#FFFFFF" : variant === "ink" ? "#12101C" : "url(#sepGrad)";
  const taglineFill = variant === "white" ? "rgba(255,255,255,.9)" : "#6E6A85";

  return (
    <span className={cn("inline-flex flex-col leading-none", className)}>
      <svg
        viewBox="0 0 148 56"
        role="img"
        aria-label="Semillero de Emprendedores Perú"
        className="h-full w-auto"
      >
        <defs>
          <linearGradient id="sepGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2E0BE8" />
            <stop offset="52%" stopColor="#6A0DD9" />
            <stop offset="100%" stopColor="#A50FC6" />
          </linearGradient>
        </defs>

        <text
          x="0"
          y="42"
          fill={fill}
          fontFamily="var(--font-display), Poppins, system-ui, sans-serif"
          fontSize="46"
          fontWeight="700"
          letterSpacing="-0.055em"
        >
          sep
        </text>

        {/* Brote: lazo que sale de la "p" */}
        <g
          fill="none"
          stroke={variant === "white" ? "#FFFFFF" : "url(#sepGrad)"}
          strokeWidth="3.4"
          strokeLinecap="round"
        >
          <path d="M116 20c0-6.5 5.4-11.6 11.9-11.6S140 13.5 140 20s-5.4 11.7-11.9 11.7c-3.4 0-6.1-1.1-6.1-3.6 0-2.2 2-3.3 4.2-3.3 2.6 0 4.4 1.9 4.4 4.9 0 4.6-3.6 8.6-8.6 8.6" />
        </g>
      </svg>

      {showTagline && (
        <span
          className="mt-1 text-[0.62rem] font-medium italic tracking-tight"
          style={{ color: taglineFill }}
        >
          ¡Emprende hoy, <strong className="not-italic font-semibold">lidera mañana</strong>!
        </span>
      )}
    </span>
  );
}

/** Isotipo compacto para avatares, favicons y el sidebar colapsado. */
export function Isotipo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-[10px] sep-gradient font-semibold text-white",
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 32 32" className="h-3/5 w-3/5" fill="none">
        <path
          d="M6 17c0-6 4.9-11 11-11s11 5 11 11-4.9 11-11 11c-3.2 0-5.7-1.1-5.7-3.5 0-2.1 1.9-3.2 4-3.2 2.4 0 4.1 1.8 4.1 4.6"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
