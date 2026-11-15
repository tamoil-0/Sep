import { Award, Check, Play, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Maquetas originales de la plataforma SEP (REDISEÑO §7).
 *
 * - Marcos `Telefono` y `Laptop` dibujados con CSS (no imágenes de dispositivos).
 * - Pantallas de ejemplo con tokens y DATOS FICTICIOS («Ana Q.», códigos inventados).
 * - Escenas animadas solo con CSS: cada elemento recibe `--t` (retraso) y comparte
 *   el ciclo `--d` y los keyframes `esc-*` de globals.css. Se pausan fuera de
 *   pantalla (`data-anim`) y quedan quietas con movimiento reducido.
 */

const t = (s: number) => ({ ["--t" as string]: `${s}s` }) as React.CSSProperties;

export function Telefono({ children, className, label }: { children: React.ReactNode; className?: string; label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      data-anim
      className={cn("escena relative mx-auto w-60 rounded-xl bg-noche-950 p-2.5 shadow-elevated ring-1 ring-white/10", className)}
      style={{ ["--d" as string]: "10s" }}
    >
      {/* Notch */}
      <div aria-hidden className="absolute left-1/2 top-2.5 z-10 h-5 w-20 -translate-x-1/2 rounded-b-xl bg-noche-950" />
      <div aria-hidden className="relative overflow-hidden rounded-lg bg-surface-1">
        <div className="flex items-center justify-between px-5 pb-1 pt-2 text-caption font-semibold text-ink">
          <span>9:41</span>
          <span className="flex gap-1">
            <span className="size-1.5 rounded-full bg-ink" />
            <span className="size-1.5 rounded-full bg-ink" />
            <span className="size-1.5 rounded-full bg-mist" />
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Laptop({ children, className, label, url }: { children: React.ReactNode; className?: string; label: string; url: string }) {
  return (
    <div role="img" aria-label={label} data-anim className={cn("escena relative mx-auto w-full max-w-xl", className)} style={{ ["--d" as string]: "10s" }}>
      <div aria-hidden className="rounded-t-lg bg-noche-950 p-2 pb-0 shadow-elevated ring-1 ring-white/10">
        {/* Barra del navegador con URL ficticia */}
        <div className="flex items-center gap-2 rounded-t-md bg-noche-800 px-3 py-2">
          <span className="flex gap-1.5">
            <span className="size-2 rounded-full bg-noche-600" />
            <span className="size-2 rounded-full bg-noche-600" />
            <span className="size-2 rounded-full bg-noche-600" />
          </span>
          <span className="ml-2 flex-1 truncate rounded-full bg-noche-900 px-3 py-0.5 text-caption text-noche-300">{url}</span>
        </div>
        <div className="overflow-hidden bg-surface-1">{children}</div>
      </div>
      {/* Base */}
      <div aria-hidden className="mx-auto h-3 w-[108%] -translate-x-[3.7%] rounded-b-lg bg-noche-700" />
    </div>
  );
}

/** Pantalla: lección del curso con progreso que avanza y sesión completada. */
export function PantallaLeccion() {
  const sesiones = ["¿Qué es Design Thinking?", "Empatía: conoce a tu usuario", "Definición del problema", "Ideación sin límites"];
  return (
    <div className="px-4 pb-5 pt-2">
      <p className="text-caption font-semibold uppercase tracking-marca text-acento">Curso de ejemplo</p>
      <p className="mt-1 font-display text-body font-semibold leading-snug text-ink">Design Thinking aplicado</p>
      {/* Video */}
      <div className="halo relative mt-3 flex aspect-video items-center justify-center rounded-md">
        <span className="esc-pulso flex size-10 items-center justify-center rounded-full bg-cian-500 text-noche-900" style={t(0)}>
          <Play className="size-4 translate-x-px" fill="currentColor" />
        </span>
      </div>
      {/* Progreso */}
      <div className="mt-3 flex justify-between text-caption">
        <span className="text-slate-ui">Tu progreso</span>
        <span className="tabular font-semibold text-ink">3 → 4 de 6</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div className="esc-crecer-x h-full w-2/3 origin-left rounded-full grad-marca" style={{ ...t(0.6), ["--desde" as string]: "0.75" }} />
      </div>
      <ul className="mt-3 space-y-1.5">
        {sesiones.map((s, i) => (
          <li key={s} className="flex items-center gap-2 rounded-sm bg-surface-0 px-2.5 py-1.5 text-caption text-ink">
            <span
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded-full",
                i < 3 ? "bg-turquesa-500 text-noche-900" : "esc-check bg-turquesa-500 text-noche-900",
              )}
              style={i === 3 ? t(1.2) : undefined}
            >
              <Check className="size-2.5" strokeWidth={3} />
            </span>
            <span className="truncate">{s}</span>
          </li>
        ))}
      </ul>
      {/* Aviso que emerge */}
      <div className="esc-emerger mt-3 flex items-center gap-2 rounded-md bg-noche-900 px-3 py-2 text-caption font-medium text-white" style={t(1.6)}>
        <Check className="size-3.5 text-cian-500" strokeWidth={3} /> ¡Sesión 4 completada!
      </div>
    </div>
  );
}

/** Pantalla: certificado con código y QR que se dibuja, y sello verificado. */
export function PantallaCertificado() {
  // QR ficticio de 13×13: tres esquinas de posición y relleno pseudoaleatorio fijo.
  // No codifica nada real.
  const N = 13;
  const esquina = (x: number, y: number, ox: number, oy: number) => {
    const dx = x - ox, dy = y - oy;
    if (dx < 0 || dy < 0 || dx > 4 || dy > 4) return null;
    return dx === 0 || dy === 0 || dx === 4 || dy === 4 || (dx === 2 && dy === 2);
  };
  const qr: { x: number; y: number }[] = [];
  for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++) {
      const f = esquina(x, y, 0, 0) ?? esquina(x, y, N - 5, 0) ?? esquina(x, y, 0, N - 5);
      const on = f ?? ((x * 7 + y * 13 + x * y) % 5 < 2);
      if (on) qr.push({ x, y });
    }
  return (
    <div className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
      <div className="esc-emerger-fijo rounded-md border border-line bg-surface-0 p-4" style={t(0)}>
        <div className="flex items-center gap-2">
          <Award className="size-4 text-acento" />
          <p className="text-caption font-semibold uppercase tracking-marca text-acento">Certificado SEP</p>
        </div>
        <p className="mt-3 text-caption text-slate-ui">Se certifica que</p>
        <p className="font-display text-h4 font-semibold text-ink">Ana Q.</p>
        <p className="mt-1 text-caption text-slate-ui">completó «Design Thinking aplicado» · 8 horas</p>
        <span className="regla-marca mt-3" />
        <p className="tabular mt-3 text-caption text-mist">Código SEP-0000-EJEMPLO</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <svg viewBox={`0 0 ${N} ${N}`} className="size-24 rounded-sm bg-surface-0 p-1.5 ring-1 ring-line" shapeRendering="crispEdges">
          {qr.map(({ x, y }) => (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} className="esc-aparecer fill-noche-900" style={t(0.4 + y * 0.04)} />
          ))}
        </svg>
        <span className="esc-sello inline-flex items-center gap-1 rounded-full bg-noche-900 px-2.5 py-1 text-caption font-semibold text-cian-500" style={t(1.4)}>
          <ShieldCheck className="size-3.5" /> Verificado
        </span>
      </div>
    </div>
  );
}
