"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/session";
import { fail, fromPostgrestError, fromZodError, ok, type ActionResult } from "@/lib/result";
import { REGION_OPTIONS } from "@/config/regions";

const schema = z.object({
  fullName: z.string().trim().min(3, "Escribe tu nombre completo.").max(120),
  phone: z.string().trim().max(25).optional().or(z.literal("")),
  region: z.enum(REGION_OPTIONS, { message: "Elige tu región." }),
  province: z.string().trim().max(120).optional().or(z.literal("")),
  university: z.string().trim().max(160).optional().or(z.literal("")),
  career: z.string().trim().max(120).optional().or(z.literal("")),
  currentSituation: z.string().trim().max(80).optional().or(z.literal("")),
  bio: z.string().trim().max(500).optional().or(z.literal("")),
  interests: z.array(z.string().max(80)).max(12).default([]),
  newsletter: z.boolean().default(false),
});

/**
 * Actualiza el perfil propio.
 *
 * La política `profiles_update_own` limita la escritura a la fila del usuario
 * autenticado, así que aunque alguien manipule la petición no puede tocar el
 * perfil de otra persona. Los roles no se tocan aquí por diseño: viven en
 * `user_roles` y solo los otorga un administrador.
 */
export async function updateProfileAction(
  _prev: ActionResult<unknown> | null,
  formData: FormData,
): Promise<ActionResult<void>> {
  const user = await requireUser();

  const parsed = schema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone") ?? "",
    region: formData.get("region"),
    province: formData.get("province") ?? "",
    university: formData.get("university") ?? "",
    career: formData.get("career") ?? "",
    currentSituation: formData.get("currentSituation") ?? "",
    bio: formData.get("bio") ?? "",
    interests: formData.getAll("interests"),
    newsletter: formData.get("newsletter") === "on",
  });

  if (!parsed.success) return fromZodError(parsed.error.flatten().fieldErrors);

  const d = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: d.fullName,
      phone: d.phone || null,
      region: d.region,
      province: d.province || null,
      university: d.university || null,
      career: d.career || null,
      current_situation: d.currentSituation || null,
      bio: d.bio || null,
      interests: d.interests,
      newsletter_opt_in: d.newsletter,
    })
    .eq("id", user.id);

  if (error) return fromPostgrestError(error);

  revalidatePath("/cuenta");
  revalidatePath("/", "layout");

  return ok(undefined, "Datos guardados.");
}

/** Marca todas las notificaciones como leídas. */
export async function markAllReadAction(): Promise<ActionResult<void>> {
  const user = await requireUser();
  const supabase = await createClient();

  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .is("read_at", null);

  if (error) return fromPostgrestError(error);

  revalidatePath("/cuenta/notificaciones");
  return ok(undefined, "Todo marcado como leído.");
}

/** Envía el correo para restablecer la contraseña del propio usuario. */
export async function requestPasswordChangeAction(): Promise<ActionResult<void>> {
  const user = await requireUser();
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/nueva-contrasena`,
  });

  if (error) return fail("No pudimos enviar el correo. Inténtalo de nuevo.");

  return ok(
    undefined,
    `Te enviamos un enlace a ${user.email} para crear una contraseña nueva.`,
  );
}
