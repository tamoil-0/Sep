import type { Metadata } from "next";
import Link from "next/link";
import { ForgotForm } from "./forgot-form";

export const metadata: Metadata = {
  title: "Recuperar contraseña",
  robots: { index: false, follow: false },
};

export default function RecuperarPage() {
  return (
    <div>
      <h1 className="font-display text-[2rem] font-semibold text-ink">
        ¿Olvidaste tu contraseña?
      </h1>
      <p className="mt-2 text-[0.9375rem] text-slate-ui">
        Escribe tu correo y te enviamos un enlace para crear una nueva.
      </p>

      <div className="mt-8">
        <ForgotForm />
      </div>

      <p className="mt-8 text-center text-sm text-slate-ui">
        <Link href="/login" className="font-medium text-sep-600 hover:underline">
          Volver a iniciar sesión
        </Link>
      </p>
    </div>
  );
}
