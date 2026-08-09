import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        borderRadius: 40,
        background: "linear-gradient(135deg, #2e0be8 0%, #6a0dd9 58%, #a50fc6 100%)",
        color: "white",
        fontSize: 78,
        fontWeight: 800,
        letterSpacing: "-6px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      sep
      <div
        style={{
          position: "absolute",
          right: 24,
          top: 24,
          width: 22,
          height: 22,
          borderRadius: 999,
          background: "#ffc629",
          boxShadow: "0 0 0 8px rgba(255,255,255,.18)",
        }}
      />
    </div>,
    size,
  );
}
