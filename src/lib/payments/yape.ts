import "server-only";
import QRCode from "qrcode";

/**
 * QR de pago para Yape / Plin.
 *
 * Yape no expone una API pública de cobro. El flujo real en Perú es:
 * el usuario escanea un QR, transfiere y comparte la captura. Aquí
 * generamos un QR con los datos del cobro más una referencia única de
 * la orden, para que la conciliación en `/admin/pagos` sea inequívoca.
 *
 * El QR se genera en el servidor y se embebe como data-URI: no hay
 * peticiones a terceros, así que pasa la CSP sin excepciones.
 */

export interface PaymentQrInput {
  orderId: string;
  amountCents: number;
  concept: string;
}

/** Referencia corta y legible que el usuario copia en el mensaje de Yape. */
export function paymentReference(orderId: string): string {
  return `SEP-${orderId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

const YAPE_NUMBER = process.env.NEXT_PUBLIC_YAPE_NUMBER ?? "+51946370641";
const YAPE_HOLDER =
  process.env.NEXT_PUBLIC_YAPE_HOLDER ?? "Semillero de Emprendedores Perú";

/**
 * Genera el QR como SVG (data-URI). SVG en lugar de PNG: escala sin
 * pixelarse, pesa menos y se puede recolorear con CSS si hiciera falta.
 */
export async function generatePaymentQr(input: PaymentQrInput): Promise<{
  dataUri: string;
  reference: string;
  holder: string;
  number: string;
  amount: number;
}> {
  const reference = paymentReference(input.orderId);

  const payload = [
    `SEP|${reference}`,
    `MONTO:${(input.amountCents / 100).toFixed(2)}`,
    `CONCEPTO:${input.concept}`,
    `DESTINO:${YAPE_NUMBER}`,
  ].join("\n");

  const svg = await QRCode.toString(payload, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 1,
    width: 240,
    color: { dark: "#12101c", light: "#ffffff" },
  });

  return {
    dataUri: `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`,
    reference,
    holder: YAPE_HOLDER,
    number: YAPE_NUMBER,
    amount: input.amountCents,
  };
}

/**
 * Valida el formato del código de operación de Yape/Plin.
 * Yape usa 8 dígitos; Plin y las transferencias interbancarias varían,
 * así que aceptamos de 6 a 20 caracteres alfanuméricos.
 */
export function isValidOperationCode(code: string): boolean {
  return /^[A-Za-z0-9-]{6,20}$/.test(code.trim());
}
