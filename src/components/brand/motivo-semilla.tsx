import { cn } from "@/lib/utils";

/**
 * Motivo de marca «Semilla en cadena» (REDISEÑO §6.4).
 *
 * Una semilla brota y se ramifica 1 → 3 → 9: el modelo de impacto de SEP
 * («formamos a quien formará a diez más», contenido/sep.md). Es el ÚNICO
 * efecto firma: hero, login, bandas de cierre y logros.
 *
 * SVG original, coloreado con tokens (violeta → turquesa → cian; pensado
 * para fondos noche). Solo CSS: las ramas se dibujan con
 * `pathLength=1` + `stroke-dasharray` y luego un pulso recorre la red.
 * Con `data-anim` se pausa fuera de pantalla; con movimiento reducido queda
 * dibujado y quieto.
 */

type Punto = { x: number; y: number };

const SEMILLA: Punto = { x: 200, y: 372 };
const TRONCO: Punto = { x: 200, y: 282 };
const NIVEL1: Punto[] = [
  { x: 112, y: 214 },
  { x: 200, y: 196 },
  { x: 288, y: 214 },
];
// Cada nodo del nivel 1 forma a tres más.
const NIVEL2: Punto[][] = NIVEL1.map((p, i) =>
  [-1, 0, 1].map((d) => ({
    x: p.x + d * 40 + (i - 1) * 10,
    y: p.y - 96 - (d === 0 ? 22 : 0) + Math.abs(i - 1) * 14,
  })),
);

/** Curva suave de a → b (sube y se abre). */
const rama = (a: Punto, b: Punto) => {
  const my = (a.y + b.y) / 2;
  return `M${a.x} ${a.y} C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
};

export function MotivoSemilla({
  className,
  label = "Ilustración: una semilla brota y se ramifica en una red de nueve nodos, el impacto en cadena de SEP.",
  ciclo = 9,
  decorativo = false,
}: {
  className?: string;
  label?: string;
  /** Solo ornamento (lo oculta a lectores de pantalla). */
  decorativo?: boolean;
  /** Duración del ciclo del pulso, en segundos. */
  ciclo?: number;
}) {
  const ramas1 = NIVEL1.map((p) => rama(TRONCO, p));
  const ramas2 = NIVEL1.flatMap((p, i) => NIVEL2[i].map((q) => rama(p, q)));

  return (
    <svg
      viewBox="0 0 400 400"
      role={decorativo ? undefined : "img"}
      aria-label={decorativo ? undefined : label}
      aria-hidden={decorativo || undefined}
      data-anim
      className={cn("motivo-semilla overflow-visible", className)}
      style={{ ["--d" as string]: `${ciclo}s` }}
    >
      {/* Tronco */}
      <path d={rama(SEMILLA, TRONCO)} pathLength={1} className="ms-trazo ms-tronco" style={{ ["--t" as string]: "0s" }} />
      {/* Nivel 1: violeta → turquesa */}
      {ramas1.map((d, i) => (
        <path key={d} d={d} pathLength={1} className="ms-trazo ms-rama1" style={{ ["--t" as string]: `${0.5 + i * 0.12}s` }} />
      ))}
      {/* Nivel 2: turquesa → cian */}
      {ramas2.map((d, i) => (
        <path key={d} d={d} pathLength={1} className="ms-trazo ms-rama2" style={{ ["--t" as string]: `${1.1 + i * 0.07}s` }} />
      ))}

      {/* Pulsos que recorren la red en bucle */}
      {[rama(SEMILLA, TRONCO), ...ramas1, ...ramas2].map((d, i) => (
        <path
          key={`p-${d}`}
          d={d}
          pathLength={1}
          className="ms-pulso"
          style={{ ["--t" as string]: `${2.4 + (i < 4 ? i * 0.4 : 1.6 + (i - 4) * 0.18)}s` }}
        />
      ))}

      {/* Nodos */}
      <circle cx={SEMILLA.x} cy={SEMILLA.y} r={9} className="ms-nodo ms-semilla" style={{ ["--t" as string]: "0s" }} />
      {NIVEL1.map((p, i) => (
        <circle key={`n1-${p.x}`} cx={p.x} cy={p.y} r={7} className="ms-nodo ms-n1" style={{ ["--t" as string]: `${1 + i * 0.12}s` }} />
      ))}
      {NIVEL2.flat().map((p, i) => (
        <circle key={`n2-${p.x}-${p.y}`} cx={p.x} cy={p.y} r={5} className="ms-nodo ms-n2" style={{ ["--t" as string]: `${1.7 + i * 0.07}s` }} />
      ))}
    </svg>
  );
}
