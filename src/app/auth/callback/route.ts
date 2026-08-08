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
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  return NextResponse.redirect(`${origin}${safeNext}`);
}
