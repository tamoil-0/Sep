import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Cliente para datos públicos: catálogo, colegios de la red, speakers
 * aprobados, eventos publicados, blog.
 *
 * Por qué existe: el cliente normal lee `cookies()` para recuperar la sesión,
 * y eso obliga a Next a renderizar la página en cada petición. Resultado: cada
 * visita a /cursos golpeaba Postgres y se sentía lenta.
 *
 * Este cliente no toca cookies, así que las páginas que lo usan pueden
 * generarse estáticamente y revalidarse cada N minutos (ISR).
 *
 * Sigue usando la anon key: **RLS se aplica igual**. Solo devuelve lo que las
 * políticas ya permiten leer a un visitante anónimo.
 */
export function createPublicClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
