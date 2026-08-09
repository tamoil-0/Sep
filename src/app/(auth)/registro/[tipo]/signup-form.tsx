"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import { signupAction, type ActionState } from "@/server/actions/auth";
import {
  Checkbox,
  Field,
  FormAlert,
  Input,
  Select,
} from "@/components/forms/field";
import {
  CURRENT_SITUATIONS,
  INTEREST_AREAS,
  REGION_OPTIONS,
  TEACHING_LEVELS,
} from "@/config/regions";
import { INSTITUTION_TYPES, type SignupRole } from "@/types/roles";

const institutionLabels: Record<string, string> = {
  colegio: "Colegio",
  universidad: "Universidad o instituto",
  empresa: "Empresa",
  ong: "ONG o fundación",
  gobierno: "Entidad pública o gobierno regional",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] sep-gradient text-[0.9375rem] font-medium text-white shadow-[0_4px_16px_rgba(46,11,232,.22)] transition-all hover:shadow-[0_8px_24px_rgba(46,11,232,.3)] disabled:opacity-60"
    >
      {pending && <Loader2 className="size-4 animate-spin" />}
      Crear mi cuenta
    </button>
  );
}

export function SignupForm({ role }: { role: SignupRole }) {
  const [state, action] = useActionState<ActionState | null, FormData>(
    signupAction,
    null,
  );
  const e = state?.fieldErrors;

  if (state?.ok && state.message) {
    return (
      <div className="rounded-[14px] border border-success/25 bg-success-bg p-6 text-center">
        <CheckCircle2 className="mx-auto size-9 text-success" />
        <p className="mt-4 font-display text-lg font-semibold text-ink">
          Revisa tu correo
        </p>
        <p className="mt-2 text-sm leading-relaxed text-graphite">{state.message}</p>
        <p className="mt-3 text-xs leading-relaxed text-slate-ui">
          El enlace puede tardar unos minutos. No cierres esta pestaña si quieres volver a
          revisar la dirección que registraste.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex h-10 items-center justify-center rounded-[10px] bg-white px-5 text-sm font-medium text-ink ring-1 ring-inset ring-line"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="accountType" value={role} />

      {state?.error && <FormAlert tone="error">{state.error}</FormAlert>}

      {/* ── Común a los tres tipos ── */}
      <Field label="Nombre completo" htmlFor="fullName" error={e?.fullName} required>
        <Input
          id="fullName"
          name="fullName"
          autoComplete="name"
          placeholder="Nombre y apellidos"
          required
          invalid={!!e?.fullName}
        />
      </Field>

      <Field label="Correo electrónico" htmlFor="email" error={e?.email} required>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          required
          invalid={!!e?.email}
        />
      </Field>

      <Field
        label="Contraseña"
        htmlFor="password"
        error={e?.password}
        hint="Mínimo 10 caracteres."
        required
      >
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••••"
          minLength={10}
          required
          invalid={!!e?.password}
        />
      </Field>

      <Field label="Región" htmlFor="region" error={e?.region} required>
        <Select id="region" name="region" required defaultValue="" invalid={!!e?.region}>
          <option value="" disabled>
            Elige tu región
          </option>
          {REGION_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>
      </Field>

      {/* ── Estudiante ── */}
      {role === "estudiante" && (
        <>
          <Field
            label="Situación actual"
            htmlFor="currentSituation"
            error={e?.currentSituation}
            required
          >
            <Select
              id="currentSituation"
              name="currentSituation"
              required
              defaultValue=""
              invalid={!!e?.currentSituation}
            >
              <option value="" disabled>
                Elige una opción
              </option>
              {CURRENT_SITUATIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Universidad" htmlFor="university" error={e?.university}>
              <Input id="university" name="university" placeholder="Opcional" />
            </Field>
            <Field label="Carrera y ciclo" htmlFor="career" error={e?.career}>
              <Input id="career" name="career" placeholder="Ej. Administración · 5to" />
            </Field>
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-graphite">
              ¿Qué te interesa aprender?
            </legend>
            <div className="flex flex-wrap gap-2">
              {INTEREST_AREAS.map((area) => (
                <label
                  key={area}
                  className="cursor-pointer rounded-full border border-line px-3 py-1.5 text-xs text-graphite transition-colors has-[:checked]:border-sep-500 has-[:checked]:bg-sep-50 has-[:checked]:text-sep-700"
                >
                  <input type="checkbox" name="interests" value={area} className="sr-only" />
                  {area}
                </label>
              ))}
            </div>
          </fieldset>
        </>
      )}

      {/* ── Docente ── */}
      {role === "docente" && (
        <>
          <Field
            label="Institución donde enseñas"
            htmlFor="institutionName"
            error={e?.institutionName}
            required
          >
            <Input
              id="institutionName"
              name="institutionName"
              placeholder="Ej. I.E. San Martín de Porres"
              required
              invalid={!!e?.institutionName}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Nivel educativo"
              htmlFor="teachingLevel"
              error={e?.teachingLevel}
              required
            >
              <Select
                id="teachingLevel"
                name="teachingLevel"
                required
                defaultValue=""
                invalid={!!e?.teachingLevel}
              >
                <option value="" disabled>
                  Elige el nivel
                </option>
                {TEACHING_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Estudiantes a tu cargo" htmlFor="studentsCount">
              <Input
                id="studentsCount"
                name="studentsCount"
                type="number"
                min={0}
                placeholder="Ej. 120"
              />
            </Field>
          </div>

          <Field label="Área o curso que enseñas" htmlFor="subject">
            <Input id="subject" name="subject" placeholder="Opcional" />
          </Field>
        </>
      )}

      {/* ── Institución ── */}
      {role === "institucion" && (
        <>
          <Field
            label="Nombre de la institución"
            htmlFor="institutionName"
            error={e?.institutionName}
            required
          >
            <Input
              id="institutionName"
              name="institutionName"
              placeholder="Razón social o nombre oficial"
              required
              invalid={!!e?.institutionName}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Tipo de institución"
              htmlFor="institutionType"
              error={e?.institutionType}
              required
            >
              <Select
                id="institutionType"
                name="institutionType"
                required
                defaultValue=""
                invalid={!!e?.institutionType}
              >
                <option value="" disabled>
                  Elige el tipo
                </option>
                {INSTITUTION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {institutionLabels[t]}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="RUC" htmlFor="ruc" error={e?.ruc} hint="Opcional, 11 dígitos.">
              <Input id="ruc" name="ruc" inputMode="numeric" placeholder="20XXXXXXXXX" />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tu cargo" htmlFor="contactRole" error={e?.contactRole} required>
              <Input
                id="contactRole"
                name="contactRole"
                placeholder="Ej. Director(a)"
                required
                invalid={!!e?.contactRole}
              />
            </Field>
            <Field label="Provincia" htmlFor="province">
              <Input id="province" name="province" placeholder="Opcional" />
            </Field>
          </div>

          <Field label="Sitio web" htmlFor="website" error={e?.website}>
            <Input
              id="website"
              name="website"
              type="url"
              placeholder="https://… (opcional)"
            />
          </Field>
        </>
      )}

      <Field label="WhatsApp" htmlFor="phone" error={e?.phone} hint="Opcional.">
        <Input id="phone" name="phone" type="tel" placeholder="+51 9XX XXX XXX" />
      </Field>

      {/* ── Consentimientos (§9.5) ── */}
      <div className="space-y-3 rounded-[12px] border border-line bg-surface-1 p-4">
        <Checkbox
          id="terms"
          name="terms"
          required
          label={
            <>
              Acepto los{" "}
              <Link href="/legal/terminos" className="text-sep-600 hover:underline">
                términos y condiciones
              </Link>{" "}
              y la{" "}
              <Link href="/legal/privacidad" className="text-sep-600 hover:underline">
                política de privacidad
              </Link>
              .
            </>
          }
        />
        <Checkbox
          id="newsletter"
          name="newsletter"
          label="Quiero recibir el newsletter de SEP con eventos, convocatorias y recursos."
        />
      </div>

      {e?.terms?.length ? (
        <p className="text-xs text-danger" role="alert">
          {e.terms[0]}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
