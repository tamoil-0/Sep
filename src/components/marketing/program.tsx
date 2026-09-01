import { ArrowRight, BookOpen, Check, Clock3, FileText, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, Card, Container, Section, SectionHeader } from "@/components/ui/primitives";
import type { ProgramAudience as ProgramAudienceData } from "@/config/programs";
import { ContextualHelp } from "@/components/ui/contextual-help";

export function ProgramHero({
  eyebrow,
  title,
  description,
  facts,
  primaryAction,
  secondaryAction,
  aside,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  facts: string[];
  primaryAction: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  aside?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-surface-1">
      <Container size="wide" className="relative grid items-center gap-8 py-10 md:py-14 lg:grid-cols-[1.05fr_.95fr] lg:py-16">
        <div className="max-w-2xl">
          <Badge><Sparkles className="size-icon-sm" />{eyebrow}</Badge>
          <h1 className="mt-4 font-display text-h1 font-bold text-ink lg:text-[3.5rem] lg:leading-[1.04]">{title}</h1>
          <p className="mt-4 max-w-[62ch] text-body-lg text-slate-ui">{description}</p>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-body-sm text-graphite">
            {facts.map((fact) => (
              <li key={fact} className="flex items-center gap-2">
                <Check className="size-icon-sm text-seed-700" />{fact}
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href={primaryAction.href} size="lg">
              {primaryAction.label}<ArrowRight />
            </Button>
            {secondaryAction && (
              <Button href={secondaryAction.href} variant="outline" size="lg">
                {secondaryAction.label}
              </Button>
            )}
          </div>
        </div>
        {aside && <div>{aside}</div>}
      </Container>
    </section>
  );
}

export function ProgramAudience({ audiences }: { audiences: ProgramAudienceData[] }) {
  return (
    <Section id="audiencias">
      <Container size="wide">
        <SectionHeader
          eyebrow="Elige tu recorrido"
          title="Un mismo método, aplicado a tu realidad"
          description="Ambos recorridos comparten seis clases. Los retos, actividades y entregables cambian según dónde vas a aplicar lo aprendido."
        />
        <div className="mt-10 grid border-y border-line md:grid-cols-2 md:divide-x md:divide-line">
          {audiences.map((audience, index) => (
            <div key={audience.id} className="flex h-full flex-col py-7 md:px-8 md:py-9 first:md:pl-0 last:md:pr-0">
              <p className="flex items-center gap-2 text-caption font-semibold uppercase tracking-[0.12em] text-sep-700">
                {index === 0 ? <Users className="size-icon-sm" /> : <BookOpen className="size-icon-sm" />}
                Recorrido {index + 1}
              </p>
              <h3 className="mt-3 font-display text-h3 font-semibold text-ink">{audience.label}</h3>
              <p className="mt-2 text-body text-graphite">{audience.summary}</p>
              <p className="mt-4 text-body-sm text-slate-ui"><strong className="font-semibold text-graphite">Resultado:</strong> {audience.outcome}</p>
              <Button href={`#${audience.id}`} variant="outline" className="mt-6 w-full sm:w-fit">
                Ver las 6 clases<ArrowRight />
              </Button>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export function ProgramTimeline({ steps }: { steps: { title: string; description: string }[] }) {
  return (
    <Section tone="muted">
      <Container size="wide">
        <SectionHeader eyebrow="Cómo avanza" title="Del reto al prototipo, paso a paso" />
        <ol className="mt-10 grid gap-0 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="relative border-l border-line pb-8 pl-7 last:pb-0 md:border-l-0 md:border-t md:pb-0 md:pl-0 md:pt-7">
              <span className="absolute -left-3 top-0 flex size-6 items-center justify-center rounded-full bg-sep-600 text-caption font-bold text-white md:-top-3 md:left-0">
                {index + 1}
              </span>
              <div className="md:pr-8">
                <h3 className="font-display text-h4 font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-body-sm text-slate-ui">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

export function ProgramCurriculum({ audience }: { audience: ProgramAudienceData }) {
  return (
    <Section id={audience.id}>
      <Container size="wide">
        <SectionHeader
          eyebrow={`Recorrido para ${audience.label.toLowerCase()}`}
          title="Seis clases que construyen un proyecto"
          description={audience.outcome}
        />
        <nav
          aria-label={`Clases del recorrido para ${audience.label}`}
          className="mt-9 overflow-x-auto border-y border-line"
        >
          <ol className="flex min-w-max">
            {audience.sessions.map((session) => (
              <li key={session.number}>
                <a
                  href={`#${audience.id}-clase-${session.number}`}
                  className="flex min-h-control items-center gap-2 border-r border-line px-4 text-body-sm text-slate-ui transition-colors hover:bg-surface-1 hover:text-ink"
                >
                  <span className="tabular font-semibold text-sep-700">
                    {String(session.number).padStart(2, "0")}
                  </span>
                  <span className="hidden max-w-36 truncate sm:block">{session.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <ol className="divide-y divide-line border-b border-line">
          {audience.sessions.map((session) => (
            <li
              key={session.number}
              id={`${audience.id}-clase-${session.number}`}
              className="scroll-mt-24"
            >
              <details className="group bg-white open:bg-surface-1/45">
                <summary className="grid min-h-20 cursor-pointer list-none grid-cols-[2.5rem_1fr_auto] items-center gap-3 py-4 marker:hidden sm:grid-cols-[3rem_minmax(12rem,.8fr)_minmax(16rem,1.2fr)_auto] sm:gap-5">
                  <span className="tabular text-body-sm font-semibold text-sep-700">
                    {String(session.number).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-body font-semibold text-ink">{session.title}</span>
                    <span className="mt-1 flex items-center gap-1.5 text-caption text-slate-ui sm:hidden"><Clock3 className="size-icon-sm" />{session.duration}</span>
                  </span>
                  <span className="hidden text-body-sm leading-relaxed text-slate-ui sm:block">
                    {session.learning}
                  </span>
                  <span className="flex items-center gap-2 text-caption font-medium text-slate-ui">
                    <Clock3 className="hidden size-icon-sm sm:block" />
                    <span className="hidden sm:inline">{session.duration}</span>
                    <span aria-hidden className="ml-1 text-h4 font-light text-sep-700 transition-transform group-open:rotate-45">+</span>
                  </span>
                </summary>
                <div className="grid gap-5 border-t border-line py-5 pl-[3.25rem] sm:grid-cols-2 sm:pl-[4.25rem]">
                  <div>
                    <p className="text-caption font-semibold uppercase tracking-[.1em] text-sep-700 sm:hidden">Resultado de aprendizaje</p>
                    <p className="mt-1.5 text-body-sm text-graphite sm:hidden">{session.learning}</p>
                    <p className="mt-4 text-caption font-semibold uppercase tracking-[.1em] text-sep-700 sm:mt-0">Actividad</p>
                    <p className="mt-1.5 text-body-sm text-graphite">{session.activity}</p>
                  </div>
                  <div className="border-l border-line pl-4">
                    <p className="flex items-center gap-2 text-caption font-semibold uppercase tracking-[.1em] text-graphite"><FileText className="size-icon-sm" />Materiales</p>
                    <p className="mt-2 text-body-sm text-slate-ui">{session.materials.join(" · ")}</p>
                    <p className="mt-4 text-caption font-semibold uppercase tracking-[.1em] text-graphite">Tarea</p>
                    <p className="mt-2 text-body-sm text-slate-ui">{session.task}</p>
                  </div>
                </div>
              </details>
            </li>
          ))}
        </ol>
        <Button href={audience.signupHref} className="mt-8 w-full sm:w-auto">
          Crear cuenta como {audience.label.toLowerCase()}<ArrowRight />
        </Button>
      </Container>
    </Section>
  );
}

export function ProgramModuleList({
  id,
  eyebrow,
  title,
  description,
  modules,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  modules: { number: number; theme: string; result: string; duration: string }[];
}) {
  return (
    <Section id={id}>
      <Container size="wide">
        <SectionHeader eyebrow={eyebrow} title={title} description={description} />
        <ol className="mt-9 border-y border-line">
          {modules.map((module) => (
            <li
              key={module.number}
              className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-line py-5 last:border-b-0 sm:grid-cols-[3rem_minmax(12rem,.75fr)_minmax(16rem,1.25fr)_auto] sm:items-baseline sm:gap-5"
            >
              <span className="tabular text-body-sm font-semibold text-sep-700">
                {String(module.number).padStart(2, "0")}
              </span>
              <h3 className="font-display text-body font-semibold text-ink">{module.theme}</h3>
              <p className="col-start-2 text-body-sm text-slate-ui sm:col-auto">{module.result}</p>
              <span className="col-start-2 text-caption font-medium text-mist sm:col-auto sm:text-right">
                {module.duration}
              </span>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

export function ProgramBenefits({ benefits }: { benefits: { title: string; description: string }[] }) {
  return (
    <Section tone="muted">
      <Container size="wide">
        <SectionHeader eyebrow="Lo que te llevas" title="Aprendizaje que termina en algo tangible" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {benefits.map((benefit) => (
            <div key={benefit.title}>
              <Check className="size-icon-xl text-seed-700" />
              <h3 className="mt-4 font-display text-h4 font-semibold text-ink">{benefit.title}</h3>
              <p className="mt-2 text-body-sm text-slate-ui">{benefit.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export function ProgramRequirements({ items }: { items: string[] }) {
  return (
    <Section>
      <Container size="narrow">
        <Card className="p-6 sm:p-8">
          <SectionHeader eyebrow="Antes de empezar" title="Qué necesitas para aprovecharlo" />
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {items.map((item) => <li key={item} className="flex items-start gap-2.5 text-body-sm text-graphite"><Check className="mt-0.5 size-icon-sm shrink-0 text-seed-700" />{item}</li>)}
          </ul>
        </Card>
      </Container>
    </Section>
  );
}

export function ProgramFAQ({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <Section tone="muted">
      <Container size="narrow">
        <SectionHeader eyebrow="Preguntas frecuentes" title="Lo importante, antes de registrarte" />
        <div className="mt-8 divide-y divide-line border-y border-line">
          {items.map((item) => (
            <details key={item.question} className="group py-1">
              <summary className="flex min-h-control cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium text-ink marker:hidden">
                {item.question}<span aria-hidden className="text-sep-600 group-open:rotate-45">+</span>
              </summary>
              <p className="max-w-[65ch] pb-5 text-body-sm text-slate-ui">{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export function ProgramCTA({ title, description, actions }: { title: string; description: string; actions: { label: string; href: string }[] }) {
  return (
    <Section tone="gradient">
      <Container size="narrow" className="text-center">
        <h2 className="font-display text-h1 font-semibold text-white">{title}</h2>
        <p className="mx-auto mt-4 max-w-[60ch] text-body text-white/80">{description}</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          {actions.map((action, index) => <Button key={action.href} href={action.href} variant={index === 0 ? "gold" : "outline-white"} size="lg">{action.label}<ArrowRight /></Button>)}
        </div>
        <ContextualHelp
          inverse
          className="mx-auto mt-7 max-w-xl"
          title="¿Tienes dudas antes de registrarte?"
          description="Escríbenos y cuéntanos qué recorrido te interesa. Te orientaremos sobre requisitos y próximos pasos."
        />
      </Container>
    </Section>
  );
}
