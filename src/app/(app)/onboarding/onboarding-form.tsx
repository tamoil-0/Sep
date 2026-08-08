"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import {
  completeOnboardingAction,
  skipOnboardingAction,
} from "@/server/actions/onboarding";
import { Card } from "@/components/ui/primitives";
import { Field, FormAlert, Input, Select } from "@/components/forms/field";
import { CURRENT_SITUATIONS, INTEREST_AREAS, REGION_OPTIONS } from "@/config/regions";
import type { ActionResult } from "@/lib/result";
import type { UserRole } from "@/types/roles";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] sep-gradient text-[0.9375rem] font-medium text-white shadow-[0_4px_16px_rgba(46,11,232,.22)] transition-all hover:shadow-[0_8px_24px_rgba(46,11,232,.3)] disabled:opacity-60"
    >
      {pending && <Loader2 className="size-4 animate-spin" />}
      Entrar a mi panel
      <ArrowRight className="size-4" />
    </button>
  );
}

export function OnboardingForm({
  role,
  defaults,
}: {
  role: UserRole;
  defaults: {
    region: string;
    university: string;
    career: string;
    currentSituation: string;
    interests: string[];
  };
}) {
  const [state, action] = useActionState<ActionResult<unknown> | null, FormData>(
    completeOnboardingAction,
    null,
  );

  const isStudent = role === "estudiante" || role === "mentor";

  return (
    <Card className="p-7">
      <form action={action} className="space-y-5">
        {state && !state.ok && state.error && (
          <FormAlert tone="error">{state.error}</FormAlert>
        )}

        <Field
          label="¿De qué región eres?"
          htmlFor="region"
          hint="Nos sirve para conectarte con gente y talleres cerca de ti."
          required
        >
          <Select
            id="region"
            name="region"
            defaultValue={defaults.region}
            required
          >
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

        {isStudent && (
          <>
            <Field label="¿En qué estás ahora?" htmlFor="currentSituation">
              <Select
                id="currentSituation"
                name="currentSituation"
                defaultValue={defaults.currentSituation}
              >
                <option value="">Prefiero no decirlo</option>
                {CURRENT_SITUATIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Universidad" htmlFor="university">
                <Input
                  id="university"
                  name="university"
                  defaultValue={defaults.university}
                  placeholder="Opcional"
                />
              </Field>
              <Field label="Carrera" htmlFor="career">
                <Input
                  id="career"
                  name="career"
                  defaultValue={defaults.career}
                  placeholder="Opcional"
                />
              </Field>
            </div>
          </>
        )}

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-graphite">
            ¿Qué te gustaría aprender?
          </legend>
          <div className="flex flex-wrap gap-2">
            {INTEREST_AREAS.map((area) => (
              <label
                key={area}
                className="cursor-pointer rounded-full border border-line px-3 py-1.5 text-xs text-graphite transition-colors has-[:checked]:border-sep-500 has-[:checked]:bg-sep-50 has-[:checked]:text-sep-700"
              >
                <input
                  type="checkbox"
                  name="interests"
                  value={area}
                  defaultChecked={defaults.interests.includes(area)}
                  className="sr-only"
                />
                {area}
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs text-mist">
            Elige las que quieras. Puedes cambiarlo después.
          </p>
        </fieldset>

        <SubmitButton />
      </form>

      <form action={skipOnboardingAction} className="mt-3">
        <button
          type="submit"
          className="w-full text-center text-sm text-slate-ui transition-colors hover:text-ink"
        >
          Lo completo después
        </button>
      </form>
    </Card>
  );
}
