"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, signupSchema } from "@/lib/validations/auth";
import { siteConfig } from "@/config/site";

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
  redirect(parsed.data.next?.startsWith("/") ? parsed.data.next : "/panel");
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
  const supabase = await createClient();

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

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

/* ── Recuperar contraseña ─────────────────────────────────── */

export async function forgotPasswordAction(
  _prev: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email.includes("@")) {
    return { ok: false, error: "Escribe un correo válido." };
  }

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteConfig.url}/nueva-contrasena`,
  });

  // Respuesta idéntica exista o no la cuenta: evita enumerar usuarios.
  return {
    ok: true,
    message:
      "Si existe una cuenta con ese correo, te enviamos un enlace para restablecer tu contraseña.",
  };
}
