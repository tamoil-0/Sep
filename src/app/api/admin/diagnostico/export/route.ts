import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth/session";
import { isAdmin } from "@/types/roles";
import { audit } from "@/lib/audit";
import {
  DIAGNOSTIC_PROFILES,
  loadDiagnostic,
  type DiagnosticFilters,
} from "@/server/queries/diagnostic";
import {
  buildDiagnosticWorkbook,
  diagnosticFileName,
} from "@/lib/excel/diagnostic-workbook";
import type { SurveyProfileDb } from "@/types/database";

/**
 * Descarga del diagnóstico en Excel.
 *
 * Tres capas de defensa, como el resto del panel: el rol se comprueba aquí,
 * RLS vuelve a comprobarlo en cada consulta y la descarga queda registrada en
 * `audit_log` — son datos personales de terceros y hay que poder responder
 * quién se llevó qué y cuándo.
 */

const ALL_PROFILES = DIAGNOSTIC_PROFILES.map((profile) => profile.key);

const querySchema = z.object({
  perfil: z.enum(["universitario", "docente", "empresa", "todos"]).default("todos"),
  origen: z.enum(["todos", "feria", "cuenta", "publico"]).default("todos"),
  datos: z.enum(["reales", "todos"]).default("reales"),
  q: z.string().max(120).default(""),
});

export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }
  if (!isAdmin(user.roles)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const parsed = querySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams),
  );
  if (!parsed.success) {
    return NextResponse.json({ error: "Filtros no válidos" }, { status: 400 });
  }

  const { perfil, origen, datos, q } = parsed.data;
  const filters: DiagnosticFilters = {
    profiles: perfil === "todos" ? ALL_PROFILES : [perfil as SurveyProfileDb],
    origin: origen,
    search: q,
    dataset: datos,
  };

  const generatedAt = new Date();
  let file: Buffer;
  let snapshotSize = 0;

  try {
    const snapshot = await loadDiagnostic(filters);
    snapshotSize = snapshot.participants.length;
    file = await buildDiagnosticWorkbook(snapshot, {
      generatedAt,
      generatedBy: user.fullName || user.email,
    });
  } catch (error) {
    console.error("[sep] no se pudo generar el Excel del diagnóstico:", error);
    return NextResponse.json(
      { error: "No pudimos generar el archivo. Inténtalo nuevamente." },
      { status: 500 },
    );
  }

  await audit({
    actorId: user.id,
    action: "EXPORT_DIAGNOSTIC",
    entity: "survey_leads",
    after: { ...filters, rows: snapshotSize },
  });

  const filename = diagnosticFileName(filters.profiles, generatedAt);

  return new NextResponse(new Uint8Array(file), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(file.byteLength),
      // Datos personales: nunca en caché compartida.
      "Cache-Control": "private, no-store",
    },
  });
}
