"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { loginAction, type ActionState } from "@/server/actions/auth";
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
      Iniciar sesión
    </button>
  );
}

export function LoginForm({
  next,
  notice,
}: {
  next?: string;
  notice?: { tone: "success" | "error"; text: string };
}) {
  const [state, action] = useActionState<ActionState | null, FormData>(
    loginAction,
    null,
  );

  return (
    <form action={action} className="space-y-4">
      {next && <input type="hidden" name="next" value={next} />}

      {notice && <FormAlert tone={notice.tone}>{notice.text}</FormAlert>}
      {state?.error && <FormAlert tone="error">{state.error}</FormAlert>}

      <Field label="Correo electrónico" htmlFor="email" error={state?.fieldErrors?.email} required>
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

      <Field
        label="Contraseña"
        htmlFor="password"
        error={state?.fieldErrors?.password}
        required
      >
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••••"
          required
          invalid={!!state?.fieldErrors?.password}
        />
      </Field>

      <div className="flex justify-end">
        <Link href="/recuperar" className="text-sm text-sep-600 hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <SubmitButton />
    </form>
  );
}
