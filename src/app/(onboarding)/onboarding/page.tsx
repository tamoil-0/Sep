import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { primaryRole, ROLE_META } from "@/types/roles";
import { Card } from "@/components/ui/primitives";
import { OnboardingForm, type OnboardingQuestion } from "./onboarding-form";

export const metadata: Metadata = {
  title: "Cuéntanos sobre ti",
  description: "Completa tu diagnóstico de entrada a SEP.",
  robots: { index: false, follow: false },
};

export default async function OnboardingPage() {
  const user = await requireUser("/onboarding");

  if (user.onboardingDone) {
    redirect(ROLE_META[primaryRole(user.roles)].home);
  }

  const profile = user.roles.includes("institucion")
    ? "empresa"
    : user.roles.includes("docente")
      ? "docente"
      : "universitario";

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("survey_questions")
    .select("number, block, block_title, question, input_type, options, is_key")
    .eq("profile", profile)
    .order("number");

  const questions: OnboardingQuestion[] = (data ?? []).map((question) => ({
    number: question.number,
    block: question.block,
    blockTitle: question.block_title,
    question: question.question,
    inputType: question.input_type,
    options: Array.isArray(question.options) ? (question.options as string[]) : [],
    isKey: question.is_key,
  }));

  if (error || questions.length !== 15) {
    console.error("[sep] diagnóstico de onboarding no disponible:", {
      profile,
      count: questions.length,
      code: error?.code,
    });

    return (
      <div className="mx-auto max-w-xl py-10 sm:py-16">
        <Card className="p-7 text-center sm:p-9">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-warning-bg text-[#8A5A00]">
            <AlertCircle className="size-5" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-semibold text-ink">
            Estamos preparando tus preguntas
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-ui">
            Tu cuenta está segura. Inténtalo nuevamente en unos minutos; no tendrás que
            volver a registrarte.
          </p>
        </Card>
      </div>
    );
  }

  const firstName = user.fullName.trim().split(/\s+/)[0] || "";
  const audience =
    profile === "empresa"
      ? "tu organización"
      : profile === "docente"
        ? "tu experiencia como docente"
        : "tu momento actual";

  return (
    <OnboardingForm
      firstName={firstName}
      audience={audience}
      profile={profile}
      questions={questions}
    />
  );
}
