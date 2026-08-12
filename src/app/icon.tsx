/* eslint-disable @next/next/no-img-element -- ImageResponse necesita un elemento img serializable. */
import { readFile } from "node:fs/promises";
import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
  const logo = await readFile(
    new URL("../../public/img/new_images/logo_original.png", import.meta.url),
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
        background: "#ffffff",
      }}
    >
      <img src={logoSrc} width={64} height={64} alt="SEP" />
    </div>,
    size,
  );
}
