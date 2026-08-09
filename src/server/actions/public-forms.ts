"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionUser } from "@/lib/auth/session";
import { fail, fromPostgrestError, fromZodError, ok, type ActionResult } from "@/lib/result";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { clientIp } from "@/lib/audit";
import { REGION_OPTIONS } from "@/config/regions";

/* ═══════════════ POSTULACIÓN A VOLUNTARIADO ═══════════════ */

const volunteerSchema = z.object({
  roleSlug: z.string().min(1),
  fullName: z.string().trim().min(3, "Escribe tu nombre completo.").max(120),
  email: z.string().trim().toLowerCase().email("Ese correo no parece válido."),
  phone: z.string().trim().min(6, "Escribe tu WhatsApp.").max(25),
  region: z.enum(REGION_OPTIONS, { message: "Elige tu región." }),
  university: z.string().trim().max(160).optional().or(z.literal("")),
  careerCycle: z.string().trim().max(120).optional().or(z.literal("")),
  motivation: z
    .string()
    .trim()
    .min(30, "Cuéntanos en 2 o 3 oraciones por qué quieres sumarte.")
    .max(1500),
  completedCourses: z.string().trim().max(200).optional().or(z.literal("")),
});

export async function applyVolunteerAction(
  _prev: ActionResult<unknown> | null,
  formData: FormData,
): Promise<ActionResult<string>> {
  const ip = await clientIp();

  if (!checkRateLimit(`volunteer:${ip}`, RATE_LIMITS.publicForm.limit, RATE_LIMITS.publicForm.windowMs)) {
    return fail("Demasiados envíos desde esta conexión. Inténtalo en una hora.");
  }

  const parsed = volunteerSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return fromZodError(parsed.error.flatten().fieldErrors);

  const supabase = createAdminClient();

  const { data: role } = await supabase
    .from("volunteer_roles")
    .select("id, name, is_open")
    .eq("slug", parsed.data.roleSlug)
    .maybeSingle();

  if (!role) return fail("Ese rol de voluntariado no existe.");
  if (!role.is_open) return fail("Las postulaciones para este rol están cerradas por ahora.");

  // Si ya inició sesión, vinculamos la postulación a su cuenta.
  const user = await getSessionUser();

  const { data, error } = await supabase
    .from("volunteer_applications")
    .insert({
      volunteer_role_id: role.id,
      user_id: user?.id ?? null,
      full_name: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      region: parsed.data.region,
      university: parsed.data.university || null,
      career_cycle: parsed.data.careerCycle || null,
      motivation: parsed.data.motivation,
      completed_courses: parsed.data.completedCourses || null,
    })
    .select("id")
    .single();

  if (error) return fromPostgrestError(error);

  revalidatePath("/admin/postulaciones");

  return ok(
    data.id,
    `¡Recibimos tu postulación para ${role.name}! Te respondemos en menos de 48 horas.`,
  );
}

/* ═══════════════ RED DE SPEAKERS ═══════════════ */

const speakerSchema = z.object({
  fullName: z.string().trim().min(3, "Escribe tu nombre y apellido.").max(120),
  email: z.string().trim().toLowerCase().email("Ese correo no parece válido."),
  country: z.string().trim().min(2).max(60),
  region: z.string().trim().min(2, "Escribe tu región o ciudad.").max(120),
  expertise: z.string().trim().min(5, "Describe tu área de expertise.").max(200),
  topics: z.array(z.string()).min(1, "Elige al menos un tema."),
  story: z
    .string()
    .trim()
    .min(40, "Cuéntanos tu historia en 2 o 3 oraciones.")
    .max(1500),
  opportunities: z.string().trim().max(1000).optional().or(z.literal("")),
  talkExperience: z.string().trim().min(1, "Elige una opción."),
  availability: z.string().trim().min(1, "Elige una opción."),
  linkedinUrl: z.string().trim().max(300).optional().or(z.literal("")),
});

export async function registerSpeakerAction(
  _prev: ActionResult<unknown> | null,
  formData: FormData,
): Promise<ActionResult<string>> {
  const ip = await clientIp();

  if (!checkRateLimit(`speaker:${ip}`, RATE_LIMITS.publicForm.limit, RATE_LIMITS.publicForm.windowMs)) {
    return fail("Demasiados envíos desde esta conexión. Inténtalo en una hora.");
  }

  const parsed = speakerSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    topics: formData.getAll("topics"),
  });

  if (!parsed.success) return fromZodError(parsed.error.flatten().fieldErrors);

  const user = await getSessionUser();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("speaker_profiles")
    .insert({
      user_id: user?.id ?? null,
      full_name: parsed.data.fullName,
      email: parsed.data.email,
      country: parsed.data.country,
      region: parsed.data.region,
      expertise: parsed.data.expertise,
      topics: parsed.data.topics,
      story: parsed.data.story,
      opportunities: parsed.data.opportunities || null,
      talk_experience: parsed.data.talkExperience,
      availability: parsed.data.availability,
      linkedin_url: parsed.data.linkedinUrl || null,
    })
    .select("id")
    .single();

  if (error) return fromPostgrestError(error);

  revalidatePath("/admin/postulaciones");

  return ok(
    data.id,
    "¡Gracias! El equipo de SEP revisará tu perfil y te contactará para coordinar tu primera participación.",
  );
}

/* ═══════════════ RED DE COLEGIOS ═══════════════ */

const schoolSchema = z.object({
  schoolName: z.string().trim().min(3, "Escribe el nombre del colegio.").max(160),
  region: z.enum(REGION_OPTIONS, { message: "Elige la región." }),
  province: z.string().trim().max(120).optional().or(z.literal("")),
  directorName: z.string().trim().min(3, "Escribe el nombre del director(a).").max(120),
  contactPhone: z.string().trim().min(6, "Escribe un teléfono de contacto.").max(25),
  contactEmail: z.string().trim().toLowerCase().email("Ese correo no parece válido."),
  students3to5: z.coerce.number().int().min(0).max(10000).optional(),
  expectations: z.string().trim().max(1500).optional().or(z.literal("")),
});

export async function registerSchoolAction(
  _prev: ActionResult<unknown> | null,
  formData: FormData,
): Promise<ActionResult<string>> {
  const ip = await clientIp();

  if (!checkRateLimit(`school:${ip}`, RATE_LIMITS.publicForm.limit, RATE_LIMITS.publicForm.windowMs)) {
    return fail("Demasiados envíos desde esta conexión. Inténtalo en una hora.");
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = schoolSchema.safeParse({
    ...raw,
    students3to5: raw.students3to5 ? Number(raw.students3to5) : undefined,
  });

  if (!parsed.success) return fromZodError(parsed.error.flatten().fieldErrors);

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("school_applications")
    .insert({
      school_name: parsed.data.schoolName,
      region: parsed.data.region,
      province: parsed.data.province || null,
      director_name: parsed.data.directorName,
      contact_phone: parsed.data.contactPhone,
      contact_email: parsed.data.contactEmail,
      students_3to5: parsed.data.students3to5 ?? null,
      expectations: parsed.data.expectations || null,
    })
    .select("id")
    .single();

  if (error) return fromPostgrestError(error);

  revalidatePath("/admin/colegios");

  return ok(
    data.id,
    "¡Solicitud enviada! El equipo de alianzas de SEP te contactará en menos de 72 horas para coordinar el primer taller.",
  );
}

/* ═══════════════ DIAGNÓSTICO PÚBLICO ═══════════════ */

const diagnosticSchema = z.object({
  email: z.string().trim().toLowerCase().email("Escribe un correo válido."),
  profile: z.enum(["universitario", "docente", "empresa"]),
  region: z.string().trim().max(120).optional().nullable(),
  answers: z
    .array(
      z.object({
        number: z.number().int().min(1).max(20),
        answer: z.union([z.string(), z.array(z.string()), z.number()]),
      }),
    )
    .min(1, "No recibimos respuestas."),
});

export async function submitDiagnosticAction(input: {
  email: string;
  profile: "universitario" | "docente" | "empresa";
  region?: string | null;
  answers: { number: number; answer: string | string[] | number }[];
}): Promise<ActionResult<string>> {
  const ip = await clientIp();

  if (
    !checkRateLimit(
      `diagnostic:${ip}`,
      RATE_LIMITS.diagnostic.limit,
      RATE_LIMITS.diagnostic.windowMs,
    )
  ) {
    return fail("Ya recibimos tus respuestas. ¡Gracias por participar!");
  }

  const parsed = diagnosticSchema.safeParse(input);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Revisa tus respuestas.");
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("submit_diagnostic", {
    p_email: parsed.data.email,
    p_profile: parsed.data.profile,
    p_region: parsed.data.region ?? null,
    p_answers: parsed.data.answers as never,
    p_utm: null,
  });

  if (error) return fromPostgrestError(error);

  // El diagnóstico también suma al newsletter, con consentimiento implícito
  // en el copy del formulario («te avisamos del piloto»).
  const { error: newsletterError } = await supabase
    .from("newsletter_subscribers")
    .upsert(
      {
        email: parsed.data.email,
        region: parsed.data.region ?? null,
        source: "diagnostico",
      },
      { onConflict: "email", ignoreDuplicates: true },
    );

  if (newsletterError) {
    console.error("[sep] no se pudo sincronizar el newsletter:", newsletterError.message);
  }

  return ok(data as string);
}

/* ═══════════════ DONACIONES ═══════════════ */

const donationSchema = z.object({
  amountCents: z.coerce.number().int().min(500, "El monto mínimo es S/ 5.").max(5000000),
  donorName: z.string().trim().max(120).optional().or(z.literal("")),
  donorEmail: z.string().trim().toLowerCase().email("Escribe un correo válido."),
  cause: z.string().trim().max(120).optional().or(z.literal("")),
  isRecurring: z.boolean().default(false),
  isAnonymous: z.boolean().default(false),
});

export async function createDonationAction(
  _prev: ActionResult<unknown> | null,
  formData: FormData,
): Promise<ActionResult<string>> {
  const ip = await clientIp();

  if (!checkRateLimit(`donation:${ip}`, 10, 60 * 60 * 1000)) {
    return fail("Demasiados intentos. Espera unos minutos.");
  }

  const parsed = donationSchema.safeParse({
    amountCents: formData.get("amountCents"),
    donorName: formData.get("donorName") ?? "",
    donorEmail: formData.get("donorEmail"),
    cause: formData.get("cause") ?? "",
    isRecurring: formData.get("isRecurring") === "on",
    isAnonymous: formData.get("isAnonymous") === "on",
  });

  if (!parsed.success) return fromZodError(parsed.error.flatten().fieldErrors);

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("donations")
    .insert({
      donor_name: parsed.data.isAnonymous ? null : parsed.data.donorName || null,
      donor_email: parsed.data.donorEmail,
      amount_cents: parsed.data.amountCents,
      is_recurring: parsed.data.isRecurring,
      cause: parsed.data.cause || null,
      method: "yape",
      status: "pendiente",
      is_anonymous: parsed.data.isAnonymous,
    })
    .select("id")
    .single();

  if (error) return fromPostgrestError(error);

  return ok(
    data.id,
    "¡Gracias! Te enviamos por correo los datos para completar tu donación por Yape o transferencia.",
  );
}
