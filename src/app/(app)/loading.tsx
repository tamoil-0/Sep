import { Skeleton } from "@/components/ui/primitives";

/**
 * Carga de cualquier vista del panel (REDISEÑO §5): el sidebar sigue en su
 * lugar (vive en el layout) y aquí se dibuja la silueta de la página
 * —cabecera, métricas y lista— con el brillo suave de `.skeleton`.
 */
export default function AppLoading() {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Cargando…</span>
      <Skeleton className="h-8 w-64 max-w-full" />
      <Skeleton className="mt-3 h-4 w-96 max-w-full" />

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="rounded-md border border-line bg-surface-0 p-4 sm:p-5">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="mt-4 h-8 w-16" />
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-md border border-line bg-surface-0 p-4">
            <Skeleton className="size-10 shrink-0 rounded-full" />
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
