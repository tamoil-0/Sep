/** Sexta tanda: formulario de perfil, seguridad, notificaciones y estados de carga. */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const write = (p, b) => {
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, b.trimStart() + "\n");
};
const A = "src/app/(app)";

/* ── Formulario de perfil ── */
write(`${A}/cuenta/profile-form.tsx`, `
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { updateProfileAction } from "@/server/actions/profile";
import { Checkbox, Field, FormAlert, Input, Select, Textarea } from "@/components/forms/field";
import { CURRENT_SITUATIONS, INTEREST_AREAS, REGION_OPTIONS } from "@/config/regions";
import type { ActionResult } from "@/lib/result";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-sep-600 px-6 text-[0.9375rem] font-medium text-white transition-colors hover:bg-sep-700 disabled:opacity-60"
    >
      {pending && <Loader2 className="size-4 animate-spin" />}
      Guardar cambios
    </button>
  );
}

export function ProfileForm({
  defaults,
}: {
  defaults: {
    fullName: string; phone: string; region: string; province: string;
    university: string; career: string; currentSituation: string; bio: string;
    interests: string[]; newsletter: boolean;
  };
}) {
  const [state, action] = useActionState<ActionResult<unknown> | null, FormData>(
    updateProfileAction,
    null,
  );
  const e = state && !state.ok ? state.fieldErrors : undefined;

  return (
    <form action={action} className="space-y-5">
      {state?.ok && state.message && <FormAlert tone="success">{state.message}</FormAlert>}
      {state && !state.ok && state.error && !e && <FormAlert tone="error">{state.error}</FormAlert>}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre completo" htmlFor="fullName" error={e?.fullName} required>
          <Input id="fullName" name="fullName" defaultValue={defaults.fullName} required invalid={!!e?.fullName} />
        </Field>
        <Field label="WhatsApp" htmlFor="phone" error={e?.phone}>
          <Input id="phone" name="phone" type="tel" defaultValue={defaults.phone} placeholder="+51 9XX XXX XXX" />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Región" htmlFor="region" error={e?.region} required>
          <Select id="region" name="region" defaultValue={defaults.region} required>
            <option value="" disabled>Elige tu región</option>
            {REGION_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </Select>
        </Field>
        <Field label="Provincia" htmlFor="province" error={e?.province}>
          <Input id="province" name="province" defaultValue={defaults.province} placeholder="Opcional" />
        </Field>
      </div>

      <Field label="Situación actual" htmlFor="currentSituation">
        <Select id="currentSituation" name="currentSituation" defaultValue={defaults.currentSituation}>
          <option value="">Prefiero no decirlo</option>
          {CURRENT_SITUATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Universidad o institución" htmlFor="university">
          <Input id="university" name="university" defaultValue={defaults.university} placeholder="Opcional" />
        </Field>
        <Field label="Carrera o área" htmlFor="career">
          <Input id="career" name="career" defaultValue={defaults.career} placeholder="Opcional" />
        </Field>
      </div>

      <Field label="Sobre ti" htmlFor="bio" error={e?.bio} hint="Lo ve la comunidad. Máximo 500 caracteres.">
        <Textarea id="bio" name="bio" rows={3} maxLength={500} defaultValue={defaults.bio} placeholder="Opcional" />
      </Field>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-graphite">Áreas de interés</legend>
        <div className="flex flex-wrap gap-2">
          {INTEREST_AREAS.map((a) => (
            <label key={a} className="cursor-pointer rounded-full border border-line px-3 py-1.5 text-xs text-graphite transition-colors has-[:checked]:border-sep-500 has-[:checked]:bg-sep-50 has-[:checked]:text-sep-700">
              <input type="checkbox" name="interests" value={a} defaultChecked={defaults.interests.includes(a)} className="sr-only" />
              {a}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="rounded-[12px] border border-line bg-surface-1 p-4">
        <Checkbox
          id="newsletter"
          name="newsletter"
          defaultChecked={defaults.newsletter}
          label="Quiero recibir el newsletter con eventos, convocatorias y recursos."
        />
      </div>

      <SaveButton />
    </form>
  );
}
`);

/* ── Seguridad ── */
write(`${A}/cuenta/seguridad/page.tsx`, `
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
`);

write(`${A}/cuenta/seguridad/password-button.tsx`, `
"use client";

import * as React from "react";
import { Loader2, Mail } from "lucide-react";
import { requestPasswordChangeAction } from "@/server/actions/profile";

export function PasswordResetButton({ email }: { email: string }) {
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState<{ text: string; ok: boolean } | null>(null);

  return (
    <div>
      <button
        type="button"
        disabled={busy || Boolean(msg?.ok)}
        onClick={async () => {
          setBusy(true);
          const r = await requestPasswordChangeAction();
          setBusy(false);
          setMsg({ text: r.ok ? (r.message ?? "Listo.") : r.error, ok: r.ok });
        }}
        className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-line bg-white px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-1 disabled:opacity-50"
      >
        {busy ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />}
        Enviar enlace a {email}
      </button>
      {msg && (
        <p className={msg.ok ? "mt-2.5 text-sm text-success" : "mt-2.5 text-sm text-danger"}>
          {msg.text}
        </p>
      )}
    </div>
  );
}
`);

/* ── Notificaciones ── */
write(`${A}/cuenta/notificaciones/page.tsx`, `
import type { Metadata } from "next";
import Link from "next/link";
import { Bell } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/page-header";
import { Card, EmptyState } from "@/components/ui/primitives";
import { MarkAllReadButton } from "./mark-all-button";
import { relativeTime, cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Notificaciones",
  robots: { index: false, follow: false },
};

export default async function NotificacionesPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const { data } = await supabase
    .from("notifications")
    .select("id, kind, title, body, link, read_at, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(60);

  const rows = data ?? [];
  const unread = rows.filter((n) => !n.read_at).length;

  return (
    <>
      <PageHeader
        title="Notificaciones"
        description={unread ? \`Tienes \${unread} sin leer.\` : "Estás al día."}
        action={unread > 0 ? <MarkAllReadButton /> : undefined}
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={<Bell className="size-5" />}
          title="Sin notificaciones"
          description="Te avisaremos cuando haya novedades sobre tus cursos, pagos o certificados."
        />
      ) : (
        <Card className="p-0">
          <ul className="divide-y divide-line">
            {rows.map((n) => {
              const content = (
                <div className="flex items-start gap-3.5">
                  <span
                    className={cn(
                      "mt-1.5 size-2 shrink-0 rounded-full",
                      n.read_at ? "bg-line" : "bg-sep-600",
                    )}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "text-[0.9375rem]",
                        n.read_at ? "text-graphite" : "font-medium text-ink",
                      )}
                    >
                      {n.title}
                    </p>
                    {n.body && (
                      <p className="mt-1 text-sm leading-relaxed text-slate-ui">{n.body}</p>
                    )}
                    <p className="mt-1.5 text-xs text-mist">{relativeTime(n.created_at)}</p>
                  </div>
                </div>
              );

              return (
                <li key={n.id}>
                  {n.link ? (
                    <Link href={n.link} className="block px-5 py-4 transition-colors hover:bg-surface-1">
                      {content}
                    </Link>
                  ) : (
                    <div className="px-5 py-4">{content}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </>
  );
}
`);

write(`${A}/cuenta/notificaciones/mark-all-button.tsx`, `
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CheckCheck, Loader2 } from "lucide-react";
import { markAllReadAction } from "@/server/actions/profile";

export function MarkAllReadButton() {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await markAllReadAction();
        setBusy(false);
        router.refresh();
      }}
      className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-line bg-white px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-1 disabled:opacity-60"
    >
      {busy ? <Loader2 className="size-4 animate-spin" /> : <CheckCheck className="size-4" />}
      Marcar todo como leído
    </button>
  );
}
`);

/* ── Estado de carga compartido del área privada ── */
write(`${A}/loading.tsx`, `
/**
 * Estado de carga del área privada.
 *
 * Reemplaza el salto en blanco entre pantallas por un esqueleto con la misma
 * forma que el contenido real. La navegación deja de sentirse cortada.
 */
export default function AppLoading() {
  return (
    <div aria-busy="true" aria-label="Cargando">
      <div className="mb-7">
        <div className="skeleton h-8 w-64" />
        <div className="skeleton mt-3 h-4 w-96 max-w-full" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-[14px] border border-line bg-white p-5">
            <div className="skeleton h-3 w-24" />
            <div className="skeleton mt-3 h-7 w-16" />
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        <div className="skeleton h-3 w-32" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-[14px] border border-line bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="skeleton size-9 rounded-full" />
              <div className="flex-1">
                <div className="skeleton h-4 w-48 max-w-full" />
                <div className="skeleton mt-2 h-3 w-32" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
`);

console.log("cuenta y carga listos");
