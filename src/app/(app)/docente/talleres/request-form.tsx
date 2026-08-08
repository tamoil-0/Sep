"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { CircleCheck, Loader2 } from "lucide-react";
import { requestWorkshopAction } from "@/server/actions/workshops";
import { Field, FormAlert, Input, Select, Textarea } from "@/components/forms/field";
import type { ActionResult } from "@/lib/result";

const TOPICS = [
  "Design Thinking",
  "Scrum y gestión de proyectos",
  "Liderazgo estudiantil",
  "Oratoria y presentación de ideas",
  "Innovación social",
  "Prototipado rápido",
];

const GRADES = [
  "1ro de secundaria",
  "2do de secundaria",
  "3ro de secundaria",
  "4to de secundaria",
  "5to de secundaria",
  "3ro a 5to (mixto)",
];

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] sep-gradient text-[0.9375rem] font-medium text-white shadow-[0_4px_16px_rgba(46,11,232,.22)] transition-all hover:shadow-[0_8px_24px_rgba(46,11,232,.3)] disabled:opacity-50"
    >
      {pending && <Loader2 className="size-4 animate-spin" />}
      Enviar solicitud
    </button>
  );
}

export function WorkshopRequestForm({
  institutionId,
  institutionName,
}: {
  institutionId: string | null;
  institutionName: string | null;
}) {
  const router = useRouter();
  const [state, action] = useActionState<ActionResult<unknown> | null, FormData>(
    requestWorkshopAction,
    null,
  );
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      router.refresh();
    }
  }, [state, router]);

  if (!institutionId) {
    return (
      <p className="rounded-[10px] border border-warning/30 bg-warning-bg px-4 py-3 text-sm leading-relaxed text-graphite">
        Para solicitar un taller primero debes estar vinculado a un colegio de la red.
        Escríbenos y te vinculamos, o inscribe tu colegio desde la página pública.
      </p>
    );
  }

  const e = state && !state.ok ? state.fieldErrors : undefined;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <input type="hidden" name="institutionId" value={institutionId} />

      {state?.ok && state.message && (
        <FormAlert tone="success">
          <span className="inline-flex items-center gap-2">
            <CircleCheck className="size-4" />
            {state.message}
          </span>
        </FormAlert>
      )}
      {state && !state.ok && state.error && !e && (
        <FormAlert tone="error">{state.error}</FormAlert>
      )}

      <Field label="Tema del taller" htmlFor="topic" error={e?.topic} required>
        <Select id="topic" name="topic" defaultValue="" required invalid={!!e?.topic}>
          <option value="" disabled>
            Elige un tema
          </option>
          {TOPICS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Grado" htmlFor="grade" error={e?.grade} required>
          <Select id="grade" name="grade" defaultValue="" required invalid={!!e?.grade}>
            <option value="" disabled>
              Elige el grado
            </option>
            {GRADES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="N.º de estudiantes"
          htmlFor="studentsCount"
          error={e?.studentsCount}
          required
        >
          <Input
            id="studentsCount"
            name="studentsCount"
            type="number"
            min={5}
            max={500}
            placeholder="30"
            className="tabular"
            required
            invalid={!!e?.studentsCount}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Fecha propuesta"
          htmlFor="preferredDate"
          error={e?.preferredDate}
          hint="La confirmamos contigo."
        >
          <Input id="preferredDate" name="preferredDate" type="date" min={today} />
        </Field>

        <Field label="Modalidad" htmlFor="modality" required>
          <Select id="modality" name="modality" defaultValue="presencial" required>
            <option value="presencial">Presencial</option>
            <option value="virtual">Virtual</option>
          </Select>
        </Field>
      </div>

      <Field
        label="¿Algo que debamos saber?"
        htmlFor="notes"
        error={e?.notes}
        hint="Contexto del grupo, temas que ya trabajaron, limitaciones del aula…"
      >
        <Textarea id="notes" name="notes" rows={3} maxLength={800} placeholder="Opcional" />
      </Field>

      <SubmitButton disabled={false} />

      <p className="text-center text-xs leading-relaxed text-mist">
        {institutionName ? `Para ${institutionName}. ` : ""}
        Sin costo. Te contactamos en menos de 72 horas.
      </p>
    </form>
  );
}
