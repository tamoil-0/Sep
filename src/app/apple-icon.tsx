/* eslint-disable @next/next/no-img-element -- ImageResponse necesita un elemento img serializable. */
import { readFile } from "node:fs/promises";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
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
        borderRadius: 40,
        background: "#ffffff",
      }}
    >
      <img src={logoSrc} width={180} height={180} alt="SEP" />
    </div>,
    size,
  );
}
