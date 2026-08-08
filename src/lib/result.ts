/**
 * Resultado tipado para Server Actions.
 *
 * Regla: una acción nunca lanza al cliente. Devuelve un `ActionResult`
 * con un mensaje ya traducido al español y apto para mostrar. Los detalles
 * técnicos van al log del servidor, nunca a la respuesta.
 */

export type ActionResult<T = void> =
  | { ok: true; data: T; message?: string }
  | { ok: false; error: string; code?: string; fieldErrors?: Record<string, string[]> };

export function ok<T>(data: T, message?: string): ActionResult<T> {
  return { ok: true, data, message };
}

export function fail(
  error: string,
  code?: string,
  fieldErrors?: Record<string, string[]>,
): ActionResult<never> {
  return { ok: false, error, code, fieldErrors };
}

/**
 * Traduce los códigos que lanzan las funciones RPC de Postgres.
 * Cada `raise exception 'CODE'` del SQL tiene aquí su mensaje humano.
 */
const PG_ERRORS: Record<string, string> = {
  AUTH_REQUIRED: "Necesitas iniciar sesión para hacer esto.",
  FORBIDDEN: "No tienes permiso para esta acción.",
  SUPER_ADMIN_REQUIRED: "Solo un super administrador puede hacer esto.",
  SELF_MODIFICATION: "No puedes modificar tus propios roles.",

  COURSE_NOT_FOUND: "Ese curso no existe.",
  COURSE_NOT_OPEN: "Este curso aún no está abierto para inscripciones.",
  COURSE_FULL: "El curso llegó a su cupo máximo. Te avisaremos de la próxima cohorte.",
  NOT_ENROLLED: "No estás inscrito en el curso de esta sesión.",
  COURSE_NOT_COMPLETED:
    "Completa todas las sesiones del curso antes de pedir tu certificado.",

  ITEM_NOT_FOUND: "Ese producto no está disponible.",
  INVALID_ITEM_TYPE: "Tipo de producto no válido.",
  FREE_ITEM: "Este producto no requiere pago.",
  ALREADY_ISSUED: "Ya tienes este certificado.",
  ENROLLMENT_REQUIRED: "Debes estar inscrito en el curso.",

  ORDER_NOT_FOUND: "No encontramos esa orden.",
  ALREADY_PAID: "Esta orden ya fue pagada.",
  ALREADY_REVIEWED: "Este pago ya fue revisado.",
  PAYMENT_NOT_FOUND: "No encontramos ese pago.",
  INVALID_METHOD: "Método de pago no válido para este flujo.",
  OPERATION_CODE_REQUIRED: "Escribe el código de operación que te dio la app.",

  APPLICATION_NOT_FOUND: "No encontramos esa postulación.",
  NO_ACCOUNT: "Quien postuló aún no tiene cuenta. Pídele que se registre primero.",
  INVALID_HOURS: "Registra entre 0.5 y 12 horas por día.",
  FUTURE_DATE: "No puedes registrar horas futuras.",
  DAILY_LIMIT: "Ya tienes 12 horas registradas ese día.",

  INVALID_EMAIL: "Ese correo no parece válido.",
  NO_ANSWERS: "No recibimos ninguna respuesta.",
};

/** Errores nativos de Postgres que sí conviene traducir. */
const PG_CODES: Record<string, string> = {
  "23505": "Ese registro ya existe.",
  "23503": "Falta un dato relacionado para completar la operación.",
  "23514": "Alguno de los datos no cumple las reglas de validación.",
  "42501": "No tienes permiso para esta operación.",
  PGRST301: "Tu sesión expiró. Vuelve a iniciar sesión.",
};

interface PgLikeError {
  message?: string;
  code?: string;
  hint?: string | null;
  details?: string | null;
}

/**
 * Convierte un error de Supabase/Postgres en un `ActionResult` presentable.
 * Prioriza el `hint` del SQL, que ya viene redactado en español.
 */
export function fromPostgrestError(
  error: PgLikeError,
  fallback = "No pudimos completar la operación. Inténtalo de nuevo.",
): ActionResult<never> {
  const raw = error.message ?? "";

  for (const [code, message] of Object.entries(PG_ERRORS)) {
    if (raw.includes(code)) {
      return fail(error.hint || message, code);
    }
  }

  if (error.code && PG_CODES[error.code]) {
    return fail(PG_CODES[error.code], error.code);
  }

  // Nunca devolvemos el mensaje crudo de Postgres al cliente: puede filtrar
  // nombres de tablas, columnas y restricciones.
  console.error("[sep] error de base de datos:", {
    code: error.code,
    message: raw,
    details: error.details,
  });

  return fail(fallback, error.code);
}

/** Formatea los errores de Zod para los formularios. */
export function fromZodError(
  fieldErrors: Record<string, string[] | undefined>,
): ActionResult<never> {
  const clean: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(fieldErrors)) {
    if (value?.length) clean[key] = value;
  }
  return {
    ok: false,
    error: "Revisa los campos marcados.",
    code: "VALIDATION",
    fieldErrors: clean,
  };
}
