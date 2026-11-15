"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Pestañas accesibles (REDISEÑO §5): roles tablist/tab/tabpanel, flechas,
 * Inicio y Fin del teclado (foco itinerante) e indicador que se desliza con
 * `transform` (no `left`). Componente compuesto, sin props booleanos:
 *
 *   <Tabs defaultValue="curso" label="Secciones del curso">
 *     <Tabs.List>
 *       <Tabs.Tab value="curso">Curso</Tabs.Tab>
 *       <Tabs.Tab value="malla">Malla</Tabs.Tab>
 *     </Tabs.List>
 *     <Tabs.Panel value="curso">…</Tabs.Panel>
 *   </Tabs>
 */
type Ctx = {
  value: string;
  setValue: (v: string) => void;
  baseId: string;
  label: string;
};
const TabsContext = React.createContext<Ctx | null>(null);
const useTabs = () => {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("Tabs.* debe ir dentro de <Tabs>");
  return ctx;
};

function TabsRoot({
  defaultValue,
  value: controlled,
  onValueChange,
  label,
  children,
  className,
}: {
  defaultValue?: string;
  value?: string;
  onValueChange?: (v: string) => void;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [inner, setInner] = React.useState(defaultValue ?? "");
  const value = controlled ?? inner;
  const setValue = (v: string) => {
    if (controlled === undefined) setInner(v);
    onValueChange?.(v);
  };
  const baseId = React.useId();
  return (
    <TabsContext.Provider value={{ value, setValue, baseId, label }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  const { value, label } = useTabs();
  const listRef = React.useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = React.useState({ x: 0, w: 0 });

  React.useLayoutEffect(() => {
    const active = listRef.current?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
    if (active) setIndicator({ x: active.offsetLeft, w: active.offsetWidth });
  }, [value]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const tabs = Array.from(listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]') ?? []);
    const i = tabs.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return;
    const next =
      e.key === "ArrowRight" ? tabs[(i + 1) % tabs.length]
      : e.key === "ArrowLeft" ? tabs[(i - 1 + tabs.length) % tabs.length]
      : e.key === "Home" ? tabs[0]
      : e.key === "End" ? tabs[tabs.length - 1]
      : null;
    if (next) {
      e.preventDefault();
      next.focus();
      next.click();
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn("relative flex gap-1 overflow-x-auto border-b border-line", className)}
    >
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-px origin-left rounded-full grad-marca transition-transform duration-300 ease-out"
        style={{ transform: `translateX(${indicator.x}px) scaleX(${indicator.w})` }}
      />
    </div>
  );
}

function TabsTab({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = useTabs();
  const selected = ctx.value === value;
  return (
    <button
      type="button"
      role="tab"
      id={`${ctx.baseId}-tab-${value}`}
      aria-selected={selected}
      aria-controls={`${ctx.baseId}-panel-${value}`}
      tabIndex={selected ? 0 : -1}
      onClick={() => ctx.setValue(value)}
      className={cn(
        "min-h-control shrink-0 whitespace-nowrap px-4 text-body-sm font-medium transition-colors",
        selected ? "text-ink" : "text-slate-ui hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

function TabsPanel({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = useTabs();
  if (ctx.value !== value) return null;
  return (
    <div
      role="tabpanel"
      id={`${ctx.baseId}-panel-${value}`}
      aria-labelledby={`${ctx.baseId}-tab-${value}`}
      tabIndex={0}
      className={cn("pt-5 outline-none", className)}
    >
      {children}
    </div>
  );
}

export const Tabs = Object.assign(TabsRoot, { List: TabsList, Tab: TabsTab, Panel: TabsPanel });
