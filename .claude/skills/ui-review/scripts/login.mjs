// Inicia sesión con usuarios FICTICIOS del seed local (supabase/seeds/demo.sql) y guarda el storageState
// de Playwright en .ui-review/sesiones/<usuario>.json para capturar paneles con shoot.mjs --state.
// Uso: SEP_DEMO_PASSWORD=... node login.mjs andrea@demo.sep.pe rosa@demo.sep.pe [--base http://localhost:3000]
// Seguridad: solo funciona contra localhost; nunca uses cuentas reales ni de producción.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const argv = process.argv.slice(2);
const bi = argv.indexOf("--base");
const base = (bi >= 0 ? argv.splice(bi, 2)[1] : "http://localhost:3000").replace(/\/$/, "");
const users = argv;
const password = process.env.SEP_DEMO_PASSWORD;

if (!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(base)) {
  console.error("login.mjs solo se usa contra localhost.");
  process.exit(1);
}
if (!password || users.length === 0) {
  console.error("Falta SEP_DEMO_PASSWORD o la lista de usuarios.");
  process.exit(1);
}

const out = ".ui-review/sesiones";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
try {
  for (const email of users) {
    const ctx = await browser.newContext({ locale: "es-PE" });
    const page = await ctx.newPage();
    await page.goto(`${base}/login`, { waitUntil: "networkidle" });
    await page.getByLabel(/correo/i).fill(email);
    await page.getByLabel(/contraseña/i).fill(password);
    await page.getByRole("button", { name: /iniciar sesión/i }).click();
    await page.waitForURL((u) => !u.pathname.startsWith("/login"), { timeout: 30_000 }).catch(() => {});
    const path = new URL(page.url()).pathname;
    const file = join(out, `${email.split("@")[0]}.json`);
    await ctx.storageState({ path: file });
    console.log(`${email} → ${path} (${file})`);
    await ctx.close();
  }
} finally {
  await browser.close();
}
