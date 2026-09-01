import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { assertQueryResults } from "@/lib/supabase/query";

/** Certificados del usuario, con su tipo y el curso al que pertenecen. */
export const getMyCertificates = cache(async (userId: string) => {
  const supabase = await createClient();
  const result = await supabase
    .from("certificates")
    .select(
      "id, verification_code, status, issued_at, pdf_url, revoked_at, certificate_types(name, issuer, price_cents, kind), enrollments(courses(title, slug))",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  assertQueryResults("cuenta:certificados", result);
  const data = result.data;

  return (data ?? []).map((c) => {
    const rawType = Array.isArray(c.certificate_types)
      ? c.certificate_types[0]
      : c.certificate_types;
    const type =
      rawType?.kind === "internacional"
        ? { ...rawType, name: "CERTIFICADO INTERNACIONAL", issuer: "" }
        : rawType;
    const enr = Array.isArray(c.enrollments) ? c.enrollments[0] : c.enrollments;
    const course = enr && (Array.isArray(enr.courses) ? enr.courses[0] : enr.courses);

    return { ...c, type, courseTitle: course?.title ?? null, courseSlug: course?.slug ?? null };
  });
});

export const getCertificateTypes = cache(async () => {
  const supabase = await createClient();
  const result = await supabase
    .from("certificate_types")
    .select("*")
    .eq("is_active", true)
    .eq("kind", "sep")
    .order("price_cents");
  assertQueryResults("cuenta:tipos-certificado", result);
  return result.data ?? [];
});

/** Orden con su pago más reciente — para la página de checkout. */
export const getOrderForCheckout = cache(async (orderId: string, userId: string) => {
  const supabase = await createClient();

  const orderResult = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", userId)
    .maybeSingle();
  assertQueryResults("pago:orden", orderResult);
  const order = orderResult.data;

  if (!order) return null;

  const paymentResult = await supabase
    .from("payments")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  assertQueryResults("pago:estado", paymentResult);
  const payment = paymentResult.data;

  // Nombre legible de lo que se está comprando.
  let itemName = "Producto SEP";
  let itemDetail: string | null = null;

  if (order.item_type === "certificate" && order.item_id) {
    const result = await supabase
      .from("certificate_types")
      .select("name, issuer, kind")
      .eq("id", order.item_id)
      .maybeSingle();
    assertQueryResults("pago:certificado", result);
    const data = result.data;
    itemName = data?.kind === "internacional" ? "CERTIFICADO INTERNACIONAL" : (data?.name ?? itemName);
    itemDetail = data?.kind === "internacional" ? null : (data?.issuer ?? null);
  } else if (order.item_type === "membership" && order.item_id) {
    const result = await supabase
      .from("membership_plans")
      .select("name, duration_months")
      .eq("id", order.item_id)
      .maybeSingle();
    assertQueryResults("pago:membresia", result);
    const data = result.data;
    itemName = data ? `Membresía ${data.name}` : itemName;
    itemDetail = data ? `${data.duration_months} meses` : null;
  } else if (order.item_type === "silp" && order.item_id) {
    const result = await supabase
      .from("courses")
      .select("title")
      .eq("id", order.item_id)
      .maybeSingle();
    assertQueryResults("pago:programa", result);
    const data = result.data;
    itemName = data?.title ?? itemName;
    itemDetail = "Programa de 6 semanas";
  }

  return { order, payment, itemName, itemDetail };
});

/** Membresía activa del usuario. */
export const getActiveMembership = cache(async (userId: string) => {
  const supabase = await createClient();
  const result = await supabase
    .from("memberships")
    .select("id, status, starts_at, ends_at, membership_plans(slug, name, duration_months, price_cents, benefits)")
    .eq("user_id", userId)
    .eq("status", "activa")
    .gte("ends_at", new Date().toISOString())
    .order("ends_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  assertQueryResults("cuenta:membresia", result);
  const data = result.data;

  if (!data) return null;

  const plan = Array.isArray(data.membership_plans)
    ? data.membership_plans[0]
    : data.membership_plans;

  return { ...data, plan };
});

export const getMembershipPlans = cache(async () => {
  const supabase = await createClient();
  const result = await supabase
    .from("membership_plans")
    .select("*")
    .eq("is_active", true)
    .order("order_index");
  assertQueryResults("cuenta:planes", result);
  return result.data ?? [];
});

/** Cola de conciliación para el panel de admin. */
export const getPaymentsToReview = cache(async () => {
  const supabase = await createClient();
  const result = await supabase
    .from("payments")
    .select(
      "id, method, amount_cents, status, operation_code, voucher_url, created_at, paid_at, reject_reason, orders(id, item_type, user_id, profiles(full_name, email, region))",
    )
    .order("created_at", { ascending: false })
    .limit(100);
  assertQueryResults("admin:pagos", result);
  const data = result.data;

  return (data ?? []).map((p) => {
    const order = Array.isArray(p.orders) ? p.orders[0] : p.orders;
    const profile =
      order && (Array.isArray(order.profiles) ? order.profiles[0] : order.profiles);
    return { ...p, order, buyer: profile };
  });
});
