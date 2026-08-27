import { createPageMetadata } from "@/lib/seo";
import { createPublicClient } from "@/lib/supabase/public";
import { DiagnosticWizard } from "./wizard";
import { assertQueryResults } from "@/lib/supabase/query";

export const metadata = createPageMetadata({
  title: "Queremos conocerte",
  description:
    "3 minutos, sin crear cuenta. Ayúdanos a construir lo que realmente necesitas: qué te frena, qué sueñas y qué te haría falta.",
  path: "/conocenos",
});

export const dynamic = "force-dynamic";

export default async function ConocenosPage() {
  const supabase = createPublicClient();

  const result = await supabase
    .from("survey_questions")
    .select("profile, block, block_title, number, question, input_type, options, tag, is_key")
    .order("profile")
    .order("number");
  assertQueryResults("publico:diagnostico", result);
  const questions = result.data;

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
