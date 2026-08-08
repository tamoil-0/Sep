import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Cliente con service-role: **SALTA RLS POR COMPLETO**.
 *
 * Plan Maestro §9.3 — reglas innegociables:
 *   1. Este archivo nunca se importa desde un componente `"use client"`.
 *      El `import "server-only"` de arriba lo garantiza en tiempo de build.
 *   2. `SUPABASE_SERVICE_ROLE_KEY` jamás lleva el prefijo `NEXT_PUBLIC_`.
 *   3. Se usa solo para: emitir certificados, conciliar pagos, gestionar roles,
 *      procesar webhooks y jobs del worker.
 *   4. Toda operación con este cliente se registra en `audit_log`.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY no está configurada. Este cliente solo puede usarse en el servidor.",
    );
  }

  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
