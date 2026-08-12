import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Award, Globe, Sprout, Users } from "lucide-react";
import { Logo } from "@/components/brand/logo";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

const highlights = [
  { icon: Sprout, text: "Cursos virtuales de acceso gratuito" },
  { icon: Globe, text: "Presencia en 10+ regiones del Perú" },
  { icon: Award, text: "Certificación nacional e internacional" },
  { icon: Users, text: "Comunidad de 75+ jóvenes formados" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh bg-white lg:grid-cols-[minmax(360px,0.9fr)_minmax(520px,1.1fr)]">
      {/* Panel de marca */}
      <aside className="relative hidden min-h-dvh overflow-hidden sep-gradient lg:sticky lg:top-0 lg:flex lg:max-h-dvh lg:flex-col lg:justify-between lg:p-10 xl:p-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-24 size-[440px] rounded-full bg-white/10 blur-3xl"
        />

        <Link href="/" className="relative">
          <Logo className="h-14" variant="white" />
        </Link>

        <div className="relative">
          <h2 className="max-w-md font-display text-[2.25rem] font-bold leading-[1.15] text-white">
            El talento está en regiones.
            <br />
            <span className="text-gold-500">Aquí empieza tu camino.</span>
          </h2>

          <ul className="mt-9 space-y-3.5">
            {highlights.map((h) => (
              <li key={h.text} className="flex items-center gap-3 text-white/80">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/12 ring-1 ring-inset ring-white/15">
                  <h.icon className="size-4 text-gold-500" />
                </span>
                <span className="text-[0.9375rem]">{h.text}</span>
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

        <div className="flex flex-1 items-center justify-center py-8 sm:py-10">
          <div className="w-full max-w-[440px]">{children}</div>
        </div>
      </main>
    </div>
  );
}
