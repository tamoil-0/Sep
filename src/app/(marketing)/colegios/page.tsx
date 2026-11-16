import { createPageMetadata } from "@/lib/seo";
import { Check, School } from "lucide-react";
import {
  Badge,
  Card,
  Container,
  Section,
  SectionHeader,
} from "@/components/ui/primitives";
import { schoolBenefits, schoolProcess } from "@/config/volunteering";
import { SchoolForm } from "./school-form";
import { RealPhoto, SEP_PHOTOS } from "@/components/marketing/real-photo";
import { getSchoolNetwork } from "@/server/queries/public-content";

export const metadata = createPageMetadata({
  title: "Red de colegios",
  description:
    "Inscribe tu colegio a la red SEP y recibe talleres gratuitos de innovación social dictados por universitarios de tu propia región.",
  path: "/colegios",
  keywords: ["talleres gratuitos para colegios", "innovación escolar Perú", "red de colegios SEP"],
});

// Estática con ISR: no lee la petición (cookies ni parámetros) y sus datos son públicos.
export const dynamic = "force-static";
export const revalidate = 300;

/** ISR: la página se sirve estática y se regenera cada 5 min. */

export default async function ColegiosPage() {
  const { schools, workshops, students } = await getSchoolNetwork();

  const regions = new Set(schools.map((s) => s.region));

  return (
    <>
      <section className="theme-night halo relative overflow-hidden">
        <Container size="wide" className="py-16 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.85fr]">
            <div className="max-w-2xl">
            <Badge tone="success">100 % gratuito para el colegio</Badge>
            <h1 className="mt-5 font-display text-h1 font-bold leading-[1.08] text-ink sm:text-display">
              Conectamos colegios con{" "}
              universitarios de su región
            </h1>
            <p className="mt-5 text-body-lg leading-relaxed text-slate-ui">
              Universitarios formados por SEP dictan talleres de innovación social a tus
              estudiantes. Sin costo, en su propio idioma y desde su propia realidad.
            </p>
            </div>
            <RealPhoto
              src={SEP_PHOTOS.workshop}
              alt="Jóvenes participando en un taller práctico de SEP"
              priority
              label="Taller presencial SEP"
              className="aspect-[4/3] min-h-0"
            />
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              [String(schools.length), "Colegios aliados"],
              [String(students ?? 0), "Estudiantes impactados"],
              [String(workshops ?? 0), "Talleres realizados"],
              [String(regions.size), "Regiones activas"],
            ]
              // Un cero en público resta confianza: solo se muestran cifras con avance.
              .filter(([value]) => value !== "0")
              .map(([value, label]) => (
              <div key={label}>
                <dd className="tabular font-display text-h2 font-semibold leading-none text-acento">
                  {value}
                </dd>
                <dt className="mt-2 text-body-sm text-slate-ui">{label}</dt>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <Section>
        <Container size="wide">
          <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
            <div>
              <SectionHeader
                eyebrow="Beneficios"
                title="Qué recibe tu colegio"
                description="Todo lo que sigue es gratuito para colegios de la red, sin patrocinio de por medio."
              />

              <ul className="mt-10 space-y-5">
                {schoolBenefits.map((b) => (
                  <li key={b.title} className="flex gap-4">
                    {/* Los beneficios no son una secuencia: check, no números. */}
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-turquesa-100 text-turquesa-800">
                      <Check className="size-4" strokeWidth={2.25} aria-hidden />
                    </span>
                    <div>
                      <p className="font-display text-body font-semibold text-ink">
                        {b.title}
                      </p>
                      <p className="mt-1 text-body-sm leading-relaxed text-slate-ui">
                        {b.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Proceso */}
              <div className="mt-12">
                <h2 className="font-display text-h4 font-semibold text-ink">¿Cómo funciona?</h2>
                {/* El proceso SÍ es una secuencia: línea de tiempo numerada. */}
                <ol className="mt-5 border-l border-line">
                  {schoolProcess.map((s) => (
                    <li key={s.step} className="relative py-3 pl-8">
                      <span aria-hidden className="absolute -left-1.5 top-4.5 size-3 rounded-full bg-surface-0 ring-2 ring-turquesa-500" />
                      <p className="text-body font-semibold text-ink">
                        <span className="tabular mr-2 text-turquesa-800">{s.step}</span>
                        {s.title}
                      </p>
                      <p className="mt-1 text-body-sm leading-relaxed text-slate-ui">{s.detail}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Colegios activos */}
              {schools.length > 0 && (
                <div className="mt-12">
                  <h2 className="font-display text-h4 font-semibold text-ink">Colegios en la red</h2>
                  <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {schools.map((s) => (
                      <li
                        key={s.id}
                        className="flex items-center gap-3 rounded-sm border border-line bg-surface-0 px-4 py-3"
                      >
                        <School className="size-4 shrink-0 text-turquesa-800" />
                        <div className="min-w-0">
                          <p className="truncate text-body-sm font-medium text-ink">{s.name}</p>
                          <p className="truncate text-caption text-slate-ui">
                            {[s.province, s.region].filter(Boolean).join(", ")}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Formulario */}
            <Card className="lg:sticky lg:top-24 lg:self-start">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-h4 font-semibold text-ink">
                  Inscribe tu colegio
                </h2>
                <Badge tone="success">Gratis</Badge>
              </div>
              <p className="mt-1.5 text-body-sm text-slate-ui">
                Te contactamos en menos de 72 horas.
              </p>

              <div className="mt-6">
                <SchoolForm />
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      <Section tone="muted" className="py-14">
        <Container size="narrow">
          <Card className="text-center">
            <Check className="mx-auto size-8 text-turquesa-800" />
            <h2 className="mt-4 font-display text-h3 font-semibold text-ink">
              Sin letra chica
            </h2>
            <p className="mx-auto mt-2.5 max-w-lg text-body-sm leading-relaxed text-slate-ui">
              Los talleres para colegios de la red no tienen costo. Si una empresa decide
              patrocinar cohortes, eso ocurre entre SEP y la empresa: tu colegio nunca paga.
            </p>
          </Card>
        </Container>
      </Section>
    </>
  );
}
