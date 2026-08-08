"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/primitives";
import { marketingNav } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-line bg-white/85 backdrop-blur-xl"
          : "border-b border-transparent bg-white",
      )}
    >
      <Container size="wide">
        <nav className="flex h-[68px] items-center justify-between gap-6">
          <Link href="/" className="shrink-0" aria-label="Inicio — SEP">
            <Logo className="h-7" />
          </Link>

          {/* Desktop */}
          <ul className="hidden items-center gap-0.5 lg:flex">
            {marketingNav.map((item) => (
              <li
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-[0.9375rem] font-medium text-graphite transition-colors hover:bg-surface-1 hover:text-ink"
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown
                      className={cn(
                        "size-3.5 text-mist transition-transform duration-200",
                        openMenu === item.label && "rotate-180",
                      )}
                    />
                  )}
                </Link>

                {item.children && openMenu === item.label && (
                  <div className="absolute left-0 top-full w-[340px] pt-2">
                    <div className="animate-fade-in overflow-hidden rounded-[14px] border border-line bg-white p-2 shadow-[0_16px_48px_rgba(18,16,28,.12)]">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-[10px] px-3 py-2.5 transition-colors hover:bg-surface-1"
                        >
                          <p className="text-sm font-medium text-ink">{child.label}</p>
                          {child.description && (
                            <p className="mt-0.5 text-xs leading-relaxed text-slate-ui">
                              {child.description}
                            </p>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-2 lg:flex">
            <Button href="/login" variant="ghost" size="sm">
              Iniciar sesión
            </Button>
            <Button href="/registro" variant="primary" size="sm">
              Crear cuenta
            </Button>
          </div>

          {/* Móvil */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-lg p-2 text-ink lg:hidden"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>
      </Container>

      {mobileOpen && (
        <div className="fixed inset-x-0 top-[68px] bottom-0 z-40 overflow-y-auto border-t border-line bg-white lg:hidden">
          <Container className="py-6">
            <ul className="space-y-1">
              {marketingNav.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2.5 font-display text-lg font-semibold text-ink"
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <ul className="mb-2 ml-3 border-l border-line pl-4">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className="block py-2 text-[0.9375rem] text-slate-ui"
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
