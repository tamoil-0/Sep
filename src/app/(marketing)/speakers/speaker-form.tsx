"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CircleCheck, Loader2 } from "lucide-react";
import { registerSpeakerAction } from "@/server/actions/public-forms";
import { Field, FormAlert, Input, Select, Textarea } from "@/components/forms/field";
import { speakerTopics } from "@/config/volunteering";
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
      Registrarme en la red
    </button>
  );
}

export function SpeakerForm() {
  const [state, action] = useActionState<ActionResult<unknown> | null, FormData>(
    registerSpeakerAction,
    null,
  );

  if (state?.ok) {
    return (
      <div className="rounded-[12px] border border-success/25 bg-success-bg p-6 text-center">
        <CircleCheck className="mx-auto size-8 text-success" />
        <p className="mt-3 font-display text-[1.0625rem] font-semibold text-ink">
          ¡Perfil recibido!
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

      <Field label="Nombre completo" htmlFor="fullName" error={e?.fullName} required>
        <Input
          id="fullName"
          name="fullName"
          autoComplete="name"
          placeholder="Tu nombre y apellido"
          required
          invalid={!!e?.fullName}
        />
      </Field>

      <Field label="Correo de contacto" htmlFor="email" error={e?.email} required>
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
        <Field label="País" htmlFor="country" error={e?.country} required>
          <Input
            id="country"
            name="country"
            defaultValue="Perú"
            required
            invalid={!!e?.country}
          />
        </Field>

        <Field label="Región / Ciudad" htmlFor="region" error={e?.region} required>
          <Input
            id="region"
            name="region"
            placeholder="Ej. Áncash · Casma"
            required
            invalid={!!e?.region}
          />
        </Field>
      </div>

      <Field
        label="Profesión o área de expertise"
        htmlFor="expertise"
        error={e?.expertise}
        required
      >
        <Input
          id="expertise"
          name="expertise"
          placeholder="Ej. Facilitador en Design Thinking · Emprendedor social"
          required
          invalid={!!e?.expertise}
        />
      </Field>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-graphite">
          ¿En qué temas puedes inspirar?<span className="ml-0.5 text-danger">*</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {speakerTopics.map((t) => (
            <label
              key={t}
              className="cursor-pointer rounded-full border border-line px-3 py-1.5 text-xs text-graphite transition-colors has-[:checked]:border-sep-500 has-[:checked]:bg-sep-50 has-[:checked]:text-sep-700"
            >
              <input type="checkbox" name="topics" value={t} className="sr-only" />
              {t}
            </label>
          ))}
        </div>
        {e?.topics?.length ? (
          <p className="mt-1.5 text-xs text-danger" role="alert">
            {e.topics[0]}
          </p>
        ) : null}
      </fieldset>

      <Field
        label="Cuéntanos tu historia"
        htmlFor="story"
        error={e?.story}
        hint="2 o 3 oraciones. De dónde vienes y qué te trajo hasta aquí."
        required
      >
        <Textarea
          id="story"
          name="story"
          rows={4}
          minLength={40}
          maxLength={1500}
          placeholder="Ej. Nací en Huaraz, sin conexiones ni recursos. Descubrí el Design Thinking en un taller y hoy llevo esa metodología a comunidades que nadie atiende…"
          required
          invalid={!!e?.story}
        />
      </Field>

      <Field
        label="¿Qué oportunidades te ha abierto el impacto social?"
        htmlFor="opportunities"
        error={e?.opportunities}
      >
        <Textarea
          id="opportunities"
          name="opportunities"
          rows={3}
          maxLength={1000}
          placeholder="Opcional"
        />
      </Field>

      <Field
        label="¿Has dado charlas o talleres antes?"
        htmlFor="talkExperience"
        error={e?.talkExperience}
        required
      >
        <Select
          id="talkExperience"
          name="talkExperience"
          defaultValue=""
          required
          invalid={!!e?.talkExperience}
        >
          <option value="" disabled>
            Elige una opción
          </option>
          <option>Sí, varias veces</option>
          <option>Solo una vez</option>
          <option>Aún no, quiero empezar</option>
        </Select>
      </Field>

      <Field
        label="¿Disponible para talleres virtuales con SEP?"
        htmlFor="availability"
        error={e?.availability}
        required
      >
        <Select
          id="availability"
          name="availability"
          defaultValue=""
          required
          invalid={!!e?.availability}
        >
          <option value="" disabled>
            Elige una opción
          </option>
          <option>Sí, estoy disponible</option>
          <option>Depende de la fecha</option>
          <option>Solo presencial</option>
        </Select>
      </Field>

      <Field label="LinkedIn o Instagram" htmlFor="linkedinUrl" error={e?.linkedinUrl}>
        <Input
          id="linkedinUrl"
          name="linkedinUrl"
          placeholder="linkedin.com/in/tu-perfil"
        />
      </Field>

      <SubmitButton />

      <p className="text-center text-xs leading-relaxed text-mist">
        El equipo de SEP revisará tu perfil antes de publicarlo en la red.
      </p>
    </form>
  );
}
