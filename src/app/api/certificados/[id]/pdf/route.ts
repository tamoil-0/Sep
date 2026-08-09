import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildCertificatePdf } from "@/lib/pdf/certificate";
import { siteConfig } from "@/config/site";
import { z } from "zod";

/**
 * Descarga del certificado en PDF.
 *
 * RLS decide quién puede leer el registro: el dueño y los admin.
 * Si alguien pide el id de un certificado ajeno, la consulta simplemente
 * no devuelve filas y respondemos 404 — sin filtrar que existe.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!z.string().uuid().safeParse(id).success) {
    return NextResponse.json({ error: "Certificado no encontrado" }, { status: 404 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { data: cert, error } = await supabase
    .from("certificates")
    .select(
      "id, verification_code, status, issued_at, revoked_at, user_id, certificate_types(name, issuer), profiles(full_name), enrollments(courses(title, total_hours))",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !cert) {
    return NextResponse.json({ error: "Certificado no encontrado" }, { status: 404 });
  }

  if (cert.status !== "emitido" || cert.revoked_at) {
    return NextResponse.json(
      { error: "Este certificado no está vigente" },
      { status: 409 },
    );
  }

  const type = Array.isArray(cert.certificate_types)
    ? cert.certificate_types[0]
    : cert.certificate_types;
  const profile = Array.isArray(cert.profiles) ? cert.profiles[0] : cert.profiles;
  const enrollment = Array.isArray(cert.enrollments)
    ? cert.enrollments[0]
    : cert.enrollments;
  const course =
    enrollment && (Array.isArray(enrollment.courses) ? enrollment.courses[0] : enrollment.courses);

  let bytes: Uint8Array;
  try {
    bytes = await buildCertificatePdf({
      holderName: profile?.full_name ?? "Participante SEP",
      courseTitle: course?.title ?? "Programa SEP",
      certificateName: type?.name ?? "Certificado SEP",
      issuer: type?.issuer ?? "Semillero de Emprendedores Perú",
      verificationCode: cert.verification_code,
      issuedAt: cert.issued_at ? new Date(cert.issued_at) : new Date(),
      hours: Number(course?.total_hours ?? 8),
      verifyUrl: `${siteConfig.url.replace(/^https?:\/\//, "")}/verificar`,
    });
  } catch (pdfError) {
    console.error("[sep] no se pudo generar el certificado PDF:", pdfError);
    return NextResponse.json(
      { error: "No pudimos generar el PDF. Inténtalo nuevamente." },
      { status: 500 },
    );
  }

  const filename = `Certificado-SEP-${cert.verification_code}.pdf`;

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      // Nunca en caché compartida: es un documento personal.
      "Cache-Control": "private, no-store",
    },
  });
}
