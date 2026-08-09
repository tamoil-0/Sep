import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Intercambia el código de Supabase por una sesión tras confirmar el email u OAuth. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  // Solo rutas internas: evita open redirect.
  const safeNext = next?.startsWith("/") && !next.startsWith("//") ? next : "/panel";

  if (!code) {
    const target = safeNext === "/nueva-contrasena" ? "/recuperar?error=invalid_link" : "/login?error=missing_code";
    return NextResponse.redirect(`${origin}${target}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const target = safeNext === "/nueva-contrasena" ? "/recuperar?error=expired_link" : "/login?error=auth_failed";
    return NextResponse.redirect(`${origin}${target}`);
  }

  const response = NextResponse.redirect(`${origin}${safeNext}`);
  if (safeNext === "/nueva-contrasena") {
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
