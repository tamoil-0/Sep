import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/**
 * Eventos publicados, ya separados en próximos y pasados.
 *
 * El corte temporal se calcula aquí y no en el componente: mantiene el render
 * puro y deja una sola fuente de verdad para «qué cuenta como próximo».
 */
export const getPublishedEvents = cache(async () => {
  const supabase = await createClient();
  const nowIso = new Date().toISOString();

  const [{ data: upcoming }, { data: past }] = await Promise.all([
    supabase
      .from("events")
      .select("id, slug, title, description, kind, starts_at, location, is_online, capacity")
      .eq("is_published", true)
      .gte("starts_at", nowIso)
      .order("starts_at", { ascending: true }),
    supabase
      .from("events")
      .select("id, slug, title, description, kind, starts_at, location, is_online, capacity")
      .eq("is_published", true)
      .lt("starts_at", nowIso)
      .order("starts_at", { ascending: false })
      .limit(12),
  ]);

  return { upcoming: upcoming ?? [], past: past ?? [] };
});
