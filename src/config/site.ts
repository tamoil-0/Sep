export const siteConfig = {
  name: "Semillero de Emprendedores Perú",
  shortName: "SEP",
  tagline: "¡Emprende hoy, lidera mañana!",
  description:
    "SEP impulsa el emprendimiento y liderazgo juvenil en el Perú: forma a jóvenes y universitarios, conecta talleres con escolares y articula a docentes, colegios y aliados.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://sep.edu.pe",
  locale: "es-PE",
  founded: "2024-04-07",
  foundedPlace: "Casma, Áncash",

  contact: {
    email: "semilleroemprendedorperu@gmail.com",
    whatsapp: "+51946370641",
    whatsappDisplay: "+51 946 370 641",
    whatsappUrl:
      "https://wa.me/51946370641?text=Hola%20SEP%2C%20quiero%20saber%20m%C3%A1s%20sobre%20sus%20programas",
  },

  social: {
    facebook: "https://facebook.com/Semillerodeemprendedoresperu",
    instagram: "https://instagram.com/semillerodemprendedoresperu",
    tiktok: "https://tiktok.com/@semillerodeemprendedores",
    linkedin: "https://linkedin.com/company/semilleroemprendedoresperu",
  },
} as const;

/** Métricas reales de tracción — Plan Maestro §1.5 */
export const impactStats = [
  { value: 135, prefix: "+", label: "Jóvenes líderes formados" },
  { value: 10, suffix: "+", label: "Regiones del Perú" },
  { value: 5, label: "Colegios aliados" },
  { value: 18, label: "Talleres realizados" },
  { value: 48, label: "Speakers en la red" },
] as const;

/** El problema — datos del pitch, §1.3 */
export const problemStats = [
  {
    figure: "80%",
    title: "Concentración en Lima",
    body: "De los programas de emprendimiento e innovación están en Lima, dejando fuera a jóvenes de regiones.",
  },
  {
    figure: "9×",
    title: "Brechas en universidades",
    body: "Menos probabilidad de éxito en regiones. Los primeros ciclos no ofrecen formación práctica en liderazgo, gestión ni oratoria.",
  },
  {
    figure: "70%",
    title: "Escolares sin referentes",
    body: "Del talento emprendedor vive en regiones, pero los escolares no acceden a talleres de innovación ni a mentores cercanos a su edad.",
  },
] as const;

/** Cadena de impacto — §1.4 */
export const impactChain = [
  { step: "SEP", detail: "Plataforma digital 100% virtual" },
  { step: "Universitarios", detail: "Primeros ciclos, cualquier carrera, cualquier región" },
  { step: "Se forman en", detail: "Design Thinking · Scrum · Lean · Liderazgo · Oratoria" },
  { step: "Impactan a", detail: "Estudiantes de secundaria en sus propias regiones" },
] as const;

/** Aliados y respaldo — §1.7 */
export const partners = [
  { name: "SENAJU", category: "red" },
  { name: "Proa", category: "red" },
  { name: "CONEII", category: "alianza" },
  { name: "CODE", category: "alianza" },
  { name: "Start Lima", category: "alianza" },
  { name: "Innovation Challenge PUCP", category: "alianza" },
  { name: "Hult Prize Perú", category: "mentoria" },
  { name: "UTP", category: "mentoria" },
  { name: "Universidad Científica del Sur", category: "mentoria" },
  { name: "UPN", category: "mentoria" },
  { name: "Huánuco Innova", category: "mentoria" },
  { name: "SpinOut Awards 2025", category: "premio" },
  { name: "Instituto Internacional de Ingeniería", category: "aval" },
] as const;

/** FAQs oficiales — §1.14 */
export const faqs = [
  {
    q: "¿Cómo puedo ser voluntario en SEP?",
    a: "SEP convoca a postular a los voluntarios una vez al año en las áreas de Cultura y Talento, Marketing y Comunicaciones, Administración y Finanzas, y por último Innovación y Tecnología.",
  },
  {
    q: "¿A quiénes está dirigido el voluntariado?",
    a: "Estudiantes universitarios y profesionales jóvenes que deseen contribuir con la sociedad y con tiempo para actividades.",
  },
  {
    q: "¿Los cursos tienen algún costo?",
    a: "No. Los cursos del catálogo no tienen costo de acceso. Lo único opcional es el certificado: S/30 el certificado SEP y S/50 el certificado con aval del Instituto Internacional de Ingeniería.",
  },
  {
    q: "¿Cómo puedo apoyar la misión de la comunidad SEP?",
    a: "Puedes escribirnos en nuestras redes sociales y/o al correo semilleroemprendedorperu@gmail.com",
  },
  {
    q: "¿Cómo puedo promocionar mi marca empresarial en los eventos de SEP?",
    a: "Puedes escribirnos en nuestras redes sociales y/o al correo semilleroemprendedorperu@gmail.com",
  },
  {
    q: "¿Cómo postulo para ser speaker en los eventos de SEP?",
    a: "Puedes enviarnos tu CV a nuestras redes sociales y/o al correo semilleroemprendedorperu@gmail.com, o registrarte directamente en nuestra red de speakers desde la plataforma.",
  },
  {
    q: "¿Cómo accedo a una asesoría para mi emprendimiento?",
    a: "Puedes enviarnos tu CV a nuestras redes sociales y/o al correo semilleroemprendedorperu@gmail.com",
  },
] as const;
