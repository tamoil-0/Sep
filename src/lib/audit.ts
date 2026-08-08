import "server-only";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Registro de auditoría desde la aplicación.
 *
 * Las operaciones críticas (roles, pagos, certificados) ya se auditan dentro
 * de sus funciones RPC. Este helper cubre lo que ocurre solo en la app:
 * inicios de sesión, cambios de configuración, exportaciones de datos.
 *
 * Nunca lanza: un fallo al auditar no debe tumbar la operación de negocio.
 */
export async function audit(entry: {
  actorId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  before?: unknown;
  after?: unknown;
}): Promise<void> {
  try {
    const h = await headers();
    const forwarded = h.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() ?? null;

    const supabase = createAdminClient();
    await supabase.from("audit_log").insert({
      actor_id: entry.actorId ?? null,
      action: entry.action,
      entity: entry.entity,
      entity_id: entry.entityId ?? null,
      before_data: (entry.before ?? null) as never,
      after_data: (entry.after ?? null) as never,
      ip,
      user_agent: h.get("user-agent"),
    });
  } catch (error) {
    console.error("[sep] no se pudo registrar la auditoría:", error);
  }
}

/** IP del cliente, para rate limiting. */
export async function clientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "unknown"
  );
}
