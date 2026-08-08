import type { Metadata } from "next";
import { ArrowRight, CalendarDays, Mic, School, Users } from "lucide-react";
import { createPublicClient } from "@/lib/supabase/public";
import {
  Badge,
  Card,
  Container,
  Section,
  SectionHeader,
} from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "@/components/marketing/newsletter-form";

export const metadata: Metadata = {
  title: "Convocatorias abiertas",
  description:
    "Todo lo que está abierto ahora mismo en SEP: cursos, voluntariado, red de speakers y red de colegios.",
};

/** ISR: la página se sirve estática y se regenera cada 5 min. */
export const revalidate = 300;

export default async function ConvocatoriasPage() {
  const supabase = createPublicClient();

  const [{ data: courses }, { data: roles }] = await Promise.all([
    supabase
      .from("courses")
      .select("slug, title, subtitle, sessions_count, total_hours")
      .eq("status", "disponible")
      .order("order_index"),
    supabase
      .from("volunteer_roles")
      .select("slug, name, description, open_positions, hours_per_week")
      .eq("is_open", true)
      .gt("open_positions", 0),
  ]);

  const calls = [
    ...(courses ?? []).map((c) => ({
      key: `course-${c.slug}`,
      kind: "Curso",
      tone: "seed" as const,
      icon: CalendarDays,
      title: c.title,
      detail: c.subtitle ?? "",
      meta: `${c.sessions_count} sesiones · ${c.total_hours} horas · gratuito`,
      href: `/cursos/${c.slug}`,
      cta: "Ver el curso",
    })),
    ...(roles ?? []).map((r) => ({
      key: `role-${r.slug}`,
      kind: "Voluntariado",
      tone: "gold" as const,
      icon: Users,
      title: r.name,
      detail: r.description ?? "",
      meta: `${r.open_positions} ${r.open_positions === 1 ? "vacante" : "vacantes"} · ${r.hours_per_week} h/semana`,
      href: `/voluntariado/${r.slug}`,
      cta: "Postular",
    })),
    {
      key: "speakers",
      kind: "Red de speakers",
      tone: "brand" as const,
      icon: Mic,
      title: "Únete a la base de speakers",
      detail:
        "Comparte tu historia y tus metodologías con jóvenes de más de 10 regiones del Perú y Latinoamérica.",
      meta: "Abierta todo el año · gratuita",
      href: "/speakers",
      cta: "Registrarme",
    },
    {
      key: "colegios",
      kind: "Red de colegios",
      tone: "brand" as const,
      icon: School,
      title: "Inscribe tu colegio a la red SEP",
      detail:
        "Recibe talleres gratuitos de innovación social dictados por universitarios de tu propia región.",
      meta: "Abierta todo el año · sin costo",
      href: "/colegios",
      cta: "Inscribir mi colegio",
    },
  ];

  return (
    <>
      <section className="border-b border-line bg-surface-1">
        <Container size="wide" className="py-16">
          <SectionHeader
            eyebrow="Convocatorias"
            title="Lo que está abierto ahora"
            description="Todo lo que puedes empezar hoy mismo. Sin listas de espera artificiales."
          />
        </Container>
      </section>

      <Section>
        <Container size="wide">
          <ul className="grid gap-4 md:grid-cols-2">
            {calls.map((c) => (
              <li key={c.key}>
                <Card className="flex h-full flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-sep-50 text-sep-600">
                      <c.icon className="size-5" />
                    </span>
                    <Badge tone={c.tone}>{c.kind}</Badge>
                  </div>

                  <h2 className="mt-4 font-display text-[1.125rem] font-semibold leading-snug text-ink">
                    {c.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-ui">
                    {c.detail}
                  </p>

                  <p className="mt-4 border-t border-line pt-3.5 text-xs text-slate-ui">
                    {c.meta}
                  </p>

                  <Button href={c.href} variant="outline" size="sm" className="mt-4">
                    {c.cta}
                    <ArrowRight className="size-3.5" />
                  </Button>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="muted">
        <Container size="narrow" className="text-center">
          <SectionHeader
            eyebrow="No te lo pierdas"
            title="Entérate 48 horas antes que el resto"
            description="El newsletter de SEP anuncia cada convocatoria antes de publicarla en redes."
            align="center"
          />
          <div className="mx-auto mt-8 max-w-lg">
            <NewsletterForm />
          </div>
        </Container>
      </Section>
    </>
  );
}
