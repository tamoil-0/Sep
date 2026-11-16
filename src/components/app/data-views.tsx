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
// La tabla adaptable vive en `@/components/ui/table`; se re-exporta para no
// cambiar las importaciones existentes.
export { DataTable, type Column } from "@/components/ui/table";

/* ── Estado ───────────────────────────────────────────────── */

const STATUS_TONES: Record<
  string,
  "brand" | "neon" | "neutral" | "success" | "warning" | "danger"
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
    <section className={cn("mt-6 first:mt-0 sm:mt-8", className)}>
      <div className="mb-3.5 flex items-center justify-between gap-4">
        <h2 className="text-body-sm font-semibold tracking-eyebrow text-slate-ui">
          {title}
        </h2>
        {action && (
          <Link
            href={action.href}
            className="inline-flex items-center gap-1 text-caption font-medium text-acento hover:underline"
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
    <Card className="p-5 sm:p-8">
      <div className="mx-auto max-w-lg text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-md bg-violeta-100 text-acento">
          {icon}
        </span>
        <h2 className="mt-5 text-h4 font-semibold text-ink">
          {title}
        </h2>
        <p className="mt-2 text-body-sm leading-relaxed text-slate-ui">
          {description}
        </p>

        {bullets && bullets.length > 0 && (
          <ul className="mt-6 space-y-2 text-left">
            {bullets.map((b) => (
              <li
                key={b}
                className="flex items-start gap-2.5 rounded-sm bg-surface-1 px-4 py-3 text-body-sm text-graphite"
              >
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-violeta-500" />
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
