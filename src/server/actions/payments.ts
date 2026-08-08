"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireUser, requireRole } from "@/lib/auth/session";
import { fail, fromPostgrestError, ok, type ActionResult } from "@/lib/result";
import { isValidOperationCode } from "@/lib/payments/yape";
import { checkRateLimit } from "@/lib/rate-limit";
import { audit } from "@/lib/audit";

/* ═══════════════════════════════════════════════════════════
   CREAR ORDEN
   El monto lo pone la base de datos, nunca el cliente (§9.3).
   ═══════════════════════════════════════════════════════════ */

const createOrderSchema = z.object({
  itemType: z.enum(["certificate", "membership", "silp"]),
  itemId: z.string().uuid("Producto no válido."),
  refId: z.string().uuid().optional().nullable(),
});

export async function createOrderAction(input: {
  itemType: "certificate" | "membership" | "silp";
  itemId: string;
  refId?: string | null;
}): Promise<ActionResult<string>> {
  const user = await requireUser();

  if (!checkRateLimit(`order:${user.id}`, 15, 60 * 60 * 1000)) {
    return fail("Demasiadas órdenes seguidas. Espera un momento.");
  }

  const parsed = createOrderSchema.safeParse(input);
  if (!parsed.success) return fail("Producto no válido.");

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_order", {
    p_item_type: parsed.data.itemType,
    p_item_id: parsed.data.itemId,
    p_ref_id: parsed.data.refId ?? undefined,
  });

  if (error) return fromPostgrestError(error);

  return ok(data as string);
}

/* ═══════════════════════════════════════════════════════════
   SUBIR VOUCHER DE YAPE / PLIN
   ═══════════════════════════════════════════════════════════ */

const VOUCHER_MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const VOUCHER_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export async function submitVoucherAction(
  _prev: ActionResult<unknown> | null,
  formData: FormData,
): Promise<ActionResult<string>> {
  const user = await requireUser();

  if (!checkRateLimit(`voucher:${user.id}`, 8, 60 * 60 * 1000)) {
    return fail("Demasiados intentos. Espera unos minutos.");
  }

  const orderId = String(formData.get("orderId") ?? "");
  const method = String(formData.get("method") ?? "yape");
  const operationCode = String(formData.get("operationCode") ?? "").trim();
  const file = formData.get("voucher");

  if (!z.string().uuid().safeParse(orderId).success) {
    return fail("Orden no válida.");
  }

  if (!["yape", "plin", "transferencia"].includes(method)) {
    return fail("Método de pago no válido.");
  }

  if (!isValidOperationCode(operationCode)) {
    return fail(
      "El código de operación no tiene el formato correcto. Cópialo tal cual aparece en tu app.",
      undefined,
      { operationCode: ["Entre 6 y 20 caracteres, solo letras y números."] },
    );
  }

  if (!(file instanceof File) || file.size === 0) {
    return fail("Adjunta la captura de tu operación.", undefined, {
      voucher: ["Falta el comprobante."],
    });
  }

  if (file.size > VOUCHER_MAX_BYTES) {
    return fail("La imagen pesa más de 5 MB. Comprímela o toma otra captura.");
  }

  if (!VOUCHER_TYPES.includes(file.type)) {
    return fail("Sube una imagen (JPG, PNG o WebP) o un PDF.");
  }

  const supabase = await createClient();

  // Ruta: vouchers/{user_id}/{order_id}-{timestamp}.ext
  // El primer segmento es el user_id porque la política de Storage lo exige.
  const ext = file.name.split(".").pop()?.toLowerCase().slice(0, 5) || "jpg";
  const path = `${user.id}/${orderId}-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("vouchers")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    console.error("[sep] fallo al subir voucher:", uploadError.message);
    return fail("No pudimos subir tu comprobante. Inténtalo de nuevo.");
  }

  const { data, error } = await supabase.rpc("submit_payment_voucher", {
    p_order_id: orderId,
    p_method: method as "yape" | "plin" | "transferencia",
    p_voucher_url: path,
    p_operation_code: operationCode,
  });

  if (error) {
    // Rollback del archivo: no dejamos huérfanos en Storage.
    await supabase.storage.from("vouchers").remove([path]);
    return fromPostgrestError(error);
  }

  revalidatePath("/estudiante/certificados");
  revalidatePath(`/pagar/${orderId}`);

  return ok(
    data as string,
    "Recibimos tu comprobante. El equipo de SEP lo valida en menos de 24 horas y te avisamos por correo.",
  );
}

/* ═══════════════════════════════════════════════════════════
   CONCILIACIÓN (ADMIN)
   ═══════════════════════════════════════════════════════════ */

export async function reviewPaymentAction(
  paymentId: string,
  approve: boolean,
  reason?: string,
): Promise<ActionResult<{ approved: boolean }>> {
  const admin = await requireRole(["admin", "super_admin"]);

  if (!z.string().uuid().safeParse(paymentId).success) {
    return fail("Pago no válido.");
  }

  if (!approve && (!reason || reason.trim().length < 10)) {
    return fail("Explica en al menos 10 caracteres por qué rechazas el pago.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("review_payment", {
    p_payment_id: paymentId,
    p_approve: approve,
    p_reason: reason ?? undefined,
  });

  if (error) return fromPostgrestError(error);

  await audit({
    actorId: admin.id,
    action: approve ? "PAYMENT_APPROVED" : "PAYMENT_REJECTED",
    entity: "payments",
    entityId: paymentId,
    after: { approve, reason },
  });

  revalidatePath("/admin/pagos");
  revalidatePath("/admin");

  return ok(
    data as { approved: boolean },
    approve
      ? "Pago aprobado. El certificado fue emitido y el estudiante ya recibió su notificación."
      : "Pago rechazado. Le avisamos al estudiante con el motivo.",
  );
}

/** URL firmada y temporal del voucher, para que el admin lo revise. */
export async function getVoucherUrlAction(
  path: string,
): Promise<ActionResult<string>> {
  await requireRole(["admin", "super_admin"]);

  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("vouchers")
    .createSignedUrl(path, 300); // 5 minutos

  if (error || !data) return fail("No pudimos abrir el comprobante.");
  return ok(data.signedUrl);
}
