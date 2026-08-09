import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

const EMAIL_OTP_TYPES = new Set<EmailOtpType>([
  "email",
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
]);

/**
 * Confirma enlaces de correo mediante TokenHash.
 *
 * A diferencia del intercambio PKCE, este flujo oficial de Supabase SSR no
 * depende del navegador donde se creó la cuenta: el correo puede abrirse en
 * Gmail móvil, otra computadora o una pestaña privada.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const rawType = searchParams.get("type");
  const requestedNext = searchParams.get("next");
  const safeNext =
    requestedNext?.startsWith("/") && !requestedNext.startsWith("//")
      ? requestedNext
      : "/panel";

  if (!tokenHash || !rawType || !EMAIL_OTP_TYPES.has(rawType as EmailOtpType)) {
    return NextResponse.redirect(`${origin}/login?error=invalid_email_link`);
  }

  const type = rawType as EmailOtpType;
  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type,
  });

  if (error) {
    const target =
      type === "recovery"
        ? "/recuperar?error=expired_link"
        : "/login?error=invalid_email_link";
    return NextResponse.redirect(`${origin}${target}`);
  }

  const response = NextResponse.redirect(`${origin}${safeNext}`);
  if (type === "recovery") {
    response.cookies.set("sep_password_recovery", "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 10 * 60,
      path: "/",
    });
  }

  return response;
}
