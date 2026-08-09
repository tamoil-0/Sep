export default function MarketingLoading() {
  return (
    <div className="animate-fade-in" role="status" aria-label="Cargando contenido">
      <section className="border-b border-line bg-surface-1">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <div className="skeleton h-6 w-32 rounded-full" />
            <div className="skeleton mt-6 h-12 w-full max-w-xl sm:h-16" />
            <div className="skeleton mt-3 h-12 w-4/5 max-w-lg" />
            <div className="skeleton mt-7 h-5 w-full max-w-md" />
            <div className="skeleton mt-2 h-5 w-3/4 max-w-sm" />
          </div>
          <div className="skeleton aspect-[4/3] min-h-56 rounded-[20px]" />
        </div>
      </section>
      <section className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="rounded-[16px] border border-line bg-white p-4">
              <div className="skeleton aspect-[16/9] w-full rounded-[12px]" />
              <div className="skeleton mt-5 h-5 w-2/3" />
              <div className="skeleton mt-3 h-4 w-full" />
              <div className="skeleton mt-2 h-4 w-4/5" />
            </div>
          ))}
        </div>
      </section>
      <span className="sr-only">Cargando la siguiente página…</span>
    </div>
  );
}
