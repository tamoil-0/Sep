import type { UserRole } from "@/types/roles";

export interface NavItem {
  label: string;
  href: string;
  icon?: string; // nombre de lucide-react
  children?: { label: string; href: string; description?: string }[];
}

/* ── Navegación pública ───────────────────────────────────── */

export const marketingNav: NavItem[] = [
  {
    label: "Programas",
    href: "/cursos",
    children: [
      {
        label: "Cursos gratuitos",
        href: "/cursos",
        description: "Design Thinking, Scrum y Liderazgo. 8 h, 100 % virtual y sin costo de acceso.",
      },
      {
        label: "SILP",
        href: "/silp",
        description: "Social Impact Leadership Program — 6 semanas, programa insignia.",
      },
      {
        label: "Para docentes",
        href: "/docentes",
        description: "Metodologías activas para llevar a tu aula.",
      },
      {
        label: "Eventos",
        href: "/eventos",
        description: "Demo Days, ferias y webinars abiertos.",
      },
    ],
  },
  {
    label: "Participa",
    href: "/voluntariado",
    children: [
      {
        label: "Voluntariado",
        href: "/voluntariado",
        description: "Mentor, Community Manager u Organizador de eventos.",
      },
      {
        label: "Red de colegios",
        href: "/colegios",
        description: "Inscribe tu colegio y recibe talleres gratuitos.",
      },
      {
        label: "Red de speakers",
        href: "/speakers",
        description: "Comparte tu historia con jóvenes de 10+ regiones.",
      },
      {
        label: "Convocatorias",
        href: "/convocatorias",
        description: "Postulaciones abiertas ahora mismo.",
      },
    ],
  },
  {
    label: "Empresas",
    href: "/empresas",
  },
  {
    label: "Nosotros",
    href: "/nosotros",
    children: [
      { label: "Quiénes somos", href: "/nosotros", description: "Historia, misión y equipo." },
      { label: "Testimonios", href: "/testimonios", description: "Historias de la comunidad." },
      { label: "Blog", href: "/blog", description: "Recursos y noticias de SEP." },
      { label: "Preguntas frecuentes", href: "/faq", description: "Todo lo que suelen preguntarnos." },
    ],
  },
  { label: "Precios", href: "/precios" },
  { label: "Donar", href: "/donaciones" },
];

export const footerNav = {
  Programas: [
    { label: "Cursos gratuitos", href: "/cursos" },
    { label: "SILP", href: "/silp" },
    { label: "Programa docente", href: "/docentes" },
    { label: "Eventos", href: "/eventos" },
    { label: "Convocatorias", href: "/convocatorias" },
  ],
  Comunidad: [
    { label: "Voluntariado", href: "/voluntariado" },
    { label: "Red de colegios", href: "/colegios" },
    { label: "Red de speakers", href: "/speakers" },
    { label: "Testimonios", href: "/testimonios" },
    { label: "Blog", href: "/blog" },
  ],
  Organización: [
    { label: "Nosotros", href: "/nosotros" },
    { label: "Para empresas", href: "/empresas" },
    { label: "Precios y certificados", href: "/precios" },
    { label: "Donaciones", href: "/donaciones" },
    { label: "Contacto", href: "/contacto" },
  ],
  Legal: [
    { label: "Términos y condiciones", href: "/legal/terminos" },
    { label: "Política de privacidad", href: "/legal/privacidad" },
    { label: "Política de cookies", href: "/legal/cookies" },
    { label: "Verificar certificado", href: "/verificar" },
  ],
} as const;

/* ── Navegación de los paneles, por rol (§6) ──────────────── */

export const appNav: Record<UserRole, NavItem[]> = {
  estudiante: [
    { label: "Dashboard", href: "/estudiante", icon: "LayoutDashboard" },
    { label: "Mis cursos", href: "/estudiante/mis-cursos", icon: "BookOpen" },
    { label: "Catálogo", href: "/estudiante/catalogo", icon: "LibraryBig" },
    { label: "Comunidad", href: "/estudiante/comunidad", icon: "Users" },
    { label: "Certificados", href: "/estudiante/certificados", icon: "Award" },
    { label: "Eventos", href: "/estudiante/eventos", icon: "CalendarDays" },
    { label: "Mis proyectos", href: "/estudiante/proyectos", icon: "Lightbulb" },
    { label: "Membresía", href: "/estudiante/membresia", icon: "Sprout" },
  ],
  docente: [
    { label: "Dashboard", href: "/docente", icon: "LayoutDashboard" },
    { label: "Mi programa", href: "/docente/programa", icon: "BookOpen" },
    { label: "Recursos para el aula", href: "/docente/recursos", icon: "FolderOpen" },
    { label: "Mi colegio", href: "/docente/mi-colegio", icon: "School" },
    { label: "Solicitar taller", href: "/docente/talleres", icon: "CalendarPlus" },
    { label: "Certificados", href: "/docente/certificados", icon: "Award" },
  ],
  mentor: [
    { label: "Dashboard", href: "/mentor", icon: "LayoutDashboard" },
    { label: "Mis mentorados", href: "/mentor/mentorados", icon: "UsersRound" },
    { label: "Sesiones", href: "/mentor/sesiones", icon: "CalendarDays" },
    { label: "Canal de mentores", href: "/mentor/canal", icon: "MessagesSquare" },
    { label: "Mis horas", href: "/mentor/horas", icon: "Clock" },
  ],
  institucion: [
    { label: "Dashboard", href: "/institucion", icon: "LayoutDashboard" },
    { label: "Perfil institucional", href: "/institucion/perfil", icon: "Building2" },
    { label: "Talleres", href: "/institucion/talleres", icon: "Presentation" },
    { label: "Estudiantes", href: "/institucion/estudiantes", icon: "GraduationCap" },
    { label: "Reporte de impacto", href: "/institucion/impacto", icon: "ChartNoAxesCombined" },
    { label: "Convenio", href: "/institucion/convenio", icon: "FileSignature" },
    { label: "Facturación", href: "/institucion/facturacion", icon: "Receipt" },
  ],
  speaker: [
    { label: "Dashboard", href: "/speaker", icon: "LayoutDashboard" },
    { label: "Mi perfil público", href: "/speaker/perfil", icon: "UserRound" },
    { label: "Invitaciones", href: "/speaker/invitaciones", icon: "Mail" },
    { label: "Mis participaciones", href: "/speaker/participaciones", icon: "Mic" },
  ],
  admin: [
    { label: "KPIs", href: "/admin", icon: "ChartNoAxesCombined" },
    { label: "Usuarios", href: "/admin/usuarios", icon: "Users" },
    { label: "Cursos", href: "/admin/cursos", icon: "BookOpen" },
    { label: "Inscripciones", href: "/admin/inscripciones", icon: "ClipboardList" },
    { label: "Certificados", href: "/admin/certificados", icon: "Award" },
    { label: "Pagos", href: "/admin/pagos", icon: "CreditCard" },
    { label: "Postulaciones", href: "/admin/postulaciones", icon: "Inbox" },
    { label: "Colegios", href: "/admin/colegios", icon: "School" },
    { label: "Instituciones", href: "/admin/instituciones", icon: "Building2" },
    { label: "Eventos", href: "/admin/eventos", icon: "CalendarDays" },
    { label: "Comunidad", href: "/admin/comunidad", icon: "MessagesSquare" },
    { label: "Diagnóstico", href: "/admin/diagnostico", icon: "ChartPie" },
    { label: "Newsletter", href: "/admin/newsletter", icon: "Send" },
    { label: "Donaciones", href: "/admin/donaciones", icon: "HeartHandshake" },
    { label: "Impacto", href: "/admin/impacto", icon: "Globe" },
    { label: "Auditoría", href: "/admin/auditoria", icon: "ShieldCheck" },
  ],
  super_admin: [],
};

// super_admin ve exactamente lo mismo que admin
appNav.super_admin = appNav.admin;
