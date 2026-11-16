import { Skeleton } from "@/components/ui/primitives";

/**
 * Silueta de una ficha de curso: aparece al instante al hacer clic en un
 * curso, mientras llega la página (respuesta al feedback «se demora en
 * cargar»). Misma forma que la página real para que no haya saltos.
 */
export function CourseSkeleton({ dark = false }: { dark?: boolean }) {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Cargando el curso…</span>
      <div className={dark ? "theme-night halo rounded-lg p-6 sm:p-8" : "rounded-lg border border-line bg-surface-0 p-6 sm:p-8"}>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-32 rounded-full" />
        </div>
        <Skeleton className="mt-5 h-9 w-3/4 max-w-xl" />
        <Skeleton className="mt-3 h-4 w-full max-w-2xl" />
        <Skeleton className="mt-2 h-4 w-2/3 max-w-xl" />
        <div className="mt-6 flex flex-wrap gap-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-4 w-24" />
          ))}
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 rounded-md border border-line bg-surface-0 p-4">
            <Skeleton className="size-8 shrink-0 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="mt-2 h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
