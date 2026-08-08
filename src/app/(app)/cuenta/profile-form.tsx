"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { updateProfileAction } from "@/server/actions/profile";
import { Checkbox, Field, FormAlert, Input, Select, Textarea } from "@/components/forms/field";
import { CURRENT_SITUATIONS, INTEREST_AREAS, REGION_OPTIONS } from "@/config/regions";
import type { ActionResult } from "@/lib/result";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-sep-600 px-6 text-[0.9375rem] font-medium text-white transition-colors hover:bg-sep-700 disabled:opacity-60"
    >
      {pending && <Loader2 className="size-4 animate-spin" />}
      Guardar cambios
    </button>
  );
}

export function ProfileForm({
  defaults,
}: {
  defaults: {
    fullName: string; phone: string; region: string; province: string;
    university: string; career: string; currentSituation: string; bio: string;
    interests: string[]; newsletter: boolean;
  };
}) {
  const [state, action] = useActionState<ActionResult<unknown> | null, FormData>(
    updateProfileAction,
    null,
  );
  const e = state && !state.ok ? state.fieldErrors : undefined;

  return (
    <form action={action} className="space-y-5">
      {state?.ok && state.message && <FormAlert tone="success">{state.message}</FormAlert>}
      {state && !state.ok && state.error && !e && <FormAlert tone="error">{state.error}</FormAlert>}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre completo" htmlFor="fullName" error={e?.fullName} required>
          <Input id="fullName" name="fullName" defaultValue={defaults.fullName} required invalid={!!e?.fullName} />
        </Field>
        <Field label="WhatsApp" htmlFor="phone" error={e?.phone}>
          <Input id="phone" name="phone" type="tel" defaultValue={defaults.phone} placeholder="+51 9XX XXX XXX" />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Región" htmlFor="region" error={e?.region} required>
          <Select id="region" name="region" defaultValue={defaults.region} required>
            <option value="" disabled>Elige tu región</option>
            {REGION_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </Select>
        </Field>
        <Field label="Provincia" htmlFor="province" error={e?.province}>
          <Input id="province" name="province" defaultValue={defaults.province} placeholder="Opcional" />
        </Field>
      </div>

      <Field label="Situación actual" htmlFor="currentSituation">
        <Select id="currentSituation" name="currentSituation" defaultValue={defaults.currentSituation}>
          <option value="">Prefiero no decirlo</option>
          {CURRENT_SITUATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Universidad o institución" htmlFor="university">
          <Input id="university" name="university" defaultValue={defaults.university} placeholder="Opcional" />
        </Field>
        <Field label="Carrera o área" htmlFor="career">
          <Input id="career" name="career" defaultValue={defaults.career} placeholder="Opcional" />
        </Field>
      </div>

      <Field label="Sobre ti" htmlFor="bio" error={e?.bio} hint="Lo ve la comunidad. Máximo 500 caracteres.">
        <Textarea id="bio" name="bio" rows={3} maxLength={500} defaultValue={defaults.bio} placeholder="Opcional" />
      </Field>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-graphite">Áreas de interés</legend>
        <div className="flex flex-wrap gap-2">
          {INTEREST_AREAS.map((a) => (
            <label key={a} className="cursor-pointer rounded-full border border-line px-3 py-1.5 text-xs text-graphite transition-colors has-[:checked]:border-sep-500 has-[:checked]:bg-sep-50 has-[:checked]:text-sep-700">
              <input type="checkbox" name="interests" value={a} defaultChecked={defaults.interests.includes(a)} className="sr-only" />
              {a}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="rounded-[12px] border border-line bg-surface-1 p-4">
        <Checkbox
          id="newsletter"
          name="newsletter"
          defaultChecked={defaults.newsletter}
          label="Quiero recibir el newsletter con eventos, convocatorias y recursos."
        />
      </div>

      <SaveButton />
    </form>
  );
}

