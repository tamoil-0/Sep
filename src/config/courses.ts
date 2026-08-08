/**
 * Catálogo de cursos — Plan Maestro §1.8.
 * Espejo de la tabla `courses` de Supabase; alimenta las páginas públicas
 * mientras la base de datos no esté conectada.
 */

export type CourseStatus = "disponible" | "proximamente" | "borrador";
export type CourseAudience = "universitario" | "docente" | "escolar" | "general";

export interface CourseSession {
  number: number;
  week: number;
  title: string;
  subtitle: string;
  description?: string;
}

export interface Course {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  audience: CourseAudience;
  status: CourseStatus;
  totalHours: number;
  sessionsCount: number;
  weeks: number;
  frequency: string;
  isFree: boolean;
  flagship?: boolean;
  priceCents?: number;
  sessions?: CourseSession[];
}

/** Formato estándar de todo curso SEP */
export const COURSE_FORMAT = {
  weeks: 2,
  frequency: "Interdiario (3 sesiones/semana)",
  sessionMinutes: 120,
  totalHours: 8,
  sessionsCount: 6,
  modality: "100% virtual — Plataforma SEP",
  access: "Acceso gratuito siempre",
} as const;

export const courses: Course[] = [
  {
    slug: "design-thinking-aplicado",
    title: "Design Thinking aplicado",
    subtitle: "Tu primera experiencia en Design Thinking",
    description:
      "Empatía, ideación y prototipado para el cambio social. Aprende el método completo resolviendo un problema real de tu comunidad.",
    category: "Metodologías ágiles",
    audience: "universitario",
    status: "disponible",
    totalHours: 8,
    sessionsCount: 6,
    weeks: 2,
    frequency: "Interdiario",
    isFree: true,
    sessions: [
      {
        number: 1,
        week: 1,
        title: "¿Qué es Design Thinking?",
        subtitle: "Introducción · casos en América Latina",
        description:
          "Introducción al método, casos de éxito en América Latina y diferencia frente al pensamiento tradicional.",
      },
      {
        number: 2,
        week: 1,
        title: "Empatía — Conoce a tu usuario",
        subtitle: "Entrevistas · mapa de empatía",
        description:
          "Técnicas de observación, entrevistas de usuario y mapa de empatía. Ejercicio práctico en vivo.",
      },
      {
        number: 3,
        week: 1,
        title: "Definición del problema (POV)",
        subtitle: "Point of View · ¿Cómo podríamos...?",
        description:
          'Cómo sintetizar hallazgos en un "Point of View" potente. Redacción del enunciado "¿Cómo podríamos…?".',
      },
      {
        number: 4,
        week: 2,
        title: "Ideación — Brainstorming sin límites",
        subtitle: "SCAMPER · Crazy 8s · selección de ideas",
        description:
          "Técnicas: SCAMPER, mapa mental y Crazy 8s. Reglas del brainstorming efectivo y selección de ideas.",
      },
      {
        number: 5,
        week: 2,
        title: "Prototipado rápido",
        subtitle: "Prototipo en papel · fallar rápido",
        description:
          'Cómo crear un prototipo en papel en menos de 30 minutos. Principio "fallar rápido para aprender rápido".',
      },
      {
        number: 6,
        week: 2,
        title: "Testeo + Presentación de proyectos",
        subtitle: "Feedback real · mini-pitch final",
        description:
          "Feedback de usuarios reales, iteración del prototipo y mini-pitch de cada proyecto ante el grupo.",
      },
    ],
  },
  {
    slug: "scrum-proyectos-sociales",
    title: "Scrum para proyectos sociales",
    subtitle: "Gestión ágil de proyectos de impacto regional",
    description:
      "Organiza equipos y entrega valor en ciclos cortos. Scrum llevado al terreno de la innovación social en regiones.",
    category: "Metodologías ágiles",
    audience: "universitario",
    status: "proximamente",
    totalHours: 8,
    sessionsCount: 6,
    weeks: 2,
    frequency: "Interdiario",
    isFree: true,
  },
  {
    slug: "liderazgo-impacto-regional",
    title: "Liderazgo e impacto regional",
    subtitle: "Desarrolla tu perfil de líder desde tu región",
    description:
      "Oratoria, toma de decisiones y liderazgo de equipos. Construye tu voz sin salir de tu región.",
    category: "Liderazgo",
    audience: "universitario",
    status: "proximamente",
    totalHours: 8,
    sessionsCount: 6,
    weeks: 2,
    frequency: "Interdiario",
    isFree: true,
  },
  {
    slug: "metodologias-agiles-en-el-aula",
    title: "Metodologías ágiles en el aula",
    subtitle: "DT y Scrum aplicados al entorno escolar",
    description:
      "Para docentes que quieren innovar en su clase. Diseña sesiones activas con Design Thinking y Scrum.",
    category: "Para docentes",
    audience: "docente",
    status: "proximamente",
    totalHours: 8,
    sessionsCount: 6,
    weeks: 2,
    frequency: "Interdiario",
    isFree: true,
  },
];

export const silp: Course = {
  slug: "silp",
  title: "Social Impact Leadership Program",
  subtitle: "SILP — Programa insignia de SEP",
  description:
    "Seis semanas de formación completa en liderazgo social. Diseñas y ejecutas un proyecto de impacto real en tu región, con acompañamiento de mentores.",
  category: "SILP",
  audience: "universitario",
  status: "disponible",
  totalHours: 36,
  sessionsCount: 18,
  weeks: 6,
  frequency: "Interdiario",
  isFree: false,
  flagship: true,
  priceCents: 20000,
};

export const courseCategories = [
  "Todos",
  "Metodologías ágiles",
  "Liderazgo",
  "Para docentes",
  "SILP",
] as const;
