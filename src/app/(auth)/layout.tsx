import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Award, Globe, Sprout, Users } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { MotivoSemilla } from "@/components/brand/motivo-semilla";
import { ContextualHelp } from "@/components/ui/contextual-help";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

const highlights = [
  { icon: Sprout, text: "Cursos virtuales de acceso gratuito" },
  { icon: Globe, text: "Participantes de 13 regiones del Perú" },
  { icon: Award, text: "Certificado SEP con verificación pública" },
  { icon: Users, text: "+135 jóvenes líderes capacitados" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh bg-surface-0 lg:grid-cols-[minmax(340px,0.78fr)_minmax(520px,1.22fr)]">
      {/* Banda de marca en móvil: el motivo no desaparece en pantallas chicas. */}
      <div className="theme-night halo relative flex items-center gap-4 overflow-hidden px-4 py-4 sm:px-8 lg:hidden">
        <Link href="/" className="relative flex min-h-control items-center" aria-label="Inicio — SEP">
          <Logo className="h-9" variant="white" />
        </Link>
        <p className="relative min-w-0 flex-1 text-body-sm text-slate-ui">El talento está en regiones.</p>
        <MotivoSemilla className="relative -my-2 h-16 w-16 shrink-0" ciclo={8} />
      </div>

      {/* Panel de marca */}
      <aside className="theme-night relative hidden min-h-dvh overflow-hidden halo lg:sticky lg:top-0 lg:flex lg:max-h-dvh lg:flex-col lg:justify-between lg:p-10 xl:p-12">
        <Link href="/" className="relative">
          <Logo className="h-14" variant="white" />
        </Link>

        <div className="relative">
          <MotivoSemilla className="-ml-6 mb-2 w-56 xl:w-64" />
          <h2 className="max-w-sm font-display text-h2 font-semibold text-white">
            El talento está en regiones.
            <br />
            <span className="text-violeta-300">Aquí empieza tu camino.</span>
          </h2>

          <ul className="mt-7 space-y-3">
            {highlights.map((h) => (
              <li key={h.text} className="flex items-center gap-3 text-white/80">
                <h.icon className="size-4 shrink-0 text-cian-500" />
                <span className="text-body-sm">{h.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-caption text-white/75">
          Organización juvenil reconocida por SENAJU · Desde Áncash, 2024
        </p>
      </aside>

      {/* Formulario */}
      <main id="contenido" className="flex min-h-dvh min-w-0 flex-col px-4 py-5 sm:px-8 sm:py-7 lg:px-10 xl:px-16">
        <div className="mx-auto flex w-full max-w-xl items-center justify-between">
          <Link
            href="/"
            className="ml-auto inline-flex min-h-control items-center gap-1.5 text-body-sm text-slate-ui transition-colors hover:text-ink"
          >
            <ArrowLeft aria-hidden className="size-icon-sm" />
            Volver al inicio
          </Link>
        </div>

        <div className="flex flex-1 items-start justify-center pb-8 pt-10 sm:pt-14 lg:items-center lg:py-8">
          <div className="w-full max-w-md">
            {children}
            <ContextualHelp
              className="mt-10 rounded-none border-0 border-t border-line bg-transparent px-0 pb-0 pt-6 shadow-none"
              description="Si el correo no llega o no puedes continuar, escríbenos indicando el paso en el que estás."
            />
          </div>
        </div>
      </main>
    </div>
  );
}
