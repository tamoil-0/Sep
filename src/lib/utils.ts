import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "display",
        "hero",
        "h1",
        "h2",
        "h3",
        "h4",
        "body-lg",
        "body",
        "body-sm",
        "caption",
      ],
      tracking: ["eyebrow"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSoles(cents: number): string {
  return `S/ ${(cents / 100).toLocaleString("es-PE", {
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Zona horaria fija de la plataforma. El servidor (Vercel) corre en UTC y el
 * navegador en la hora local: sin fijarla, la misma fecha se pinta distinto en
 * el servidor y en el cliente (horas corridas 5 h y errores de hidratación).
 */
const SEP_TIME_ZONE = "America/Lima";

/** "2026-11-20" (solo fecha) se interpreta como medianoche UTC: se formatea en UTC para no restar un día. */
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Node y el navegador traen versiones distintas de ICU: uno separa "2:00 p. m."
 * con espacio fino no separable (U+202F/U+00A0) y el otro con espacio normal.
 * Se normalizan para que el HTML del servidor coincida con el del cliente.
 */
const normalizeSpaces = (text: string) => text.replace(/[\u00a0\u202f]/g, " ");

export function formatDate(date: string | Date): string {
  const dateOnly = typeof date === "string" && DATE_ONLY.test(date);
  return normalizeSpaces(
    new Intl.DateTimeFormat("es-PE", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: dateOnly ? "UTC" : SEP_TIME_ZONE,
    }).format(typeof date === "string" ? new Date(date) : date),
  );
}

export function formatDateTime(date: string | Date): string {
  return normalizeSpaces(
    new Intl.DateTimeFormat("es-PE", {
      weekday: "long",
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      timeZone: SEP_TIME_ZONE,
    }).format(typeof date === "string" ? new Date(date) : date),
  );
}

export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function relativeTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "Hace un momento";
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Hace ${days} d`;
  return formatDate(d);
}
