"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Check, Clock, Loader2, Search, Sprout, X } from "lucide-react";
import { enrollAction } from "@/server/actions/learning";
import { Badge, Card, EmptyState } from "@/components/ui/primitives";
import { Input } from "@/components/forms/field";
import { CourseMedia } from "@/components/marketing/course-media";
import { formatSoles, cn } from "@/lib/utils";

export interface CatalogCourse {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  category: string | null;
  audience: string;
  status: string;
  totalHours: number;
  sessionsCount: number;
  weeks: number;
  isFree: boolean;
  priceCents: number;
  coverUrl: string | null;
  enrolled: boolean;
}

const CATEGORIES = ["Todos", "Metodologías ágiles", "Liderazgo", "Para docentes", "SILP"];

export function CourseCatalog({ courses }: { courses: CatalogCourse[] }) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("Todos");
  const [busy, setBusy] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const visible = courses.filter((c) => {
    const matchesCategory = category === "Todos" || c.category === category;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      c.title.toLowerCase().includes(q) ||
      (c.description ?? "").toLowerCase().includes(q) ||
      (c.subtitle ?? "").toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });
  const hasFilters = query.trim().length > 0 || category !== "Todos";

  function clearFilters() {
    setQuery("");
    setCategory("Todos");
  }

  async function enroll(slug: string) {
    setBusy(slug);
    setError(null);
    try {
      const result = await enrollAction(slug);
      if (result.ok) router.push(`/estudiante/curso/${slug}`);
      else setError(result.error);
    } catch {
      setError("No pudimos conectarnos. Revisa tu conexión e inténtalo nuevamente.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      {/* Filtros */}
      <div className="mb-6 space-y-3">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-mist" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar cursos…"
            className="pl-10"
            aria-label="Buscar cursos"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "min-h-control rounded-sm px-3.5 py-2 text-body-sm font-medium transition-colors",
                category === c
                  ? "bg-sep-600 text-white"
                  : "bg-white text-graphite ring-1 ring-inset ring-line hover:bg-surface-2",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-3 text-caption text-slate-ui" role="status">
            <span>
              Mostrando {visible.length} de {courses.length} cursos
              {category !== "Todos" ? ` en “${category}”` : ""}.
            </span>
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex min-h-control items-center gap-1.5 font-semibold text-sep-700 hover:underline"
            >
              <X className="size-icon-sm" /> Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-sm border border-danger/25 bg-danger-bg px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {visible.length === 0 ? (
        <EmptyState
          icon={<Search className="size-5" />}
          title="No encontramos cursos con ese filtro"
          description="Prueba con otra palabra o quita los filtros."
          action={
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex min-h-control items-center gap-2 rounded-sm border border-line bg-white px-4 text-body-sm font-semibold text-ink hover:bg-surface-2"
            >
              <X className="size-icon-sm" /> Limpiar filtros
            </button>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((c) => {
            const available = c.status === "disponible";
            return (
              <Card key={c.id} className="flex flex-col overflow-hidden p-3">
                <CourseMedia
                  slug={c.slug}
                  title={c.title}
                  category={c.category}
                  coverUrl={c.coverUrl}
                  className="aspect-[16/9] w-full"
                />

                <div className="flex flex-1 flex-col p-2 pt-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {c.enrolled ? (
                      <Badge tone="brand">
                        <Check className="size-3.5" />
                        Inscrito
                      </Badge>
                    ) : available ? (
                      <Badge tone="seed">Disponible</Badge>
                    ) : (
                      <Badge tone="neutral">Próximamente</Badge>
                    )}
                    {c.audience === "docente" && <Badge tone="gold">Docentes</Badge>}
                    {c.category === "SILP" && <Badge tone="gold">Insignia</Badge>}
                  </div>

                  <h3 className="mt-3.5 font-display text-body font-semibold leading-snug text-ink">
                    {c.title}
                  </h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-ui">
                    {c.description}
                  </p>

                  <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-line pt-3.5 text-xs text-slate-ui">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="size-3.5 text-mist" />
                      {c.totalHours} h
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="size-3.5 text-mist" />
                      {c.sessionsCount} sesiones
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Sprout className="size-3.5 text-mist" />
                      {c.weeks} sem.
                    </span>
                  </dl>

                  <p className="mt-3 text-sm font-medium text-ink">
                    {c.isFree ? (
                      <span className="text-seed-700">Gratuito</span>
                    ) : (
                      formatSoles(c.priceCents)
                    )}
                  </p>

                  <div className="mt-4">
                    {c.enrolled ? (
                      <Link
                        href={`/estudiante/curso/${c.slug}`}
                        className="inline-flex min-h-control w-full items-center justify-center rounded-sm border border-line bg-white text-sm font-medium text-ink transition-colors hover:bg-surface-2"
                      >
                        Ir al curso
                      </Link>
                    ) : available ? (
                      <button
                        type="button"
                        onClick={() => enroll(c.slug)}
                        disabled={busy !== null}
                        className="inline-flex min-h-control w-full items-center justify-center gap-2 rounded-sm bg-sep-600 text-sm font-medium text-white transition-colors hover:bg-sep-700 disabled:opacity-60"
                      >
                        {busy === c.slug && <Loader2 className="size-4 animate-spin" />}
                        {c.isFree ? "Inscribirme gratis" : "Continuar"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="inline-flex min-h-control w-full items-center justify-center rounded-sm border border-line bg-surface-1 text-sm text-mist"
                      >
                        Próximamente
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
