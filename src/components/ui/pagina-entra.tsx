"use client";

import { useEffect, useRef } from "react";

/**
 * Transición entre páginas (REDISEÑO §6.3): fade + 8 px en 300 ms, SOLO al
 * navegar. La primera carga se marca `ya-vista` para no retrasar el LCP.
 */
export function PaginaEntra({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("navegado")) {
      ref.current?.classList.add("ya-vista");
      html.classList.add("navegado");
    }
  }, []);

  return (
    <div ref={ref} className="pagina-entra">
      {children}
    </div>
  );
}
