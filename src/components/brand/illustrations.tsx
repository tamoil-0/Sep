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

const GRAD = {
  blue: "#2E0BE8",
  violet: "#6A0DD9",
  purple: "#A50FC6",
  gold: "#FFC629",
  seed: "#7CC242",
  line: "#E6E4F0",
  mist: "#A8A4BC",
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
          {n.main && <circle cx={n.x} cy={n.y} r={n.r + 7} fill={GRAD.gold} opacity="0.25" />}
          <circle
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill={n.main ? GRAD.gold : "#fff"}
            opacity={n.main ? 1 : 0.9}
          />
        </g>
      ))}

      {/* Brote creciendo desde el nodo principal */}
      <g stroke={GRAD.seed} strokeWidth="2.4" strokeLinecap="round" fill="none">
        <path d="M118 121 v-16" />
        <path d="M118 110 c-9 -2 -13 -9 -12 -16 8 0 13 6 12 16z" fill={GRAD.seed} stroke="none" />
        <path d="M118 114 c9 -3 12 -10 10 -17 -8 1 -12 8 -10 17z" fill={GRAD.seed} stroke="none" opacity="0.75" />
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
            fill={GRAD.seed}
            opacity={0.35 + (i % 4) * 0.15}
          />
        );
      })}
      <circle cx="540" cy="100" r="14" fill={GRAD.gold} />

      {/* Flechas */}
      {[[100, 168], [230, 328], [412, 492]].map(([x1, x2], i) => (
        <g key={i} stroke={GRAD.gold} strokeWidth="2" strokeLinecap="round" fill="none">
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
        "relative overflow-hidden rounded-[12px] bg-surface-1",
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
                fill={i % 3 === 0 ? GRAD.gold : i % 3 === 1 ? GRAD.violet : GRAD.seed}
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
            <circle cx="70" cy="60" r="11" fill={GRAD.gold} stroke="none" />
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
                fill={i === 2 ? GRAD.gold : GRAD.mist}
                opacity={i === 2 ? 0.9 : 0.3}
              />
            ))}
            <circle cx="252" cy="65" r="26" fill={GRAD.seed} opacity="0.4" />
            <circle cx="252" cy="65" r="12" fill={GRAD.seed} opacity="0.7" />
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
            <circle cx="288" cy="24" r="13" fill={GRAD.gold} />
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
  tone?: "brand" | "gold" | "seed";
}) {
  return (
    <div className="relative overflow-hidden rounded-[16px] border border-line bg-white p-6">
      <div
        aria-hidden
        className={cn(
          "absolute -right-6 -top-6 size-24 rounded-full opacity-[0.09]",
          tone === "brand" && "sep-gradient",
          tone === "gold" && "bg-gold-500",
          tone === "seed" && "bg-seed-500",
        )}
      />
      <p
        className={cn(
          "tabular relative font-display text-[2.75rem] font-bold leading-none",
          tone === "brand" && "sep-gradient-text",
          tone === "gold" && "text-gold-600",
          tone === "seed" && "text-seed-700",
        )}
      >
        {figure}
      </p>
      <p className="relative mt-3 font-display text-[1.0625rem] font-semibold text-ink">
        {label}
      </p>
      {detail && (
        <p className="relative mt-1.5 text-sm leading-relaxed text-slate-ui">{detail}</p>
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
            className="flex size-9 items-center justify-center rounded-full border-2 border-white sep-gradient text-[0.6875rem] font-semibold text-white"
            style={{ opacity: 1 - idx * 0.12 }}
          >
            {i}
          </span>
        ))}
        {extra ? (
          <span className="flex size-9 items-center justify-center rounded-full border-2 border-white bg-surface-2 text-[0.6875rem] font-semibold text-graphite">
            +{extra}
          </span>
        ) : null}
      </div>
    </div>
  );
}
