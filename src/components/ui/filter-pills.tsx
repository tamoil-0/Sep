"use client";

import { cn } from "@/lib/utils";

export type FilterPillOption<K extends string> = {
  key: K;
  label: string;
  count?: number;
};

/**
 * Filtros en píldora (pestañas de una lista: "Por revisar 3", "Aprobados 5"…).
 * 44px de alto táctil, estado activo anunciado con aria-pressed y conteo tabular.
 */
export function FilterPills<K extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: FilterPillOption<K>[];
  value: K;
  onChange: (key: K) => void;
  /** Nombre del grupo para lectores de pantalla, p. ej. "Filtrar pagos por estado". */
  label: string;
  className?: string;
}) {
  return (
    <div role="group" aria-label={label} className={cn("flex flex-wrap gap-2", className)}>
      {options.map((o) => {
        const active = o.key === value;
        return (
          <button
            key={o.key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.key)}
            className={cn(
              "inline-flex min-h-control items-center gap-1.5 rounded-full px-4 text-body-sm font-medium transition-colors duration-150",
              active
                ? "bg-violeta-600 text-white"
                : "bg-white text-graphite ring-1 ring-inset ring-line hover:bg-surface-2",
            )}
          >
            {o.label}
            {typeof o.count === "number" && (
              <span className={cn("tabular", active ? "text-white" : "text-mist")}>
                {o.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
