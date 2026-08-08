import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/** Certificados del usuario, con su tipo y el curso al que pertenecen. */
export const getMyCertificates = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("certificates")
    .select(
      "id, verification_code, status, issued_at, pdf_url, revoked_at, certificate_types(name, issuer, price_cents, kind), enrollments(courses(title, slug))",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (data ?? []).map((c) => {
    const type = Array.isArray(c.certificate_types)
      ? c.certificate_types[0]
      : c.certificate_types;
    const enr = Array.isArray(c.enrollments) ? c.enrollments[0] : c.enrollments;
    const course = enr && (Array.isArray(enr.courses) ? enr.courses[0] : enr.courses);

    return { ...c, type, courseTitle: course?.title ?? null, courseSlug: course?.slug ?? null };
  });
});

export const getCertificateTypes = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("certificate_types")
    .select("*")
    .eq("is_active", true)
    .in("kind", ["sep", "internacional"])
    .order("price_cents");

  return data ?? [];
});

/** Orden con su pago más reciente — para la página de checkout. */
export const getOrderForCheckout = cache(async (orderId: string, userId: string) => {
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!order) return null;

  const { data: payment } = await supabase
    .from("payments")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Nombre legible de lo que se está comprando.
  let itemName = "Producto SEP";
  let itemDetail: string | null = null;

  if (order.item_type === "certificate" && order.item_id) {
    const { data } = await supabase
      .from("certificate_types")
      .select("name, issuer")
      .eq("id", order.item_id)
      .maybeSingle();
    itemName = data?.name ?? itemName;
    itemDetail = data?.issuer ?? null;
  } else if (order.item_type === "membership" && order.item_id) {
    const { data } = await supabase
      .from("membership_plans")
      .select("name, duration_months")
      .eq("id", order.item_id)
      .maybeSingle();
    itemName = data ? `Membresía ${data.name}` : itemName;
    itemDetail = data ? `${data.duration_months} meses` : null;
  } else if (order.item_type === "silp" && order.item_id) {
    const { data } = await supabase
      .from("courses")
      .select("title")
      .eq("id", order.item_id)
      .maybeSingle();
    itemName = data?.title ?? itemName;
    itemDetail = "Programa de 6 semanas";
  }

  return { order, payment, itemName, itemDetail };
});

/** Membresía activa del usuario. */
export const getActiveMembership = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("memberships")
    .select("id, status, starts_at, ends_at, membership_plans(slug, name, duration_months, price_cents, benefits)")
    .eq("user_id", userId)
    .eq("status", "activa")
    .gte("ends_at", new Date().toISOString())
    .order("ends_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;

  const plan = Array.isArray(data.membership_plans)
    ? data.membership_plans[0]
    : data.membership_plans;

  return { ...data, plan };
});

export const getMembershipPlans = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("membership_plans")
    .select("*")
    .eq("is_active", true)
    .order("order_index");

  return data ?? [];
});

/** Cola de conciliación para el panel de admin. */
export const getPaymentsToReview = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("payments")
    .select(
      "id, method, amount_cents, status, operation_code, voucher_url, created_at, paid_at, reject_reason, orders(id, item_type, user_id, profiles(full_name, email, region))",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  return (data ?? []).map((p) => {
    const order = Array.isArray(p.orders) ? p.orders[0] : p.orders;
    const profile =
      order && (Array.isArray(order.profiles) ? order.profiles[0] : order.profiles);
    return { ...p, order, buyer: profile };
  });
});
