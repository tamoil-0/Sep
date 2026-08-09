import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Crear nueva contraseña",
  robots: { index: false, follow: false },
};

export default async function NuevaContrasenaPage() {
  const cookieStore = await cookies();
  if (cookieStore.get("sep_password_recovery")?.value !== "1") {
    redirect("/recuperar?error=invalid_link");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/recuperar?error=invalid_link");

  return (
    <div>
      <h1 className="font-display text-[2rem] font-semibold text-ink">
        Crea una contraseña nueva
      </h1>
      <p className="mt-2 text-[0.9375rem] text-slate-ui">
        Usa al menos 10 caracteres. Al guardarla cerraremos esta sesión de recuperación
        para proteger tu cuenta.
      </p>

      <div className="mt-8">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
