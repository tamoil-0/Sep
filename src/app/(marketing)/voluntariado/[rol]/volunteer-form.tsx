"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CircleCheck, Loader2 } from "lucide-react";
import { applyVolunteerAction } from "@/server/actions/public-forms";
import { Field, FormAlert, Input, Select, Textarea } from "@/components/forms/field";
import { REGION_OPTIONS } from "@/config/regions";
import type { ActionResult } from "@/lib/result";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] sep-gradient text-[0.9375rem] font-medium text-white shadow-[0_4px_16px_rgba(46,11,232,.22)] transition-all hover:shadow-[0_8px_24px_rgba(46,11,232,.3)] disabled:opacity-60"
    >
      {pending && <Loader2 className="size-4 animate-spin" />}
      Enviar postulación
    </button>
  );
}

export function VolunteerForm({
  roleSlug,
  roleName,
}: {
  roleSlug: string;
  roleName: string;
}) {
  const [state, action] = useActionState<ActionResult<unknown> | null, FormData>(
    applyVolunteerAction,
    null,
  );

  if (state?.ok) {
    return (
      <div className="rounded-[12px] border border-success/25 bg-success-bg p-6 text-center">
        <CircleCheck className="mx-auto size-8 text-success" />
        <p className="mt-3 font-display text-[1.0625rem] font-semibold text-ink">
          ¡Postulación enviada!
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-graphite">{state.message}</p>
      </div>
    );
  }

  const e = state?.fieldErrors;

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="roleSlug" value={roleSlug} />

      {state && !state.ok && state.error && !e && (
        <FormAlert tone="error">{state.error}</FormAlert>
      )}

      <Field label="Nombre completo" htmlFor="fullName" error={e?.fullName} required>
        <Input
          id="fullName"
          name="fullName"
          autoComplete="name"
          placeholder="Tu nombre y apellidos"
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

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="WhatsApp" htmlFor="phone" error={e?.phone} required>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+51 9XX XXX XXX"
            required
            invalid={!!e?.phone}
          />
        </Field>

        <Field label="Región" htmlFor="region" error={e?.region} required>
          <Select id="region" name="region" defaultValue="" required invalid={!!e?.region}>
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
      </div>

      <Field label="Universidad" htmlFor="university" error={e?.university}>
        <Input id="university" name="university" placeholder="Opcional" />
      </Field>

      <Field label="Carrera y ciclo actual" htmlFor="careerCycle" error={e?.careerCycle}>
        <Input
          id="careerCycle"
          name="careerCycle"
          placeholder="Ej. Administración · 5to ciclo"
        />
      </Field>

      <Field
        label={`¿Por qué quieres ser ${roleName}?`}
        htmlFor="motivation"
        error={e?.motivation}
        hint="Cuéntanos en 2 o 3 oraciones."
        required
      >
        <Textarea
          id="motivation"
          name="motivation"
          rows={4}
          minLength={30}
          maxLength={1500}
          placeholder="Lo que te mueve, lo que quieres construir…"
          required
          invalid={!!e?.motivation}
        />
      </Field>

      <Field
        label="¿Completaste algún curso o el SILP de SEP?"
        htmlFor="completedCourses"
        error={e?.completedCourses}
      >
        <Input
          id="completedCourses"
          name="completedCourses"
          placeholder="Sí / No / ¿Cuál?"
        />
      </Field>

      <SubmitButton />

      <p className="text-center text-xs leading-relaxed text-mist">
        Al enviar aceptas que SEP trate tus datos para evaluar tu postulación, conforme a
        la Ley N.º 29733.
      </p>
    </form>
  );
}
