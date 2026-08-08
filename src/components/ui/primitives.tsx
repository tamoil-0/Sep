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
        "mx-auto w-full px-5 sm:px-8",
        size === "narrow" && "max-w-3xl",
        size === "default" && "max-w-6xl",
        size === "wide" && "max-w-7xl",
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
        "py-16 sm:py-24",
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
            "mb-3 text-xs font-semibold uppercase tracking-[0.14em]",
            inverted ? "text-gold-500" : "text-sep-600",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-[2rem] sm:text-[2.5rem]",
          inverted ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-[1.0625rem] leading-relaxed",
            inverted ? "text-white/75" : "text-slate-ui",
          )}
        >
          {description}
        </p>
      )}
    </div>
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
        "rounded-[14px] border border-line bg-white p-6",
        interactive &&
          "transition-all duration-200 hover:border-sep-200 hover:shadow-[0_8px_28px_rgba(46,11,232,.08)]",
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
  gold: "bg-[#FFF6DE] text-gold-700",
  seed: "bg-[#EEF8E4] text-seed-700",
  neutral: "bg-surface-2 text-graphite",
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-[#8A5A00]",
  danger: "bg-danger-bg text-danger",
  white: "bg-white/12 text-white ring-1 ring-inset ring-white/25 backdrop-blur-sm",
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
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
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
    <div className="flex flex-col items-center justify-center rounded-[14px] border border-dashed border-line bg-surface-1 px-6 py-14 text-center">
      {icon && (
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-white text-slate-ui shadow-[0_1px_3px_rgba(18,16,28,.06)]">
          {icon}
        </div>
      )}
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-slate-ui">{description}</p>
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
}: {
  value: number;
  className?: string;
  tone?: "brand" | "gold" | "seed";
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-surface-2", className)}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-500",
          tone === "brand" && "sep-gradient",
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
          "tabular font-display text-[2.25rem] font-semibold leading-none tracking-tight sm:text-[2.75rem]",
          inverted ? "text-gold-500" : "sep-gradient-text",
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
