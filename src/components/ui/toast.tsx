"use client";

import * as React from "react";
import { AlertTriangle, CheckCircle2, CircleAlert, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "info" | "warning" | "error";
type ToastInput = { title: string; description?: string; tone?: ToastTone };
type ToastItem = ToastInput & { id: number; tone: ToastTone };

const ToastContext = React.createContext<((toast: ToastInput) => void) | null>(null);

const toneStyles: Record<ToastTone, string> = {
  success: "border-success/25 bg-success-bg text-success",
  info: "border-info/25 bg-info-bg text-info",
  warning: "border-warning/25 bg-warning-bg text-warning",
  error: "border-danger/25 bg-danger-bg text-danger",
};

const toneIcons = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  error: CircleAlert,
} as const;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const nextId = React.useRef(0);

  const dismiss = React.useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = React.useCallback((input: ToastInput) => {
    const item: ToastItem = {
      ...input,
      id: ++nextId.current,
      tone: input.tone ?? "info",
    };
    setToasts((current) => [...current.slice(-2), item]);
    window.setTimeout(() => dismiss(item.id), item.tone === "error" ? 8000 : 4500);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[150] flex flex-col items-end gap-2 sm:left-auto sm:w-full sm:max-w-sm"
        aria-label="Notificaciones"
      >
        {toasts.map((toast) => {
          const Icon = toneIcons[toast.tone];
          return (
            <div
              key={toast.id}
              role={toast.tone === "error" ? "alert" : "status"}
              aria-live={toast.tone === "error" ? "assertive" : "polite"}
              className={cn(
                "pointer-events-auto flex w-full items-start gap-3 rounded-md border p-3 shadow-elevated animate-scale-in",
                toneStyles[toast.tone],
              )}
            >
              <Icon className="mt-0.5 size-icon-lg shrink-0" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-body-sm font-semibold">{toast.title}</p>
                {toast.description && (
                  <p className="mt-0.5 text-caption text-graphite">{toast.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="-m-2 flex size-control shrink-0 items-center justify-center rounded-sm text-current hover:bg-white/50"
                aria-label={`Cerrar notificación: ${toast.title}`}
              >
                <X className="size-icon-sm" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) throw new Error("useToast debe usarse dentro de ToastProvider");
  return context;
}
