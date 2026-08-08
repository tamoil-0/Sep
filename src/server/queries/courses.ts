import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";

/** Catálogo público. Solo cursos publicados; RLS lo garantiza. */
export const getCatalog = cache(async () => {
  // Cliente público: sin cookies, así la página puede ser estática con ISR.
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("courses")
    .select(
      "id, slug, title, subtitle, description, category, audience, status, total_hours, sessions_count, weeks, frequency, is_free, price_cents, cover_url",
    )
    .in("status", ["disponible", "proximamente"])
    .order("order_index");

  return data ?? [];
});

export const getCourseBySlug = cache(async (slug: string) => {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  return data;
});

/**
 * Curso con sus sesiones y el progreso del usuario actual.
 * Una sola ida a la base por bloque, no una por sesión.
 */
export const getCourseWithProgress = cache(async (slug: string, userId: string) => {
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!course) return null;

  const [{ data: sessions }, { data: enrollment }] = await Promise.all([
    supabase
      .from("course_sessions")
      .select("*")
      .eq("course_id", course.id)
      .order("number"),
    supabase
      .from("enrollments")
      .select("id, status, progress_pct, enrolled_at, completed_at")
      .eq("course_id", course.id)
      .eq("user_id", userId)
      .maybeSingle(),
  ]);

  let completed = new Set<string>();
  if (enrollment) {
    const { data: progress } = await supabase
      .from("session_progress")
      .select("session_id, completed_at")
      .eq("enrollment_id", enrollment.id);

    completed = new Set(
      (progress ?? []).filter((p) => p.completed_at).map((p) => p.session_id),
    );
  }

  return {
    course,
    enrollment,
    sessions: (sessions ?? []).map((s) => ({
      ...s,
      // El enlace de Meet solo si está inscrito (RLS ya lo filtra, esto es
      // defensa en profundidad para no filtrarlo por accidente en el render).
      meet_url: enrollment ? s.meet_url : null,
      isCompleted: completed.has(s.id),
    })),
  };
});

/** Inscripciones del usuario con datos del curso. */
export const getMyEnrollments = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("enrollments")
    .select(
      "id, status, progress_pct, enrolled_at, completed_at, courses(id, slug, title, subtitle, category, sessions_count, total_hours, cover_url)",
    )
    .eq("user_id", userId)
    .order("enrolled_at", { ascending: false });

  return (data ?? []).map((e) => ({
    ...e,
    course: Array.isArray(e.courses) ? e.courses[0] : e.courses,
  }));
});

/** Próxima sesión en vivo entre todos los cursos del usuario. */
export const getNextSession = cache(async (userId: string) => {
  const supabase = await createClient();

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("course_id, courses(slug, title)")
    .eq("user_id", userId)
    .eq("status", "activo");

  if (!enrollments?.length) return null;

  const courseIds = enrollments.map((e) => e.course_id);
  const { data: session } = await supabase
    .from("course_sessions")
    .select("id, course_id, number, title, subtitle, scheduled_at, meet_url, status")
    .in("course_id", courseIds)
    .gte("scheduled_at", new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString())
    .order("scheduled_at")
    .limit(1)
    .maybeSingle();

  if (!session) return null;

  const enrollment = enrollments.find((e) => e.course_id === session.course_id);
  const course = Array.isArray(enrollment?.courses)
    ? enrollment?.courses[0]
    : enrollment?.courses;

  return { ...session, courseSlug: course?.slug, courseTitle: course?.title };
});
