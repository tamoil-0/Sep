"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  HeartHandshake,
  Loader2,
  LockKeyhole,
  PartyPopper,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { submitFairDiagnosticAction } from "@/server/actions/fair-diagnostic";
import { cn } from "@/lib/utils";

export interface FairQuestion {
  number: number;
  question: string;
  inputType: "single" | "multiple" | "scale_1_5" | "email";
  options: string[];
  isKey: boolean;
}

type Answer = string | string[];
type Answers = Record<number, Answer>;

const MODULES = [
  { title: "Tu realidad", color: "bg-sep-600" },
  { title: "Lo que buscas", color: "bg-gold-500" },
  { title: "Tu impacto", color: "bg-seed-500" },
] as const;

function answered(value: Answer | undefined) {
  return Array.isArray(value) ? value.length > 0 : Boolean(value);
}

export function FairDiagnostic({ questions }: { questions: FairQuestion[] }) {
  const [stage, setStage] = React.useState<"welcome" | "questions" | "done">("welcome");
  const [fullName, setFullName] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [index, setIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Answers>({});
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);

  const current = questions[index];
  const currentAnswer = current ? answers[current.number] : undefined;
  const moduleIndex = Math.floor(index / 5);
  const progress = questions.length ? Math.round((index / questions.length) * 100) : 0;
  const firstName = fullName.trim().split(/\s+/)[0] || fullName.trim();

  function focusQuestion() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.setTimeout(() => titleRef.current?.focus(), 250);
  }

  function goTo(nextIndex: number) {
    setIndex(nextIndex);
    setError(null);
    focusQuestion();
  }

  function choose(option: string) {
    if (!current) return;
    setAnswers((state) => ({ ...state, [current.number]: option }));
    setError(null);

    if (index < questions.length - 1) {
      window.setTimeout(() => goTo(index + 1), 220);
    }
  }

  function toggle(option: string) {
    if (!current) return;
    const selected = Array.isArray(currentAnswer) ? currentAnswer : [];
    setAnswers((state) => ({
      ...state,
      [current.number]: selected.includes(option)
        ? selected.filter((value) => value !== option)
        : [...selected, option],
    }));
    setError(null);
  }

  function start(event: React.FormEvent) {
    event.preventDefault();
    if (fullName.trim().length < 2) {
      setError("Escribe tu nombre para comenzar.");
      return;
    }
    if (questions.length !== 15) {
      setError("Las preguntas todavía no están disponibles. Avísale al equipo de SEP.");
      return;
    }
    setError(null);
    setStage("questions");
    focusQuestion();
  }

  function finish() {
    if (!current || !answered(currentAnswer) || busy) return;
    setBusy(true);
    setError(null);

    React.startTransition(async () => {
      try {
        const result = await submitFairDiagnosticAction({
          fullName,
          website,
          answers: questions.map((question) => ({
            number: question.number,
            answer: answers[question.number],
          })),
        });

        if (!result.ok) {
          setBusy(false);
          setError(result.error);
          return;
        }

        setStage("done");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch {
        setBusy(false);
        setError("Se perdió la conexión. Tus respuestas siguen aquí; inténtalo otra vez.");
      }
    });
  }

  if (stage === "done") {
    return (
      <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
        <div aria-hidden className="absolute inset-0 sep-gradient opacity-[0.06]" />
        <div aria-hidden className="absolute -right-20 -top-20 size-64 rounded-full bg-gold-500/20 blur-3xl" />
        <div className="relative w-full max-w-lg rounded-[24px] border border-line bg-white px-6 py-10 text-center shadow-[0_24px_70px_rgba(46,11,232,.12)] sm:px-10">
          <span className="mx-auto flex size-16 items-center justify-center rounded-[20px] bg-seed-500 text-white shadow-[0_10px_30px_rgba(96,160,58,.25)]">
            <PartyPopper className="size-8" />
          </span>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-seed-700">
            Participación registrada
          </p>
          <h1 className="mt-2 font-display text-[2rem] font-bold leading-tight text-ink sm:text-[2.35rem]">
            ¡Gracias, {firstName}!
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-base leading-relaxed text-slate-ui">
            Tu voz nos ayuda a construir oportunidades que sí respondan a lo que los jóvenes necesitan.
          </p>
          <div className="mt-7 rounded-[14px] bg-sep-50 px-4 py-4 text-sm leading-relaxed text-sep-800">
            Ya guardamos tus 15 respuestas. Puedes devolver el equipo al personal de SEP.
          </div>
          <Link
            href="/"
            className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-[10px] border border-line px-5 text-sm font-medium text-graphite transition-colors hover:bg-surface-1"
          >
            Conocer más de SEP <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (stage === "welcome") {
    return (
      <div className="relative min-h-dvh overflow-hidden px-4 py-5 sm:flex sm:items-center sm:justify-center sm:px-6 sm:py-10">
        <div aria-hidden className="absolute inset-x-0 top-0 h-[48%] sep-gradient" />
        <div aria-hidden className="absolute -right-20 top-12 size-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative mx-auto w-full max-w-lg overflow-hidden rounded-[24px] border border-white/20 bg-white shadow-[0_24px_70px_rgba(28,13,92,.18)]">
          <div className="sep-gradient px-6 pb-8 pt-6 text-white sm:px-9 sm:pt-8">
            <Logo variant="white" className="h-14" />
            <span className="mt-8 flex size-12 items-center justify-center rounded-[15px] bg-gold-500 text-ink shadow-[0_10px_25px_rgba(255,198,41,.28)]">
              <HeartHandshake className="size-6" />
            </span>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-gold-500">
              Tu voz importa
            </p>
            <h1 className="mt-2 font-display text-[2rem] font-bold leading-[1.08] sm:text-[2.5rem]">
              Ayúdanos a construir algo mejor para ti
            </h1>
            <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-white/75">
              Son 15 preguntas rápidas. No necesitas crear una cuenta ni confirmar un correo.
            </p>
          </div>

          <form onSubmit={start} className="px-6 py-7 sm:px-9 sm:py-8">
            <label htmlFor="fair-name" className="block text-sm font-semibold text-ink">
              ¿Cómo te llamas?
            </label>
            <p className="mt-1 text-xs text-slate-ui">Así podremos reconocer tu participación.</p>
            <input
              id="fair-name"
              value={fullName}
              onChange={(event) => {
                setFullName(event.target.value);
                setError(null);
              }}
              autoComplete="name"
              autoFocus
              maxLength={120}
              placeholder="Tu nombre y apellido"
              className="mt-3 h-14 w-full rounded-[12px] border border-line bg-white px-4 text-base text-ink outline-none transition focus:border-sep-500 focus:ring-4 focus:ring-sep-100"
            />
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <label htmlFor="company-website">Sitio web</label>
              <input
                id="company-website"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {error && <p role="alert" className="mt-3 text-sm text-danger">{error}</p>}

            <button
              type="submit"
              className="mt-5 inline-flex h-13 w-full items-center justify-center gap-2 rounded-[12px] sep-gradient px-5 text-base font-semibold text-white shadow-[0_8px_22px_rgba(46,11,232,.25)] transition-transform active:scale-[.99]"
            >
              Comenzar ahora <ArrowRight className="size-5" />
            </button>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-mist">
              <LockKeyhole className="size-3.5" /> Tus respuestas solo serán vistas por el equipo SEP.
            </p>
            <p className="mt-2 text-center text-[0.6875rem] leading-relaxed text-mist">
              Al continuar aceptas nuestro{" "}
              <Link href="/legal/privacidad" target="_blank" className="text-sep-600 underline underline-offset-2">
                aviso de privacidad
              </Link>
              .
            </p>
          </form>
        </div>
      </div>
    );
  }

  if (!current) return null;

  const multiple = current.inputType === "multiple";
  const moduleMeta = MODULES[moduleIndex];

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col bg-white sm:min-h-0 sm:my-8 sm:rounded-[24px] sm:border sm:border-line sm:shadow-[0_24px_70px_rgba(46,11,232,.1)]">
      <header className="sticky top-0 z-10 border-b border-line bg-white/95 px-4 pb-3 pt-4 backdrop-blur-md sm:rounded-t-[24px] sm:px-7 sm:pt-5">
        <div className="flex items-center justify-between gap-4">
          <Logo className="h-10" />
          <span className="tabular text-xs font-semibold text-slate-ui">
            {index + 1} de {questions.length}
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full sep-gradient transition-[width] duration-300"
            style={{ width: `${Math.max(3, progress)}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-graphite">
            <span className={cn("size-2 rounded-full", moduleMeta.color)} />
            Módulo {moduleIndex + 1}: {moduleMeta.title}
          </span>
          <span className="text-xs text-mist">Hola, {firstName}</span>
        </div>
      </header>

      <section className="flex flex-1 flex-col px-4 py-6 sm:px-8 sm:py-8">
        {current.isKey && (
          <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#fff6de] px-2.5 py-1 text-xs font-semibold text-gold-700">
            <Sparkles className="size-3.5" /> Pregunta clave
          </span>
        )}
        <h1
          ref={titleRef}
          tabIndex={-1}
          className="font-display text-[1.45rem] font-semibold leading-[1.22] text-ink outline-none sm:text-[1.8rem]"
        >
          {current.question}
        </h1>
        <p className="mt-2 text-sm text-slate-ui">
          {multiple ? "Puedes marcar más de una opción." : "Toca la opción que mejor te represente."}
        </p>

        <div
          className={cn(
            "mt-5 grid gap-2.5",
            current.inputType === "scale_1_5" && "sm:grid-cols-5",
          )}
        >
          {current.options.map((option) => {
            const selected = multiple
              ? Array.isArray(currentAnswer) && currentAnswer.includes(option)
              : currentAnswer === option;

            return (
              <button
                key={option}
                type="button"
                onClick={() => (multiple ? toggle(option) : choose(option))}
                aria-pressed={selected}
                className={cn(
                  "group flex min-h-14 w-full items-center gap-3 rounded-[12px] border px-4 py-3 text-left text-[0.9375rem] leading-snug transition-all active:scale-[.99]",
                  selected
                    ? "border-sep-500 bg-sep-50 text-sep-800 shadow-[0_3px_12px_rgba(46,11,232,.08)]"
                    : "border-line bg-white text-graphite hover:border-sep-300 hover:bg-surface-1",
                  current.inputType === "scale_1_5" && "sm:min-h-24 sm:flex-col sm:justify-center sm:text-center",
                )}
              >
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center border-2",
                    multiple ? "rounded-[6px]" : "rounded-full",
                    selected ? "border-sep-600 bg-sep-600 text-white" : "border-line bg-white",
                  )}
                >
                  {selected && <Check className="size-3.5" strokeWidth={3} />}
                </span>
                <span>{option}</span>
              </button>
            );
          })}
        </div>

        {error && (
          <p role="alert" className="mt-4 rounded-[10px] bg-danger-bg px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}
      </section>

      <footer className="sticky bottom-0 border-t border-line bg-white/95 px-4 py-3 backdrop-blur-md sm:rounded-b-[24px] sm:px-8 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            disabled={index === 0 || busy}
            className="inline-flex h-11 items-center gap-1.5 rounded-[10px] px-3 text-sm font-medium text-slate-ui transition hover:bg-surface-1 disabled:invisible"
          >
            <ArrowLeft className="size-4" /> Atrás
          </button>

          {(multiple || index === questions.length - 1) && (
            <button
              type="button"
              onClick={() => (index === questions.length - 1 ? finish() : goTo(index + 1))}
              disabled={!answered(currentAnswer) || busy}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] sep-gradient px-5 text-sm font-semibold text-white shadow-[0_5px_16px_rgba(46,11,232,.2)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy ? (
                <><Loader2 className="size-4 animate-spin" /> Guardando</>
              ) : index === questions.length - 1 ? (
                <><CheckCircle2 className="size-4" /> Enviar respuestas</>
              ) : (
                <>Continuar <ArrowRight className="size-4" /></>
              )}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
