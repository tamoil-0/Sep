"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, ShieldCheck } from "lucide-react";
import { resetPasswordAction, type ActionState } from "@/server/actions/auth";
import { Field, FormAlert, Input } from "@/components/forms/field";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-sep-600 text-[0.9375rem] font-medium text-white transition-colors hover:bg-sep-700 disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
      {pending ? "Protegiendo tu cuenta…" : "Guardar nueva contraseña"}
    </button>
  );
}

export function ResetPasswordForm() {
  const [state, action] = useActionState<ActionState | null, FormData>(
    resetPasswordAction,
    null,
  );

  return (
    <form action={action} className="space-y-4">
      {state?.error && <FormAlert tone="error">{state.error}</FormAlert>}

      <Field
        label="Nueva contraseña"
        htmlFor="password"
        error={state?.fieldErrors?.password}
        required
      >
        <Input
          id="password"
          name="password"
          type="password"
          minLength={10}
          maxLength={128}
          autoComplete="new-password"
          placeholder="Mínimo 10 caracteres"
          invalid={!!state?.fieldErrors?.password}
          required
        />
      </Field>

      <Field
        label="Confirma la contraseña"
        htmlFor="confirm"
        error={state?.fieldErrors?.confirm}
        required
      >
        <Input
          id="confirm"
          name="confirm"
          type="password"
          minLength={10}
          maxLength={128}
          autoComplete="new-password"
          placeholder="Repite tu nueva contraseña"
          invalid={!!state?.fieldErrors?.confirm}
          required
        />
      </Field>

      <SubmitButton />
    </form>
  );
}
