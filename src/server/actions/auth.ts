"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from "@/lib/validations/auth";
import { siteConfig } from "@/config/site";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { clientIp } from "@/lib/audit";

export interface ActionState {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  message?: string;
}

/* ── Iniciar sesión ───────────────────────────────────────── */

export async function loginAction(
  _prev: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") ?? undefined,
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const ip = await clientIp();
  if (
    !checkRateLimit(
      `login:${ip}:${parsed.data.email}`,
      RATE_LIMITS.login.limit,
      RATE_LIMITS.login.windowMs,
    )
  ) {
    return {
      ok: false,
      error: "Demasiados intentos. Espera 15 minutos antes de volver a intentar.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    // Mensaje genérico: no revelamos si el correo existe (§9.3)
    return { ok: false, error: "Correo o contraseña incorrectos." };
  }

  revalidatePath("/", "layout");
  const next = parsed.data.next;
  redirect(next?.startsWith("/") && !next.startsWith("//") ? next : "/panel");
}

/* ── Crear cuenta ─────────────────────────────────────────── */

export async function signupAction(
  _prev: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const raw = Object.fromEntries(formData.entries());

  const parsed = signupSchema.safeParse({
    ...raw,
    newsletter: formData.get("newsletter") === "on",
    terms: formData.get("terms") === "on",
    interests: formData.getAll("interests"),
    studentsCount: raw.studentsCount ? Number(raw.studentsCount) : undefined,
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  const ip = await clientIp();
  if (
    !checkRateLimit(
      `signup:${ip}:${data.email}`,
      RATE_LIMITS.signup.limit,
      RATE_LIMITS.signup.windowMs,
    )
  ) {
    return {
      ok: false,
      error: "Se alcanzó el límite de registros. Inténtalo nuevamente en una hora.",
    };
  }

  const supabase = await createClient();

  const accountMetadata =
    data.accountType === "estudiante"
      ? {
          phone: data.phone || null,
          current_situation: data.currentSituation,
          university: data.university || null,
          career: data.career || null,
          study_cycle: data.studyCycle || null,
          interests: data.interests,
        }
      : data.accountType === "docente"
        ? {
            phone: data.phone || null,
            institution_name: data.institutionName,
            teaching_level: data.teachingLevel,
            subject: data.subject || null,
            students_count: data.studentsCount ?? null,
          }
        : {
            phone: data.phone || null,
            institution_name: data.institutionName,
            institution_type: data.institutionType,
            ruc: data.ruc || null,
            contact_role: data.contactRole,
            province: data.province || null,
            website: data.website || null,
          };

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${siteConfig.url}/auth/callback?next=/onboarding`,
      // El trigger `handle_new_user` solo acepta los 3 tipos de cuenta
      // con registro abierto: nadie puede autoasignarse `admin` (§9.3).
      data: {
        full_name: data.fullName,
        account_type: data.accountType,
        region: data.region,
        newsletter_opt_in: data.newsletter,
        ...accountMetadata,
      },
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      return {
        ok: false,
        error: "Ya existe una cuenta con ese correo. Inicia sesión o recupera tu contraseña.",
      };
    }
    return { ok: false, error: "No pudimos crear tu cuenta. Inténtalo de nuevo." };
  }

  return {
    ok: true,
    message:
      "¡Cuenta creada! Te enviamos un correo para confirmar tu dirección. Revisa también la carpeta de spam.",
  };
}

/* ── Cerrar sesión ────────────────────────────────────────── */

export async function logoutAction(): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return {
      ok: false,
      error: "No pudimos cerrar tu sesión. Revisa tu conexión e inténtalo nuevamente.",
    };
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

/* ── Recuperar contraseña ─────────────────────────────────── */

export async function forgotPasswordAction(
  _prev: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const email = parsed.data.email;
  const ip = await clientIp();
  if (
    !checkRateLimit(
      `password-reset:${ip}:${email}`,
      RATE_LIMITS.login.limit,
      RATE_LIMITS.login.windowMs,
    )
  ) {
    return {
      ok: false,
      error: "Solicitaste varios enlaces. Espera 15 minutos y vuelve a intentarlo.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteConfig.url.replace(/\/$/, "")}/auth/callback?next=/nueva-contrasena`,
  });

  if (error) {
    console.error("[sep] no se pudo solicitar recuperación de contraseña:", error.message);
  }

  // Respuesta idéntica exista o no la cuenta: evita enumerar usuarios.
  return {
    ok: true,
    message:
      "Si existe una cuenta con ese correo, te enviamos un enlace para restablecer tu contraseña.",
  };
}

/** Cambia la contraseña únicamente dentro de una sesión de recuperación válida. */
export async function resetPasswordAction(
  _prev: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const cookieStore = await cookies();
  if (cookieStore.get("sep_password_recovery")?.value !== "1") {
    return {
      ok: false,
      error: "El enlace venció o ya fue utilizado. Solicita uno nuevo.",
    };
  }

  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      error: "El enlace venció o ya fue utilizado. Solicita uno nuevo.",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return {
      ok: false,
      error: "No pudimos actualizar tu contraseña. Solicita un enlace nuevo e inténtalo otra vez.",
    };
  }

  await supabase.auth.signOut();
  cookieStore.delete("sep_password_recovery");
  revalidatePath("/", "layout");
  redirect("/login?password=updated");
}
