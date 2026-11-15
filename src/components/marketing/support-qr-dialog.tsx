"use client";

import * as React from "react";
import { ArrowUpRight, Check, Copy, Download, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";

const SUPPORT_URL = "https://sep-drab.vercel.app/apoya-hoy";

export function SupportQrDialog() {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const toast = useToast();

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
      <Button type="button" size="lg" variant="outline" onClick={() => setOpen(true)}>
        <HeartHandshake />
        Apoya hoy
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Escanea para apoyar hoy"
        description="Abre la cámara del celular y apunta al código para ingresar directamente."
      >
        <div className="mx-auto aspect-square w-full max-w-2xs rounded-md border border-line bg-surface-0 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/apoya-hoy/qr" width="256" height="256" alt="Código QR para abrir Apoya hoy de SEP" className="size-full" />
        </div>
        <p className="mt-4 break-all rounded-sm bg-surface-1 px-3 py-2 text-center text-caption text-graphite">{SUPPORT_URL}</p>
        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Button variant="outline" onClick={copyLink}>
            {copied ? <Check className="text-success" aria-hidden /> : <Copy aria-hidden />}
            {copied ? "Copiado" : "Copiar"}
          </Button>
          <a
            href="/apoya-hoy/qr"
            download="sep-apoya-hoy-qr.svg"
            className="inline-flex h-control items-center justify-center gap-1.5 rounded-full border border-line bg-surface-0 px-4 text-body-sm font-medium text-ink transition-colors hover:bg-surface-1"
          >
            <Download className="size-4" aria-hidden /> Descargar
          </a>
          <Button href={SUPPORT_URL}>
            Abrir <ArrowUpRight aria-hidden />
          </Button>
        </div>
      </Dialog>
    </>
  );
}
