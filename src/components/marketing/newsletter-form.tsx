"use client";

import * as React from "react";
import { Check, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export function NewsletterForm({ inverted = false }: { inverted?: boolean }) {
  const [state, setState] = React.useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = React.useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email");
    if (typeof email !== "string" || !email.includes("@")) {
      setState("error");
      setMessage("Escribe un correo válido.");
      return;
    }

    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "landing" }),
      });
      if (!res.ok) throw new Error();
      setState("done");
      setMessage("¡Listo! Revisa tu correo para confirmar la suscripción.");
    } catch {
      setState("error");
      setMessage("No pudimos suscribirte. Inténtalo de nuevo en un momento.");
    }
  }

  if (state === "done") {
    return (
      <p
        className={cn(
          "flex items-center gap-2 text-sm font-medium",
          inverted ? "text-gold-500" : "text-success",
        )}
      >
        <Check className="size-4" />
        {message}
      </p>
    );
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="flex flex-col gap-2.5 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Tu correo electrónico
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="tu@correo.com"
          className={cn(
            "h-12 flex-1 rounded-[10px] border px-4 text-[0.9375rem] outline-none transition-colors",
            inverted
              ? "border-white/25 bg-white/10 text-white placeholder:text-white/45 focus:border-gold-500"
              : "border-line bg-white text-ink placeholder:text-mist focus:border-sep-400",
          )}
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className={cn(
            "inline-flex h-12 items-center justify-center gap-2 rounded-[10px] px-6 text-[0.9375rem] font-medium transition-all disabled:opacity-60",
            inverted
              ? "bg-gold-500 text-ink hover:bg-gold-400"
              : "bg-sep-600 text-white hover:bg-sep-700",
          )}
        >
          {state === "loading" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
          Suscribirme
        </button>
      </form>

      <p
        className={cn(
          "mt-3 text-xs",
          state === "error"
            ? "text-danger"
            : inverted
              ? "text-white/50"
              : "text-mist",
        )}
      >
        {state === "error" ? message : "Sin spam. Puedes darte de baja cuando quieras."}
      </p>
    </div>
  );
}
