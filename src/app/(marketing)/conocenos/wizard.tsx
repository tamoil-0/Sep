"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  GraduationCap,
  Loader2,
  School,
  Sparkles,
} from "lucide-react";
import { submitDiagnosticAction } from "@/server/actions/public-forms";
import {
  Badge,
  Card,
  Container,
  GoldUnderline,
  Section,
} from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Field, FormAlert, Input, Select } from "@/components/forms/field";
import { REGION_OPTIONS } from "@/config/regions";
import { cn } from "@/lib/utils";

type Profile = "universitario" | "docente" | "empresa";

interface Question {
  number: number;
  block: number;
  blockTitle: string | null;
  question: string;
  inputType: string;
  options: string[];
  tag: string | null;
  isKey: boolean;
}

type Answers = Record<number, string | string[]>;

const PROFILES: {
  key: Profile;
  emoji: string;
  icon: typeof GraduationCap;
  title: string;
  body: string;
}[] = [
  {
    key: "universitario",
    emoji: "🎓",
    icon: GraduationCap,
    title: "Soy universitario o joven en formación",
    body: "Estudio en la universidad o acabo de egresar. Busco crecer, aprender y generar impacto desde donde estoy.",
  },
  {
    key: "docente",
    emoji: "📚",
    icon: School,
    title: "Soy docente o educador",
    body: "Enseño en un colegio, instituto o universidad. Quiero innovar en mi aula y conectar a mis estudiantes con nuevas oportunidades.",
  },
  {
    key: "empresa",
    emoji: "🏢",
    icon: Building2,
    title: "Represento una empresa u organización",
    body: "Trabajo en una empresa, ONG o institución y buscamos generar impacto social real en jóvenes de regiones.",
  },
];

export function DiagnosticWizard({
  questions,
}: {
  questions: Record<Profile, Question[]>;
}) {
  const [step, setStep] = React.useState<"intro" | "profile" | "questions" | "email" | "done">(
    "intro",
  );
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [index, setIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Answers>({});
  const [email, setEmail] = React.useState("");
  const [region, setRegion] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const list = profile ? questions[profile] : [];
  const current = list[index];
  const progress = list.length ? Math.round(((index + 1) / list.length) * 100) : 0;

  function setAnswer(value: string | string[]) {
    if (!current) return;
    setAnswers((prev) => ({ ...prev, [current.number]: value }));
  }

  function toggleMulti(option: string) {
    if (!current) return;
    const currentValue = answers[current.number];
    const list = Array.isArray(currentValue) ? currentValue : [];
    setAnswer(
      list.includes(option) ? list.filter((o) => o !== option) : [...list, option],
    );
  }

  function next() {
    if (index < list.length - 1) {
      setIndex((i) => i + 1);
    } else {
      setStep("email");
    }
  }

  function back() {
    if (index > 0) setIndex((i) => i - 1);
    else setStep("profile");
  }

  async function submit() {
    if (!profile) return;
    setBusy(true);
    setError(null);

    const payload = Object.entries(answers).map(([number, answer]) => ({
      number: Number(number),
      answer,
    }));

    const result = await submitDiagnosticAction({
      email,
      profile,
      region: region || null,
      answers: payload,
    });

    setBusy(false);
    if (result.ok) setStep("done");
    else setError(result.error);
  }

  const answered = current ? answers[current.number] : undefined;
  const canContinue = Array.isArray(answered) ? answered.length > 0 : !!answered;

  /* ── Intro ── */
  if (step === "intro") {
    return (
      <Section>
        <Container size="narrow">
          <div className="text-center">
            <Badge tone="seed">Fase piloto · 2026 · Áncash, Perú</Badge>
            <h1 className="mx-auto mt-6 max-w-2xl font-display text-[2.25rem] font-bold leading-[1.12] text-ink sm:text-[2.75rem]">
              Estamos construyendo algo para jóvenes de regiones.{" "}
              <GoldUnderline>Ayúdanos a hacerlo bien.</GoldUnderline>
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-[1.0625rem] leading-relaxed text-slate-ui">
              Antes de abrir las puertas queremos entender tu realidad: qué te frena, qué
              sueñas y qué necesitas. Son 3 minutos que pueden cambiar lo que construimos
              para ti.
            </p>

            <Button
              onClick={() => setStep("profile")}
              variant="gradient"
              size="lg"
              className="mt-9"
            >
              Quiero participar — es gratis
              <ArrowRight className="size-4" />
            </Button>

            <p className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-slate-ui">
              <span className="inline-flex items-center gap-1.5">
                <Check className="size-4 text-seed-500" /> 3 minutos
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="size-4 text-seed-500" /> Sin crear cuenta
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="size-4 text-seed-500" /> Cualquier región
              </span>
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Para escucharte primero",
                body: "No asumimos qué necesitas. Queremos saberlo de ti.",
              },
              {
                title: "Para construir mejor",
                body: "Tus respuestas definen qué cursos, programas y recursos priorizamos.",
              },
              {
                title: "Estamos en fase piloto",
                body: "Somos honestos: estamos validando. Tu voz tiene peso real en lo que sigue.",
              },
              {
                title: "Al final hay una sorpresa",
                body: "Basándonos en lo que nos digas, te mostraremos algo construido para ti.",
              },
            ].map((c) => (
              <Card key={c.title} className="p-6">
                <h2 className="font-display text-[0.9375rem] font-semibold text-ink">
                  {c.title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-ui">{c.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    );
  }

  /* ── Selector de perfil ── */
  if (step === "profile") {
    return (
      <Section>
        <Container size="narrow">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
            Paso 1 de 3 · Perfil
          </p>
          <h1 className="mt-3 font-display text-[2rem] font-semibold leading-tight text-ink">
            Antes de empezar, ¿quién eres?
          </h1>
          <p className="mt-2.5 text-[0.9375rem] text-slate-ui">
            Según tu perfil, las preguntas serán diferentes. No te tomará más de 3 minutos.
          </p>

          <ul className="mt-8 space-y-3">
            {PROFILES.map((p) => (
              <li key={p.key}>
                <button
                  type="button"
                  onClick={() => {
                    setProfile(p.key);
                    setIndex(0);
                    setAnswers({});
                    setStep("questions");
                  }}
                  className="group flex w-full items-start gap-4 rounded-[14px] border border-line bg-white p-5 text-left transition-all hover:border-sep-300 hover:shadow-[0_8px_28px_rgba(46,11,232,.08)]"
                >
                  <span className="text-2xl leading-none">{p.emoji}</span>
                  <span className="flex-1">
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-display text-[1.0625rem] font-semibold text-ink">
                        {p.title}
                      </span>
                      <ArrowRight className="size-4 shrink-0 text-mist transition-all group-hover:translate-x-0.5 group-hover:text-sep-600" />
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-slate-ui">
                      {p.body}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-center text-xs text-mist">
            Tus respuestas son confidenciales y solo se usan para mejorar el programa.
          </p>
        </Container>
      </Section>
    );
  }

  /* ── Preguntas ── */
  if (step === "questions" && current) {
    return (
      <Section>
        <Container size="narrow">
          {/* Progreso */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs text-slate-ui">
              <span>
                {current.blockTitle ?? `Bloque ${current.block}`}
              </span>
              <span className="tabular">
                {index + 1} de {list.length}
              </span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full sep-gradient transition-[width] duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {current.isKey && (
            <Badge tone="gold" className="mb-4">
              <Sparkles className="size-3.5" />
              Pregunta clave
            </Badge>
          )}

          <h1 className="font-display text-[1.75rem] font-semibold leading-tight text-ink">
            {current.question}
          </h1>

          {current.inputType === "multiple" && (
            <p className="mt-2 text-sm text-slate-ui">Puedes elegir varias.</p>
          )}

          <ul className="mt-7 space-y-2.5">
            {current.options.map((option) => {
              const selected =
                current.inputType === "multiple"
                  ? Array.isArray(answered) && answered.includes(option)
                  : answered === option;

              return (
                <li key={option}>
                  <button
                    type="button"
                    onClick={() =>
                      current.inputType === "multiple"
                        ? toggleMulti(option)
                        : setAnswer(option)
                    }
                    aria-pressed={selected}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-[12px] border p-4 text-left text-[0.9375rem] transition-all",
                      selected
                        ? "border-sep-500 bg-sep-50 text-sep-700"
                        : "border-line bg-white text-graphite hover:border-sep-300",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center border-2 transition-colors",
                        current.inputType === "multiple" ? "rounded-[5px]" : "rounded-full",
                        selected ? "border-sep-600 bg-sep-600 text-white" : "border-line",
                      )}
                    >
                      {selected && <Check className="size-3" />}
                    </span>
                    {option}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={back}
              className="inline-flex items-center gap-1.5 text-sm text-slate-ui transition-colors hover:text-ink"
            >
              <ArrowLeft className="size-4" />
              Anterior
            </button>

            <Button onClick={next} disabled={!canContinue} variant="primary">
              {index === list.length - 1 ? "Terminar" : "Siguiente"}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  /* ── Captura de email ── */
  if (step === "email") {
    return (
      <Section>
        <Container size="narrow">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
            Paso final
          </p>
          <h1 className="mt-3 font-display text-[2rem] font-semibold leading-tight text-ink">
            Gracias por contarnos
          </h1>
          <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-slate-ui">
            Antes de mostrarte lo que construimos para ti, déjanos tu correo. Te avisamos
            cuando abramos el acceso al piloto.
          </p>

          <div className="mt-8 space-y-4">
            {error && <FormAlert tone="error">{error}</FormAlert>}

            <Field label="Tu correo electrónico" htmlFor="diag-email" required>
              <Input
                id="diag-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                autoComplete="email"
                required
              />
            </Field>

            <Field label="¿De qué región eres?" htmlFor="diag-region">
              <Select
                id="diag-region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                <option value="">Prefiero no decirlo</option>
                {REGION_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Select>
            </Field>

            <Button
              onClick={submit}
              disabled={busy || !email.includes("@")}
              variant="gradient"
              size="lg"
              className="w-full"
            >
              {busy && <Loader2 className="size-4 animate-spin" />}
              Ver mi resultado
            </Button>

            <p className="text-center text-xs text-mist">
              Sin spam. Solo te avisamos del piloto. Puedes darte de baja cuando quieras.
            </p>
          </div>
        </Container>
      </Section>
    );
  }

  /* ── Resultado ── */
  return (
    <Section>
      <Container size="narrow">
        <div className="overflow-hidden rounded-[18px] border border-line">
          <div className="sep-gradient px-8 py-10 text-center text-white">
            <p className="text-xs uppercase tracking-[0.14em] text-white/70">
              Construido exactamente para lo que nos contaste
            </p>
            <h1 className="mt-4 font-display text-[2rem] font-bold leading-tight">
              Semillero de Emprendedores Perú
            </h1>
            <p className="mx-auto mt-3 max-w-md text-[0.9375rem] text-white/75">
              Sin importar tu región, tu carrera o tu punto de partida.
            </p>
          </div>

          <div className="bg-white p-8">
            <ul className="space-y-4">
              {[
                ["Tu barrera", "Acceso limitado", "100 % virtual y gratuito"],
                ["Tu aspiración", "Crecer y liderar", "Liderazgo real, no teoría"],
                ["Tu región", "Fuera de Lima", "Nacimos en Áncash"],
                ["Tu disposición", "Generar impacto", "El impacto es el programa"],
              ].map(([label, from, to]) => (
                <li
                  key={label}
                  className="flex flex-wrap items-center gap-3 border-b border-line pb-4 last:border-0 last:pb-0"
                >
                  <span className="w-28 shrink-0 text-xs uppercase tracking-[0.08em] text-slate-ui">
                    {label}
                  </span>
                  <span className="text-sm text-slate-ui">{from}</span>
                  <ArrowRight className="size-4 text-gold-500" />
                  <span className="text-sm font-medium text-ink">{to}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-6 text-center">
              {[
                ["S/ 0", "Costo de acceso"],
                ["135+", "Jóvenes formados"],
                ["10+", "Regiones alcanzadas"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dd className="tabular font-display text-[1.75rem] font-bold leading-none sep-gradient-text">
                    {value}
                  </dd>
                  <dt className="mt-1.5 text-xs text-slate-ui">{label}</dt>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/registro" variant="gradient" size="lg" className="flex-1">
                Quiero ser parte del piloto
                <ArrowRight className="size-4" />
              </Button>
              <Button href="/cursos" variant="outline" size="lg" className="flex-1">
                Ver los cursos
              </Button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-ui">
          Gracias por tus 3 minutos.{" "}
          <Link href="/" className="text-sep-600 hover:underline">
            Volver al inicio
          </Link>
        </p>
      </Container>
    </Section>
  );
}
