import type { Metadata } from "next";
import { KeyRound, Lock, ShieldCheck, Smartphone } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { PageHeader } from "@/components/app/page-header";
import { Badge, Card } from "@/components/ui/primitives";
import { PanelSection } from "@/components/app/data-views";
import { isAdmin } from "@/types/roles";
import { PasswordResetButton } from "./password-button";

export const metadata: Metadata = {
  title: "Seguridad",
  robots: { index: false, follow: false },
};

export default async function SeguridadPage() {
  const user = await requireUser();
  const needsMfa = isAdmin(user.roles);

  return (
    <>
      <PageHeader
        title="Seguridad"
        description="Cómo proteges tu cuenta y quién puede entrar a ella."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <div className="flex items-start gap-3.5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-sep-50 text-sep-600">
              <KeyRound className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-[1.0625rem] font-semibold text-ink">Contraseña</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-ui">
                Te enviamos un enlace a tu correo para crear una nueva. No pedimos la
                anterior: así, si alguien accede a tu sesión, no puede cambiarla sin
                entrar también a tu correo.
              </p>
              <div className="mt-4">
                <PasswordResetButton email={user.email} />
              </div>
            </div>
          </div>
        </Card>

        <Card className={needsMfa ? "border-warning/30 bg-warning-bg/40" : ""}>
          <div className="flex items-start gap-3.5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-gold-500/15 text-gold-700">
              <Smartphone className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-[1.0625rem] font-semibold text-ink">
                  Doble factor
                </h2>
                {needsMfa && <Badge tone="warning">Obligatorio para tu rol</Badge>}
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-ui">
                {needsMfa
                  ? "Tu cuenta tiene permisos de administración. El doble factor con app autenticadora es obligatorio para acceder al panel de administración."
                  : "Añade una segunda barrera con una app autenticadora como Google Authenticator o Authy."}
              </p>
              <p className="mt-4 rounded-[10px] bg-white px-4 py-3 text-xs leading-relaxed text-slate-ui ring-1 ring-inset ring-line">
                La activación se hace desde el panel de Supabase mientras terminamos la
                pantalla de configuración. Escríbenos y lo activamos contigo.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <PanelSection title="Cómo protegemos tu cuenta">
        <Card>
          <ul className="space-y-4">
            {[
              {
                icon: Lock,
                title: "Tus datos solo los ves tú",
                detail:
                  "La base de datos aplica seguridad a nivel de fila: aunque alguien consultara la API directamente, solo obtendría lo que te pertenece.",
              },
              {
                icon: ShieldCheck,
                title: "Los roles no se autoasignan",
                detail:
                  "Nadie puede darse permisos de administrador, ni siquiera manipulando la petición. Solo un super administrador los otorga, y queda auditado.",
              },
              {
                icon: KeyRound,
                title: "Contraseñas cifradas",
                detail:
                  "Nunca guardamos tu contraseña en texto plano. Ni nosotros podemos leerla.",
              },
            ].map((f) => (
              <li key={f.title} className="flex items-start gap-3.5">
                <f.icon className="mt-0.5 size-5 shrink-0 text-seed-500" />
                <div>
                  <p className="text-[0.9375rem] font-medium text-ink">{f.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-ui">{f.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </PanelSection>
    </>
  );
}

