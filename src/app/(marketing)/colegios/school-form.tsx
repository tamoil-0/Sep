"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CircleCheck, Loader2 } from "lucide-react";
import { registerSchoolAction } from "@/server/actions/public-forms";
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
      Enviar solicitud
    </button>
  );
}

export function SchoolForm() {
  const [state, action] = useActionState<ActionResult<unknown> | null, FormData>(
    registerSchoolAction,
    null,
  );

  if (state?.ok) {
    return (
      <div className="rounded-[12px] border border-success/25 bg-success-bg p-6 text-center">
        <CircleCheck className="mx-auto size-8 text-success" />
        <p className="mt-3 font-display text-[1.0625rem] font-semibold text-ink">
          ¡Solicitud recibida!
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-graphite">{state.message}</p>
      </div>
    );
  }

  const e = state?.fieldErrors;

  return (
    <form action={action} className="space-y-4">
      {state && !state.ok && state.error && !e && (
        <FormAlert tone="error">{state.error}</FormAlert>
      )}

      <Field label="Nombre del colegio" htmlFor="schoolName" error={e?.schoolName} required>
        <Input
          id="schoolName"
          name="schoolName"
          placeholder="Ej. I.E. San Martín de Porres"
          required
          invalid={!!e?.schoolName}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Región" htmlFor="region" error={e?.region} required>
          <Select id="region" name="region" defaultValue="" required invalid={!!e?.region}>
            <option value="" disabled>
              Elige la región
            </option>
            {REGION_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Provincia" htmlFor="province" error={e?.province}>
          <Input id="province" name="province" placeholder="Ej. Casma" />
        </Field>
      </div>

      <Field
        label="Nombre del director(a)"
        htmlFor="directorName"
        error={e?.directorName}
        required
      >
        <Input
          id="directorName"
          name="directorName"
          placeholder="Nombre completo"
          required
          invalid={!!e?.directorName}
        />
      </Field>

      <Field
        label="Teléfono / WhatsApp"
        htmlFor="contactPhone"
        error={e?.contactPhone}
        required
      >
        <Input
          id="contactPhone"
          name="contactPhone"
          type="tel"
          placeholder="+51 9XX XXX XXX"
          required
          invalid={!!e?.contactPhone}
        />
      </Field>

      <Field
        label="Correo institucional"
        htmlFor="contactEmail"
        error={e?.contactEmail}
        required
      >
        <Input
          id="contactEmail"
          name="contactEmail"
          type="email"
          placeholder="colegio@ejemplo.edu.pe"
          required
          invalid={!!e?.contactEmail}
        />
      </Field>

      <Field
        label="N.º aproximado de estudiantes de 3ro a 5to"
        htmlFor="students3to5"
        error={e?.students3to5}
      >
        <Input
          id="students3to5"
          name="students3to5"
          type="number"
          min={0}
          placeholder="Ej. 120"
          className="tabular"
        />
      </Field>

      <Field label="¿Qué esperas de SEP?" htmlFor="expectations" error={e?.expectations}>
        <Textarea
          id="expectations"
          name="expectations"
          rows={3}
          maxLength={1500}
          placeholder="Talleres de Design Thinking, visitas de mentores…"
        />
      </Field>

      <SubmitButton />

      <p className="text-center text-xs leading-relaxed text-mist">
        El equipo de SEP te contactará en menos de 72 horas para coordinar el primer taller.
      </p>
    </form>
  );
}
