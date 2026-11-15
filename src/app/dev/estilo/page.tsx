import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowRight, Award, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Badge,
  Card,
  Container,
  EmptyState,
  ProgressBar,
  Section,
  SectionHeader,
  Stat,
} from "@/components/ui/primitives";
import { Field, FormAlert, Input } from "@/components/forms/field";

/**
 * Página de muestra del sistema «Lavanda neón» (fase 2 del rediseño).
 * No está enlazada ni indexada. En producción solo responde con SEP_ESTILO=1.
 */
export const metadata: Metadata = {
  title: "Estilo — SEP (interno)",
  robots: { index: false, follow: false, nocache: true },
};

/* Las clases van completas (no interpoladas) para que Tailwind las detecte. */
const escalas = [
  {
    nombre: "Violeta lavanda",
    rol: "Marca. Acción en 600; el 500 solo en títulos grandes, íconos, bordes y foco.",
    pasos: [
      ["50", "#F4F3FF", "bg-violeta-50"],
      ["100", "#E8E6FF", "bg-violeta-100"],
      ["200", "#D2CEFF", "bg-violeta-200"],
      ["300", "#B1AAFF", "bg-violeta-300"],
      ["400", "#9187FF", "bg-violeta-400"],
      ["500", "#7265FF", "bg-violeta-500"],
      ["600", "#6257DB", "bg-violeta-600"],
      ["700", "#5249B8", "bg-violeta-700"],
      ["800", "#423B94", "bg-violeta-800"],
      ["900", "#322C70", "bg-violeta-900"],
    ],
  },
  {
    nombre: "Verde turquesa",
    rol: "Éxito, progreso y acento secundario. Texto sobre claro en 800.",
    pasos: [
      ["50", "#EBFAF8", "bg-turquesa-50"],
      ["100", "#D8F6F2", "bg-turquesa-100"],
      ["200", "#B1EDE4", "bg-turquesa-200"],
      ["300", "#79E0D1", "bg-turquesa-300"],
      ["400", "#41D3BD", "bg-turquesa-400"],
      ["500", "#0BC6AB", "bg-turquesa-500"],
      ["600", "#09AA93", "bg-turquesa-600"],
      ["700", "#088F7B", "bg-turquesa-700"],
      ["800", "#067363", "bg-turquesa-800"],
      ["900", "#05574B", "bg-turquesa-900"],
    ],
  },
  {
    nombre: "Noche",
    rol: "Neutros fríos. 900 fondo oscuro, 950 sidebar y footer, 700 pizarra.",
    pasos: [
      ["50", "#F5F7FA", "bg-noche-50"],
      ["100", "#EEF1F5", "bg-noche-100"],
      ["200", "#E2E7EE", "bg-noche-200"],
      ["300", "#B6C2D1", "bg-noche-300"],
      ["400", "#8D9AAB", "bg-noche-400"],
      ["500", "#5B6878", "bg-noche-500"],
      ["600", "#4A5869", "bg-noche-600"],
      ["700", "#374658", "bg-noche-700"],
      ["800", "#2A3545", "bg-noche-800"],
      ["900", "#212B38", "bg-noche-900"],
      ["950", "#151C24", "bg-noche-950"],
    ],
  },
] as const;

const contrastes = [
  ["Blanco sobre violeta-600 (botón primario)", "5.38", true],
  ["Blanco sobre violeta-700 (hover)", "6.99", true],
  ["Blanco sobre violeta-500", "4.18", false],
  ["Noche-900 sobre cian (botón neón)", "11.17", true],
  ["Cian sobre blanco", "1.28", false],
  ["acento (violeta-700) sobre blanco", "6.99", true],
  ["acento (violeta-300) sobre noche-900", "6.86", true],
  ["success (turquesa-800) sobre blanco", "5.77", true],
  ["Turquesa-500 sobre blanco", "2.17", false],
  ["ink (noche-900) sobre noche-50", "13.34", true],
  ["slate-ui (noche-600) sobre noche-50", "6.77", true],
  ["mist (noche-500) sobre noche-50", "5.29", true],
  ["noche-300 sobre tarjeta translúcida en noche", "6.59", true],
  ["danger #C9354A sobre blanco", "5.13", true],
  ["warning #A15C00 sobre blanco", "5.19", true],
] as const;

const tipos = [
  ["text-display", "Ideas que salen del papel", "text-display font-display font-semibold"],
  ["text-h1", "Cursos para convertir ideas en acción", "text-h1 font-display font-semibold"],
  ["text-h2", "El talento está en regiones", "text-h2 font-display font-semibold"],
  ["text-h3", "Design Thinking aplicado", "text-h3 font-display font-semibold"],
  ["text-h4", "Próxima sesión en vivo", "text-h4 font-display font-semibold"],
  ["text-body-lg", "Formamos a universitarios que vuelven como mentores a los colegios de su región.", "text-body-lg"],
  ["text-body", "Seis sesiones de dos horas, interdiario y 100 % virtual.", "text-body"],
  ["text-body-sm", "Certificado SEP con código de verificación público.", "text-body-sm"],
  ["text-caption", "Emitido el 12 de noviembre de 2026", "text-caption"],
] as const;

export default async function EstiloPage() {
  await connection();
  if (process.env.NODE_ENV === "production" && process.env.SEP_ESTILO !== "1") notFound();

  return (
    <main id="contenido" className="bg-surface-1">
      {/* ── Portada: el halo es el único gesto memorable ── */}
      <section className="theme-night halo relative overflow-hidden">
        <Container size="wide" className="py-16 md:py-20">
          <Badge tone="neon">
            <Sparkles className="size-3.5" aria-hidden /> Sistema visual interno
          </Badge>
          <h1 className="mt-6 max-w-3xl font-display text-h1 font-semibold text-white lg:text-hero">
            Lavanda neón
          </h1>
          <p className="mt-4 max-w-prose text-body-lg text-slate-ui">
            Tokens, contraste verificado y componentes base de SEP. Noche para la identidad, claro para
            leer, violeta para actuar, turquesa para avanzar y cian solo para lo que brilla sobre oscuro.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="neon" size="lg">
              Crear cuenta gratis <ArrowRight aria-hidden />
            </Button>
            <Button variant="outline-white" size="lg">
              Ver programas
            </Button>
          </div>
          <dl className="mt-12 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              ["~60 %", "Neutros"],
              ["~25 %", "Violeta"],
              ["~10 %", "Turquesa"],
              ["≤ 5 %", "Cian"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="text-body-sm text-slate-ui">{l}</dt>
                <dd className="tabular mt-1 font-display text-h3 font-semibold text-white">{v}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ── Paleta ── */}
      <Section>
        <Container size="wide">
          <SectionHeader as="h2" title="Paleta" description="Cinco colores base fijos; escalas derivadas para tokens @theme." />
          <div className="mt-10 grid gap-8">
            {escalas.map((e) => (
              <div key={e.nombre}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-h4 font-semibold text-ink">{e.nombre}</h3>
                  <p className="text-body-sm text-slate-ui">{e.rol}</p>
                </div>
                <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-11">
                  {e.pasos.map(([paso, hex, clase]) => (
                    <li key={paso} className="overflow-hidden rounded-sm border border-line bg-surface-0">
                      <div className={`h-14 ${clase}`} />
                      <div className="px-2 py-1.5">
                        <p className="text-caption font-semibold text-ink">{paso}</p>
                        <p className="tabular text-caption text-mist">{hex}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="theme-night halo">
                <h3 className="font-display text-h4 font-semibold text-ink">Cian neón · solo sobre oscuro</h3>
                <div className="mt-4 flex gap-3">
                  <span className="h-12 flex-1 rounded-sm bg-cian-500" />
                  <span className="h-12 flex-1 rounded-sm bg-cian-600" />
                </div>
                <p className="mt-3 text-body-sm text-slate-ui">
                  cian-500 #04FFE1 · cian-600 #03DBC2 (hover). Interactivo o destacado; nunca en fondos claros.
                </p>
              </Card>
              <Card>
                <h3 className="font-display text-h4 font-semibold text-ink">Degradado de marca</h3>
                <div className="mt-4 h-12 rounded-sm grad-marca" />
                <p className="mt-3 text-body-sm text-slate-ui">
                  Decorativo: bordes encendidos, reglas, barra de progreso, anillo de logro y halo. Nunca con
                  texto encima.
                </p>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Contraste ── */}
      <Section className="bg-surface-0">
        <Container size="wide">
          <SectionHeader as="h2" title="Contraste verificado" description="WCAG 2.1: 4.5:1 texto normal; 3:1 texto grande, íconos y bordes." />
          <ul className="mt-8 grid gap-2 md:grid-cols-2">
            {contrastes.map(([par, razon, ok]) => (
              <li key={par} className="flex items-center justify-between gap-4 rounded-sm border border-line bg-surface-0 px-4 py-3">
                <span className="text-body-sm text-ink">{par}</span>
                <Badge tone={ok ? "success" : "danger"}>
                  <span className="tabular">{razon}</span> {ok ? "AA" : "solo grande o decorativo"}
                </Badge>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ── Tipografía ── */}
      <Section>
        <Container size="wide">
          <SectionHeader as="h2" title="Tipografía" description="Sora para títulos y cifras; Geist para cuerpo, interfaz y tablas." />
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {tipos.map(([token, texto, clase]) => (
              <li key={token} className="grid gap-2 py-4 md:grid-cols-[10rem_1fr] md:items-baseline">
                <code className="text-caption text-mist">{token}</code>
                <p className={`${clase} text-ink`}>{texto}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ── Componentes ── */}
      <Section tone="muted">
        <Container size="wide">
          <SectionHeader as="h2" title="Componentes base" description="Estado actual de src/components/ui con los tokens nuevos. La fase 3 les da movimiento." />

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="font-display text-h4 font-semibold text-ink">Botones sobre claro</h3>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button>Inscribirme</Button>
                <Button variant="outline">Ver malla</Button>
                <Button variant="ghost">Cancelar</Button>
                <Button variant="danger">Rechazar</Button>
                <Button variant="link">Ver detalle</Button>
              </div>
            </Card>
            <Card className="theme-night halo p-6">
              <h3 className="font-display text-h4 font-semibold text-ink">Botones sobre noche</h3>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button variant="neon">Crear cuenta gratis</Button>
                <Button>Inscribirme</Button>
                <Button variant="outline-white">Escríbenos</Button>
                <Button variant="outline">Outline</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-display text-h4 font-semibold text-ink">Badges</h3>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge tone="brand">Metodologías ágiles</Badge>
                <Badge tone="neon">Programa insignia</Badge>
                <Badge tone="success">
                  <Check className="size-3" aria-hidden /> Completado
                </Badge>
                <Badge tone="neutral">8 horas</Badge>
                <Badge tone="warning">En revisión</Badge>
                <Badge tone="danger">Rechazado</Badge>
              </div>
            </Card>
            <Card className="theme-night halo p-6">
              <h3 className="font-display text-h4 font-semibold text-ink">Badges sobre noche</h3>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge tone="brand">Metodologías ágiles</Badge>
                <Badge tone="neon">En vivo</Badge>
                <Badge tone="success">Completado</Badge>
                <Badge tone="white">Gratuito</Badge>
                <Badge tone="warning">En revisión</Badge>
                <Badge tone="danger">Rechazado</Badge>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-display text-h4 font-semibold text-ink">Progreso y métricas</h3>
              <div className="mt-5 grid gap-5">
                <div>
                  <div className="flex justify-between text-body-sm">
                    <span className="text-slate-ui">Design Thinking aplicado</span>
                    <span className="tabular text-ink">4 / 6 sesiones</span>
                  </div>
                  <ProgressBar value={66} className="mt-2" label="Progreso del curso" />
                </div>
                <div>
                  <div className="flex justify-between text-body-sm">
                    <span className="text-slate-ui">Horas de voluntariado del mes</span>
                    <span className="tabular text-ink">9 / 24 h</span>
                  </div>
                  <ProgressBar value={37} tone="success" className="mt-2" label="Horas del mes" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Stat value="6" label="Sesiones en vivo" />
                  <Stat value="8 h" label="Por curso" />
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="font-display text-h4 font-semibold text-ink">Formulario</h3>
              <form className="mt-5 grid gap-4" action="#">
                <Field label="Correo electrónico" htmlFor="estilo-correo" hint="Usaremos este correo para tu certificado." required>
                  <Input id="estilo-correo" type="email" placeholder="ana.q@correo.com" />
                </Field>
                <Field label="Código de verificación" htmlFor="estilo-codigo" error={["El código tiene 12 caracteres."]}>
                  <Input id="estilo-codigo" defaultValue="SEP-2026" aria-invalid />
                </Field>
                <FormAlert tone="success">Te escribimos a ana.q@correo.com con el enlace.</FormAlert>
              </form>
            </Card>

            <Card interactive className="p-6">
              <Badge tone="success">Disponible</Badge>
              <h3 className="mt-3 font-display text-h4 font-semibold text-ink">Tarjeta interactiva</h3>
              <p className="mt-2 text-body-sm text-slate-ui">
                Hoy: borde violeta-300 y sombra con tinte al pasar el mouse. La fase 3 le da el borde que se
                enciende con el degradado.
              </p>
            </Card>
            <EmptyState
              icon={<Award className="size-5" aria-hidden />}
              title="Aún no tienes certificados"
              description="Completa las 6 sesiones de un curso para solicitar tu certificado SEP."
              action={<Button size="sm">Ver mis cursos</Button>}
            />
          </div>
        </Container>
      </Section>

      {/* ── Halo con texto: comprobación de roles dentro de noche ── */}
      <Section tone="night">
        <Container>
          <SectionHeader
            eyebrow="Bloque noche"
            title="Los mismos componentes, sin variantes nuevas"
            description="theme-night reasigna ink, slate-ui, mist, line, surface y acento: todo lo de arriba se lee igual aquí."
            align="center"
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {["Universitarios", "Colegios", "Sustentabilidad"].map((t, i) => (
              <Card key={t}>
                <p className="tabular text-caption font-semibold text-acento">Fase {i + 1}</p>
                <h3 className="mt-2 font-display text-h4 font-semibold text-ink">{t}</h3>
                <p className="mt-2 text-body-sm text-slate-ui">Texto secundario sobre tarjeta translúcida.</p>
                <p className="mt-2 text-caption text-mist">Metadato terciario · 4.9:1</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
