import type { Metadata } from "next";
import { Check, School } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  Badge,
  Card,
  Container,
  GoldUnderline,
  Section,
  SectionHeader,
} from "@/components/ui/primitives";
import { schoolBenefits, schoolProcess } from "@/config/volunteering";
import { SchoolForm } from "./school-form";

export const metadata: Metadata = {
  title: "Red de colegios",
  description:
    "Inscribe tu colegio a la red SEP y recibe talleres gratuitos de innovación social dictados por universitarios de tu propia región.",
};

export default async function ColegiosPage() {
  const supabase = await createClient();

  const [{ data: schools }, { count: workshops }, { count: students }] =
    await Promise.all([
      supabase
        .from("institutions")
        .select("id, name, region, province")
        .eq("type", "colegio")
        .eq("is_verified", true)
        .limit(12),
      supabase
        .from("workshops")
        .select("id", { count: "exact", head: true })
        .eq("status", "realizado"),
      supabase
        .from("workshop_attendees")
        .select("id", { count: "exact", head: true })
        .eq("attended", true),
    ]);

  const regions = new Set((schools ?? []).map((s) => s.region));

  return (
    <>
      <section className="border-b border-line bg-surface-1">
        <Container size="wide" className="py-16 sm:py-20">
          <div className="max-w-2xl">
            <Badge tone="seed">100 % gratuito para el colegio</Badge>
            <h1 className="mt-5 font-display text-[2.5rem] font-bold leading-[1.08] text-ink sm:text-[3.25rem]">
              Conectamos colegios con{" "}
              <GoldUnderline>universitarios de su región</GoldUnderline>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-ui">
              Universitarios formados por SEP dictan talleres de innovación social a tus
              estudiantes. Sin costo, en su propio idioma y desde su propia realidad.
            </p>
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              [String(schools?.length ?? 0), "Colegios aliados"],
              [String(students ?? 0), "Estudiantes impactados"],
              [String(workshops ?? 0), "Talleres realizados"],
              [String(regions.size), "Regiones activas"],
            ].map(([value, label]) => (
              <div key={label}>
                <dd className="tabular font-display text-[2rem] font-semibold leading-none sep-gradient-text">
                  {value}
                </dd>
                <dt className="mt-2 text-[0.8125rem] text-slate-ui">{label}</dt>
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
                {schoolBenefits.map((b, i) => (
                  <li key={b.title} className="flex gap-4">
                    <span className="tabular flex size-8 shrink-0 items-center justify-center rounded-full bg-sep-50 text-xs font-semibold text-sep-600">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-display text-[1.0625rem] font-semibold text-ink">
                        {b.title}
                      </p>
                      <p className="mt-1 text-[0.9375rem] leading-relaxed text-slate-ui">
                        {b.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Proceso */}
              <div className="mt-12">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
                  ¿Cómo funciona?
                </p>
                <ol className="mt-5 grid gap-4 sm:grid-cols-2">
                  {schoolProcess.map((s) => (
                    <li key={s.step} className="rounded-[12px] border border-line p-5">
                      <span className="tabular text-xs font-semibold text-gold-600">
                        Paso {s.step}
                      </span>
                      <p className="mt-2 text-[0.9375rem] font-medium text-ink">
                        {s.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-ui">
                        {s.detail}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Colegios activos */}
              {(schools?.length ?? 0) > 0 && (
                <div className="mt-12">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
                    Colegios en la red
                  </p>
                  <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {(schools ?? []).map((s) => (
                      <li
                        key={s.id}
                        className="flex items-center gap-3 rounded-[10px] border border-line bg-white px-4 py-3"
                      >
                        <School className="size-4 shrink-0 text-seed-500" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-ink">{s.name}</p>
                          <p className="truncate text-xs text-slate-ui">
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
                <h2 className="font-display text-[1.25rem] font-semibold text-ink">
                  Inscribe tu colegio
                </h2>
                <Badge tone="seed">Gratis</Badge>
              </div>
              <p className="mt-1.5 text-sm text-slate-ui">
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
            <Check className="mx-auto size-8 text-seed-500" />
            <h2 className="mt-4 font-display text-[1.5rem] font-semibold text-ink">
              Sin letra chica
            </h2>
            <p className="mx-auto mt-2.5 max-w-lg text-[0.9375rem] leading-relaxed text-slate-ui">
              Los talleres para colegios de la red no tienen costo. Si una empresa decide
              patrocinar cohortes, eso ocurre entre SEP y la empresa: tu colegio nunca paga.
            </p>
          </Card>
        </Container>
      </Section>
    </>
  );
}
