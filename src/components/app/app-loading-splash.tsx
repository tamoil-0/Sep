import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

export function AppLoadingSplash({ overlay = false }: { overlay?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-surface-1",
        overlay
          ? "fixed inset-0 z-[45] bg-surface-1/92 backdrop-blur-sm lg:left-[232px]"
          : "min-h-[calc(100dvh-8rem)] w-full",
      )}
      role="status"
      aria-live="polite"
      aria-label="Cargando la siguiente pantalla"
    >
      <div className="flex flex-col items-center px-6 text-center animate-fade-in">
        <div className="relative flex size-24 items-center justify-center">
          <span className="absolute inset-0 rounded-full border-2 border-sep-100" />
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-r-sep-300 border-t-sep-600" />
          <span className="absolute inset-2 animate-[spin_1.4s_linear_infinite_reverse] rounded-full border border-transparent border-b-gold-500" />
          <span className="flex size-[66px] items-center justify-center rounded-full bg-white shadow-[0_8px_30px_rgba(46,11,232,.14)]">
            <Logo className="h-9" />
          </span>
        </div>
        <p className="mt-5 font-display text-sm font-semibold text-ink">Preparando tu panel</p>
        <p className="mt-1 text-xs text-slate-ui">Un momento, estamos cargando tu información…</p>
        <div className="mt-5 flex gap-1.5" aria-hidden>
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              className="size-1.5 animate-pulse rounded-full bg-sep-500"
              style={{ animationDelay: `${dot * 180}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
