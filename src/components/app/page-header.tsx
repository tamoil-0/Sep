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
        "mb-5 flex min-w-0 flex-col items-stretch gap-3 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <h1 className="break-words text-h3 font-semibold tracking-tight text-ink">{title}</h1>
        {description && (
          <p className="mt-1.5 text-body-sm text-slate-ui">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function KpiGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{children}</div>;
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
    <div className="rounded-md border border-line bg-white px-4 py-3.5 sm:px-5 sm:py-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-body-sm text-slate-ui">{label}</p>
        {icon && <span className="text-mist">{icon}</span>}
      </div>
      <p className="tabular mt-1.5 text-h3 font-semibold leading-none tracking-tight text-ink">
        {value}
      </p>
      {hint && <p className="mt-1.5 text-xs text-mist">{hint}</p>}
    </div>
  );
}
