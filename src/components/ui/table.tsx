import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Tabla de datos adaptable (REDISEÑO §5, «Tablas de admin»).
 *
 * - Escritorio (≥ md): encabezado fijo, filas con hover tenue y cifras con
 *   `tabular-nums` alineadas a la derecha.
 * - Móvil: cada fila se convierte en una tarjeta. La columna `primary` (o la
 *   primera) va como título; la columna sin encabezado (acciones) va al pie.
 *
 * Los filtros van fuera, con `FilterPills`.
 */
export interface Column<T> {
  key: string;
  header: string;
  /** Cifras: alineadas a la derecha y con números tabulares. */
  numeric?: boolean;
  /** Título de la tarjeta en móvil (por defecto, la primera columna). */
  primary?: boolean;
  render: (row: T) => React.ReactNode;
}

export function DataTable<T>({
  columns,
  rows,
  empty,
  caption,
  getRowKey,
  className,
}: {
  columns: Column<T>[];
  rows: T[];
  /** Qué mostrar cuando no hay filas (normalmente un `EmptyState`). */
  empty: React.ReactNode;
  /** Nombre accesible de la tabla (se lee, no se ve). */
  caption?: string;
  getRowKey?: (row: T, index: number) => string;
  className?: string;
}) {
  if (rows.length === 0) return <>{empty}</>;

  const primary = columns.find((c) => c.primary) ?? columns[0];
  const actions = columns.filter((c) => c !== primary && c.header === "");
  const details = columns.filter((c) => c !== primary && c.header !== "");
  const keyOf = (row: T, i: number) => getRowKey?.(row, i) ?? String(i);

  return (
    <div className={cn("max-w-full overflow-hidden rounded-md border border-line bg-surface-0", className)}>
      {/* Móvil: tarjetas */}
      <ul className="divide-y divide-line md:hidden" aria-label={caption}>
        {rows.map((row, i) => (
          <li key={keyOf(row, i)} className="p-4">
            <div className="text-body-sm font-semibold text-ink">{primary.render(row)}</div>
            {details.length > 0 && (
              <dl className="mt-3 space-y-2">
                {details.map((c) => (
                  <div key={c.key} className="flex items-baseline justify-between gap-4">
                    <dt className="shrink-0 text-caption text-mist">{c.header}</dt>
                    <dd className={cn("min-w-0 text-right text-body-sm text-graphite", c.numeric && "tabular")}>
                      {c.render(row)}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            {actions.map((c) => (
              <div key={c.key} className="mt-3 border-t border-line pt-3">
                {c.render(row)}
              </div>
            ))}
          </li>
        ))}
      </ul>

      {/* Escritorio: tabla con encabezado fijo */}
      <div className="hidden max-w-full overflow-x-auto overscroll-x-contain md:block" tabIndex={0} aria-label={caption}>
        <table className="w-full min-w-xl text-left">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead className="sticky top-0 z-10 border-b border-line bg-surface-1">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className={cn("px-4 py-3 text-body-sm font-medium text-slate-ui", c.numeric && "text-right")}
                >
                  {c.header || <span className="sr-only">Acciones</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row, i) => (
              <tr key={keyOf(row, i)} className="transition-colors duration-150 hover:bg-violeta-50/50">
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={cn(
                      "px-4 py-3 text-body-sm text-graphite",
                      c === primary && "font-medium text-ink",
                      c.numeric && "tabular text-right",
                    )}
                  >
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
