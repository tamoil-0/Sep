"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/session";
import { fail, fromPostgrestError, type ActionResult } from "@/lib/result";
import { REGION_OPTIONS } from "@/config/regions";
import { primaryRole, ROLE_META } from "@/types/roles";

const schema = z.object({
  region: z.enum(REGION_OPTIONS, { message: "Elige tu región." }),
  currentSituation: z.string().trim().max(80).optional().or(z.literal("")),
  university: z.string().trim().max(160).optional().or(z.literal("")),
  career: z.string().trim().max(120).optional().or(z.literal("")),
  interests: z.array(z.string().max(80)).max(12).default([]),
});

/**
 * Guarda el perfil y marca el onboarding como hecho.
 *
 * Solo toca la fila del propio usuario: la política RLS `profiles_update_own`
 * lo garantiza aunque alguien manipule la petición.
 */
export async function completeOnboardingAction(
  _prev: ActionResult<unknown> | null,
  formData: FormData,
): Promise<ActionResult<never>> {
  const user = await requireUser();

  const parsed = schema.safeParse({
    region: formData.get("region"),
    currentSituation: formData.get("currentSituation") ?? "",
    university: formData.get("university") ?? "",
    career: formData.get("career") ?? "",
    interests: formData.getAll("interests"),
  });

  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Revisa los datos.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      region: parsed.data.region,
      current_situation: parsed.data.currentSituation || null,
      university: parsed.data.university || null,
      career: parsed.data.career || null,
      interests: parsed.data.interests,
      onboarding_done: true,
    })
    .eq("id", user.id);

  if (error) return fromPostgrestError(error);

  revalidatePath("/", "layout");
  redirect(ROLE_META[primaryRole(user.roles)].home);
}

/**
 * Saltar por ahora: marca el onboarding como hecho sin pedir nada más.
 * Devuelve `void` porque se usa directamente como `action` de un formulario;
 * termina siempre en `redirect`, que interrumpe la ejecución.
 */
export async function skipOnboardingAction(): Promise<void> {
  const user = await requireUser();

  const supabase = await createClient();
  await supabase
    .from("profiles")
    .update({ onboarding_done: true })
    .eq("id", user.id);

  revalidatePath("/", "layout");
  redirect(ROLE_META[primaryRole(user.roles)].home);
}
