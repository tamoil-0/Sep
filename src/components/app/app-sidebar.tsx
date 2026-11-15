"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as Icons from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { appNav } from "@/config/navigation";
import { ROLE_META, type UserRole } from "@/types/roles";
import { cn, initials } from "@/lib/utils";
import { LogoutDialog } from "@/components/app/logout-dialog";
import { AppLoadingSplash } from "@/components/app/app-loading-splash";
import { useDialogA11y } from "@/components/ui/use-dialog-a11y";

type IconName = keyof typeof Icons;

function NavIcon({ name }: { name?: string }) {
  if (!name) return null;
  const Cmp = Icons[name as IconName] as React.ComponentType<{ className?: string }>;
  if (!Cmp) return null;
  return <Cmp className="size-[18px] shrink-0" />;
}

export function AppSidebar({
  activeRole,
  roles,
  fullName,
  email,
}: {
  activeRole: UserRole;
  roles: UserRole[];
  fullName: string;
  email: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [navigatingTo, setNavigatingTo] = React.useState<string | null>(null);
  const routeRole = React.useMemo<UserRole>(() => {
    const roleFromPath = roles.find((role) => {
      const home = ROLE_META[role].home;
      return pathname === home || pathname.startsWith(`${home}/`);
    });

    return roleFromPath ?? activeRole;
  }, [activeRole, pathname, roles]);
  const items = appNav[routeRole] ?? [];
  const otherRoles = roles.filter((r) => r !== routeRole && appNav[r]?.length);
  const drawerRef = useDialogA11y<HTMLElement>({
    open: mobileOpen,
    onClose: () => setMobileOpen(false),
  });

  function prepareNavigation(href: string) {
    if (href !== pathname) router.prefetch(href);
  }

  function startNavigation(href: string) {
    if (href !== pathname) setNavigatingTo(href);
    setMobileOpen(false);
  }

  const content = (
    <>
      <div className="px-4 pb-5 pt-1">
        <Link href="/" aria-label="Inicio" className="inline-flex">
          <Logo className="h-11" variant="white" />
        </Link>
        <p className="mt-4 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-caption font-medium text-noche-300">
          <span aria-hidden className="size-1.5 rounded-full bg-cian-500" />
          Panel de {ROLE_META[routeRole].shortLabel.toLowerCase()}
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        <ul className="space-y-0.5">
          {items.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onPointerEnter={() => prepareNavigation(item.href)}
                  onFocus={() => prepareNavigation(item.href)}
                  onClick={() => startNavigation(item.href)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group/nav relative flex min-h-control items-center gap-3 rounded-sm px-3 py-2 text-body-sm transition-colors duration-150",
                    active
                      ? "bg-white/10 font-medium text-white ring-1 ring-inset ring-white/10 [&_svg]:text-violeta-300"
                      : "text-noche-300 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <NavIcon name={item.icon} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {otherRoles.length > 0 && (
          <div className="mt-6 border-t border-white/10 pt-4">
            <p className="px-3 pb-2 text-caption font-medium text-noche-400">
              Cambiar de panel
            </p>
            <ul className="space-y-0.5">
              {otherRoles.map((r) => (
                <li key={r}>
                  <Link
                    href={ROLE_META[r].home}
                    onPointerEnter={() => prepareNavigation(ROLE_META[r].home)}
                    onFocus={() => prepareNavigation(ROLE_META[r].home)}
                    onClick={() => startNavigation(ROLE_META[r].home)}
                    className="flex min-h-control items-center gap-3 rounded-sm px-3 py-2 text-body-sm text-noche-300 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <Icons.Repeat className="size-4" />
                    {ROLE_META[r].shortLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/cuenta"
          onPointerEnter={() => prepareNavigation("/cuenta")}
          onFocus={() => prepareNavigation("/cuenta")}
          onClick={() => startNavigation("/cuenta")}
          className="flex min-h-control items-center gap-2.5 rounded-sm px-2 py-2 transition-colors hover:bg-white/8"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-cian-500 text-caption font-semibold text-noche-900">
            {initials(fullName || email)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-body-sm font-medium text-white">
              {fullName || "Mi cuenta"}
            </span>
            <span className="block truncate text-caption text-noche-400">{email}</span>
          </span>
        </Link>

        <div className="mt-1">
          <LogoutDialog userName={fullName || email} />
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Barra móvil */}
      <header className="theme-night sticky top-0 z-40 flex h-nav w-full items-center justify-between border-b border-line bg-noche-900 px-4 lg:hidden">
        <Link href="/" aria-label="Inicio" className="flex min-h-control items-center">
          <Logo className="h-9" variant="white" />
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex size-control items-center justify-center rounded-sm text-ink transition-colors hover:bg-surface-2"
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <Icons.X className="size-5" /> : <Icons.Menu className="size-5" />}
        </button>
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      <aside
        ref={drawerRef}
        role={mobileOpen ? "dialog" : undefined}
        aria-modal={mobileOpen ? "true" : undefined}
        aria-labelledby="app-navigation-title"
        tabIndex={mobileOpen ? -1 : undefined}
        className={cn(
          "halo z-50 flex w-[min(88vw,320px)] shrink-0 flex-col py-5 shadow-elevated outline-none lg:w-[240px] lg:shadow-none",
          "fixed inset-y-0 left-0 transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <h2 id="app-navigation-title" className="sr-only">Navegación del panel</h2>
        {content}
      </aside>

      {navigatingTo !== null &&
        navigatingTo !== pathname &&
        typeof document !== "undefined" &&
        createPortal(<AppLoadingSplash overlay />, document.body)}
    </>
  );
}
