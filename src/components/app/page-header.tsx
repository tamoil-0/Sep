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
  return <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">{children}</div>;
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
    <div className="min-w-0 rounded-sm border border-line bg-white px-3 py-3 sm:rounded-md sm:px-4 sm:py-3.5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs leading-snug text-slate-ui sm:text-body-sm">{label}</p>
        {icon && <span className="hidden text-mist sm:block">{icon}</span>}
      </div>
      <p className="tabular mt-1.5 truncate text-xl font-semibold leading-none tracking-tight text-ink sm:text-h3">
        {value}
      </p>
      {hint && <p className="mt-1 line-clamp-2 text-caption leading-snug text-mist sm:mt-1.5 sm:text-xs">{hint}</p>}
    </div>
  );
}
