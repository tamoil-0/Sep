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
        "mb-6 flex min-w-0 flex-col items-stretch gap-4 sm:mb-7 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <h1 className="break-words font-display text-[1.625rem] font-semibold text-ink sm:text-[1.75rem]">{title}</h1>
        {description && (
          <p className="mt-1.5 text-[0.9375rem] text-slate-ui">{description}</p>
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
    <div className="rounded-[14px] border border-line bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[0.8125rem] text-slate-ui">{label}</p>
        {icon && <span className="text-mist">{icon}</span>}
      </div>
      <p className="tabular mt-2 font-display text-[1.75rem] font-semibold leading-none text-ink">
        {value}
      </p>
      {hint && <p className="mt-1.5 text-xs text-mist">{hint}</p>}
    </div>
  );
}
