"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/server/actions/auth";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

      {/* ── Confirmación: <dialog> nativo ── */}
      <Dialog
        open={state === "confirm"}
        onClose={() => setState("idle")}
        title="Cerrar sesión en este dispositivo"
        description="Tu progreso queda guardado y podrás volver cuando quieras."
        footer={
          <>
            <Button variant="outline" onClick={() => setState("idle")}>
              Quedarme
            </Button>
            <Button variant="danger" onClick={confirmLogout}>
              <LogOut aria-hidden /> Sí, salir
            </Button>
          </>
        }
      >
        {logoutError && (
          <p role="alert" className="rounded-sm bg-danger-bg px-3.5 py-3 text-body-sm text-danger">
            {logoutError}
          </p>
        )}
      </Dialog>

      {/* ── Despedida ── */}
      {state === "leaving" &&
        typeof document !== "undefined" &&
        createPortal(
        <div
          className="fixed inset-0 z-[110] flex min-h-dvh flex-col items-center justify-center overflow-hidden halo px-5 text-center animate-fade-in"
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

            <p className="mt-8 text-h3 font-semibold text-white animate-fade-up">
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
                className="h-full rounded-full bg-cian-500"
                style={{
                  animation: `logout-progress ${FAREWELL_MS}ms cubic-bezier(.4,0,.2,1) forwards`,
                }}
              />
            </div>

            <p className="mt-4 text-caption text-white/50">Cerrando tu sesión…</p>
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
