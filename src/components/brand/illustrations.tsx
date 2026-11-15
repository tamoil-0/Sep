import { cn } from "@/lib/utils";

/**
 * Sistema de ilustraciones de SEP.
 *
 * Son SVG en línea, no imágenes de archivo, por tres razones:
 *   · pesan ~1 KB y no añaden peticiones de red (la CSP bloquea CDNs)
 *   · escalan sin pixelarse en cualquier pantalla
 *   · usan los tokens de marca, así que nunca se desalinean de la paleta
 *
 * Cuando SEP tenga fotos reales de sus talleres, estas piezas se sustituyen
 * una a una sin tocar el layout: todas ocupan un contenedor con aspect-ratio.
 */

// Paleta «Lavanda neón» en hex: los atributos SVG no leen variables CSS.
const GRAD = {
  blue: "#6257DB", // violeta-600
  violet: "#7265FF", // violeta-500
  purple: "#0BC6AB", // turquesa-500 (fin del degradado)
  accent: "#41D3BD", // turquesa-400 (sin cian: van sobre claro)
  success: "#0BC6AB", // turquesa-500
  line: "#E2E7EE", // noche-200
  mist: "#B6C2D1", // noche-300
};

/** Definiciones compartidas: un solo <defs> por ilustración. */
function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={GRAD.blue} />
        <stop offset="55%" stopColor={GRAD.violet} />
        <stop offset="100%" stopColor={GRAD.purple} />
      </linearGradient>
      <linearGradient id={`${id}-soft`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={GRAD.blue} stopOpacity="0.12" />
        <stop offset="100%" stopColor={GRAD.purple} stopOpacity="0.12" />
      </linearGradient>
    </defs>
  );
}

/* ═══════════════════════════════════════════════════════════
   HERO — mapa del Perú abstracto con nodos conectados.
   La idea visual: el talento no está en un punto, está repartido.
   ═══════════════════════════════════════════════════════════ */

export function HeroIllustration({ className }: { className?: string }) {
  // Nodos aproximando la forma del Perú. El grande es Áncash (origen de SEP).
  const nodes = [
    { x: 108, y: 52, r: 5 },
    { x: 142, y: 88, r: 4 },
    { x: 88, y: 96, r: 4 },
    { x: 118, y: 130, r: 9, main: true },
    { x: 158, y: 148, r: 4 },
    { x: 92, y: 168, r: 5 },
    { x: 132, y: 196, r: 4 },
    { x: 168, y: 214, r: 5 },
    { x: 104, y: 226, r: 4 },
    { x: 140, y: 258, r: 5 },
    { x: 176, y: 282, r: 4 },
    { x: 118, y: 292, r: 4 },
  ];

  const links: [number, number][] = [
    [3, 0], [3, 1], [3, 2], [3, 4], [3, 5],
    [5, 6], [6, 7], [5, 8], [6, 9], [9, 10], [8, 11], [9, 11],
  ];

  return (
    <svg
      viewBox="0 0 280 340"
      className={cn("h-auto w-full", className)}
      role="img"
      aria-label="Mapa abstracto del Perú con nodos conectados que representan las regiones donde SEP tiene presencia"
    >
      <Defs id="hero" />

      {/* Halo del nodo principal */}
      <circle cx="118" cy="130" r="46" fill="#fff" opacity="0.07" />
      <circle cx="118" cy="130" r="30" fill="#fff" opacity="0.07" />

      {/* Conexiones */}
      <g stroke="#fff" strokeOpacity="0.28" strokeWidth="1.2">
        {links.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
          />
        ))}
      </g>

      {/* Nodos */}
      {nodes.map((n, i) => (
        <g key={i}>
          {n.main && <circle cx={n.x} cy={n.y} r={n.r + 7} fill={GRAD.accent} opacity="0.25" />}
          <circle
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill={n.main ? GRAD.accent : "#fff"}
            opacity={n.main ? 1 : 0.9}
          />
        </g>
      ))}

      {/* Brote creciendo desde el nodo principal */}
      <g stroke={GRAD.success} strokeWidth="2.4" strokeLinecap="round" fill="none">
        <path d="M118 121 v-16" />
        <path d="M118 110 c-9 -2 -13 -9 -12 -16 8 0 13 6 12 16z" fill={GRAD.success} stroke="none" />
        <path d="M118 114 c9 -3 12 -10 10 -17 -8 1 -12 8 -10 17z" fill={GRAD.success} stroke="none" opacity="0.75" />
      </g>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   CADENA DE IMPACTO — cuatro nodos que se multiplican.
   Sustituye el diagrama de 4 tarjetas con texto.
   ═══════════════════════════════════════════════════════════ */

export function ImpactChainIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 200"
      className={cn("h-auto w-full", className)}
      role="img"
      aria-label="Diagrama: SEP forma universitarios, que forman escolares, que multiplican el impacto en su región"
    >
      <Defs id="chain" />

      {/* Línea base */}
      <line x1="60" y1="100" x2="580" y2="100" stroke={GRAD.line} strokeWidth="2" />

      {/* 1 — SEP */}
      <circle cx="60" cy="100" r="26" fill="url(#chain-g)" />
      <path
        d="M60 92 v-10 M60 86 c-6 -1 -9 -6 -8 -11 5 0 9 4 8 11z"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* 2 — Universitarios: 3 nodos */}
      {[[200, 70], [200, 100], [200, 130]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="11" fill={GRAD.violet} opacity={0.55 + i * 0.15} />
      ))}

      {/* 3 — Escolares: 6 nodos */}
      {[[360, 58], [360, 82], [360, 106], [360, 130], [386, 70], [386, 118]].map(
        ([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="8" fill={GRAD.purple} opacity={0.45 + i * 0.09} />
        ),
      )}

      {/* 4 — Comunidad: nube de puntos */}
      {Array.from({ length: 14 }).map((_, i) => {
        const angle = (i / 14) * Math.PI * 2;
        const rr = 34 + (i % 3) * 9;
        return (
          <circle
            key={i}
            cx={540 + Math.cos(angle) * rr}
            cy={100 + Math.sin(angle) * rr * 0.75}
            r={3.5}
            fill={GRAD.success}
            opacity={0.35 + (i % 4) * 0.15}
          />
        );
      })}
      <circle cx="540" cy="100" r="14" fill={GRAD.accent} />

      {/* Flechas */}
      {[[100, 168], [230, 328], [412, 492]].map(([x1, x2], i) => (
        <g key={i} stroke={GRAD.accent} strokeWidth="2" strokeLinecap="round" fill="none">
          <line x1={x1} y1="100" x2={x2 - 8} y2="100" />
          <path d={`M${x2 - 14} 94 l7 6 -7 6`} />
        </g>
      ))}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   PORTADAS DE CURSO — un patrón geométrico por categoría.
   Da identidad visual a las tarjetas sin necesitar fotos.
   ═══════════════════════════════════════════════════════════ */

export type CoursePattern = "agiles" | "liderazgo" | "docentes" | "silp";

export function CourseCover({
  pattern = "agiles",
  className,
}: {
  pattern?: CoursePattern;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-surface-1",
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 320 120" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <Defs id={`cc-${pattern}`} />
        <rect width="320" height="120" fill={`url(#cc-${pattern}-soft)`} />

        {pattern === "agiles" && (
          /* Post-its del Design Thinking */
          <g>
            {[
              [40, 30, -8], [96, 22, 5], [152, 34, -4],
              [64, 72, 6], [122, 66, -7], [180, 74, 4],
              [214, 28, -6], [246, 62, 7],
            ].map(([x, y, r], i) => (
              <rect
                key={i}
                x={x}
                y={y}
                width="34"
                height="34"
                rx="4"
                fill={i % 3 === 0 ? GRAD.accent : i % 3 === 1 ? GRAD.violet : GRAD.success}
                opacity={i % 3 === 1 ? 0.35 : 0.55}
                transform={`rotate(${r} ${x + 17} ${y + 17})`}
              />
            ))}
          </g>
        )}

        {pattern === "liderazgo" && (
          /* Ondas concéntricas: una voz que se propaga */
          <g fill="none" stroke={GRAD.violet}>
            {[22, 40, 58, 76, 94].map((r, i) => (
              <circle key={r} cx="70" cy="60" r={r} strokeWidth="2" opacity={0.5 - i * 0.08} />
            ))}
            <circle cx="70" cy="60" r="11" fill={GRAD.accent} stroke="none" />
          </g>
        )}

        {pattern === "docentes" && (
          /* Cuaderno: renglones y una idea marcada */
          <g>
            {[26, 44, 62, 80, 98].map((y, i) => (
              <rect
                key={y}
                x="40"
                y={y}
                width={i === 2 ? 150 : 200 - i * 12}
                height="7"
                rx="3.5"
                fill={i === 2 ? GRAD.accent : GRAD.mist}
                opacity={i === 2 ? 0.9 : 0.3}
              />
            ))}
            <circle cx="252" cy="65" r="26" fill={GRAD.success} opacity="0.4" />
            <circle cx="252" cy="65" r="12" fill={GRAD.success} opacity="0.7" />
          </g>
        )}

        {pattern === "silp" && (
          /* Escalera ascendente hacia una cima dorada */
          <g>
            {[0, 1, 2, 3, 4].map((i) => (
              <rect
                key={i}
                x={44 + i * 46}
                y={96 - i * 17}
                width="36"
                height={16 + i * 17}
                rx="4"
                fill="url(#cc-silp-g)"
                opacity={0.28 + i * 0.16}
              />
            ))}
            <circle cx="288" cy="24" r="13" fill={GRAD.accent} />
          </g>
        )}
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PATRÓN DE FONDO — malla de puntos reutilizable.
   ═══════════════════════════════════════════════════════════ */

export function DotGrid({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, ${
          tone === "dark" ? "rgba(255,255,255,.16)" : "rgba(18,16,28,.07)"
        } 1px, transparent 0)`,
        backgroundSize: "32px 32px",
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   DATO GRANDE — sustituye párrafos por una cifra con contexto.
   ═══════════════════════════════════════════════════════════ */

export function StatBlock({
  figure,
  label,
  detail,
  tone = "brand",
}: {
  figure: string;
  label: string;
  detail?: string;
  tone?: "brand" | "neon" | "success";
}) {
  return (
    <div className="relative overflow-hidden rounded-md border border-line bg-surface-0 p-6 sm:p-7">
      {/* Franja de acento de 4px: el color distingue la cifra sin teñir el número. */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-0 h-1",
          tone === "brand" && "grad-marca",
          tone === "neon" && "bg-cian-500",
          tone === "success" && "bg-turquesa-500",
        )}
      />
      <p className="tabular relative font-display text-display font-semibold leading-none text-ink">
        {figure}
      </p>
      <p className="relative mt-4 font-display text-body-lg font-semibold text-ink">
        {label}
      </p>
      {detail && (
        <p className="relative mt-1.5 text-body-sm leading-relaxed text-slate-ui">{detail}</p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   AVATARES APILADOS — prueba social sin fotos reales.
   ═══════════════════════════════════════════════════════════ */

export function AvatarStack({
  initials,
  extra,
  className,
}: {
  initials: string[];
  extra?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex -space-x-2.5">
        {initials.map((i, idx) => (
          <span
            key={i + idx}
            className="flex size-9 items-center justify-center rounded-full border-2 border-white bg-violeta-600 text-caption font-semibold text-white"
            style={{ opacity: 1 - idx * 0.12 }}
          >
            {i}
          </span>
        ))}
        {extra ? (
          <span className="flex size-9 items-center justify-center rounded-full border-2 border-white bg-surface-2 text-caption font-semibold text-graphite">
            +{extra}
          </span>
        ) : null}
      </div>
    </div>
  );
}
