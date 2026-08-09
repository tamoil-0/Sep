"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { forgotPasswordAction, type ActionState } from "@/server/actions/auth";
import { Field, FormAlert, Input } from "@/components/forms/field";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-sep-600 text-[0.9375rem] font-medium text-white transition-colors hover:bg-sep-700 disabled:opacity-60"
    >
      {pending && <Loader2 className="size-4 animate-spin" />}
      Enviar enlace
    </button>
  );
}

export function ForgotForm({ initialError }: { initialError?: string }) {
  const [state, action] = useActionState<ActionState | null, FormData>(
    forgotPasswordAction,
    null,
  );

  if (state?.ok && state.message) {
    return <FormAlert tone="success">{state.message}</FormAlert>;
  }

  return (
    <form action={action} className="space-y-4">
      {(state?.error || initialError) && (
        <FormAlert tone="error">{state?.error ?? initialError}</FormAlert>
      )}

      <Field
        label="Correo electrónico"
        htmlFor="email"
        error={state?.fieldErrors?.email}
        required
      >
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          required
          invalid={!!state?.fieldErrors?.email}
        />
      </Field>

      <SubmitButton />
    </form>
  );
}
