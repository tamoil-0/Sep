"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, Check, Copy, Download, HeartHandshake, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDialogA11y } from "@/components/ui/use-dialog-a11y";
import { useToast } from "@/components/ui/toast";

const SUPPORT_URL = "https://sep-drab.vercel.app/apoya-hoy";

export function SupportQrDialog() {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const toast = useToast();
  const dialogRef = useDialogA11y<HTMLDivElement>({
    open,
    onClose: () => setOpen(false),
  });

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(SUPPORT_URL);
      setCopied(true);
      toast({ title: "Enlace de apoyo copiado", tone: "success" });
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast({ title: "No pudimos copiar el enlace", tone: "error" });
    }
  }

  return (
    <>
      <Button type="button" variant="gold" size="lg" onClick={() => setOpen(true)}>
        <HeartHandshake />
        Apoya hoy
      </Button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-ink/60 p-4 "
            onClick={() => setOpen(false)}
          >
            <div
              ref={dialogRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="support-qr-title"
              aria-describedby="support-qr-description"
              onClick={(event) => event.stopPropagation()}
              className="my-auto w-full max-w-md rounded-lg bg-white p-5 shadow-elevated outline-none sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-sep-600">Comparte SEP</p>
                  <h2
                    id="support-qr-title"
                    className="mt-1 font-display text-h4 font-semibold text-ink"
                  >
                    Escanea para apoyar hoy
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex size-control shrink-0 items-center justify-center rounded-sm text-slate-ui transition-colors hover:bg-surface-2 hover:text-ink"
                  aria-label="Cerrar código QR"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="mx-auto mt-5 aspect-square w-full max-w-[280px] rounded-md border border-line bg-white p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/apoya-hoy/qr"
                  width="256"
                  height="256"
                  alt="Código QR para abrir Apoya hoy de SEP"
                  className="size-full"
                />
              </div>

              <p id="support-qr-description" className="mt-4 text-center text-body-sm text-slate-ui">
                Abre la cámara del celular y apunta al código para ingresar directamente.
              </p>
              <p className="mt-2 break-all rounded-sm bg-surface-1 px-3 py-2 text-center text-xs text-graphite">
                {SUPPORT_URL}
              </p>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={copyLink}
                  className="inline-flex h-control items-center justify-center gap-1.5 rounded-sm border border-line bg-white text-body-sm font-medium text-ink transition-colors hover:bg-surface-1"
                >
                  {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
                  {copied ? "Copiado" : "Copiar"}
                </button>
                <a
                  href="/apoya-hoy/qr"
                  download="sep-apoya-hoy-qr.svg"
                  className="inline-flex h-control items-center justify-center gap-1.5 rounded-sm border border-line bg-white text-body-sm font-medium text-ink transition-colors hover:bg-surface-1"
                >
                  <Download className="size-4" />
                  Descargar
                </a>
                <a
                  href={SUPPORT_URL}
                  className="inline-flex h-control items-center justify-center gap-1.5 rounded-sm bg-sep-600 text-body-sm font-medium text-white transition-colors hover:bg-sep-700"
                >
                  Abrir
                  <ArrowUpRight className="size-4" />
                </a>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
