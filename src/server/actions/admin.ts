"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import { fail, fromPostgrestError, ok, type ActionResult } from "@/lib/result";
import { audit } from "@/lib/audit";
import { USER_ROLES, type UserRole } from "@/types/roles";

/* ═══════════════ ROLES ═══════════════ */

const roleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(USER_ROLES),
});

export async function grantRoleAction(
  userId: string,
  role: UserRole,
): Promise<ActionResult<void>> {
  const admin = await requireRole(["admin", "super_admin"]);

  const parsed = roleSchema.safeParse({ userId, role });
  if (!parsed.success) return fail("Datos no válidos.");

  const supabase = await createClient();
  const { error } = await supabase.rpc("grant_role", {
    p_user_id: userId,
    p_role: role,
  });

  if (error) return fromPostgrestError(error);

  await audit({
    actorId: admin.id,
    action: "GRANT_ROLE",
    entity: "user_roles",
    entityId: userId,
    after: { role },
  });

  revalidatePath("/admin/usuarios");
  return ok(undefined, `Rol «${role}» otorgado.`);
}

export async function revokeRoleAction(
  userId: string,
  role: UserRole,
): Promise<ActionResult<void>> {
  const admin = await requireRole(["admin", "super_admin"]);

  const parsed = roleSchema.safeParse({ userId, role });
  if (!parsed.success) return fail("Datos no válidos.");

  const supabase = await createClient();
  const { error } = await supabase.rpc("revoke_role", {
    p_user_id: userId,
    p_role: role,
  });

  if (error) return fromPostgrestError(error);

  await audit({
    actorId: admin.id,
    action: "REVOKE_ROLE",
    entity: "user_roles",
    entityId: userId,
    after: { role },
  });

  revalidatePath("/admin/usuarios");
  return ok(undefined, `Rol «${role}» revocado.`);
}

/* ═══════════════ POSTULACIONES DE VOLUNTARIADO ═══════════════ */

export async function approveVolunteerAction(
  applicationId: string,
): Promise<ActionResult<string>> {
  await requireRole(["admin", "super_admin"]);

  if (!z.string().uuid().safeParse(applicationId).success) {
    return fail("Postulación no válida.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("approve_volunteer_application", {
    p_application_id: applicationId,
  });

  if (error) return fromPostgrestError(error);

  revalidatePath("/admin/postulaciones");
  revalidatePath("/admin");

  return ok(
    data as string,
    "Postulación aprobada. Ya tiene rol de mentor y acceso a su panel.",
  );
}

const APPLICATION_STATES = [
  "recibida",
  "en_revision",
  "entrevista",
  "aprobada",
  "rechazada",
] as const;

export async function updateApplicationStatusAction(
  applicationId: string,
  status: (typeof APPLICATION_STATES)[number],
  notes?: string,
): Promise<ActionResult<void>> {
  const admin = await requireRole(["admin", "super_admin"]);

  if (!z.string().uuid().safeParse(applicationId).success) {
    return fail("Postulación no válida.");
  }
  if (!APPLICATION_STATES.includes(status)) return fail("Estado no válido.");

  // Aprobar tiene efectos secundarios (otorga rol): pasa por el RPC.
  if (status === "aprobada") {
    const result = await approveVolunteerAction(applicationId);
    return result.ok ? ok(undefined, result.message) : result;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("volunteer_applications")
    .update({ status, reviewer_notes: notes ?? null, reviewed_by: admin.id })
    .eq("id", applicationId)
    .select("id")
    .maybeSingle();

  if (error) return fromPostgrestError(error);
  if (!data) return fail("No encontramos esa postulación.");

  revalidatePath("/admin/postulaciones");
  return ok(undefined, "Estado actualizado.");
}

/* ═══════════════ SOLICITUDES DE COLEGIOS ═══════════════ */

export async function updateSchoolApplicationAction(
  applicationId: string,
  status: (typeof APPLICATION_STATES)[number],
): Promise<ActionResult<void>> {
  const admin = await requireRole(["admin", "super_admin"]);
  if (!z.string().uuid().safeParse(applicationId).success) {
    return fail("Solicitud no válida.");
  }
  if (!APPLICATION_STATES.includes(status)) return fail("Estado no válido.");

  const supabase = await createClient();
  const { error } = await supabase.rpc("review_school_application", {
    p_application_id: applicationId,
    p_status: status,
  });

  if (error) return fromPostgrestError(error);

  await audit({
    actorId: admin.id,
    action: "SCHOOL_APPLICATION_" + status.toUpperCase(),
    entity: "school_applications",
    entityId: applicationId,
  });

  revalidatePath("/admin/colegios");
  return ok(
    undefined,
    status === "aprobada"
      ? "Colegio incorporado a la red SEP."
      : "Estado actualizado.",
  );
}

/* ═══════════════ SPEAKERS ═══════════════ */

export async function approveSpeakerAction(
  speakerId: string,
  approve: boolean,
): Promise<ActionResult<void>> {
  const admin = await requireRole(["admin", "super_admin"]);
  if (!z.string().uuid().safeParse(speakerId).success) {
    return fail("Perfil de speaker no válido.");
  }

  const supabase = await createClient();

  const { error } = await supabase.rpc("review_speaker_profile", {
    p_speaker_id: speakerId,
    p_approve: approve,
  });

  if (error) return fromPostgrestError(error);

  await audit({
    actorId: admin.id,
    action: approve ? "SPEAKER_APPROVED" : "SPEAKER_REJECTED",
    entity: "speaker_profiles",
    entityId: speakerId,
  });

  revalidatePath("/admin/postulaciones");
  revalidatePath("/speakers");

  return ok(
    undefined,
    approve ? "Speaker aprobado y publicado en la red." : "Speaker despublicado.",
  );
}

/* ═══════════════ HORAS DE VOLUNTARIADO ═══════════════ */

export async function approveHoursAction(
  hoursId: string,
): Promise<ActionResult<void>> {
  const admin = await requireRole(["admin", "super_admin"]);
  if (!z.string().uuid().safeParse(hoursId).success) {
    return fail("Registro de horas no válido.");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("volunteer_hours")
    .update({ approved_by: admin.id, approved_at: new Date().toISOString() })
    .eq("id", hoursId)
    .select("id")
    .maybeSingle();

  if (error) return fromPostgrestError(error);
  if (!data) return fail("No encontramos ese registro de horas.");

  revalidatePath("/admin/postulaciones");
  return ok(undefined, "Horas aprobadas.");
}

/* ═══════════════ CERTIFICADOS ═══════════════ */

export async function revokeCertificateAction(
  certificateId: string,
  reason: string,
): Promise<ActionResult<void>> {
  const admin = await requireRole(["admin", "super_admin"]);

  if (!z.string().uuid().safeParse(certificateId).success) {
    return fail("Certificado no válido.");
  }

  if (reason.trim().length < 10) {
    return fail("Explica en al menos 10 caracteres por qué revocas el certificado.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("certificates")
    .update({
      status: "revocado",
      revoked_at: new Date().toISOString(),
      revoked_reason: reason,
    })
    .eq("id", certificateId)
    .select("id")
    .maybeSingle();

  if (error) return fromPostgrestError(error);
  if (!data) return fail("No encontramos ese certificado.");

  await audit({
    actorId: admin.id,
    action: "REVOKE_CERTIFICATE",
    entity: "certificates",
    entityId: certificateId,
    after: { reason },
  });

  revalidatePath("/admin/certificados");
  return ok(undefined, "Certificado revocado. La verificación pública ya lo refleja.");
}
