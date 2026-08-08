import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge, Card, EmptyState } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

/**
 * Piezas compartidas por las pantallas de los paneles.
 *
 * Existen para que las 30+ vistas de admin, docente, mentor e institución se
 * vean como el mismo producto: misma tabla, mismo estado vacío, mismos tonos
 * de estado. Antes cada pantalla improvisaba su propio layout.
 */

/* ── Tabla ────────────────────────────────────────────────── */

export interface Column<T> {
  key: string;
  header: string;
  /** Alineación a la derecha para cifras. */
  numeric?: boolean;
  render: (row: T) => React.ReactNode;
}

export function DataTable<T>({
  columns,
  rows,
  empty,
  caption,
}: {
  columns: Column<T>[];
  rows: T[];
  empty: React.ReactNode;
  caption?: string;
}) {
  if (rows.length === 0) return <>{empty}</>;

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead className="border-b border-line bg-surface-1">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className={cn(
                    "px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-ui",
                    c.numeric && "text-right",
                  )}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row, i) => (
              <tr key={i} className="transition-colors hover:bg-surface-1">
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={cn(
                      "px-5 py-3.5 text-sm text-graphite",
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
    </Card>
  );
}

/* ── Estado ───────────────────────────────────────────────── */

const STATUS_TONES: Record<
  string,
  "brand" | "gold" | "seed" | "neutral" | "success" | "warning" | "danger"
> = {
  // pagos y órdenes
  pendiente: "neutral",
  en_revision: "warning",
  pagado: "success",
  rechazado: "danger",
  reembolsado: "neutral",
  // inscripciones
  activo: "brand",
  completado: "success",
  abandonado: "neutral",
  expulsado: "danger",
  // postulaciones
  recibida: "neutral",
  entrevista: "brand",
  aprobada: "success",
  // certificados
  emitido: "success",
  revocado: "danger",
  // talleres
  solicitado: "neutral",
  confirmado: "brand",
  realizado: "success",
  cancelado: "danger",
  // sesiones
  programada: "neutral",
  en_vivo: "danger",
  finalizada: "success",
  // membresías
  activa: "success",
  vencida: "neutral",
  cancelada: "danger",
};

const STATUS_LABELS: Record<string, string> = {
  en_revision: "En revisión",
  en_vivo: "En vivo",
};

export function StatusBadge({ status }: { status: string | null }) {
  if (!status) return <span className="text-mist">—</span>;
  const label =
    STATUS_LABELS[status] ??
    status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ");
  return <Badge tone={STATUS_TONES[status] ?? "neutral"}>{label}</Badge>;
}

/* ── Sección con cabecera y enlace ────────────────────────── */

export function PanelSection({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: { label: string; href: string };
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mt-8 first:mt-0", className)}>
      <div className="mb-3.5 flex items-center justify-between gap-4">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
          {title}
        </h2>
        {action && (
          <Link
            href={action.href}
            className="inline-flex items-center gap-1 text-xs font-medium text-sep-600 hover:underline"
          >
            {action.label}
            <ArrowRight className="size-3" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

/* ── Estado vacío con guía ────────────────────────────────── */

export function ComingSoon({
  icon,
  title,
  description,
  bullets,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  bullets?: string[];
}) {
  return (
    <Card className="p-8">
      <div className="mx-auto max-w-lg text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-[14px] bg-sep-50 text-sep-600">
          {icon}
        </span>
        <h2 className="mt-5 font-display text-[1.25rem] font-semibold text-ink">
          {title}
        </h2>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-slate-ui">
          {description}
        </p>

        {bullets && bullets.length > 0 && (
          <ul className="mt-6 space-y-2 text-left">
            {bullets.map((b) => (
              <li
                key={b}
                className="flex items-start gap-2.5 rounded-[10px] bg-surface-1 px-4 py-3 text-sm text-graphite"
              >
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold-500" />
                {b}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}

export { EmptyState };
