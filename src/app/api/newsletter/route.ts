import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  fullName: z.string().trim().max(120).optional(),
  region: z.string().trim().max(80).optional(),
  source: z.string().trim().max(40).optional(),
});

export async function POST(request: NextRequest) {
  // Verificación de origen — protección CSRF para endpoints de API (§9.4)
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== request.nextUrl.host) {
        return NextResponse.json({ error: "Origen no permitido" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Origen no permitido" }, { status: 403 });
    }
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  // 3 suscripciones por hora e IP (§9.3)
  if (!checkRateLimit(`newsletter:${ip}`, 3, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Demasiados intentos. Inténtalo más tarde." },
      { status: 429 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo no válido" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Correo no válido" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("newsletter_subscribers").insert({
    email: parsed.data.email,
    full_name: parsed.data.fullName ?? null,
    region: parsed.data.region ?? null,
    source: parsed.data.source ?? "web",
  });

  // 23505 = unique_violation: ya estaba suscrito. Respondemos igual para
  // no revelar qué correos están en la lista.
  if (error && error.code !== "23505") {
    return NextResponse.json({ error: "No pudimos suscribirte" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
