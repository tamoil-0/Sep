/**
 * Estado de carga del área privada.
 *
 * Reemplaza el salto en blanco entre pantallas por un esqueleto con la misma
 * forma que el contenido real. La navegación deja de sentirse cortada.
 */
export default function AppLoading() {
  return (
    <div aria-busy="true" aria-label="Cargando">
      <div className="mb-7">
        <div className="skeleton h-8 w-64" />
        <div className="skeleton mt-3 h-4 w-96 max-w-full" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-[14px] border border-line bg-white p-5">
            <div className="skeleton h-3 w-24" />
            <div className="skeleton mt-3 h-7 w-16" />
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        <div className="skeleton h-3 w-32" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-[14px] border border-line bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="skeleton size-9 rounded-full" />
              <div className="flex-1">
                <div className="skeleton h-4 w-48 max-w-full" />
                <div className="skeleton mt-2 h-3 w-32" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

