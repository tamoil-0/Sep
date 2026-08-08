/** Los 25 departamentos del Perú + opción para el extranjero. */
export const PERU_REGIONS = [
  "Amazonas",
  "Áncash",
  "Apurímac",
  "Arequipa",
  "Ayacucho",
  "Cajamarca",
  "Callao",
  "Cusco",
  "Huancavelica",
  "Huánuco",
  "Ica",
  "Junín",
  "La Libertad",
  "Lambayeque",
  "Lima",
  "Loreto",
  "Madre de Dios",
  "Moquegua",
  "Pasco",
  "Piura",
  "Puno",
  "San Martín",
  "Tacna",
  "Tumbes",
  "Ucayali",
] as const;

export const REGION_OPTIONS = [...PERU_REGIONS, "Vivo en otro país"] as const;

export type PeruRegion = (typeof PERU_REGIONS)[number];

/** Regiones donde SEP ya tiene presencia activa */
export const ACTIVE_REGIONS: PeruRegion[] = [
  "Áncash",
  "Cusco",
  "Arequipa",
  "La Libertad",
  "Huánuco",
  "Lima",
];

export const CURRENT_SITUATIONS = [
  "Universitario (1er al 3er ciclo)",
  "Universitario (4to ciclo en adelante)",
  "Egresado reciente (menos de 2 años)",
  "Emprendedor",
  "Trabajo y estudio a la vez",
  "Escolar de 5to de secundaria",
  "Otro",
] as const;

export const INTEREST_AREAS = [
  "Design Thinking",
  "Scrum y gestión ágil",
  "Lean Startup",
  "Liderazgo e impacto social",
  "Oratoria y comunicación",
  "Gestión de proyectos sociales",
  "Emprendimiento desde cero",
  "Cómo dictar talleres y capacitar",
] as const;

export const TEACHING_LEVELS = [
  "Primaria",
  "Secundaria",
  "Instituto o educación superior",
  "Universidad",
] as const;
