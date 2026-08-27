"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/primitives";
import { marketingNav } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { useDialogA11y } from "@/components/ui/use-dialog-a11y";

/**
 * El menú anterior se sentía lento por tres razones, todas corregidas aquí:
 *
 * 1. Cerraba en cuanto el cursor salía del <li>, así que al bajar en diagonal
 *    hacia el panel el menú desaparecía. Ahora hay 140 ms de gracia al salir.
 * 2. El panel se montaba y desmontaba en cada hover: el navegador rehacía
 *    layout entero. Ahora siempre está en el DOM y solo cambia opacidad y
 *    transform, que se animan en la GPU.
 * 3. Los enlaces no se precargaban. Con `prefetch` la página siguiente ya
 *    está lista al hacer clic.
 */

const CLOSE_DELAY_MS = 140;

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const mobileMenuRef = useDialogA11y<HTMLDivElement>({
    open: mobileOpen,
    onClose: () => setMobileOpen(false),
  });

  // Scroll pasivo, sin re-render salvo cuando cruza el umbral.
  React.useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Escape cierra el desplegable.
  React.useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openMenu]);

  React.useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  function open(label: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  }

  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), CLOSE_DELAY_MS);
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-b border-line bg-white "
          : "border-b border-transparent bg-white",
      )}
    >
      <Container size="wide">
        <nav className="flex h-16 items-center justify-between gap-8">
          <Link
            href="/"
            className="shrink-0 transition-opacity hover:opacity-80"
            aria-label="Inicio — SEP"
          >
            <Logo className="h-10" />
          </Link>

          {/* ── Escritorio ── */}
          <ul className="hidden items-center gap-0.5 lg:flex">
            {marketingNav.map((item) => {
              const expanded = openMenu === item.label;
              return (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.children && open(item.label)}
                  onMouseLeave={scheduleClose}
                >
                  <Link
                    href={item.href}
                    prefetch
                    aria-expanded={item.children ? expanded : undefined}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    onFocus={() => item.children && open(item.label)}
                    onClick={() => setOpenMenu(null)}
                    className={cn(
                      "flex min-h-control items-center gap-1 rounded-sm px-3 py-2 text-body-sm font-medium transition-colors duration-150",
                      isActive(item.href)
                        ? "text-sep-600"
                        : "text-graphite hover:text-ink",
                      expanded && "text-ink",
                    )}
                  >
                    {item.label}
                    {item.children && (
                      <ChevronDown
                        className={cn(
                          "size-3.5 text-mist transition-transform duration-200",
                          expanded && "rotate-180",
                        )}
                      />
                    )}
                  </Link>

                  {item.children && (
                    /* Siempre montado: solo animamos opacidad y desplazamiento.
                       El padding-top hace de puente invisible hacia el panel. */
                    <div
                      className={cn(
                        "absolute left-0 top-full w-[360px] pt-2 transition-[opacity,transform] duration-200 ease-out",
                        expanded
                          ? "pointer-events-auto translate-y-0 opacity-100"
                          : "pointer-events-none -translate-y-1 opacity-0",
                      )}
                    >
                      <div className="overflow-hidden rounded-lg border border-line bg-white p-2 shadow-elevated">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            prefetch
                            tabIndex={expanded ? 0 : -1}
                            onClick={() => setOpenMenu(null)}
                            className="block rounded-sm px-3.5 py-3 transition-colors duration-150 hover:bg-surface-1"
                          >
                            <p className="text-body-sm font-medium text-ink">
                              {child.label}
                            </p>
                            {child.description && (
                              <p className="mt-0.5 text-caption text-slate-ui">
                                {child.description}
                              </p>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="hidden shrink-0 items-center gap-1.5 lg:flex">
            <Button href="/login" variant="ghost" size="sm" prefetch>
              Iniciar sesión
            </Button>
            <Button href="/registro" variant="primary" size="sm" prefetch>
              Crear cuenta
            </Button>
          </div>

          {/* ── Móvil ── */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="-mr-2 flex size-control items-center justify-center rounded-sm text-ink transition-colors hover:bg-surface-1 lg:hidden"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>
      </Container>

      {mobileOpen && (
        <div
          ref={mobileMenuRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-navigation-title"
          tabIndex={-1}
          className="fixed inset-x-0 bottom-0 top-16 z-40 animate-fade-in overflow-y-auto border-t border-line bg-white outline-none lg:hidden"
        >
          <h2 id="mobile-navigation-title" className="sr-only">Navegación principal</h2>
          <Container className="py-6">
            <ul className="space-y-0.5">
              {marketingNav.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    prefetch
                    onClick={() => setMobileOpen(false)}
                    className="block min-h-control rounded-sm px-3 py-2.5 font-display text-h4 font-semibold text-ink"
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <ul className="mb-3 ml-3 border-l border-line pl-4">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            prefetch
                            onClick={() => setMobileOpen(false)}
                            className="flex min-h-control items-center py-2 text-body-sm text-slate-ui"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-2.5 border-t border-line pt-6">
              <Button href="/registro" variant="gradient" size="lg">
                Crear cuenta gratis
              </Button>
              <Button href="/login" variant="outline" size="lg">
                Iniciar sesión
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
