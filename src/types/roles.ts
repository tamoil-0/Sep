/**
 * Roles y RBAC — Plan Maestro §5.
 *
 * Respuesta a "¿son 3 tipos de usuario?": son SEIS.
 * 3 tipos de cuenta con registro abierto + 3 roles internos que SEP otorga.
 */

export const USER_ROLES = [
  "estudiante",
  "docente",
  "institucion",
  "mentor",
  "speaker",
  "admin",
  "super_admin",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

/** Tipos de cuenta con registro abierto */
export const SIGNUP_ROLES = ["estudiante", "docente", "institucion"] as const;
export type SignupRole = (typeof SIGNUP_ROLES)[number];

/** Roles que solo SEP puede otorgar */
export const GRANTED_ROLES = ["mentor", "speaker", "admin", "super_admin"] as const;

export const VOLUNTEER_TYPES = [
  "mentor_junior",
  "mentor_senior",
  "community_manager",
  "event_organizer",
] as const;
export type VolunteerType = (typeof VOLUNTEER_TYPES)[number];

export const INSTITUTION_TYPES = [
  "colegio",
  "universidad",
  "empresa",
  "ong",
  "gobierno",
] as const;
export type InstitutionType = (typeof INSTITUTION_TYPES)[number];

/* ── Metadata de presentación ─────────────────────────────── */

export interface RoleMeta {
  role: UserRole;
  label: string;
  shortLabel: string;
  description: string;
  home: string;
  openSignup: boolean;
}

export const ROLE_META: Record<UserRole, RoleMeta> = {
  estudiante: {
    role: "estudiante",
    label: "Estudiante",
    shortLabel: "Estudiante",
    description:
      "Universitario, joven en formación o egresado escolar. Toma cursos, participa en la comunidad y obtiene certificados.",
    home: "/estudiante",
    openSignup: true,
  },
  docente: {
    role: "docente",
    label: "Docente o educador",
    shortLabel: "Docente",
    description:
      "Enseñas en colegio, instituto o universidad. Accedes al programa docente, recursos para el aula y talleres para tus estudiantes.",
    home: "/docente",
    openSignup: true,
  },
  institucion: {
    role: "institucion",
    label: "Institución",
    shortLabel: "Institución",
    description:
      "Colegio, universidad, empresa u ONG. Gestiona talleres, convenios y reportes de impacto.",
    home: "/institucion",
    openSignup: true,
  },
  mentor: {
    role: "mentor",
    label: "Mentor / Voluntario",
    shortLabel: "Mentor",
    description:
      "Voluntario SEP: mentor, community manager u organizador de eventos. Rol otorgado tras postulación aprobada.",
    home: "/mentor",
    openSignup: false,
  },
  speaker: {
    role: "speaker",
    label: "Speaker",
    shortLabel: "Speaker",
    description:
      "Especialista invitado a los programas de SEP. Rol otorgado tras aprobación del perfil.",
    home: "/speaker",
    openSignup: false,
  },
  admin: {
    role: "admin",
    label: "Administrador",
    shortLabel: "Admin",
    description: "Equipo SEP. Gestión de la plataforma.",
    home: "/admin",
    openSignup: false,
  },
  super_admin: {
    role: "super_admin",
    label: "Super administrador",
    shortLabel: "Super admin",
    description: "Control total, incluida la gestión de roles y la auditoría.",
    home: "/admin",
    openSignup: false,
  },
};

/** Prioridad para decidir a qué panel entra alguien con varios roles */
const ROLE_PRIORITY: UserRole[] = [
  "super_admin",
  "admin",
  "institucion",
  "mentor",
  "docente",
  "speaker",
  "estudiante",
];

export function primaryRole(roles: UserRole[]): UserRole {
  for (const r of ROLE_PRIORITY) if (roles.includes(r)) return r;
  return "estudiante";
}

export function roleHome(roles: UserRole[]): string {
  return ROLE_META[primaryRole(roles)].home;
}

export function isAdmin(roles: UserRole[]): boolean {
  return roles.includes("admin") || roles.includes("super_admin");
}

export function isStaff(roles: UserRole[]): boolean {
  return isAdmin(roles) || roles.includes("mentor");
}

/** Prefijo de ruta → roles que pueden entrar */
export const ROUTE_GUARDS: { prefix: string; allow: UserRole[] }[] = [
  { prefix: "/estudiante", allow: ["estudiante", "mentor", "admin", "super_admin"] },
  { prefix: "/docente", allow: ["docente", "admin", "super_admin"] },
  { prefix: "/mentor", allow: ["mentor", "admin", "super_admin"] },
  { prefix: "/institucion", allow: ["institucion", "admin", "super_admin"] },
  { prefix: "/speaker", allow: ["speaker", "admin", "super_admin"] },
  { prefix: "/admin", allow: ["admin", "super_admin"] },
];
