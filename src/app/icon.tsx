import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        borderRadius: 15,
        background: "linear-gradient(135deg, #2e0be8 0%, #6a0dd9 58%, #a50fc6 100%)",
        color: "white",
        fontSize: 28,
        fontWeight: 800,
        letterSpacing: "-2px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      sep
      <div
        style={{
          position: "absolute",
          right: 8,
          top: 8,
          width: 8,
          height: 8,
          borderRadius: 999,
          background: "#ffc629",
          boxShadow: "0 0 0 3px rgba(255,255,255,.18)",
        }}
      />
    </div>,
    size,
  );
}
