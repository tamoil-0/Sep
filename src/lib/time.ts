import "server-only";
import { cache } from "react";

/**
 * Instante actual, memoizado por petición.
 *
 * Existe porque `Date.now()` dentro del render de un Server Component es una
 * llamada impura: rompe la reproducibilidad y el linter la marca con razón.
 * Al envolverla en `cache()` cada petición obtiene un único "ahora" coherente
 * para todos los componentes que lo consulten.
 */
export const now = cache(() => Date.now());
