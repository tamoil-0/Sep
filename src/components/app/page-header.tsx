import { cn } from "@/lib/utils";

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
    <div
      className={cn(
        "mb-6 flex min-w-0 flex-col items-stretch gap-3 sm:mb-8 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <h1 className="break-words font-display text-h3 font-semibold text-ink sm:text-h2">{title}</h1>
        {description && (
          <p className="mt-2 max-w-prose text-body text-slate-ui">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function KpiGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{children}</div>;
}

export function Kpi({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-md border border-line bg-surface-0 p-4 shadow-soft sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-caption leading-snug text-slate-ui sm:text-body-sm">{label}</p>
        {icon && (
          <span className="hidden size-9 items-center justify-center rounded-full bg-violeta-50 text-acento sm:flex [&_svg]:size-4">
            {icon}
          </span>
        )}
      </div>
      <p className="tabular mt-3 truncate font-display text-h3 font-semibold leading-none text-ink sm:text-h2">
        {value}
      </p>
      {hint && <p className="mt-1 line-clamp-2 text-caption leading-snug text-mist sm:mt-1.5 sm:text-caption">{hint}</p>}
    </div>
  );
}
