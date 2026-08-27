"use client";

import * as React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  Loader2,
  LockKeyhole,
  Sparkles,
} from "lucide-react";
import { submitAccountDiagnosticAction } from "@/server/actions/onboarding";
import { Logo } from "@/components/brand/logo";
import { Badge, Card, ProgressBar } from "@/components/ui/primitives";
import { FormAlert } from "@/components/forms/field";
import { ContextualHelp } from "@/components/ui/contextual-help";
import { cn } from "@/lib/utils";

export interface OnboardingQuestion {
  number: number;
  block: number;
  blockTitle: string | null;
  question: string;
  inputType: "single" | "multiple" | "scale_1_5" | "email";
  options: string[];
  isKey: boolean;
}

type Profile = "universitario" | "docente" | "empresa";
type Answer = string | string[];
type Answers = Record<number, Answer>;

const MODULES = [
  {
    title: "Tu punto de partida",
    description: "Conozcamos tu contexto y las barreras que encuentras hoy.",
  },
  {
    title: "Lo que quieres lograr",
    description: "Cuéntanos qué necesitas y hacia dónde te gustaría avanzar.",
  },
  {
    title: "Tus próximos pasos",
    description: "Cerremos con tu experiencia y disposición para generar impacto.",
  },
] as const;

function hasAnswer(answer: Answer | undefined) {
  return Array.isArray(answer) ? answer.length > 0 : Boolean(answer?.trim());
}

export function OnboardingForm({
  firstName,
  audience,
  profile,
  questions,
}: {
  firstName: string;
  audience: string;
  profile: Profile;
  questions: OnboardingQuestion[];
}) {
  const [module, setModule] = React.useState(0);
  const [answers, setAnswers] = React.useState<Answers>({});
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [draftReady, setDraftReady] = React.useState(false);
  const [draftSaved, setDraftSaved] = React.useState(false);
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const draftKey = `sep:onboarding:${profile}:${firstName}`;

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.sessionStorage.getItem(draftKey);
        if (stored) {
          const draft = JSON.parse(stored) as { module?: number; answers?: Answers };
          if (draft.answers && typeof draft.answers === "object") {
            const allowedNumbers = new Set(questions.map((question) => String(question.number)));
            const safeAnswers = Object.fromEntries(
              Object.entries(draft.answers).filter(
                ([number, value]) =>
                  allowedNumbers.has(number) &&
                  (typeof value === "string" ||
                    (Array.isArray(value) && value.every((item) => typeof item === "string"))),
              ),
            ) as Answers;
            setAnswers(safeAnswers);
            setModule(Math.max(0, Math.min(2, Number(draft.module) || 0)));
          }
        }
      } catch {
        window.sessionStorage.removeItem(draftKey);
      } finally {
        setDraftReady(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [draftKey, questions]);

  React.useEffect(() => {
    if (!draftReady || busy) return;
    const timer = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem(draftKey, JSON.stringify({ module, answers }));
        setDraftSaved(true);
      } catch {
        setDraftSaved(false);
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [answers, busy, draftKey, draftReady, module]);

  const visibleQuestions = questions.slice(module * 5, module * 5 + 5);
  const answeredCount = questions.filter((question) => hasAnswer(answers[question.number])).length;
  const moduleComplete = visibleQuestions.every((question) =>
    hasAnswer(answers[question.number]),
  );
  const progress = Math.round((answeredCount / questions.length) * 100);

  function moveTo(nextModule: number) {
    setModule(nextModule);
    setError(null);
    setDraftSaved(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.setTimeout(() => headingRef.current?.focus(), 350);
  }

  function setAnswer(number: number, value: Answer) {
    setAnswers((current) => ({ ...current, [number]: value }));
    setError(null);
    setDraftSaved(false);
  }

  function toggleAnswer(number: number, option: string) {
    const current = answers[number];
    const selected = Array.isArray(current) ? current : [];
    setAnswer(
      number,
      selected.includes(option)
        ? selected.filter((value) => value !== option)
        : [...selected, option],
    );
  }

  function finish() {
    if (!moduleComplete || busy) return;
    setBusy(true);
    setError(null);

    React.startTransition(async () => {
      try {
        const result = await submitAccountDiagnosticAction(
          questions.map((question) => ({
            number: question.number,
            answer: answers[question.number],
          })),
        );

        if (!result.ok) {
          setBusy(false);
          setError(result.error);
          return;
        }

        window.sessionStorage.removeItem(draftKey);
        window.location.assign(result.data.redirectTo);
      } catch {
        setBusy(false);
        setError(
          "Perdimos la conexión al guardar. Tus respuestas siguen en pantalla; vuelve a intentarlo.",
        );
      }
    });
  }

  const profileLabel =
    profile === "empresa" ? "Organización" : profile === "docente" ? "Docente" : "Estudiante";

  return (
    <div className="mx-auto max-w-5xl pb-8">
      <header className="relative overflow-hidden rounded-lg sep-gradient px-5 py-7 text-white sm:px-8 sm:py-9">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative mb-7 flex items-center justify-between">
          <Logo variant="white" className="h-14" />
          <span className="text-xs font-medium text-white/60">Tu ingreso a SEP</span>
        </div>
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Badge tone="white">Preparando SEP para ti · {profileLabel}</Badge>
            <h1 className="mt-4 font-display text-h1 font-semibold">
              {firstName ? `${firstName}, personalicemos tu experiencia` : "Personalicemos tu experiencia"}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75 sm:text-body-sm">
              Son 15 preguntas breves sobre {audience}, organizadas en tres módulos. Así podremos mostrarte primero lo que te resulte más útil.
            </p>
          </div>
          <div className="flex shrink-0 gap-4 text-xs text-white/75">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="size-4 text-gold-500" /> 4–6 min
            </span>
            <span className="inline-flex items-center gap-1.5">
              <LockKeyhole className="size-4 text-gold-500" /> Información protegida
            </span>
          </div>
        </div>
      </header>

      <div className="mt-5 grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
        <aside className="lg:sticky lg:top-6">
          <Card className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-ui">
                Tu avance
              </p>
              <span className="tabular text-xs font-medium text-sep-700">{progress}%</span>
            </div>
            <ProgressBar value={progress} label={`${answeredCount} de ${questions.length} preguntas respondidas`} className="mt-2.5" />
            <p className="mt-2 text-caption text-slate-ui" aria-live="polite">
              {answeredCount} de {questions.length} respondidas
            </p>
            <p className="mt-1 text-caption text-mist" aria-live="polite">
              {draftSaved
                ? "Borrador guardado en esta pestaña"
                : "Guardando borrador en esta pestaña…"}
            </p>
            <ol className="mt-5 grid grid-cols-3 gap-2 lg:grid-cols-1 lg:gap-1.5">
              {MODULES.map((item, index) => {
                const complete = questions
                  .slice(index * 5, index * 5 + 5)
                  .every((question) => hasAnswer(answers[question.number]));
                const active = index === module;

                return (
                  <li key={item.title}>
                    <button
                      type="button"
                      onClick={() => index < module && moveTo(index)}
                      disabled={index > module}
                      aria-current={active ? "step" : undefined}
                      className={cn(
                        "flex min-h-control w-full flex-col items-center gap-2 rounded-sm px-2 py-2.5 text-center transition-colors lg:flex-row lg:text-left",
                        active && "bg-sep-50 text-sep-700",
                        !active && index < module && "text-graphite hover:bg-surface-1",
                        index > module && "cursor-default text-mist",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                          complete && "border-seed-500 bg-seed-500 text-white",
                          active && !complete && "border-sep-500 bg-white text-sep-700",
                          !active && !complete && "border-line bg-white",
                        )}
                      >
                        {complete ? <Check className="size-3.5" /> : index + 1}
                      </span>
                      <span className="hidden text-xs font-medium sm:block">Módulo {index + 1}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <p className="mt-4 hidden text-caption text-mist lg:block">
              Tus respuestas se conservan si recargas esta pestaña y se eliminan al finalizar.
            </p>
          </Card>
        </aside>

        <main className="min-w-0">
          <Card className="overflow-hidden p-0">
            <div className="border-b border-line bg-surface-1 px-5 py-5 sm:px-7 sm:py-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sep-600">
                Módulo {module + 1} de 3 · Preguntas {module * 5 + 1}–{module * 5 + 5}
              </p>
              <h2
                ref={headingRef}
                tabIndex={-1}
                className="mt-1.5 font-display text-xl font-semibold text-ink outline-none sm:text-2xl"
              >
                {MODULES[module].title}
              </h2>
              <p className="mt-1 text-sm text-slate-ui">{MODULES[module].description}</p>
            </div>

            <div className="divide-y divide-line px-5 sm:px-7">
              {visibleQuestions.map((question) => {
                const answer = answers[question.number];
                const multiple = question.inputType === "multiple";

                return (
                  <fieldset key={question.number} className="py-6 sm:py-7">
                    <legend className="w-full">
                      <span className="flex items-start gap-3">
                        <span className="tabular mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-sep-50 text-xs font-semibold text-sep-700">
                          {question.number}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2 font-display text-body font-semibold leading-snug text-ink sm:text-body">
                            {question.question}
                            {question.isKey && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF6DE] px-2 py-0.5 font-sans text-caption font-semibold uppercase tracking-wide text-gold-700">
                                <Sparkles className="size-3" /> Clave
                              </span>
                            )}
                          </span>
                          {multiple && (
                            <span className="mt-1 block font-sans text-xs font-normal text-slate-ui">
                              Puedes elegir más de una opción.
                            </span>
                          )}
                        </span>
                      </span>
                    </legend>

                    <div
                      className={cn(
                        "mt-4 grid gap-2.5 pl-0 sm:pl-10",
                        question.inputType === "scale_1_5" &&
                          "grid-cols-1 sm:grid-cols-5 sm:gap-2",
                      )}
                    >
                      {question.options.map((option) => {
                        const selected = multiple
                          ? Array.isArray(answer) && answer.includes(option)
                          : answer === option;

                        return (
                          <label
                            key={option}
                            className={cn(
                              "group flex min-h-12 cursor-pointer items-center gap-3 rounded-md border px-3.5 py-3 text-sm leading-snug transition-colors",
                              selected
                                ? "border-sep-500 bg-sep-50 text-sep-800 "
                                : "border-line bg-white text-graphite hover:border-sep-300 hover:bg-surface-1",
                              question.inputType === "scale_1_5" &&
                                "sm:min-h-[76px] sm:flex-col sm:justify-center sm:px-2 sm:text-center",
                            )}
                          >
                            <input
                              type={multiple ? "checkbox" : "radio"}
                              name={`question-${question.number}`}
                              value={option}
                              checked={selected}
                              onChange={() =>
                                multiple
                                  ? toggleAnswer(question.number, option)
                                  : setAnswer(question.number, option)
                              }
                              className="sr-only"
                            />
                            <span
                              aria-hidden
                              className={cn(
                                "flex size-5 shrink-0 items-center justify-center border-2 transition-colors",
                                multiple ? "rounded-sm" : "rounded-full",
                                selected
                                  ? "border-sep-600 bg-sep-600 text-white"
                                  : "border-line bg-white group-hover:border-sep-300",
                              )}
                            >
                              {selected && <Check className="size-3" strokeWidth={3} />}
                            </span>
                            <span>{option}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                );
              })}
            </div>

            <div className="border-t border-line bg-surface-1 px-5 py-5 sm:px-7">
              {error && (
                <div className="mb-4"><FormAlert tone="error">{error}</FormAlert></div>
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => moveTo(module - 1)}
                  disabled={module === 0 || busy}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-sm px-4 text-sm font-medium text-slate-ui transition-colors hover:bg-white hover:text-ink disabled:invisible"
                >
                  <ArrowLeft className="size-4" /> Anterior
                </button>

                <div className="text-center sm:text-right">
                  {!moduleComplete && (
                    <p className="mb-2 text-xs text-slate-ui">
                      Responde las 5 preguntas para continuar.
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => (module === 2 ? finish() : moveTo(module + 1))}
                    disabled={!moduleComplete || busy}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-sep-600 px-5 text-sm font-semibold text-white  transition-colors  disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
                  >
                    {busy ? (
                      <>
                        <Loader2 className="size-4 animate-spin" /> Guardando respuestas
                      </>
                    ) : module === 2 ? (
                      <>
                        <CheckCircle2 className="size-4" /> Finalizar y entrar a SEP
                      </>
                    ) : (
                      <>
                        Siguiente módulo <ArrowRight className="size-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </main>
      </div>
      <ContextualHelp
        className="mt-5"
        title="¿No puedes completar el diagnóstico?"
        description="Tu borrador queda en esta pestaña. Si una pregunta no corresponde a tu caso o aparece un error, escríbenos antes de cerrar."
      />
    </div>
  );
}
