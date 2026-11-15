/**
 * Testimonios reales de las encuestas de satisfacción de los webinars de SEP.
 *
 * Fuente: `encuesta_satisfaccion_de_webinars/Encuestas de satisfaccion SEP - todas las respuestas.xlsx`
 * (59 respuestas, oct.–nov. 2026). Ficha: `contenido/testimonios.md`.
 *
 * Las encuestas no piden nombre ni permiso de publicación: por eso cada cita va
 * ANÓNIMA (rol + región + webinar). Las citas son textuales; solo se corrigieron
 * tildes y mayúsculas, y «…» marca un recorte.
 */

export interface WebinarTestimonial {
  quote: string;
  role: "Estudiante" | "Egresado" | "Egresada";
  region: string;
  webinar: string;
  date: string; // ISO, fecha del webinar
}

export const webinarTestimonials: WebinarTestimonial[] = [
  {
    quote:
      "Muchas gracias por la charla, ya que el problema es que no nos creemos suficientes o no tenemos talentos.",
    role: "Estudiante",
    region: "Junín",
    webinar: "Descubre tu talento y propósito",
    date: "2026-10-03",
  },
  {
    quote:
      "Aprender que la vida no es una competencia, que se trata de conectar los puntos y que cada experiencia nos suma dependiendo de cómo la tomemos.",
    role: "Estudiante",
    region: "Lima",
    webinar: "De tu historia a tu iniciativa",
    date: "2026-10-10",
  },
  {
    quote:
      "La conexión que se logra mantener con Jashira e identificarte realmente con su historia, tomarlas de ejemplo y seguir adelante con tus ideales y tus anhelos para poder desarrollar un proyecto que genere impacto.",
    role: "Estudiante",
    region: "Lambayeque",
    webinar: "De tu historia a tu iniciativa",
    date: "2026-10-10",
  },
  {
    quote: "La explicación a través de pasos sencillos de cómo crear tu ONG e impactar en la sociedad.",
    role: "Egresado",
    region: "Áncash",
    webinar: "Cómo crear tu ONG",
    date: "2026-10-17",
  },
  {
    quote:
      "Conocer nuevas oportunidades académicas, aprender sobre programas internacionales y descubrir cómo puedo prepararme para alcanzar mis metas.",
    role: "Estudiante",
    region: "Lima",
    webinar: "De postulante a fundadora",
    date: "2026-10-25",
  },
  {
    quote:
      "Me inspiró saber que podemos generar cambios positivos en la sociedad a través de la solidaridad, el compromiso y el trabajo en equipo.",
    role: "Estudiante",
    region: "Puno",
    webinar: "Liderazgo que transforma realidades",
    date: "2026-11-07",
  },
];

/** Cifras agregadas de las mismas 59 respuestas (escala de 1 a 5). */
export const webinarSurveyStats = {
  responses: 59,
  webinars: 5,
  averageExperience: "4,7",
  recommendShare: "92 %", // calificó 4 o 5 la probabilidad de recomendar los webinars
  regions: 13, // regiones del Perú de quienes respondieron (más 1 respuesta del extranjero)
  period: "octubre y noviembre de 2026",
} as const;
