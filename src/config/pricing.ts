/**
 * Fuente única de precios — Plan Maestro §10.
 *
 * IMPORTANTE (seguridad §9.3): en producción estos valores son el *espejo* de la
 * tabla `certificate_types` / `membership_plans` de Supabase. El servidor SIEMPRE
 * lee el precio de la base de datos al crear una orden; este archivo solo alimenta
 * la UI pública.
 *
 * `confirmed: true`  → dato confirmado en el deck o el pitch de SEP.
 * `confirmed: false` → propuesta a validar con los resultados del diagnóstico.
 */

export const CURRENCY = "PEN" as const;

export function soles(cents: number): string {
  return `S/ ${(cents / 100).toLocaleString("es-PE", {
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

/* ── Certificados — §10.1 (confirmados) ───────────────────── */

export const certificateTypes = [
  {
    slug: "sep",
    kind: "sep",
    name: "Certificado SEP",
    issuer: "Semillero de Emprendedores Perú",
    priceCents: 3000,
    confirmed: true,
    recommended: false,
    description:
      "Aval de Semillero de Emprendedores Perú, organización reconocida por SENAJU. Válido para voluntariado, portafolio y postulaciones nacionales.",
    features: [
      "Emitido por SEP",
      "Reconocimiento SENAJU",
      "Código de verificación público",
      "Válido para voluntariado y postulaciones",
    ],
  },
  {
    slug: "internacional",
    kind: "internacional",
    name: "Certificado Internacional",
    issuer: "Instituto Internacional de Ingeniería",
    priceCents: 5000,
    confirmed: true,
    recommended: true,
    description:
      "Aval del Instituto Internacional de Ingeniería. Mayor peso en tu CV y en aplicaciones internacionales.",
    features: [
      "Aval internacional",
      "Mayor peso en CV",
      "Código de verificación público",
      "Válido para aplicaciones internacionales",
    ],
  },
] as const;

/* ── SILP — §10.3 ─────────────────────────────────────────── */

export const silpPricing = {
  name: "SILP — Social Impact Leadership Program",
  duration: "6 semanas",
  tiers: [
    { label: "Tarifa social (Red SEP)", priceCents: 20000, confirmed: true },
    { label: "Tarifa comercial", priceCents: 35000, confirmed: false },
    { label: "Becado (voluntarios activos)", priceCents: 0, confirmed: true },
  ],
} as const;

/* ── Membresías — §10.4 ───────────────────────────────────── */

export const membershipPlans = [
  {
    slug: "semilla",
    emoji: "🌱",
    name: "Semilla",
    months: 0,
    priceCents: 0,
    confirmed: true,
    highlight: false,
    tagline: "Empieza sin pagar nada",
    benefits: [
      "Todos los cursos del catálogo",
      "Acceso a la comunidad SEP",
      "Newsletter quincenal",
      "Eventos abiertos y Demo Days",
    ],
  },
  {
    slug: "raiz",
    emoji: "🌿",
    name: "Raíz",
    months: 3,
    priceCents: 4500,
    confirmed: false,
    highlight: false,
    tagline: "Para tu primera acreditación",
    benefits: [
      "Todo lo de Semilla",
      "1 certificado SEP incluido",
      "Mentoría grupal mensual",
      "Acceso anticipado a nuevas cohortes",
    ],
  },
  {
    slug: "tronco",
    emoji: "🌳",
    name: "Tronco",
    months: 6,
    priceCents: 8000,
    confirmed: false,
    highlight: true,
    tagline: "El más elegido",
    benefits: [
      "Todo lo de Raíz",
      "2 certificados SEP incluidos",
      "1 mentoría 1:1 al mes",
      "Prioridad para presentar en Demo Day",
    ],
  },
  {
    slug: "bosque",
    emoji: "🌲",
    name: "Bosque",
    months: 12,
    priceCents: 14000,
    confirmed: false,
    highlight: false,
    tagline: "Un año completo de crecimiento",
    benefits: [
      "Todo lo de Tronco",
      "1 certificado Internacional incluido",
      "SILP con 30% de descuento",
      "Badge de miembro fundador",
    ],
  },
] as const;

/* ── B2B institucional — §10.5 (propuesta) ────────────────── */

export const b2bPackages = [
  {
    slug: "taller-semilla",
    name: "Taller Semilla",
    scope: "1 taller · 1 aula (≈30 estudiantes)",
    priceCents: 90000,
    confirmed: false,
    deliverables: ["Taller de 3 horas", "Constancias para estudiantes", "Mini-reporte de impacto"],
  },
  {
    slug: "programa-raiz",
    name: "Programa Raíz",
    scope: "4 talleres · 1 colegio · 1 ciclo escolar",
    priceCents: 320000,
    confirmed: false,
    deliverables: [
      "4 talleres completos",
      "Constancias para todos los estudiantes",
      "Reporte de impacto",
      "1 Demo Day interno",
    ],
  },
  {
    slug: "cohorte-bosque",
    name: "Cohorte Bosque",
    scope: "Cohorte de 30 universitarios (curso + SILP)",
    priceCents: 900000,
    confirmed: false,
    deliverables: [
      "Formación completa",
      "Certificados incluidos",
      "Reporte con métricas y mapeo a ODS",
      "Co-branding de la cohorte",
    ],
  },
  {
    slug: "alianza-anual",
    name: "Alianza Anual",
    scope: "Programa a medida multi-región",
    priceCents: 2500000,
    priceFrom: true,
    confirmed: false,
    deliverables: [
      "Cohortes patrocinadas",
      "Becas para jóvenes de su región",
      "Voluntariado corporativo",
      "Reporte trimestral de impacto",
      "Pipeline de talento regional",
    ],
  },
] as const;

/* ── Donaciones — §10.6 (confirmado en la web actual) ─────── */

export const donationAmounts = [1000, 2000, 5000] as const;

export const donationCauses = [
  { slug: "formacion-regiones", label: "Formación de jóvenes en regiones" },
  { slug: "talleres-colegios", label: "Talleres en colegios" },
  { slug: "becas-silp", label: "Becas SILP" },
] as const;

/* ── Métodos de pago — §10.8 ──────────────────────────────── */

export const paymentMethods = [
  { slug: "yape", label: "Yape", auto: false },
  { slug: "plin", label: "Plin", auto: false },
  { slug: "culqi_card", label: "Tarjeta de crédito o débito", auto: true },
  { slug: "transferencia", label: "Transferencia bancaria", auto: false },
] as const;
