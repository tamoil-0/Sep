/**
 * Rate limiting en memoria — Plan Maestro §9.3.
 *
 * ⚠️ Válido para una sola instancia. En producción con varias regiones de
 * Vercel, sustituir por Upstash Redis (`@upstash/ratelimit`) manteniendo
 * esta misma firma:
 *
 *   const { success } = await ratelimit.limit(key)
 *   return success
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Limpieza perezosa para que el Map no crezca sin límite.
function sweep(now: number) {
  if (buckets.size < 5000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/**
 * @param key      Identificador del cubo, p. ej. `login:${ip}:${email}`
 * @param limit    Intentos permitidos dentro de la ventana
 * @param windowMs Duración de la ventana en milisegundos
 * @returns `true` si la petición está permitida
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  sweep(now);

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) return false;

  bucket.count += 1;
  return true;
}

/** Límites declarados en el Plan Maestro §9.3. */
export const RATE_LIMITS = {
  login: { limit: 5, windowMs: 15 * 60 * 1000 },
  signup: { limit: 3, windowMs: 60 * 60 * 1000 },
  publicForm: { limit: 5, windowMs: 60 * 60 * 1000 },
  newsletter: { limit: 3, windowMs: 60 * 60 * 1000 },
  diagnostic: { limit: 2, windowMs: 24 * 60 * 60 * 1000 },
  // En ferias muchas personas comparten el mismo wifi o red móvil.
  fair: { limit: 300, windowMs: 12 * 60 * 60 * 1000 },
} as const;
