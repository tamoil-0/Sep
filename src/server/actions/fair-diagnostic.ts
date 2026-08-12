"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { clientIp } from "@/lib/audit";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { fail, fromPostgrestError, ok, type ActionResult } from "@/lib/result";

const answerSchema = z.object({
  number: z.number().int().min(1).max(15),
  answer: z.union([
    z.string().trim().min(1).max(300),
    z.array(z.string().trim().min(1).max(300)).min(1).max(12),
  ]),
});

const fairSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Escribe tu nombre para continuar.")
    .max(120, "Tu nombre es demasiado largo."),
  website: z.string().max(0),
  answers: z
    .array(answerSchema)
    .length(15, "Completa las 15 preguntas antes de finalizar.")
    .refine(
      (answers) => new Set(answers.map((answer) => answer.number)).size === 15,
      "Hay preguntas pendientes de responder.",
    ),
});

export async function submitFairDiagnosticAction(input: {
  fullName: string;
  website: string;
  answers: { number: number; answer: string | string[] | undefined }[];
}): Promise<ActionResult<{ id: string }>> {
  const parsed = fairSchema.safeParse(input);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Revisa tus respuestas.");
  }

  const ip = await clientIp();
  if (!checkRateLimit(`fair:${ip}`, RATE_LIMITS.fair.limit, RATE_LIMITS.fair.windowMs)) {
    return fail("Esta red alcanzó el límite de participaciones. Avísale al equipo de SEP.");
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("submit_fair_diagnostic", {
    p_full_name: parsed.data.fullName,
    p_answers: parsed.data.answers as never,
    p_source: "apoya_hoy",
  });

  if (error) {
    return fromPostgrestError(
      error,
      "No pudimos guardar tus respuestas. Siguen en pantalla; inténtalo nuevamente.",
    );
  }

  revalidatePath("/admin/diagnostico");
  return ok({ id: data as string });
}
