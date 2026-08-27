import "server-only";

interface QueryResultLike {
  error: { code?: string | null } | null;
}

/**
 * Evita que un fallo de datos termine representado como un listado vacío.
 * Solo registra contexto y código; nunca valores de filas ni mensajes de la base.
 */
export function assertQueryResults(
  context: string,
  ...results: QueryResultLike[]
) {
  const errors = results.filter((result) => result.error);
  if (errors.length === 0) return;

  console.error("[sep] no se pudieron cargar datos:", {
    context,
    codes: errors.map((result) => result.error?.code ?? "UNKNOWN"),
  });
  throw new Error("DATA_LOAD_FAILED");
}
