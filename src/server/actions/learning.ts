"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/session";
import { fail, fromPostgrestError, ok, type ActionResult } from "@/lib/result";
import { checkRateLimit } from "@/lib/rate-limit";
import { clientIp } from "@/lib/audit";

/**
 * Inscribirse a un curso.
 * Toda la validación (curso publicado, cupo, duplicados) vive en el RPC
 * `enroll_in_course`, que es SECURITY DEFINER: no se puede saltar.
 */
export async function enrollAction(slug: string): Promise<ActionResult<string>> {
  const user = await requireUser();

  if (!checkRateLimit(`enroll:${user.id}`, 10, 60 * 60 * 1000)) {
    return fail("Demasiadas inscripciones seguidas. Espera un momento.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("enroll_in_course", {
    p_course_slug: slug,
  });

  if (error) return fromPostgrestError(error);

  revalidatePath("/estudiante", "layout");
  revalidatePath(`/cursos/${slug}`);

  return ok(data as string, "¡Listo! Ya estás inscrito. Empieza cuando quieras.");
}

/** Marcar o desmarcar una sesión como completada. */
export async function toggleSessionAction(
  sessionId: string,
  done: boolean,
  courseSlug: string,
): Promise<ActionResult<number>> {
  await requireUser();

  const parsed = z.string().uuid().safeParse(sessionId);
  if (!parsed.success) return fail("Sesión no válida.");

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("toggle_session_complete", {
    p_session_id: sessionId,
    p_done: done,
  });

  if (error) return fromPostgrestError(error);

  revalidatePath(`/estudiante/curso/${courseSlug}`);
  revalidatePath("/estudiante");

  const progress = (data as number) ?? 0;
  return ok(
    progress,
    progress === 100
      ? "🎉 ¡Completaste el curso! Ya puedes solicitar tu certificado."
      : undefined,
  );
}

/* ── Comunidad ────────────────────────────────────────────── */

const postSchema = z.object({
  content: z
    .string()
    .trim()
    .min(3, "Escribe al menos unas palabras.")
    .max(4000, "Máximo 4000 caracteres."),
  courseId: z.string().uuid().optional().or(z.literal("")),
});

export async function createPostAction(
  _prev: ActionResult<unknown> | null,
  formData: FormData,
): Promise<ActionResult<string>> {
  const user = await requireUser();
  const ip = await clientIp();

  if (!checkRateLimit(`post:${user.id}:${ip}`, 10, 60 * 60 * 1000)) {
    return fail("Estás publicando muy seguido. Espera unos minutos.");
  }

  const parsed = postSchema.safeParse({
    content: formData.get("content"),
    courseId: formData.get("courseId") ?? "",
  });

  if (!parsed.success) {
    return fail(
      parsed.error.issues[0]?.message ?? "Revisa el contenido de tu publicación.",
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .insert({
      user_id: user.id,
      content: parsed.data.content,
      course_id: parsed.data.courseId || null,
    })
    .select("id")
    .single();

  if (error) return fromPostgrestError(error);

  revalidatePath("/estudiante/comunidad");
  return ok(data.id, "Publicado.");
}

export async function toggleLikeAction(postId: string): Promise<ActionResult<boolean>> {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("post_likes")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("post_likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", user.id);
    if (error) return fromPostgrestError(error);
    revalidatePath("/estudiante/comunidad");
    return ok(false);
  }

  const { error } = await supabase
    .from("post_likes")
    .insert({ post_id: postId, user_id: user.id });

  if (error) return fromPostgrestError(error);
  revalidatePath("/estudiante/comunidad");
  return ok(true);
}

export async function createCommentAction(
  postId: string,
  content: string,
): Promise<ActionResult<string>> {
  const user = await requireUser();

  const parsed = z
    .string()
    .trim()
    .min(1, "Escribe tu comentario.")
    .max(2000)
    .safeParse(content);

  if (!parsed.success) return fail(parsed.error.issues[0].message);

  if (!checkRateLimit(`comment:${user.id}`, 20, 60 * 60 * 1000)) {
    return fail("Estás comentando muy seguido. Espera unos minutos.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .insert({ post_id: postId, user_id: user.id, content: parsed.data })
    .select("id")
    .single();

  if (error) return fromPostgrestError(error);

  revalidatePath("/estudiante/comunidad");
  return ok(data.id);
}

/* ── Eventos ──────────────────────────────────────────────── */

export async function registerForEventAction(
  eventId: string,
): Promise<ActionResult<void>> {
  const user = await requireUser();
  const supabase = await createClient();

  const { error } = await supabase
    .from("event_registrations")
    .insert({ event_id: eventId, user_id: user.id, email: user.email });

  // 23505 = ya estaba inscrito. No es un error para el usuario.
  if (error && error.code !== "23505") return fromPostgrestError(error);

  revalidatePath("/estudiante/eventos");
  revalidatePath("/eventos");
  return ok(undefined, "¡Listo! Te esperamos. Te enviaremos un recordatorio.");
}

/* ── Voluntariado ─────────────────────────────────────────── */

const hoursSchema = z.object({
  date: z.string().min(1, "Elige la fecha."),
  hours: z.coerce
    .number()
    .min(0.5, "Mínimo media hora.")
    .max(12, "Máximo 12 horas por día."),
  activity: z
    .string()
    .trim()
    .min(5, "Describe brevemente qué hiciste.")
    .max(300),
});

export async function logHoursAction(
  _prev: ActionResult<unknown> | null,
  formData: FormData,
): Promise<ActionResult<string>> {
  await requireUser();

  const parsed = hoursSchema.safeParse({
    date: formData.get("date"),
    hours: formData.get("hours"),
    activity: formData.get("activity"),
  });

  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Revisa los datos.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("log_volunteer_hours", {
    p_date: parsed.data.date,
    p_hours: parsed.data.hours,
    p_activity: parsed.data.activity,
  });

  if (error) return fromPostgrestError(error);

  revalidatePath("/mentor/horas");
  revalidatePath("/mentor");
  return ok(data as string, "Horas registradas. El equipo las revisará pronto.");
}
