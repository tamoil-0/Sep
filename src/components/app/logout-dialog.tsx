"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { LogOut, X } from "lucide-react";
import { logoutAction } from "@/server/actions/auth";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

/**
 * Cierre de sesión en tres tiempos.
 *
 * Antes era un botón que te expulsaba de golpe: sentías que la app se había
 * roto. Ahora hay confirmación (salir por error es frustrante), una despedida
 * de ~3 s que da cierre, y recién entonces la redirección.
 *
 * La animación es honesta: mientras se ve, el servidor está invalidando la
 * sesión de verdad. No es una espera decorativa.
 */

const FAREWELL_MS = 1600;

export function LogoutDialog({ userName }: { userName: string }) {
  const router = useRouter();
  const [state, setState] = React.useState<"idle" | "confirm" | "leaving">("idle");
  const [logoutError, setLogoutError] = React.useState<string | null>(null);
  const dialogRef = React.useRef<HTMLDivElement>(null);

  // Escape cierra la confirmación (pero no la despedida, que ya es irreversible).
  React.useEffect(() => {
    if (state !== "confirm") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setState("idle");
    };
    window.addEventListener("keydown", onKey);
    dialogRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [state]);

  // Bloquea el scroll de fondo mientras hay algo encima.
  React.useEffect(() => {
    document.body.style.overflow = state === "idle" ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [state]);

  async function confirmLogout() {
    setLogoutError(null);
    setState("leaving");
    // La despedida y el cierre de sesión corren a la vez; nos vamos cuando
    // ambos terminen, así nunca se ve un salto brusco ni una espera vacía.
    const [logoutResult] = await Promise.allSettled([
      logoutAction(),
      new Promise((r) => setTimeout(r, FAREWELL_MS)),
    ]);
    if (logoutResult.status === "rejected" || !logoutResult.value.ok) {
      setLogoutError(
        logoutResult.status === "fulfilled"
          ? (logoutResult.value.error ?? "No pudimos cerrar tu sesión. Inténtalo nuevamente.")
          : "No pudimos cerrar tu sesión. Inténtalo nuevamente.",
      );
      setState("confirm");
      return;
    }
    router.replace("/");
    router.refresh();
  }

  const firstName = userName.trim().split(/\s+/)[0] || "";

  return (
    <>
      <button
        type="button"
        onClick={() => setState("confirm")}
        className="flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2 text-[0.8125rem] text-white/50 transition-colors hover:bg-white/8 hover:text-white"
      >
        <LogOut className="size-4" />
        Cerrar sesión
      </button>

      {/* ── Confirmación ── */}
      {state === "confirm" &&
        typeof document !== "undefined" &&
        createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-ink/50 p-4 backdrop-blur-sm animate-fade-in sm:p-5"
          onClick={() => setState("idle")}
        >
          <div
            ref={dialogRef}
            tabIndex={-1}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            onClick={(e) => e.stopPropagation()}
            className="my-auto w-full max-w-sm rounded-[18px] bg-white p-5 shadow-[0_24px_64px_-16px_rgba(18,16,28,.35)] outline-none animate-scale-in sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="flex size-11 items-center justify-center rounded-[12px] bg-danger-bg text-danger">
                <LogOut className="size-5" />
              </span>
              <button
                type="button"
                onClick={() => setState("idle")}
                className="-mr-1.5 -mt-1.5 rounded-lg p-1.5 text-slate-ui transition-colors hover:bg-surface-2 hover:text-ink"
                aria-label="Cancelar"
              >
                <X className="size-4" />
              </button>
            </div>

            <h2
              id="logout-title"
              className="mt-5 font-display text-[1.25rem] font-semibold text-ink"
            >
              ¿Seguro que quieres salir?
            </h2>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-slate-ui">
              Cerrarás tu sesión en este dispositivo. Tu progreso queda guardado
              y podrás volver cuando quieras.
            </p>

            {logoutError && (
              <p role="alert" className="mt-4 rounded-xl bg-danger-bg px-3.5 py-3 text-sm text-danger">
                {logoutError}
              </p>
            )}

            <div className="mt-7 flex flex-col-reverse gap-2.5 sm:flex-row">
              <button
                type="button"
                onClick={() => setState("idle")}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-[10px] border border-line bg-white text-[0.9375rem] font-medium text-ink transition-colors hover:bg-surface-1"
              >
                Quedarme
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-[10px] bg-danger text-[0.9375rem] font-medium text-white transition-opacity hover:opacity-90"
              >
                <LogOut className="size-4" />
                Sí, salir
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}

      {/* ── Despedida ── */}
      {state === "leaving" &&
        typeof document !== "undefined" &&
        createPortal(
        <div
          className="fixed inset-0 z-[110] flex min-h-dvh flex-col items-center justify-center overflow-hidden sep-gradient px-5 text-center animate-fade-in"
          role="status"
          aria-live="polite"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative flex flex-col items-center">
            <div className="animate-float">
              <Logo className="h-11" variant="white" />
            </div>

            <p className="mt-8 font-display text-[1.5rem] font-semibold text-white animate-fade-up">
              {firstName ? `Hasta pronto, ${firstName}` : "Hasta pronto"}
            </p>
            <p
              className="mt-2 text-[0.9375rem] text-white/70 animate-fade-up"
              style={{ animationDelay: "120ms" }}
            >
              Emprende hoy, lidera mañana.
            </p>

            {/* Barra de progreso sincronizada con la espera real */}
            <div className="mt-9 h-[3px] w-52 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-gold-500"
                style={{
                  animation: `logout-progress ${FAREWELL_MS}ms cubic-bezier(.4,0,.2,1) forwards`,
                }}
              />
            </div>

            <p className="mt-4 text-xs text-white/50">Cerrando tu sesión…</p>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

/** Igual que el anterior pero para el menú de cuenta del área pública. */
export function LogoutButton({
  userName,
  className,
}: {
  userName: string;
  className?: string;
}) {
  return (
    <div className={cn(className)}>
      <LogoutDialog userName={userName} />
    </div>
  );
}
