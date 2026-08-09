import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Accede a tu cuenta de la plataforma SEP.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; password?: string; error?: string }>;
}) {
  const { next, password, error } = await searchParams;
  const notice =
    password === "updated"
      ? { tone: "success" as const, text: "Tu contraseña fue actualizada. Ya puedes iniciar sesión." }
      : error
        ? { tone: "error" as const, text: "El enlace de acceso no es válido o ya venció. Inténtalo nuevamente." }
        : undefined;

  return (
    <div>
      <h1 className="font-display text-[2rem] font-semibold text-ink">
        Bienvenid@ de vuelta
      </h1>
      <p className="mt-2 text-[0.9375rem] text-slate-ui">
        Entra a tu panel y continúa donde lo dejaste.
      </p>

      <div className="mt-8">
        <LoginForm next={next} notice={notice} />
      </div>

      <p className="mt-8 text-center text-sm text-slate-ui">
        ¿Aún no tienes cuenta?{" "}
        <Link href="/registro" className="font-medium text-sep-600 hover:underline">
          Crear cuenta gratis
        </Link>
      </p>
    </div>
  );
}
