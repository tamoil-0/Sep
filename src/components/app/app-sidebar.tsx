"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Icons from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { appNav } from "@/config/navigation";
import { ROLE_META, type UserRole } from "@/types/roles";
import { cn, initials } from "@/lib/utils";
import { LogoutDialog } from "@/components/app/logout-dialog";

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
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const items = appNav[activeRole] ?? [];
  const otherRoles = roles.filter((r) => r !== activeRole && appNav[r]?.length);

  const content = (
    <>
      <div className="px-4 pb-5 pt-1">
        <Link href="/" aria-label="Inicio">
          <Logo className="h-7" variant="white" />
        </Link>
        <p className="mt-2 text-[0.6875rem] uppercase tracking-[0.12em] text-white/40">
          {ROLE_META[activeRole].shortLabel}
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
                  onClick={() => setMobileOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2.5 rounded-[8px] border-l-2 px-3 py-2 text-[0.875rem] transition-colors",
                    active
                      ? "border-gold-500 bg-white/12 font-medium text-white"
                      : "border-transparent text-white/60 hover:bg-white/8 hover:text-white",
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
            <p className="px-3 pb-2 text-[0.625rem] font-medium uppercase tracking-[0.12em] text-white/35">
              Cambiar de panel
            </p>
            <ul className="space-y-0.5">
              {otherRoles.map((r) => (
                <li key={r}>
                  <Link
                    href={ROLE_META[r].home}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 rounded-[8px] px-3 py-2 text-[0.8125rem] text-white/50 transition-colors hover:bg-white/8 hover:text-white"
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
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2.5 rounded-[8px] px-2 py-2 transition-colors hover:bg-white/8"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gold-500 text-[0.6875rem] font-semibold text-ink">
            {initials(fullName || email)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[0.8125rem] font-medium text-white">
              {fullName || "Mi cuenta"}
            </span>
            <span className="block truncate text-[0.6875rem] text-white/45">{email}</span>
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
      <div className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-line bg-white/95 px-4 backdrop-blur lg:hidden">
        <Link href="/" aria-label="Inicio">
          <Logo className="h-6" />
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex size-10 items-center justify-center rounded-lg text-ink transition-colors hover:bg-surface-2"
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <Icons.X className="size-5" /> : <Icons.Menu className="size-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "z-50 flex w-[min(82vw,280px)] shrink-0 flex-col bg-sep-800 py-4 shadow-2xl lg:w-[232px] lg:shadow-none",
          "fixed inset-y-0 left-0 transition-transform duration-250 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {content}
      </aside>
    </>
  );
}
