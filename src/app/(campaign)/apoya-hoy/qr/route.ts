import QRCode from "qrcode";

const SUPPORT_URL = "https://sep-drab.vercel.app/apoya-hoy";

export const dynamic = "force-static";

export async function GET() {
  const svg = await QRCode.toString(SUPPORT_URL, {
    type: "svg",
    errorCorrectionLevel: "H",
    margin: 2,
    width: 512,
    color: {
      dark: "#171326",
      light: "#ffffff",
    },
  });

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Disposition": 'inline; filename="sep-apoya-hoy-qr.svg"',
    },
  });
}
