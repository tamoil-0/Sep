import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, GraduationCap, School } from "lucide-react";
import { ROLE_META, SIGNUP_ROLES } from "@/types/roles";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description:
    "Crea tu cuenta gratuita en SEP. Elige si eres estudiante, docente o institución.",
};

const icons = {
  estudiante: GraduationCap,
  docente: School,
  institucion: Building2,
} as const;

export default function RegistroPage() {
  return (
    <div>
      <h1 className="font-display text-h1 font-semibold text-ink">
        Crea tu cuenta gratis
      </h1>
      <p className="mt-2 text-body-sm text-slate-ui">
        Elige el tipo de cuenta que va contigo. Puedes cambiarlo después
        conversando con el equipo.
      </p>

      <ul className="mt-8 space-y-3">
        {SIGNUP_ROLES.map((role) => {
          const meta = ROLE_META[role];
          const Icon = icons[role];
          return (
            <li key={role}>
              <Link
                href={`/registro/${role}`}
                className="group flex min-h-control items-start gap-4 rounded-md border border-line bg-white p-5 transition-[border-color,box-shadow] hover:border-sep-300 "
              >
                <span className="flex size-control shrink-0 items-center justify-center rounded-sm bg-sep-50 text-sep-600 transition-colors group-hover:sep-gradient group-hover:text-white">
                  <Icon className="size-5" />
                </span>
                <span className="flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-display text-body font-semibold text-ink">
                      {meta.label}
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-mist transition-colors group-hover:translate-x-0.5 group-hover:text-sep-600" />
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-slate-ui">
                    {meta.description}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 rounded-md border border-line bg-surface-1 p-4">
        <p className="text-sm text-slate-ui">
          <strong className="font-medium text-graphite">
            ¿Quieres ser mentor o speaker?
          </strong>{" "}
          Esos roles se otorgan tras una postulación. Crea tu cuenta de estudiante y
          postula desde{" "}
          <Link href="/voluntariado" className="text-sep-600 hover:underline">
            voluntariado
          </Link>{" "}
          o{" "}
          <Link href="/speakers" className="text-sep-600 hover:underline">
            la red de speakers
          </Link>
          .
        </p>
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
