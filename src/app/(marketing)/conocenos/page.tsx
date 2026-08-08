import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { DiagnosticWizard } from "./wizard";

export const metadata: Metadata = {
  title: "Queremos conocerte",
  description:
    "3 minutos, sin crear cuenta. Ayúdanos a construir lo que realmente necesitas: qué te frena, qué sueñas y qué te haría falta.",
};

export default async function ConocenosPage() {
  const supabase = await createClient();

  const { data: questions } = await supabase
    .from("survey_questions")
    .select("profile, block, block_title, number, question, input_type, options, tag, is_key")
    .order("profile")
    .order("number");

  type Q = {
    number: number;
    block: number;
    blockTitle: string | null;
    question: string;
    inputType: string;
    options: string[];
    tag: string | null;
    isKey: boolean;
  };

  const byProfile: Record<"universitario" | "docente" | "empresa", Q[]> = {
    universitario: [],
    docente: [],
    empresa: [],
  };

  for (const q of questions ?? []) {
    const item: Q = {
      number: q.number,
      block: q.block,
      blockTitle: q.block_title,
      question: q.question,
      inputType: q.input_type,
      options: Array.isArray(q.options) ? (q.options as string[]) : [],
      tag: q.tag,
      isKey: q.is_key,
    };
    byProfile[q.profile].push(item);
  }

  return <DiagnosticWizard questions={byProfile} />;
}
