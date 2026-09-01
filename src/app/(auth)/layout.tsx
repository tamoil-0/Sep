import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Award, Globe, Sprout, Users } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ContextualHelp } from "@/components/ui/contextual-help";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

const highlights = [
  { icon: Sprout, text: "Cursos virtuales de acceso gratuito" },
  { icon: Globe, text: "Presencia en 10+ regiones del Perú" },
  { icon: Award, text: "Certificado SEP con verificación pública" },
  { icon: Users, text: "Comunidad de 75+ jóvenes formados" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh bg-white lg:grid-cols-[minmax(340px,0.78fr)_minmax(520px,1.22fr)]">
      {/* Panel de marca */}
      <aside className="relative hidden min-h-dvh overflow-hidden bg-sep-950 lg:sticky lg:top-0 lg:flex lg:max-h-dvh lg:flex-col lg:justify-between lg:p-10 xl:p-12">
        <Link href="/" className="relative">
          <Logo className="h-14" variant="white" />
        </Link>

        <div className="relative">
          <h2 className="max-w-sm font-display text-h2 font-semibold leading-[1.15] text-white">
            El talento está en regiones.
            <br />
            <span className="text-gold-500">Aquí empieza tu camino.</span>
          </h2>

          <ul className="mt-7 space-y-3">
            {highlights.map((h) => (
              <li key={h.text} className="flex items-center gap-3 text-white/80">
                <h.icon className="size-4 shrink-0 text-gold-500" />
                <span className="text-body-sm">{h.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/45">
          Organización juvenil reconocida por SENAJU · Desde Áncash, 2024
        </p>
      </aside>

      {/* Formulario */}
      <main id="contenido" className="flex min-h-dvh min-w-0 flex-col px-4 py-5 sm:px-8 sm:py-7 lg:px-10 xl:px-16">
        <div className="mx-auto flex w-full max-w-xl items-center justify-between">
          <Link href="/" className="lg:hidden">
            <Logo className="h-9" />
          </Link>
          <Link
            href="/"
            className="ml-auto inline-flex items-center gap-1.5 text-sm text-slate-ui transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-4" />
            Volver al inicio
          </Link>
        </div>

        <div className="flex flex-1 items-start justify-center pb-8 pt-10 sm:pt-14 lg:items-center lg:py-8">
          <div className="w-full max-w-[440px]">
            {children}
            <ContextualHelp
              className="mt-6 border-0 bg-transparent px-0 py-2 shadow-none"
              description="Si el correo no llega o no puedes continuar, escríbenos indicando el paso en el que estás."
            />
          </div>
        </div>
      </main>
    </div>
  );
}
