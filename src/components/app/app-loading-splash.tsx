"use client";

import * as React from "react";

export function AppLoadingSplash({ overlay = false }: { overlay?: boolean }) {
  const [visible, setVisible] = React.useState(!overlay);

  React.useEffect(() => {
    if (!overlay) return;
    const timer = window.setTimeout(() => setVisible(true), 280);
    return () => window.clearTimeout(timer);
  }, [overlay]);

  if (!visible) return null;

  if (overlay) {
    return (
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-1 overflow-hidden bg-sep-100 lg:left-[232px]"
        role="status"
        aria-live="polite"
        aria-label="Cargando la siguiente pantalla"
      >
        <span className="block h-full w-2/3 animate-[navigation-progress_1.2s_ease-in-out_infinite] bg-sep-600" />
      </div>
    );
  }

  return (
    <div
      className="min-h-[calc(100dvh-8rem)] w-full bg-surface-1 py-2"
      role="status"
      aria-live="polite"
      aria-label="Cargando la siguiente pantalla"
    >
      <span className="sr-only">Preparando tu panel…</span>
      <div className="animate-fade-in" aria-hidden>
        <div className="skeleton h-7 w-52" />
        <div className="skeleton mt-2 h-4 w-72 max-w-full" />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="rounded-md border border-line bg-white p-4">
              <div className="skeleton h-3 w-24" />
              <div className="skeleton mt-3 h-7 w-16" />
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-md border border-line bg-white p-5">
          <div className="skeleton h-4 w-36" />
          <div className="mt-5 space-y-3">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="skeleton h-11 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
