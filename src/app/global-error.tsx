"use client";

import * as React from "react";
import { siteConfig } from "@/config/site";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  React.useEffect(() => {
    console.error("[sep] interrupción global:", { digest: error.digest });
  }, [error.digest]);

  return (
    <html lang="es-PE">
      <body>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "24px", fontFamily: "system-ui, sans-serif", color: "#12101c" }}>
          <div style={{ maxWidth: 520, textAlign: "center" }}>
            <p style={{ color: "#2e0be8", fontWeight: 700 }}>SEP</p>
            <h1 style={{ fontSize: 32, lineHeight: 1.2 }}>Algo interrumpió la plataforma</h1>
            <p style={{ color: "#3a3550", lineHeight: 1.6 }}>No pudimos mostrar la plataforma completa. Intenta cargar de nuevo; si el problema continúa, vuelve al inicio.</p>
            <button type="button" onClick={reset} style={{ minHeight: 44, marginTop: 16, border: 0, borderRadius: 8, padding: "0 20px", background: "#2e0be8", color: "white", fontWeight: 600, cursor: "pointer" }}>Cargar de nuevo</button>
            <p style={{ marginTop: 20, color: "#6e6a85", fontSize: 14 }}>
              Si continúa, escribe a{" "}
              <a href={`mailto:${siteConfig.contact.email}`} style={{ color: "#2e0be8", fontWeight: 600 }}>
                soporte SEP
              </a>
              {error.digest ? ` e indica el código ${error.digest}` : " y cuéntanos qué intentabas hacer"}.
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
