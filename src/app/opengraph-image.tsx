/* eslint-disable @next/next/no-img-element -- ImageResponse necesita un elemento img serializable. */
import { readFile } from "node:fs/promises";
import { ImageResponse } from "next/og";

export const alt = "SEP | Semillero de Emprendedores Perú";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(
    new URL("../../public/img/new_images/logo_original.png", import.meta.url),
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        display: "flex",
        height: "100%",
        width: "100%",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
        background: "linear-gradient(115deg, #2e0be8 0%, #6a0dd9 55%, #a50fc6 100%)",
        padding: "72px 78px",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -130,
          top: -170,
          display: "flex",
          height: 520,
          width: 520,
          borderRadius: 999,
          background: "rgba(255,255,255,.10)",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <span
          style={{
            display: "flex",
            height: 150,
            width: 150,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 28,
            background: "white",
          }}
        >
          <img src={logoSrc} width={142} height={142} alt="SEP" />
        </span>
        <span
          style={{
            display: "flex",
            borderLeft: "2px solid rgba(255,255,255,.35)",
            paddingLeft: 28,
            fontSize: 24,
            fontWeight: 700,
            lineHeight: 1.2,
            textTransform: "uppercase",
          }}
        >
          Semillero de Emprendedores Perú
        </span>
      </div>

      <div style={{ display: "flex", maxWidth: 950, flexDirection: "column" }}>
        <span style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.08, letterSpacing: -2 }}>
          Ideas jóvenes que se convierten en proyectos con impacto.
        </span>
        <span style={{ marginTop: 24, fontSize: 26, color: "rgba(255,255,255,.78)" }}>
          Emprendimiento y liderazgo juvenil desde las regiones del Perú
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 20 }}>
        <span style={{ color: "#ffd24d", fontWeight: 800 }}>●</span>
        Organización juvenil reconocida por SENAJU
      </div>
    </div>,
    size,
  );
}
