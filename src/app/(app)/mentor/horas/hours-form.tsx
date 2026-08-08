"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { logHoursAction } from "@/server/actions/learning";
import { Field, FormAlert, Input, Textarea } from "@/components/forms/field";
import type { ActionResult } from "@/lib/result";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-[10px] bg-sep-600 text-sm font-medium text-white transition-colors hover:bg-sep-700 disabled:opacity-60"
    >
      {pending && <Loader2 className="size-4 animate-spin" />}
      Registrar
    </button>
  );
}

export function HoursForm() {
  const router = useRouter();
  const [state, action] = useActionState<ActionResult<unknown> | null, FormData>(
    logHoursAction,
    null,
  );
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      router.refresh();
    }
  }, [state, router]);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form ref={formRef} action={action} className="space-y-4">
      {state && !state.ok && state.error && (
        <FormAlert tone="error">{state.error}</FormAlert>
      )}
      {state?.ok && state.message && (
        <FormAlert tone="success">{state.message}</FormAlert>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Fecha" htmlFor="date" required>
          <Input
            id="date"
            name="date"
            type="date"
            max={today}
            defaultValue={today}
            required
          />
        </Field>

        <Field label="Horas" htmlFor="hours" required>
          <Input
            id="hours"
            name="hours"
            type="number"
            step="0.5"
            min="0.5"
            max="12"
            placeholder="2.5"
            className="tabular"
            required
          />
        </Field>
      </div>

      <Field
        label="¿Qué hiciste?"
        htmlFor="activity"
        hint="Sé concreto: ayuda al equipo a aprobarlas rápido."
        required
      >
        <Textarea
          id="activity"
          name="activity"
          rows={3}
          minLength={5}
          maxLength={300}
          placeholder="Ej. Mentoría 1:1 con Kevin Quispe sobre su proyecto de biblioteca comunal."
          required
        />
      </Field>

      <SubmitButton />

      <p className="text-xs leading-relaxed text-mist">
        Las horas quedan pendientes hasta que el equipo de SEP las apruebe. No puedes
        aprobar las tuyas.
      </p>
    </form>
  );
}
