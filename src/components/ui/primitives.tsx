import * as React from "react";
import { cn } from "@/lib/utils";

/* ── Layout ───────────────────────────────────────────────── */

export function Container({
  className,
  children,
  size = "default",
}: {
  className?: string;
  children: React.ReactNode;
  size?: "default" | "narrow" | "wide";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 md:px-8",
        size === "narrow" && "max-w-reading",
        size === "default" && "max-w-content",
        size === "wide" && "max-w-wide",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Section({
  className,
  children,
  tone = "base",
  id,
}: {
  className?: string;
  children: React.ReactNode;
  /** `night` (y `gradient`, su alias histórico) pinta la sección en noche con el halo de marca. */
  tone?: "base" | "muted" | "gradient" | "night";
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-14 md:py-20 lg:py-24",
        tone === "muted" && "bg-surface-1",
        (tone === "gradient" || tone === "night") && "theme-night halo relative overflow-hidden",
        className,
      )}
    >
      {children}
    </section>
  );
}

/**
 * Encabezado de sección: etiqueta pequeña + título + bajada.
 * Con `as="h1"` sirve de cabecera de página (misma escala que el h1 de `PageHero`).
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  inverted = false,
  as: Heading = "h2",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  inverted?: boolean;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <Eyebrow className={cn("mb-4", inverted && "text-violeta-300")}>{eyebrow}</Eyebrow>
      )}
      <Heading
        className={cn(
          "font-display",
          Heading === "h1" ? "text-h1 font-semibold lg:text-hero" : "text-h2 font-semibold",
          inverted ? "text-white" : "text-ink",
        )}
      >
        {title}
      </Heading>
      {description && (
        <p
          className={cn(
            "mt-4 text-body-lg",
            inverted ? "text-white/75" : "text-slate-ui",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

/**
 * Cabecera de página.
 *
 * Existe para que todas las pantallas respiren igual: mismo alto, misma
 * jerarquía y mismo lugar para las métricas. Antes cada página inventaba
 * su propio hero y el sitio se sentía como cinco sitios distintos.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  stats,
  action,
  aside,
  tone = "muted",
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  stats?: { value: string; label: string }[];
  action?: React.ReactNode;
  aside?: React.ReactNode;
  tone?: "muted" | "gradient";
}) {
  const inverted = tone === "gradient";

  return (
    <section
      className={cn(
        "relative overflow-hidden",
        inverted ? "theme-night halo" : "border-b border-line bg-surface-1",
      )}
    >
      <Container size="wide" className="relative py-10 md:py-14 lg:py-16">
        <div
          className={cn(
            "grid items-center gap-8 lg:gap-12",
            aside && "lg:grid-cols-[1.2fr_1fr]",
          )}
        >
          <div className="max-w-2xl">
            {eyebrow}
            <h1
              className={cn(
                "mt-4 font-display text-h1 font-bold lg:text-hero",
                inverted ? "text-white" : "text-ink",
              )}
            >
              {title}
            </h1>
            {description && (
              <p
                className={cn(
                  "mt-4 max-w-prose text-body-lg",
                  inverted ? "text-white/75" : "text-slate-ui",
                )}
              >
                {description}
              </p>
            )}
            {action && <div className="mt-6">{action}</div>}
          </div>

          {aside && <div className="mx-auto w-full max-w-xs lg:max-w-none">{aside}</div>}
        </div>

        {stats && stats.length > 0 && (
          <dl className="mt-9 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dd
                  className={cn(
                    "tabular text-h3 font-semibold leading-none tracking-tight",
                    inverted ? "text-white" : "text-ink",
                  )}
                >
                  {s.value}
                </dd>
                <dt
                  className={cn(
                    "mt-2 text-body-sm leading-snug",
                    inverted ? "text-white/65" : "text-slate-ui",
                  )}
                >
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        )}
      </Container>
    </section>
  );
}

/* ── Superficies ──────────────────────────────────────────── */

type CardProps = {
  className?: string;
  children: React.ReactNode;
  interactive?: boolean;
  as?: React.ElementType;
} & Record<string, unknown>;

export function Card({
  className,
  children,
  interactive = false,
  as: Tag = "div",
  ...rest
}: CardProps) {
  return (
    <Tag
      className={cn(
        "min-w-0 rounded-md p-5",
        // Interactiva: borde que se enciende con el degradado, sube 4 px y sombra con tinte.
        interactive ? "tarjeta-viva" : "border border-line bg-surface-0",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ── Badges ───────────────────────────────────────────────── */

const badgeTones = {
  brand: "bg-violeta-50 text-acento",
  /* Chip neón: fondo noche con texto cian (11.17:1). Funciona sobre claro y sobre noche. */
  neon: "bg-noche-900 text-cian-500 ring-1 ring-inset ring-cian-500/30",
  neutral: "bg-surface-2 text-graphite",
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  danger: "bg-danger-bg text-danger",
  white: "bg-white/10 text-white ring-1 ring-inset ring-white/25",
} as const;

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof badgeTones;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-semibold",
        badgeTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ── Tipografía de marca ──────────────────────────────────── */

/**
 * Etiqueta sobre un título: pequeña, en mayúsculas, tracking 0.15em y en el
 * color de acento accesible (`acento`: 6.99 sobre blanco, 6.86 sobre noche).
 * Úsala poco: no en todas las secciones.
 */
export function Eyebrow({
  children,
  className,
  as: Tag = "p",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "p" | "span";
}) {
  return (
    <Tag className={cn("text-body-sm font-medium text-acento", className)}>
      {children}
    </Tag>
  );
}

/** Regla de 3 px en degradado para separar o subrayar títulos. */
export function BrandRule({ className }: { className?: string }) {
  return <span aria-hidden className={cn("regla-marca", className)} />;
}

/** Bloque de carga con brillo suave (usa `.skeleton` de globals.css). */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("skeleton h-4 w-full", className)} />;
}

/** Palabra subrayada con el trazo del degradado de marca (decorativo). */
export function AccentUnderline({ children }: { children: React.ReactNode }) {
  return <span className="subrayado-marca relative z-0">{children}</span>;
}

/* ── Estados ──────────────────────────────────────────────── */

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-violeta-200 bg-violeta-50/40 px-4 py-8 text-center sm:px-6 sm:py-10">
      {icon && (
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-surface-0 text-acento shadow-soft ring-1 ring-violeta-100">
          {icon}
        </div>
      )}
      <p className="font-display text-h4 font-semibold text-ink">{title}</p>
      {description && (
        <p className="mt-1.5 max-w-sm text-body-sm text-slate-ui">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ── Progreso ─────────────────────────────────────────────── */

export function ProgressBar({
  value,
  className,
  tone = "brand",
  label = "Progreso",
}: {
  value: number;
  className?: string;
  tone?: "brand" | "success";
  label?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-surface-2", className)}
      role="progressbar"
      aria-label={label}
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Se llena con transform (scaleX) al montarse: `barra-progreso` en globals.css. */}
      <div
        className={cn(
          "barra-progreso h-full rounded-full",
          tone === "brand" && "grad-marca",
          // turquesa-700: 4.02:1 sobre blanco (objeto gráfico ≥ 3:1).
          tone === "success" && "bg-turquesa-700",
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ── Métrica ──────────────────────────────────────────────── */

export function Stat({
  value,
  label,
  inverted = false,
  className,
}: {
  value: string;
  label: string;
  inverted?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <p
        className={cn(
          "tabular font-display text-h1 font-semibold leading-none",
          inverted ? "text-white" : "text-ink",
        )}
      >
        {value}
      </p>
      <p
        className={cn(
          "mt-2 text-body-sm",
          inverted ? "text-white/70" : "text-slate-ui",
        )}
      >
        {label}
      </p>
    </div>
  );
}
