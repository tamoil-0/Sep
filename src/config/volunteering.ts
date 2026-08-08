/**
 * Programa de voluntariado y red de colegios — Plan Maestro §1.9 y §1.10.
 */

export interface VolunteerRole {
  slug: string;
  name: string;
  type: "mentor_junior" | "community_manager" | "event_organizer";
  openPositions: number;
  hoursPerWeek: number;
  exclusive?: string;
  description: string;
  requirements: string[];
  benefits: { title: string; detail: string }[];
}

export const volunteerRoles: VolunteerRole[] = [
  {
    slug: "mentor",
    name: "Mentor SEP",
    type: "mentor_junior",
    openPositions: 2,
    hoursPerWeek: 4,
    exclusive: "Exclusivo egresados SILP",
    description:
      "Acompañas a jóvenes universitarios en el diseño de sus proyectos de innovación social. Guías, retroalimentas y celebras sus logros.",
    requirements: [
      "Egresado del SILP o 1 curso SEP completado",
      "Disponibilidad de 4 h/semana",
      "Interés genuino en el impacto regional",
    ],
    benefits: [
      {
        title: "Certificado Mentor Junior SEP",
        detail:
          "Aval institucional que acredita tu rol formalmente ante universidades y empleadores.",
      },
      {
        title: "Carta de recomendación personalizada",
        detail: "Emitida por la dirección de SEP para postulaciones académicas o laborales.",
      },
      {
        title: "Canal privado de mentores",
        detail:
          "Comunidad cerrada con recursos, casos y sesiones exclusivas de formación en mentoría.",
      },
      {
        title: "Prioridad para ascender a Mentor Senior",
        detail: "Ruta clara de crecimiento dentro del ecosistema SEP.",
      },
      {
        title: "Facilitador en Demo Days",
        detail: "Presencia oficial en los eventos más importantes de SEP.",
      },
    ],
  },
  {
    slug: "community-manager",
    name: "Community Manager",
    type: "community_manager",
    openPositions: 1,
    hoursPerWeek: 5,
    description:
      "Gestionas la voz digital de SEP: redes sociales, grupos de WhatsApp, foro de la plataforma y el tono de comunicación con los jóvenes.",
    requirements: [
      "Manejo de Instagram, TikTok y LinkedIn",
      "Habilidad para crear contenido en Canva",
      "Disponibilidad de 5 h/semana",
    ],
    benefits: [
      {
        title: "Portafolio digital certificado",
        detail:
          "SEP valida y certifica tu experiencia en gestión de comunidades para tu CV profesional.",
      },
      {
        title: "Reconocimiento público como co-creador",
        detail: "Crédito en contenidos, campañas y publicaciones oficiales de SEP.",
      },
      {
        title: "Formación en marketing digital social",
        detail:
          "Sesiones privadas de capacitación en estrategia de contenido e impacto digital.",
      },
      {
        title: "Acceso a métricas y analítica SEP",
        detail: "Aprende a leer datos de impacto y comunidad en contexto real.",
      },
      {
        title: "Mentoría en comunicación estratégica",
        detail: "Acompañamiento directo del equipo de marketing de SEP.",
      },
    ],
  },
  {
    slug: "organizador-eventos",
    name: "Organizador de eventos",
    type: "event_organizer",
    openPositions: 1,
    hoursPerWeek: 6,
    description:
      "Coordinas la logística de Demo Days, ferias, talleres y workshops. Eres el motor que hace que SEP llegue a más espacios y personas.",
    requirements: [
      "Experiencia organizando actividades estudiantiles",
      "Proactividad y atención al detalle",
      "Disponibilidad de 6 h/semana",
    ],
    benefits: [
      {
        title: "Certificado en gestión de eventos",
        detail: "Acreditación formal en organización de eventos de innovación social.",
      },
      {
        title: "Mención oficial en cada evento",
        detail: "Reconocimiento público como co-organizador en materiales y redes del evento.",
      },
      {
        title: "Red de aliados institucionales",
        detail:
          "Contacto directo con universidades, ONGs, municipalidades y empresas colaboradoras.",
      },
      {
        title: "Experiencia en logística de alto impacto",
        detail: "Coordinas eventos de hasta 200+ personas con alcance nacional.",
      },
      {
        title: "Acceso a speakers y líderes de Latam",
        detail: "Contacto directo con expertos invitados a los eventos de SEP.",
      },
    ],
  },
];

/** Beneficios comunes a todos los voluntarios */
export const commonVolunteerBenefits = [
  {
    title: "Cursos exclusivos SEP",
    detail:
      "Acceso al catálogo completo de metodologías ágiles, al SILP y a formaciones especiales para voluntarios.",
  },
  {
    title: "Impacto social real",
    detail: "Tu trabajo transforma vidas en regiones que nadie más está atendiendo.",
  },
  {
    title: "Acceso exclusivo a eventos y recursos",
    detail: "Invitaciones anticipadas a Demo Days, ferias, webinars y materiales internos.",
  },
  {
    title: "Networking con profesionales de Latam",
    detail:
      "Conecta con líderes, fundadores y referentes de innovación social de toda América Latina.",
  },
];

export const volunteerProcess = [
  { step: 1, title: "Envías el formulario", detail: "Cuéntanos quién eres y por qué quieres sumarte." },
  { step: 2, title: "Entrevista de 15 min", detail: "Conversación virtual con el equipo de SEP." },
  { step: 3, title: "Confirmación e inducción", detail: "Te damos la bienvenida y tus accesos." },
];

/* ── Red de colegios — §1.10 ──────────────────────────────── */

export const schoolBenefits = [
  {
    title: "Talleres de innovación social",
    detail:
      "Design Thinking, Scrum y liderazgo dictados por universitarios de su propia región, de forma gratuita.",
  },
  {
    title: "Certificado de participación",
    detail:
      "Cada estudiante que completa un taller recibe una constancia firmada por SEP, válida para su portafolio.",
  },
  {
    title: "Mentores universitarios cercanos",
    detail:
      'Los estudiantes se conectan con universitarios de su misma región, rompiendo el mito de que "para innovar hay que ir a Lima".',
  },
  {
    title: "Proyectos de impacto propios",
    detail:
      "Los escolares diseñan prototipos de soluciones para problemas reales de su comunidad, con acompañamiento del equipo SEP.",
  },
  {
    title: "Acceso a la plataforma SEP",
    detail:
      "Los estudiantes de colegios aliados acceden a cursos gratuitos cuando concluyen 5.º de secundaria.",
  },
];

export const schoolProcess = [
  {
    step: 1,
    title: "Envías la solicitud",
    detail: "El formulario llega al equipo de alianzas de SEP.",
  },
  {
    step: 2,
    title: "Te contactamos en 72 h",
    detail: "Coordinamos una reunión virtual de bienvenida.",
  },
  {
    step: 3,
    title: "Firmamos un convenio SEP",
    detail: "Formalización del acuerdo: talleres, fechas y roles.",
  },
  {
    step: 4,
    title: "Primer taller en tu colegio",
    detail: "Universitarios SEP llegan a tus aulas.",
  },
];

export const activeSchools = [
  { name: "I.E. San Bartolomé", location: "Casma, Áncash", workshops: 2 },
  { name: "I.E. República de Perú", location: "Chimbote, Áncash", workshops: 5 },
];

/* ── Red de speakers — §1.11 ──────────────────────────────── */

export const speakerTopics = [
  "Design Thinking",
  "Scrum",
  "Lean Startup",
  "Liderazgo social",
  "Innovación regional",
  "OKRs",
  "Emprendimiento",
  "Otro",
] as const;

export const speakerBenefits = [
  { title: "Visibilidad ante 1,000+ jóvenes", detail: "De más de 10 regiones del Perú y Latam." },
  { title: "Constancia de speaker", detail: "Emitida por SEP para tu portafolio y CV." },
  {
    title: "Red de contactos",
    detail: "Con organizadores, fundadores y referentes de América Latina.",
  },
  { title: "Cursos exclusivos SEP", detail: "Para seguir creciendo como facilitador." },
];
