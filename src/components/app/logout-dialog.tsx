"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { LogOut, X } from "lucide-react";
import { logoutAction } from "@/server/actions/auth";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import { useDialogA11y } from "@/components/ui/use-dialog-a11y";

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
  const dialogRef = useDialogA11y<HTMLDivElement>({
    open: state === "confirm",
    onClose: () => setState("idle"),
  });

  // Bloquea el scroll de fondo mientras hay algo encima.
  React.useEffect(() => {
    if (state !== "leaving") return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
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
        className="flex min-h-control w-full items-center gap-2.5 rounded-sm px-3 py-2 text-body-sm text-white/70 transition-colors hover:bg-white/8 hover:text-white"
      >
        <LogOut className="size-4" />
        Cerrar sesión
      </button>

      {/* ── Confirmación ── */}
      {state === "confirm" &&
        typeof document !== "undefined" &&
        createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-ink/50 p-4  animate-fade-in sm:p-5"
          onClick={() => setState("idle")}
        >
          <div
            ref={dialogRef}
            tabIndex={-1}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            aria-describedby="logout-description"
            onClick={(e) => e.stopPropagation()}
            className="my-auto w-full max-w-sm rounded-lg bg-white p-5 shadow-elevated outline-none animate-scale-in sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="flex size-11 items-center justify-center rounded-md bg-danger-bg text-danger">
                <LogOut className="size-5" />
              </span>
              <button
                type="button"
                onClick={() => setState("idle")}
                className="-mr-1.5 -mt-1.5 flex size-control items-center justify-center rounded-sm text-slate-ui transition-colors hover:bg-surface-2 hover:text-ink"
                aria-label="Cancelar"
              >
                <X className="size-4" />
              </button>
            </div>

            <h2
              id="logout-title"
              className="mt-5 font-display text-h4 font-semibold text-ink"
            >
              Cerrar sesión en este dispositivo
            </h2>
            <p id="logout-description" className="mt-2 text-body-sm text-slate-ui">
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
                className="inline-flex h-control flex-1 items-center justify-center rounded-sm border border-line bg-white text-body-sm font-medium text-ink transition-colors hover:bg-surface-1"
              >
                Quedarme
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="inline-flex h-control flex-1 items-center justify-center gap-2 rounded-sm bg-danger text-body-sm font-medium text-white transition-colors hover:bg-[#852d31]"
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
          className="fixed inset-0 z-[110] flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-sep-800 px-5 text-center animate-fade-in"
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
              <Logo className="h-16" variant="white" />
            </div>

            <p className="mt-8 font-display text-h3 font-semibold text-white animate-fade-up">
              {firstName ? `Hasta pronto, ${firstName}` : "Hasta pronto"}
            </p>
            <p
              className="mt-2 text-body-sm text-white/70 animate-fade-up"
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
