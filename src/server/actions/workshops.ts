"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import { fail, fromPostgrestError, fromZodError, ok, type ActionResult } from "@/lib/result";
import { checkRateLimit } from "@/lib/rate-limit";

const schema = z.object({
  institutionId: z.string().uuid("Institución no válida."),
  topic: z.string().trim().min(3, "Elige un tema."),
  grade: z.string().trim().min(3, "Elige el grado."),
  studentsCount: z.coerce
    .number()
    .int()
    .min(5, "Mínimo 5 estudiantes.")
    .max(500, "Máximo 500 estudiantes."),
  preferredDate: z.string().optional().or(z.literal("")),
  modality: z.enum(["presencial", "virtual"]),
  notes: z.string().trim().max(800).optional().or(z.literal("")),
});

/**
 * Solicitud de taller para un aula.
 *
 * La política RLS `workshops_insert_institution_or_teacher` exige que quien
 * inserta sea el propio solicitante y tenga rol de docente o institución, así
 * que aunque alguien llame directo a la API no puede pedir talleres a nombre
 * de otro colegio.
 */
export async function requestWorkshopAction(
  _prev: ActionResult<unknown> | null,
  formData: FormData,
): Promise<ActionResult<string>> {
  const user = await requireRole(["docente", "institucion", "admin", "super_admin"]);

  if (!checkRateLimit(`workshop:${user.id}`, 6, 24 * 60 * 60 * 1000)) {
    return fail("Ya enviaste varias solicitudes hoy. Escríbenos si es urgente.");
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return fromZodError(parsed.error.flatten().fieldErrors);

  const d = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("workshops")
    .insert({
      institution_id: d.institutionId,
      title: `${d.topic} — ${d.grade}`,
      topic: d.topic,
      grade: d.grade,
      students_count: d.studentsCount,
      modality: d.modality,
      scheduled_at: d.preferredDate ? new Date(d.preferredDate).toISOString() : null,
      status: "solicitado",
      requested_by: user.id,
    })
    .select("id")
    .single();

  if (error) return fromPostgrestError(error);

  revalidatePath("/docente/talleres");
  revalidatePath("/docente/mi-colegio");
  revalidatePath("/institucion/talleres");
  revalidatePath("/admin/colegios");

  return ok(
    data.id,
    "¡Solicitud enviada! El equipo de SEP te contactará en menos de 72 horas para coordinar la fecha y asignar facilitadores.",
  );
}
