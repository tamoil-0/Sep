import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Proxy (antes `middleware`) — Next.js 16.
 *
 * Hace dos cosas y nada más (Plan Maestro §9.2, capa 1):
 *   1. Refresca la sesión de Supabase para que las cookies no expiren.
 *   2. Bloquea el acceso anónimo a las rutas privadas.
 *
 * La verificación fina de rol vive en cada página (`requireRole`) y en las
 * políticas RLS de Postgres. El proxy es un filtro grueso, no la autoridad.
 */

const PROTECTED_PREFIXES = [
  "/panel",
  "/estudiante",
  "/docente",
  "/mentor",
  "/institucion",
  "/speaker",
  "/admin",
  "/cuenta",
];

const AUTH_PAGES = ["/login", "/registro", "/recuperar"];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (user && AUTH_PAGES.some((p) => pathname === p)) {
    const url = request.nextUrl.clone();
    url.pathname = "/panel";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Todas las rutas excepto estáticos e imágenes.
     * Se excluyen también los assets de marca para no gastar invocaciones.
     */
    "/((?!_next/static|_next/image|favicon.ico|brand|images|partners|og|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)",
  ],
};
