import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";

const DOCS = ["terminos", "privacidad", "cookies"] as const;
type Doc = (typeof DOCS)[number];

const meta: Record<Doc, { title: string; description: string }> = {
  terminos: {
    title: "Términos y condiciones",
    description: "Condiciones de uso de la plataforma SEP.",
  },
  privacidad: {
    title: "Política de privacidad",
    description:
      "Cómo tratamos tus datos personales conforme a la Ley N.º 29733 del Perú.",
  },
  cookies: {
    title: "Política de cookies",
    description: "Qué cookies usamos y para qué.",
  },
};

export function generateStaticParams() {
  return DOCS.map((doc) => ({ doc }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ doc: string }>;
}): Promise<Metadata> {
  const { doc } = await params;
  if (!DOCS.includes(doc as Doc)) return { title: "Documento legal" };
  return meta[doc as Doc];
}

const content: Record<Doc, { heading: string; body: string }[]> = {
  terminos: [
    {
      heading: "1. Quiénes somos",
      body: `Esta plataforma es operada por ${siteConfig.name} (SEP), organización juvenil reconocida por la Secretaría Nacional de la Juventud (SENAJU), constituida el 7 de abril de 2024 en Casma, región Áncash, Perú. Puedes contactarnos en ${siteConfig.contact.email}.`,
    },
    {
      heading: "2. Qué ofrecemos",
      body: "SEP ofrece cursos de formación en metodologías ágiles, liderazgo e innovación social. El acceso a los cursos del catálogo es gratuito y no requiere pago alguno. Los certificados, membresías y programas institucionales son opcionales y tienen el precio publicado en la sección de precios.",
    },
    {
      heading: "3. Tu cuenta",
      body: "Para acceder a los cursos necesitas crear una cuenta con datos veraces. Eres responsable de mantener tu contraseña segura. Debes tener 15 años o más para registrarte. SEP no crea cuentas para menores de edad: los estudiantes de secundaria participan a través de sus colegios y bajo su responsabilidad.",
    },
    {
      heading: "4. Certificados",
      body: "Los certificados se emiten únicamente tras completar el 100 % de las sesiones del curso y confirmar el pago correspondiente. Cada certificado lleva un código único de verificación pública. SEP puede revocar un certificado si detecta fraude en su obtención, notificando el motivo al titular.",
    },
    {
      heading: "5. Pagos y reembolsos",
      body: "Los pagos por Yape, Plin o transferencia se validan manualmente en un plazo máximo de 24 horas hábiles. Si tu pago es rechazado, te explicamos el motivo y puedes volver a enviarlo. Puedes solicitar el reembolso de un certificado dentro de los 7 días posteriores a su emisión escribiendo a nuestro correo.",
    },
    {
      heading: "6. Conducta en la comunidad",
      body: "La comunidad de SEP existe para sostenernos entre todos. No se permite acoso, discriminación, spam, publicidad no autorizada ni contenido que vulnere derechos de terceros. SEP puede ocultar publicaciones o suspender cuentas que incumplan estas reglas.",
    },
    {
      heading: "7. Propiedad intelectual",
      body: "Los materiales de los cursos son propiedad de SEP y se ceden para tu uso personal y educativo. Puedes usarlos en tus propios talleres comunitarios citando la fuente. No está permitida su venta ni su uso comercial sin autorización escrita.",
    },
    {
      heading: "8. Cambios",
      body: "Podemos actualizar estos términos. Si el cambio es sustancial, te avisamos por correo con al menos 15 días de anticipación.",
    },
  ],

  privacidad: [
    {
      heading: "1. Responsable del tratamiento",
      body: `${siteConfig.name} (SEP), con correo de contacto ${siteConfig.contact.email}, es responsable del tratamiento de tus datos personales conforme a la Ley N.º 29733, Ley de Protección de Datos Personales del Perú, y su reglamento.`,
    },
    {
      heading: "2. Qué datos recogemos",
      body: "Al registrarte: nombre, correo, región, y según tu tipo de cuenta, universidad, carrera, institución donde enseñas o datos de tu organización. Al pagar: comprobante de operación y código de la transacción. Al participar: tu progreso en los cursos, publicaciones en la comunidad y horas de voluntariado. En el diagnóstico público: tus respuestas y tu correo.",
    },
    {
      heading: "3. Para qué los usamos",
      body: "Para darte acceso a la plataforma, emitir tus certificados, validar tus pagos, medir el impacto de nuestros programas y mejorar lo que construimos. Con tu consentimiento explícito y separado, también para enviarte el newsletter con eventos y convocatorias.",
    },
    {
      heading: "4. Con quién los compartimos",
      body: "Con nuestros proveedores de infraestructura (Supabase para la base de datos, Vercel para el alojamiento, Resend para el correo), que actúan como encargados del tratamiento. Con el Instituto Internacional de Ingeniería, únicamente los datos necesarios para emitir tu certificado internacional si lo solicitas. Nunca vendemos tus datos.",
    },
    {
      heading: "5. Menores de edad",
      body: "SEP no crea cuentas para menores de 15 años. En los talleres escolares registramos únicamente el nombre y el grado del estudiante, bajo responsabilidad del colegio y con el consentimiento del apoderado. Estos datos se muestran anonimizados por defecto y no se usan para ningún otro fin.",
    },
    {
      heading: "6. Cuánto tiempo los guardamos",
      body: "Datos de cuenta: mientras tu cuenta esté activa y hasta 2 años después de su cierre. Respuestas del diagnóstico: 24 meses. Comprobantes de pago: 5 años, por obligación tributaria. Registros de auditoría: 5 años.",
    },
    {
      heading: "7. Tus derechos (ARCO)",
      body: `Puedes acceder, rectificar, cancelar u oponerte al tratamiento de tus datos escribiéndonos a ${siteConfig.contact.email}. Respondemos en un máximo de 20 días hábiles. También puedes presentar un reclamo ante la Autoridad Nacional de Protección de Datos Personales.`,
    },
    {
      heading: "8. Seguridad",
      body: "Ciframos todo el tráfico con TLS 1.3 y los datos en reposo con AES-256. El acceso a la información está restringido por políticas a nivel de base de datos: cada persona solo ve lo suyo. El equipo con acceso administrativo usa autenticación de dos factores obligatoria.",
    },
  ],

  cookies: [
    {
      heading: "1. Qué son",
      body: "Pequeños archivos que guardamos en tu navegador para que la plataforma funcione correctamente.",
    },
    {
      heading: "2. Cuáles usamos",
      body: "Cookies estrictamente necesarias: mantienen tu sesión iniciada y protegen los formularios contra ataques CSRF. Sin ellas la plataforma no funciona, por eso no requieren consentimiento previo. Cookies de medición: Vercel Analytics registra visitas de forma agregada y anónima, sin rastrearte entre sitios.",
    },
    {
      heading: "3. Lo que NO hacemos",
      body: "No usamos cookies publicitarias ni de rastreo de terceros. No vendemos tu comportamiento de navegación. No hay píxeles de redes sociales en esta plataforma.",
    },
    {
      heading: "4. Cómo controlarlas",
      body: "Puedes borrar o bloquear las cookies desde la configuración de tu navegador. Si bloqueas las estrictamente necesarias, no podrás iniciar sesión.",
    },
  ],
};

export default async function LegalPage({
  params,
}: {
  params: Promise<{ doc: string }>;
}) {
  const { doc } = await params;
  if (!DOCS.includes(doc as Doc)) notFound();

  const key = doc as Doc;

  return (
    <Section>
      <Container size="narrow">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sep-600">
          Legal
        </p>
        <h1 className="mt-3 font-display text-[2.25rem] font-bold leading-tight text-ink">
          {meta[key].title}
        </h1>
        <p className="mt-3 text-[0.9375rem] text-slate-ui">
          Última actualización: 7 de agosto de 2026
        </p>

        <div className="mt-12 space-y-9">
          {content[key].map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-[1.125rem] font-semibold text-ink">
                {section.heading}
              </h2>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-graphite">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-14 rounded-[14px] border border-line bg-surface-1 p-6">
          <p className="text-sm leading-relaxed text-slate-ui">
            ¿Tienes dudas sobre este documento? Escríbenos a{" "}
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="font-medium text-sep-600 hover:underline"
            >
              {siteConfig.contact.email}
            </a>
            . Respondemos personas, no bots.
          </p>
        </div>
      </Container>
    </Section>
  );
}
