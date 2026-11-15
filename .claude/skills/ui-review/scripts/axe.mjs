// axe-core (WCAG 2.1 A/AA) sobre una o varias URL. Uso: node axe.mjs http://localhost:3000/ http://localhost:3000/login
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const axeSrc = readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js", { paths: [process.cwd()] }), "utf8");
const b = await chromium.launch();
for (const url of process.argv.slice(2)) {
  for (const w of [375, 1440]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.goto(url, { waitUntil: "networkidle" });
    await p.addScriptTag({ content: axeSrc });
    const r = await p.evaluate(() => window.axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] }));
    const v = r.violations.map((x) => `${x.impact} ${x.id} (${x.nodes.length}): ${x.nodes.slice(0, 2).map((n) => n.target.join(" ")).join(" | ")}`);
    console.log(`${url} ${w} | ${v.length ? "\n  " + v.join("\n  ") : "sin violaciones"}`);
    await p.close();
  }
}
await b.close();
