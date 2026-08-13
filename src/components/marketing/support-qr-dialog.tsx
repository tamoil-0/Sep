"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, Check, Copy, Download, HeartHandshake, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const SUPPORT_URL = "https://sep-drab.vercel.app/apoya-hoy";

export function SupportQrDialog() {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const dialogRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function copyLink() {
    await navigator.clipboard.writeText(SUPPORT_URL);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
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
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-ink/60 p-4 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <div
              ref={dialogRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="support-qr-title"
              onClick={(event) => event.stopPropagation()}
              className="my-auto w-full max-w-md rounded-[16px] bg-white p-5 shadow-[0_24px_64px_-16px_rgba(18,16,28,.4)] outline-none sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-sep-600">Comparte SEP</p>
                  <h2
                    id="support-qr-title"
                    className="mt-1 font-display text-[1.35rem] font-semibold text-ink"
                  >
                    Escanea para apoyar hoy
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-ui transition-colors hover:bg-surface-2 hover:text-ink"
                  aria-label="Cerrar código QR"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="mx-auto mt-5 aspect-square w-full max-w-[280px] rounded-[12px] border border-line bg-white p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/apoya-hoy/qr"
                  width="256"
                  height="256"
                  alt="Código QR para abrir Apoya hoy de SEP"
                  className="size-full"
                />
              </div>

              <p className="mt-4 text-center text-sm leading-relaxed text-slate-ui">
                Abre la cámara del celular y apunta al código para ingresar directamente.
              </p>
              <p className="mt-2 break-all rounded-[8px] bg-surface-1 px-3 py-2 text-center text-xs text-graphite">
                {SUPPORT_URL}
              </p>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={copyLink}
                  className="inline-flex h-11 items-center justify-center gap-1.5 rounded-[10px] border border-line bg-white text-sm font-medium text-ink transition-colors hover:bg-surface-1"
                >
                  {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
                  {copied ? "Copiado" : "Copiar"}
                </button>
                <a
                  href="/apoya-hoy/qr"
                  download="sep-apoya-hoy-qr.svg"
                  className="inline-flex h-11 items-center justify-center gap-1.5 rounded-[10px] border border-line bg-white text-sm font-medium text-ink transition-colors hover:bg-surface-1"
                >
                  <Download className="size-4" />
                  Descargar
                </a>
                <a
                  href={SUPPORT_URL}
                  className="inline-flex h-11 items-center justify-center gap-1.5 rounded-[10px] bg-sep-600 text-sm font-medium text-white transition-colors hover:bg-sep-700"
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
