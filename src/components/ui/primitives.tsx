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
  tone?: "base" | "muted" | "gradient";
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-14 md:py-18 lg:py-22",
        tone === "muted" && "bg-surface-1",
        tone === "gradient" && "sep-gradient text-white",
        className,
      )}
    >
      {children}
    </section>
  );
}

/** Encabezado de sección: etiqueta pequeña + título + bajada. */
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  inverted = false,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  inverted?: boolean;
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
        <p
          className={cn(
            "mb-3 text-caption font-semibold uppercase tracking-[0.12em]",
            inverted ? "text-gold-500" : "text-sep-600",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-display text-h2",
          inverted ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
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
        inverted ? "sep-gradient" : "border-b border-line bg-surface-1",
      )}
    >
      <Container size="wide" className="relative py-14 md:py-18 lg:py-20">
        <div
          className={cn(
            "grid items-center gap-12",
            aside && "lg:grid-cols-[1.2fr_1fr]",
          )}
        >
          <div className="max-w-2xl">
            {eyebrow}
            <h1
              className={cn(
                "mt-5 font-display text-display font-bold",
                inverted ? "text-white" : "text-ink",
              )}
            >
              {title}
            </h1>
            {description && (
              <p
                className={cn(
                  "mt-5 max-w-[65ch] text-body-lg",
                  inverted ? "text-white/75" : "text-slate-ui",
                )}
              >
                {description}
              </p>
            )}
            {action && <div className="mt-8">{action}</div>}
          </div>

          {aside && <div className="mx-auto w-full max-w-xs lg:max-w-none">{aside}</div>}
        </div>

        {stats && stats.length > 0 && (
          <dl className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
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
        "min-w-0 rounded-md border border-line bg-white p-5",
        interactive &&
          "transition-colors duration-150 hover:border-sep-300 hover:bg-surface-1/50",
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
  brand: "bg-sep-50 text-sep-700",
  gold: "bg-[#fff6de] text-gold-700",
  seed: "bg-[#eef8e4] text-seed-700",
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

/** Palabra con el subrayado amarillo trazado a mano del logo. */
export function GoldUnderline({ children }: { children: React.ReactNode }) {
  return <span className="gold-underline relative z-0">{children}</span>;
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
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-line bg-surface-1 px-4 py-10 text-center sm:px-6 sm:py-14">
      {icon && (
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-white text-slate-ui shadow-subtle">
          {icon}
        </div>
      )}
      <p className="font-display text-h4 font-semibold text-ink">{title}</p>
      {description && (
        <p className="mt-1.5 max-w-sm text-body-sm text-slate-ui">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
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
  tone?: "brand" | "gold" | "seed";
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
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-200",
          tone === "brand" && "bg-sep-600",
          tone === "gold" && "bg-gold-500",
          tone === "seed" && "bg-seed-500",
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
          "tabular font-display text-h1 font-semibold leading-none tracking-tight",
          inverted ? "text-gold-500" : "text-sep-700",
        )}
      >
        {value}
      </p>
      <p
        className={cn(
          "mt-2 text-sm",
          inverted ? "text-white/70" : "text-slate-ui",
        )}
      >
        {label}
      </p>
    </div>
  );
}
