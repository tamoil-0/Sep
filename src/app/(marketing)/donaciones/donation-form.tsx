"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CircleCheck, Loader2 } from "lucide-react";
import { createDonationAction } from "@/server/actions/public-forms";
import { Checkbox, Field, FormAlert, Input, Select } from "@/components/forms/field";
import { donationAmounts, donationCauses } from "@/config/pricing";
import { formatSoles, cn } from "@/lib/utils";
import type { ActionResult } from "@/lib/result";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-gold-500 text-[0.9375rem] font-medium text-ink shadow-[0_4px_16px_rgba(255,198,41,.3)] transition-all hover:bg-gold-400 disabled:opacity-60"
    >
      {pending && <Loader2 className="size-4 animate-spin" />}
      Quiero donar
    </button>
  );
}

export function DonationForm() {
  const [state, action] = useActionState<ActionResult<unknown> | null, FormData>(
    createDonationAction,
    null,
  );
  const [amount, setAmount] = React.useState<number>(2000);
  const [custom, setCustom] = React.useState("");

  const effective = custom ? Math.round(Number(custom) * 100) : amount;

  if (state?.ok) {
    return (
      <div className="rounded-[12px] border border-success/25 bg-success-bg p-6 text-center">
        <CircleCheck className="mx-auto size-8 text-success" />
        <p className="mt-3 font-display text-[1.0625rem] font-semibold text-ink">
          ¡Gracias de corazón!
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-graphite">{state.message}</p>
      </div>
    );
  }

  const e = state?.fieldErrors;

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="amountCents" value={effective} />

      {state && !state.ok && state.error && !e && (
        <FormAlert tone="error">{state.error}</FormAlert>
      )}

      {/* Monto */}
      <div>
        <p className="mb-2 text-sm font-medium text-graphite">
          Monto<span className="ml-0.5 text-danger">*</span>
        </p>
        <div className="grid grid-cols-3 gap-2">
          {donationAmounts.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => {
                setAmount(a);
                setCustom("");
              }}
              className={cn(
                "tabular h-11 rounded-[10px] border text-sm font-medium transition-colors",
                !custom && amount === a
                  ? "border-sep-500 bg-sep-50 text-sep-700"
                  : "border-line bg-white text-graphite hover:border-sep-300",
              )}
            >
              {formatSoles(a)}
            </button>
          ))}
        </div>

        <div className="mt-2">
          <label htmlFor="custom" className="sr-only">
            Otro monto en soles
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-mist">
              S/
            </span>
            <Input
              id="custom"
              type="number"
              min={5}
              step={1}
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="Otro monto"
              className="tabular pl-9"
            />
          </div>
        </div>

        {e?.amountCents?.length ? (
          <p className="mt-1.5 text-xs text-danger" role="alert">
            {e.amountCents[0]}
          </p>
        ) : null}
      </div>

      <Field label="¿A qué causa?" htmlFor="cause">
        <Select id="cause" name="cause" defaultValue={donationCauses[0].label}>
          {donationCauses.map((c) => (
            <option key={c.slug} value={c.label}>
              {c.label}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Tu nombre" htmlFor="donorName" error={e?.donorName}>
        <Input id="donorName" name="donorName" placeholder="Opcional" />
      </Field>

      <Field label="Tu correo" htmlFor="donorEmail" error={e?.donorEmail} required>
        <Input
          id="donorEmail"
          name="donorEmail"
          type="email"
          placeholder="tu@correo.com"
          required
          invalid={!!e?.donorEmail}
        />
      </Field>

      <div className="space-y-2.5 rounded-[12px] border border-line bg-surface-1 p-4">
        <Checkbox
          id="isRecurring"
          name="isRecurring"
          label="Quiero que sea una donación mensual"
        />
        <Checkbox
          id="isAnonymous"
          name="isAnonymous"
          label="Prefiero donar de forma anónima"
        />
      </div>

      <SubmitButton />

      <p className="text-center text-xs leading-relaxed text-mist">
        Te enviaremos por correo los datos de Yape, Plin o transferencia para completar tu
        donación.
      </p>
    </form>
  );
}
