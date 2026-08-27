"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { forgotPasswordAction, type ActionState } from "@/server/actions/auth";
import { Field, FormAlert, Input } from "@/components/forms/field";
import { Button } from "@/components/ui/button";

function maskEmail(email?: string) {
  if (!email) return "el correo indicado";
  const [local, domain] = email.split("@");
  if (!domain) return "el correo indicado";
  return `${local.slice(0, 1)}${"•".repeat(Math.min(Math.max(local.length - 1, 3), 6))}@${domain}`;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-sep-600 text-body-sm font-medium text-white transition-colors hover:bg-sep-700 disabled:opacity-60"
    >
      {pending && <Loader2 className="size-4 animate-spin" />}
      {pending ? "Enviando enlace…" : "Enviar enlace"}
    </button>
  );
}

export function ForgotForm({ initialError }: { initialError?: string }) {
  const [state, action] = useActionState<ActionState | null, FormData>(
    forgotPasswordAction,
    null,
  );

  if (state?.ok && state.message) {
    return (
      <div className="space-y-4">
        <FormAlert tone="success">
          <span className="block font-semibold">Solicitud recibida</span>
          <span className="mt-1 block font-normal">
            Si existe una cuenta para {maskEmail(state.submittedEmail)}, el enlace llegará en uno o dos minutos.
          </span>
        </FormAlert>
        <div className="rounded-sm border border-line bg-surface-1 p-4 text-caption leading-relaxed text-slate-ui">
          <p>Revisa también spam y promociones. El enlace solo se puede usar una vez.</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Button href="/login" variant="outline" className="flex-1">Volver al login</Button>
            <Button type="button" variant="ghost" className="flex-1" onClick={() => window.location.reload()}>
              Intentar otra vez
            </Button>
          </div>
        </div>
      </div>
    );
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
