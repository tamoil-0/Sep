"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Apariciones al hacer scroll y animaciones que solo corren en pantalla
 * (REDISEÑO §6.1–6.2). Se monta una vez en el layout raíz y se re-ejecuta en
 * cada cambio de ruta.
 *
 * - `[data-reveal]`: aparece una vez (fade + 12 px). Retraso escalonado con
 *   `style={{ transitionDelay: "60ms" }}`.
 * - `[data-anim]`: maquetas y motivos animados; se pausan fuera de pantalla.
 *
 * Primero marca como visible lo que ya está en pantalla y DESPUÉS agrega `.js`
 * al <html>: así nada parpadea y, si el JS falla, todo queda visible.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const enPantalla = (el: Element) => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight * 0.92 && r.bottom > 0;
    };

    const reveals = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)"));
    const anims = Array.from(document.querySelectorAll<HTMLElement>("[data-anim]"));

    reveals.forEach((el) => enPantalla(el) && el.classList.add("is-visible"));
    anims.forEach((el) => el.classList.toggle("is-visible", enPantalla(el)));
    root.classList.add("js");

    // Las animaciones decorativas esperan a que la página termine de cargar y el
    // hilo principal quede libre (REDISEÑO §6.2).
    let idleId: number | undefined;
    const encender = () => {
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
      idleId = ric(() => root.classList.add("anim-listo"));
    };
    if (!root.classList.contains("anim-listo")) {
      if (document.readyState === "complete") encender();
      else window.addEventListener("load", encender, { once: true });
    }

    if (!("IntersectionObserver" in window)) {
      reveals.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const revealIO = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-visible");
          revealIO.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    reveals.filter((el) => !el.classList.contains("is-visible")).forEach((el) => revealIO.observe(el));

    // Las animaciones se encienden y se apagan según entren o salgan.
    const animIO = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("is-visible", e.isIntersecting)),
      { threshold: 0.1 },
    );
    anims.forEach((el) => animIO.observe(el));

    return () => {
      revealIO.disconnect();
      animIO.disconnect();
      window.removeEventListener("load", encender);
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId);
    };
  }, [pathname]);

  return null;
}
