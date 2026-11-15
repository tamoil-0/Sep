// Capturas de página completa en 375, 768 y 1440 con Playwright (Chromium headless).
// Adaptado del método de ECOING para varias rutas de SEP.
// Uso:
//   node shoot.mjs --base http://localhost:3000 --routes "/,/cursos,/login" --out .ui-review/antes
//   node shoot.mjs --base http://localhost:3000 --routes "/" --section "#programas" --out .ui-review/rondas/home
// Opciones: --widths 375,768,1440  --viewport (solo el primer pantallazo)  --state storageState.json (sesión)
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, arr) => {
    if (cur.startsWith("--")) acc.push([cur.slice(2), arr[i + 1]?.startsWith("--") || arr[i + 1] === undefined ? true : arr[i + 1]]);
    return acc;
  }, [])
);
const base = String(args.base ?? "http://localhost:3000").replace(/\/$/, "");
const routes = String(args.routes ?? "/").split(",").map((r) => r.trim()).filter(Boolean);
const out = args.out ?? ".ui-review/shots";
const widths = String(args.widths ?? "375,768,1440").split(",").map(Number);
const section = typeof args.section === "string" ? args.section : null;
const state = typeof args.state === "string" ? args.state : undefined;

// "/" -> "home", "/cursos/abc" -> "cursos-abc"
const slug = (r) => (r === "/" ? "home" : r.replace(/^\//, "").replace(/[^\w-]+/g, "-"));

const browser = await chromium.launch();
try {
  for (const route of routes) {
    const dir = join(out, slug(route));
    mkdirSync(dir, { recursive: true });
    for (const w of widths) {
      const h = w < 500 ? 812 : w < 1000 ? 1024 : 900;
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, storageState: state, locale: "es-PE" });
      const page = await ctx.newPage();
      // Algunas vistas (comunidad, realtime) nunca llegan a "networkidle": se captura igual tras el load.
      let res;
      let idle = "";
      try {
        res = await page.goto(base + route, { waitUntil: "networkidle", timeout: 30_000 });
      } catch {
        idle = "sin networkidle";
        res = await page.goto(base + route, { waitUntil: "load", timeout: 60_000 });
        await page.waitForTimeout(1500);
      }
      // Recorre la página para disparar lazy-load y apariciones, luego vuelve arriba.
      // SEP usa scroll-behavior: smooth; se fuerza "instant" para que la captura no salga a mitad de una animación.
      await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += Math.round(window.innerHeight * 0.6)) {
          window.scrollTo({ top: y, behavior: "instant" });
          await new Promise((r) => setTimeout(r, 160));
        }
        // Tope de 3 s: una imagen `lazy` oculta (display:none) nunca dispara onload.
        await Promise.race([
          Promise.all([...document.images].map((img) => (img.complete ? null : new Promise((r) => { img.onload = img.onerror = r; })))),
          new Promise((r) => setTimeout(r, 3000)),
        ]);
        document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
        window.scrollTo({ top: 0, behavior: "instant" });
      });
      await page.waitForTimeout(700);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      const final = new URL(page.url()).pathname;
      const notes = [res?.status(), final !== route ? `→ ${final}` : "", overflow > 0 ? `overflow ${overflow}px` : "", idle].filter(Boolean).join(" ");
      if (section) {
        const box = await page.locator(section).first().evaluate((el) => {
          const r = el.getBoundingClientRect();
          return { x: 0, y: r.top + window.scrollY, width: window.innerWidth, height: r.height };
        });
        await page.screenshot({ path: join(dir, `${section.replace(/[^\w-]/g, "")}-${w}.png`), fullPage: true, clip: box });
      } else if (args.viewport) {
        await page.screenshot({ path: join(dir, `${w}-fold.png`) });
      } else {
        await page.screenshot({ path: join(dir, `${w}.png`), fullPage: true });
      }
      await ctx.close();
      console.log(`${route} ${w} | ${notes}`);
    }
  }
} finally {
  await browser.close();
}
