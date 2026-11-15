import { cn } from "@/lib/utils";
import { MotivoSemilla } from "@/components/brand/motivo-semilla";

/**
 * Cabecera de cada pantalla del panel: banda noche con el halo y la semilla de
 * marca de fondo. Es la firma visual del producto. Si la sigue un `KpiGrid`,
 * las métricas se montan sobre su borde inferior (globals.css: `.cabecera-panel`).
 */
export function PageHeader({
  title,
  description,
  action,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "cabecera-panel theme-night halo relative mb-6 overflow-hidden rounded-lg px-5 py-6 sm:mb-8 sm:px-8 sm:py-8",
        className,
      )}
    >
      <MotivoSemilla decorativo className="motivo-logro pointer-events-none absolute -right-8 -top-6 hidden w-48 opacity-35 md:block" />
      <div className="relative flex min-w-0 flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1 md:pr-40">
          <h1 className="break-words font-display text-h3 font-semibold text-ink sm:text-h2">{title}</h1>
          {description && <p className="mt-2 max-w-prose text-body text-slate-ui">{description}</p>}
        </div>
        {action && <div className="relative shrink-0">{action}</div>}
      </div>
    </header>
  );
}

export function KpiGrid({ children }: { children: React.ReactNode }) {
  // `kpi-grid` da a los íconos un ritmo de color de marca (globals.css).
  return <div className="kpi-grid grid grid-cols-2 gap-3 lg:grid-cols-4">{children}</div>;
}

export function Kpi({
  label,
  value,
  hint,
  icon,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon?: React.ReactNode;
  /** `destacada`: la métrica principal del panel, en noche con el halo (una por panel). */
  tone?: "default" | "destacada";
}) {
  const destacada = tone === "destacada";
  return (
    <div
      className={cn(
        "relative min-w-0 overflow-hidden rounded-md p-4 sm:p-5",
        destacada ? "border border-violeta-200 bg-surface-0 shadow-elevated" : "border border-line bg-surface-0 shadow-soft",
      )}
      data-reveal
    >
      {destacada && <span aria-hidden className="absolute inset-x-0 top-0 h-1 grad-marca" />}
      <div className="flex items-center justify-between gap-3">
        <p className="text-caption leading-snug text-slate-ui sm:text-body-sm">{label}</p>
        {icon && (
          <span
            className={cn(
              "hidden size-9 items-center justify-center rounded-full sm:flex [&_svg]:size-4",
              destacada ? "bg-noche-900 text-cian-500" : "kpi-icono bg-violeta-50 text-acento",
            )}
          >
            {icon}
          </span>
        )}
      </div>
      <p className={cn("tabular mt-3 truncate font-display text-h3 font-semibold leading-none sm:text-h2", destacada ? "text-acento" : "text-ink")}>
        {value}
      </p>
      {hint && <p className="mt-1 line-clamp-2 text-caption leading-snug text-mist sm:mt-1.5">{hint}</p>}
    </div>
  );
}
