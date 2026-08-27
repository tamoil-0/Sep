import type { Metadata } from "next";
import { createPublicClient } from "@/lib/supabase/public";
import { FairDiagnostic, type FairQuestion } from "./fair-diagnostic";
import { assertQueryResults } from "@/lib/supabase/query";

export const metadata: Metadata = {
  title: "Apoya hoy",
  description:
    "Cuéntanos qué necesitas y ayúdanos a construir mejores oportunidades para jóvenes del Perú.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ApoyaHoyPage() {
  const supabase = createPublicClient();
  const result = await supabase
    .from("survey_questions")
    .select("number, question, input_type, options, is_key")
    .eq("profile", "universitario")
    .order("number");
  assertQueryResults("campana:diagnostico", result);
  const data = result.data;

  const questions: FairQuestion[] = (data ?? []).map((question) => ({
    number: question.number,
    question: question.question,
    inputType: question.input_type,
    options: Array.isArray(question.options) ? (question.options as string[]) : [],
    isKey: question.is_key,
  }));

  return <FairDiagnostic questions={questions} />;
}
