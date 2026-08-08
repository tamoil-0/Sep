"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CircleCheck, ImageUp, Loader2, X } from "lucide-react";
import { submitVoucherAction } from "@/server/actions/payments";
import { Field, FormAlert, Input, Select } from "@/components/forms/field";
import type { ActionResult } from "@/lib/result";
import { cn } from "@/lib/utils";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] sep-gradient text-[0.9375rem] font-medium text-white shadow-[0_4px_16px_rgba(46,11,232,.22)] transition-all hover:shadow-[0_8px_24px_rgba(46,11,232,.3)] disabled:opacity-60"
    >
      {pending && <Loader2 className="size-4 animate-spin" />}
      Enviar comprobante
    </button>
  );
}

export function VoucherForm({ orderId }: { orderId: string }) {
  const [state, action] = useActionState<ActionResult<unknown> | null, FormData>(
    submitVoucherAction,
    null,
  );
  const [preview, setPreview] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (preview) URL.revokeObjectURL(preview);

    if (!file) {
      setPreview(null);
      setFileName(null);
      return;
    }

    setFileName(file.name);
    setPreview(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
  }

  function clearFile() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFileName(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  if (state?.ok && state.message) {
    return (
      <div className="rounded-[12px] border border-success/25 bg-success-bg p-5 text-center">
        <CircleCheck className="mx-auto size-8 text-success" />
        <p className="mt-3 font-display text-[1.0625rem] font-semibold text-ink">
          Comprobante recibido
        </p>
        <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-graphite">
          {state.message}
        </p>
      </div>
    );
  }

  const fieldErrors = !state?.ok ? state?.fieldErrors : undefined;

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="orderId" value={orderId} />

      {state && !state.ok && state.error && (
        <FormAlert tone="error">{state.error}</FormAlert>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="¿Con qué pagaste?" htmlFor="method" required>
          <Select id="method" name="method" defaultValue="yape" required>
            <option value="yape">Yape</option>
            <option value="plin">Plin</option>
            <option value="transferencia">Transferencia bancaria</option>
          </Select>
        </Field>

        <Field
          label="Código de operación"
          htmlFor="operationCode"
          error={fieldErrors?.operationCode}
          hint="Aparece en tu constancia de pago."
          required
        >
          <Input
            id="operationCode"
            name="operationCode"
            placeholder="Ej. 00412873"
            autoComplete="off"
            spellCheck={false}
            className="tabular"
            required
            invalid={!!fieldErrors?.operationCode}
          />
        </Field>
      </div>

      {/* Zona de subida */}
      <div>
        <label
          htmlFor="voucher"
          className="mb-1.5 block text-sm font-medium text-graphite"
        >
          Captura de la operación<span className="ml-0.5 text-danger">*</span>
        </label>

        <div
          className={cn(
            "relative rounded-[12px] border border-dashed p-5 transition-colors",
            fieldErrors?.voucher
              ? "border-danger bg-danger-bg/30"
              : "border-line bg-surface-1 hover:border-sep-300",
          )}
        >
          <input
            ref={inputRef}
            id="voucher"
            name="voucher"
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={onFile}
            required
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-describedby="voucher-hint"
          />

          {preview ? (
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Vista previa del comprobante"
                className="h-24 w-20 rounded-lg border border-line object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{fileName}</p>
                <p className="mt-0.5 text-xs text-slate-ui">
                  Verifica que se vean el monto, la fecha y el código.
                </p>
              </div>
              <button
                type="button"
                onClick={clearFile}
                className="relative z-10 rounded-lg p-1.5 text-slate-ui hover:bg-surface-2 hover:text-ink"
                aria-label="Quitar archivo"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : fileName ? (
            <div className="flex items-center gap-3">
              <ImageUp className="size-5 text-slate-ui" />
              <p className="flex-1 truncate text-sm font-medium text-ink">{fileName}</p>
              <button
                type="button"
                onClick={clearFile}
                className="relative z-10 rounded-lg p-1.5 text-slate-ui hover:bg-surface-2"
                aria-label="Quitar archivo"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <ImageUp className="mx-auto size-6 text-mist" />
              <p className="mt-2.5 text-sm font-medium text-ink">
                Arrastra tu captura o haz clic para elegirla
              </p>
              <p id="voucher-hint" className="mt-1 text-xs text-slate-ui">
                JPG, PNG, WebP o PDF · máximo 5 MB
              </p>
            </div>
          )}
        </div>

        {fieldErrors?.voucher?.length ? (
          <p className="mt-1.5 text-xs text-danger" role="alert">
            {fieldErrors.voucher[0]}
          </p>
        ) : null}
      </div>

      <SubmitButton />

      <p className="text-center text-xs leading-relaxed text-mist">
        Tu comprobante es privado: solo lo ve el equipo de SEP para validar el pago.
      </p>
    </form>
  );
}
