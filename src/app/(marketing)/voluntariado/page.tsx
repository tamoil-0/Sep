import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  CalendarDays,
  Check,
  Clock,
  Globe,
  MessageCircle,
  Users,
} from "lucide-react";
import {
  Badge,
  Card,
  Container,
  GoldUnderline,
  Section,
  SectionHeader,
} from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { RealPhoto, SEP_PHOTOS } from "@/components/marketing/real-photo";
import {
  commonVolunteerBenefits,
  volunteerProcess,
  volunteerRoles,
} from "@/config/volunteering";

export const metadata: Metadata = {
  title: "Voluntariado",
  description:
    "Tres roles abiertos en SEP: Mentor, Community Manager y Organizador de eventos. Certificación formal, carta de recomendación y acceso gratuito a todos los cursos.",
};

const roleIcons = {
  mentor_junior: Users,
  community_manager: MessageCircle,
  event_organizer: CalendarDays,
} as const;

const benefitIcons = [Award, Globe, CalendarDays, Users];

export default function VoluntariadoPage() {
  const totalPositions = volunteerRoles.reduce((s, r) => s + r.openPositions, 0);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden sep-gradient">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
            backgroundSize: "34px 34px",
          }}
        />
        <Container size="wide" className="relative py-16 sm:py-20">
          <div className="max-w-2xl">
            <Badge tone="white">{totalPositions} vacantes abiertas</Badge>
            <h1 className="mt-5 font-display text-[2.5rem] font-bold leading-[1.08] text-white sm:text-[3.25rem]">
              Forma parte del equipo que{" "}
              <span className="text-gold-500">democratiza la innovación</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/80">
              Tu trabajo llega a jóvenes que nadie más está atendiendo. A cambio recibes
              certificación formal, red nacional y formación continua sin costo.
            </p>
          </div>

          <RealPhoto
            src={SEP_PHOTOS.team}
            alt="Voluntarios y participantes de SEP trabajando como equipo"
            priority
            label="Una comunidad que construye"
            className="mt-10 aspect-[16/7] min-h-52 border border-white/20"
            imageClassName="object-[50%_42%]"
            sizes="(min-width: 1280px) 1152px, 100vw"
          />

          <dl className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              ["3", "Roles disponibles"],
              ["12", "Voluntarios activos"],
              ["10+", "Regiones alcanzadas"],
              [String(totalPositions), "Vacantes abiertas"],
            ].map(([value, label]) => (
              <div key={label}>
                <dd className="tabular font-display text-[2rem] font-semibold leading-none text-gold-500">
                  {value}
                </dd>
                <dt className="mt-2 text-[0.8125rem] text-white/65">{label}</dt>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Roles */}
      <Section>
        <Container size="wide">
          <SectionHeader
            eyebrow="Roles disponibles"
            title="Elige según tu talento"
            description="Cada rol tiene requisitos claros y beneficios exclusivos. Todos incluyen acceso gratuito al catálogo completo y al SILP."
          />

          <div className="mt-12 space-y-5">
            {volunteerRoles.map((role) => {
              const Icon = roleIcons[role.type];
              return (
                <Card key={role.slug} className="p-0">
                  <div className="grid gap-8 p-7 lg:grid-cols-[1.2fr_1fr]">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-[12px] bg-sep-50 text-sep-600">
                          <Icon className="size-5" />
                        </span>
                        <Badge tone="gold">
                          {role.openPositions}{" "}
                          {role.openPositions === 1 ? "vacante" : "vacantes"}
                        </Badge>
                      </div>

                      <h2 className="mt-5 font-display text-[1.5rem] font-semibold text-ink">
                        {role.name}
                      </h2>
                      {role.exclusive && (
                        <p className="mt-1 text-xs font-medium text-gold-700">
                          {role.exclusive}
                        </p>
                      )}
                      <p className="mt-3 text-[0.9375rem] leading-relaxed text-slate-ui">
                        {role.description}
                      </p>

                      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.1em] text-slate-ui">
                        Requisitos
                      </p>
                      <ul className="mt-2.5 space-y-2">
                        {role.requirements.map((r) => (
                          <li
                            key={r}
                            className="flex items-start gap-2.5 text-sm text-graphite"
                          >
                            <Check className="mt-0.5 size-4 shrink-0 text-seed-500" />
                            {r}
                          </li>
                        ))}
                      </ul>

                      <p className="mt-5 inline-flex items-center gap-1.5 text-sm text-slate-ui">
                        <Clock className="size-4 text-mist" />
                        {role.hoursPerWeek} horas por semana
                      </p>

                      <Button
                        href={`/voluntariado/${role.slug}`}
                        variant="primary"
                        className="mt-6"
                      >
                        Postular a este rol
                        <ArrowRight className="size-4" />
                      </Button>
                    </div>

                    <div className="rounded-[14px] bg-surface-1 p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-ui">
                        Beneficios exclusivos del rol
                      </p>
                      <ul className="mt-4 space-y-4">
                        {role.benefits.map((b) => (
                          <li key={b.title}>
                            <p className="text-sm font-medium text-ink">{b.title}</p>
                            <p className="mt-0.5 text-xs leading-relaxed text-slate-ui">
                              {b.detail}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Beneficios comunes */}
      <Section tone="muted">
        <Container size="wide">
          <SectionHeader
            eyebrow="Para todos"
            title={
              <>
                Beneficios que recibe <GoldUnderline>cada voluntario</GoldUnderline>
              </>
            }
            description="Independientemente del rol, esto es tuyo desde el primer día."
            align="center"
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {commonVolunteerBenefits.map((b, i) => {
              const Icon = benefitIcons[i] ?? Award;
              return (
                <Card key={b.title} className="p-6">
                  <Icon className="size-5 text-sep-600" />
                  <h3 className="mt-4 font-display text-[0.9375rem] font-semibold text-ink">
                    {b.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-ui">{b.detail}</p>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Proceso */}
      <Section>
        <Container size="narrow">
          <SectionHeader
            eyebrow="Proceso de selección"
            title="Tres pasos, respuesta en 48 horas"
            align="center"
          />

          <ol className="mt-10 space-y-4">
            {volunteerProcess.map((s) => (
              <li key={s.step} className="flex gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full sep-gradient text-sm font-semibold text-white">
                  {s.step}
                </span>
                <div className="pt-1">
                  <p className="font-display text-[1.0625rem] font-semibold text-ink">
                    {s.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-ui">{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>

          <Card className="mt-10 border-sep-200 bg-sep-50/40 text-center">
            <p className="text-sm leading-relaxed text-graphite">
              ¿Tu colegio quiere recibir a nuestros voluntarios?{" "}
              <Link href="/colegios" className="font-medium text-sep-600 hover:underline">
                Inscríbelo a la red SEP
              </Link>{" "}
              — es completamente gratuito.
            </p>
          </Card>
        </Container>
      </Section>
    </>
  );
}
