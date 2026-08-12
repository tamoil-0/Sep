import "server-only";
import { readFile } from "node:fs/promises";
import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";

/**
 * Certificado en PDF, generado en el servidor con pdf-lib.
 *
 * Sin dependencias nativas ni headless browser: funciona igual en Vercel,
 * en Render y en local. A4 horizontal, con la identidad de SEP.
 */

export interface CertificateData {
  holderName: string;
  courseTitle: string;
  certificateName: string;
  issuer: string;
  verificationCode: string;
  issuedAt: Date;
  hours: number;
  verifyUrl: string;
}

// Paleta de marca (Plan Maestro §2.2)
const BLUE = rgb(0x2e / 255, 0x0b / 255, 0xe8 / 255);
const PURPLE = rgb(0xa5 / 255, 0x0f / 255, 0xc6 / 255);
const GOLD = rgb(1, 0xc6 / 255, 0x29 / 255);
const INK = rgb(0x12 / 255, 0x10 / 255, 0x1c / 255);
const SLATE = rgb(0x6e / 255, 0x6a / 255, 0x85 / 255);
const LINE = rgb(0xe6 / 255, 0xe4 / 255, 0xf0 / 255);

const W = 842; // A4 horizontal
const H = 595;

function centerText(
  text: string,
  font: PDFFont,
  size: number,
): number {
  return (W - font.widthOfTextAtSize(text, size)) / 2;
}

/** Recorta el texto para que quepa en el ancho disponible. */
function fit(text: string, font: PDFFont, size: number, maxWidth: number): string {
  if (font.widthOfTextAtSize(text, size) <= maxWidth) return text;
  let cut = text;
  while (cut.length > 4 && font.widthOfTextAtSize(`${cut}…`, size) > maxWidth) {
    cut = cut.slice(0, -1);
  }
  return `${cut}…`;
}

export async function buildCertificatePdf(
  data: CertificateData,
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();

  pdf.setTitle(`${data.certificateName} — ${data.holderName}`);
  pdf.setAuthor("Semillero de Emprendedores Perú");
  pdf.setSubject(data.courseTitle);
  pdf.setKeywords([data.verificationCode, "SEP", "certificado"]);
  pdf.setProducer("Plataforma SEP");
  pdf.setCreationDate(data.issuedAt);

  const page = pdf.addPage([W, H]);

  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const logoBytes = await readFile(
    new URL("../../../public/img/new_images/logo_original.png", import.meta.url),
  );
  const logo = await pdf.embedPng(logoBytes);

  // ── Banda superior: degradado simulado en franjas ──
  const bandH = 92;
  const steps = 60;
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    page.drawRectangle({
      x: (W / steps) * i,
      y: H - bandH,
      width: W / steps + 1,
      height: bandH,
      color: rgb(
        BLUE.red + (PURPLE.red - BLUE.red) * t,
        BLUE.green + (PURPLE.green - BLUE.green) * t,
        BLUE.blue + (PURPLE.blue - BLUE.blue) * t,
      ),
    });
  }

  // Logotipo oficial sobre una base clara para conservar sus colores originales.
  page.drawRectangle({
    x: 46,
    y: H - 79,
    width: 88,
    height: 64,
    color: rgb(1, 1, 1),
    opacity: 0.96,
  });
  page.drawImage(logo, {
    x: 42,
    y: H - 94,
    width: 96,
    height: 96,
  });

  page.drawText("CERTIFICADO", {
    x: W - 56 - bold.widthOfTextAtSize("CERTIFICADO", 13),
    y: H - 55,
    size: 13,
    font: bold,
    color: GOLD,
  });
  const issuerFit = fit(data.issuer.toUpperCase(), regular, 8, 300);
  page.drawText(issuerFit, {
    x: W - 56 - regular.widthOfTextAtSize(issuerFit, 8),
    y: H - 72,
    size: 8,
    font: regular,
    color: rgb(1, 1, 1),
    opacity: 0.7,
  });

  // ── Marco interior ──
  page.drawRectangle({
    x: 34,
    y: 34,
    width: W - 68,
    height: H - 68 - bandH + 10,
    borderColor: LINE,
    borderWidth: 1,
  });

  // ── Cuerpo ──
  let y = H - bandH - 68;

  const intro = "Se certifica que";
  page.drawText(intro, {
    x: centerText(intro, regular, 12),
    y,
    size: 12,
    font: regular,
    color: SLATE,
  });

  y -= 52;
  const nameSize = data.holderName.length > 34 ? 30 : 38;
  const name = fit(data.holderName, bold, nameSize, W - 160);
  page.drawText(name, {
    x: centerText(name, bold, nameSize),
    y,
    size: nameSize,
    font: bold,
    color: INK,
  });

  // Subrayado dorado del logo
  const nameWidth = bold.widthOfTextAtSize(name, nameSize);
  page.drawRectangle({
    x: (W - nameWidth) / 2,
    y: y - 9,
    width: nameWidth,
    height: 4,
    color: GOLD,
  });

  y -= 44;
  const line2 = "ha completado satisfactoriamente el programa";
  page.drawText(line2, {
    x: centerText(line2, regular, 12),
    y,
    size: 12,
    font: regular,
    color: SLATE,
  });

  y -= 38;
  const courseSize = data.courseTitle.length > 44 ? 19 : 23;
  const course = fit(data.courseTitle, bold, courseSize, W - 160);
  page.drawText(course, {
    x: centerText(course, bold, courseSize),
    y,
    size: courseSize,
    font: bold,
    color: BLUE,
  });

  y -= 30;
  const detail = `${data.hours} horas academicas  ·  modalidad virtual  ·  Peru`;
  page.drawText(detail, {
    x: centerText(detail, regular, 10),
    y,
    size: 10,
    font: regular,
    color: SLATE,
  });

  // ── Pie ──
  const footY = 92;

  page.drawLine({
    start: { x: 100, y: footY + 34 },
    end: { x: 300, y: footY + 34 },
    thickness: 0.8,
    color: LINE,
  });
  page.drawText("Celeste Ulloa Jara", {
    x: 100,
    y: footY + 20,
    size: 10,
    font: bold,
    color: INK,
  });
  page.drawText("Managing Director · SEP", {
    x: 100,
    y: footY + 7,
    size: 8,
    font: regular,
    color: SLATE,
  });

  const dateStr = new Intl.DateTimeFormat("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(data.issuedAt);

  page.drawLine({
    start: { x: W - 300, y: footY + 34 },
    end: { x: W - 100, y: footY + 34 },
    thickness: 0.8,
    color: LINE,
  });
  page.drawText(dateStr, {
    x: W - 300,
    y: footY + 20,
    size: 10,
    font: bold,
    color: INK,
  });
  page.drawText("Fecha de emision", {
    x: W - 300,
    y: footY + 7,
    size: 8,
    font: regular,
    color: SLATE,
  });

  // ── Verificación ──
  const codeLabel = `Codigo de verificacion:  ${data.verificationCode}`;
  page.drawText(codeLabel, {
    x: centerText(codeLabel, bold, 10),
    y: 54,
    size: 10,
    font: bold,
    color: INK,
  });

  const verify = fit(`Verifica este certificado en ${data.verifyUrl}`, regular, 8, W - 120);
  page.drawText(verify, {
    x: centerText(verify, regular, 8),
    y: 41,
    size: 8,
    font: regular,
    color: SLATE,
  });

  return pdf.save();
}
