"use client";

import * as React from "react";

/**
 * Métrica que cuenta al entrar en viewport.
 *
 * Escribe directamente en el nodo del DOM en lugar de usar estado: la animación
 * es una sincronización con un sistema externo, no datos de React. Así evitamos
 * ~60 renders por segundo y el SSR ya entrega el valor final (si el JS no carga,
 * el número sigue siendo correcto).
 *
 * Respeta `prefers-reduced-motion`.
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = 1400,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const format = (n: number) => `${prefix}${n.toLocaleString("es-PE")}${suffix}`;
    let frame = 0;
    let started = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t); // easeOutExpo
          node.textContent = format(Math.round(eased * value));
          if (t < 1) frame = requestAnimationFrame(tick);
        };

        node.textContent = format(0);
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      node.textContent = format(value);
    };
  }, [value, prefix, suffix, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString("es-PE")}
      {suffix}
    </span>
  );
}
