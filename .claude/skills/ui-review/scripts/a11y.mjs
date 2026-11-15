// Chequeos rápidos de accesibilidad: headings, nombres accesibles, alt, objetivos táctiles (>=44px) y overflow.
// Uso: node a11y.mjs http://localhost:3000
import { chromium } from "playwright";
const url = process.argv[2] ?? "http://localhost:3000";
const b = await chromium.launch();
for (const w of [375, 1440]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto(url, { waitUntil: "networkidle" });
  const r = await p.evaluate(() => {
    const vis = (el) => { const s = getComputedStyle(el); const b = el.getBoundingClientRect(); return s.visibility !== "hidden" && s.display !== "none" && b.width > 0 && b.height > 0; };
    const hs = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => +h.tagName[1]);
    const jumps = hs.filter((l, i) => i > 0 && l - hs[i - 1] > 1).length;
    const noName = [...document.querySelectorAll("a,button,input,textarea,select")].filter((el) => vis(el) && !(el.getAttribute("aria-label") || el.textContent.trim() || el.labels?.length || el.getAttribute("title") || el.querySelector("img[alt]:not([alt=''])"))).map((el) => el.outerHTML.slice(0, 80));
    const noAlt = [...document.images].filter((i) => !i.hasAttribute("alt")).length;
    const small = [...document.querySelectorAll("a,button,summary,input,textarea")].filter((el) => vis(el) && !el.closest("p, dd, li p") ).map((el) => { const b = el.getBoundingClientRect(); return { h: Math.round(b.height), w: Math.round(b.width), t: (el.getAttribute("aria-label") || el.textContent).trim().slice(0, 30) }; }).filter((x) => x.h < 44 || x.w < 44);
    return { h1: hs.filter((l) => l === 1).length, jumps, noName, noAlt, small, overflow: document.documentElement.scrollWidth - innerWidth, lang: document.documentElement.lang };
  });
  console.log(w, JSON.stringify(r));
  await p.close();
}
await b.close();
