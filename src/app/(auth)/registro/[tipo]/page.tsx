import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ROLE_META, SIGNUP_ROLES, type SignupRole } from "@/types/roles";
import { SignupForm } from "./signup-form";

export function generateStaticParams() {
  return SIGNUP_ROLES.map((tipo) => ({ tipo }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tipo: string }>;
}): Promise<Metadata> {
  const { tipo } = await params;
  if (!SIGNUP_ROLES.includes(tipo as SignupRole)) return { title: "Crear cuenta" };
  return {
    title: `Crear cuenta — ${ROLE_META[tipo as SignupRole].label}`,
    description: ROLE_META[tipo as SignupRole].description,
  };
}

export default async function SignupTypePage({
  params,
}: {
  params: Promise<{ tipo: string }>;
}) {
  const { tipo } = await params;
  if (!SIGNUP_ROLES.includes(tipo as SignupRole)) notFound();

  const role = tipo as SignupRole;
  const meta = ROLE_META[role];

  return (
    <div>
      <Link
        href="/registro"
        className="inline-flex items-center gap-1.5 text-sm text-slate-ui transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        Cambiar tipo de cuenta
      </Link>

      <h1 className="mt-5 font-display text-[1.75rem] font-semibold text-ink">
        Cuenta de {meta.shortLabel.toLowerCase()}
      </h1>
      <p className="mt-2 text-[0.9375rem] text-slate-ui">{meta.description}</p>

      <div className="mt-7">
        <SignupForm role={role} />
      </div>

      <p className="mt-8 text-center text-sm text-slate-ui">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-medium text-sep-600 hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
}
