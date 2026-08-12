"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/session";
import { fail, fromPostgrestError, ok, type ActionResult } from "@/lib/result";
import { roleHome } from "@/types/roles";

const answerSchema = z.object({
  number: z.number().int().min(1).max(15),
  answer: z.union([
    z.string().trim().min(1).max(300),
    z.array(z.string().trim().min(1).max(300)).min(1).max(12),
  ]),
});

const diagnosticSchema = z
  .array(answerSchema)
  .length(15, "Completa las 15 preguntas antes de finalizar.")
  .refine(
    (answers) => new Set(answers.map((answer) => answer.number)).size === 15,
    "Hay preguntas pendientes de responder.",
  );

export async function submitAccountDiagnosticAction(
  input: { number: number; answer: string | string[] | undefined }[],
): Promise<ActionResult<{ redirectTo: string }>> {
  const user = await requireUser("/onboarding");
  const parsed = diagnosticSchema.safeParse(input);

  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Revisa tus respuestas.");
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("submit_account_diagnostic", {
    p_answers: parsed.data as never,
  });

  if (error) {
    return fromPostgrestError(
      error,
      "No pudimos guardar el diagnóstico. Tus respuestas siguen en pantalla; inténtalo nuevamente.",
    );
  }

  revalidatePath("/", "layout");
  return ok({ redirectTo: roleHome(user.roles) });
}
