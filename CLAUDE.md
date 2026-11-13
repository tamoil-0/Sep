@AGENTS.md

# SEP — Instrucciones del proyecto

## Qué es
**SEP (Semillero de Emprendedores Perú)** — *¡Emprende hoy, lidera mañana!* Plataforma de formación en emprendimiento, liderazgo y metodologías ágiles para jóvenes universitarios, escolares, docentes e instituciones de todas las regiones del Perú. Incluye sitio público (marketing, SEO), cursos y programas, mentorías, voluntariado, certificados en PDF con QR, pagos (Yape) con conciliación manual, y paneles por rol (estudiante, mentor, docente, speaker, institución, admin, super_admin). La configuración del sitio, precios y programas vive en `src/config/`.

## Stack
- **Framework:** Next.js 16.3 (App Router, carpeta `src/`, `src/proxy.ts` en lugar de middleware) + React 19.2 + TypeScript 5. Lee `node_modules/next/dist/docs/` antes de usar APIs de Next (ver `AGENTS.md`).
- **Estilos:** Tailwind CSS v4 (`@tailwindcss/postcss`, sin `tailwind.config`). Los tokens de marca están en `@theme` dentro de `src/app/globals.css` (`--color-sep-*` azul→violeta, `--color-violet-brand`, `--color-purple-brand`, acento `--color-gold-*`). Sin tema oscuro por ahora.
- **Componentes:** **no usa shadcn/ui**. Hay componentes propios en `src/components/ui` (`button`, `primitives`, `toast`, `contextual-help`) construidos con `class-variance-authority` + `clsx` + `tailwind-merge` (`src/lib/utils.ts`).
- **Íconos y fuentes:** lucide-react; Inter + Poppins vía `next/font/google`.
- **Formularios:** react-hook-form + zod 4 (`src/lib/validations`).
- **Base de datos y auth:** Supabase (Postgres + Auth + RLS) con `@supabase/ssr` y `@supabase/supabase-js`. Migraciones en `supabase/migrations`, seeds en `supabase/seed.sql`, tipos en `src/types/database.ts`. Server actions en `src/server/actions` y consultas en `src/server/queries`.
- **Documentos:** pdf-lib (certificados, `src/lib/pdf`), qrcode, write-excel-file (`src/lib/excel`), date-fns.
- **Pagos:** Yape (`src/lib/payments/yape.ts`). `.env.example` también prevé Culqi, Resend, hCaptcha y Sentry, pero sus SDK todavía no están instalados.
- **Infraestructura:** Vercel (región `gru1`, crons en `vercel.json`); worker opcional en Render (`worker/render.yaml`) que consume la tabla `job_queue`.
- **IA:** el proyecto **no llama a modelos de IA** (no hay ningún SDK de IA instalado).
- **Scripts:** `npm run dev`, `npm run build`, `npm run lint`. No hay script de tests.

## Reglas generales
- Responde y comenta el código en **español**.
- Antes de usar la API de una librería, consulta su documentación actual con **Context7** (`use context7`), en vez de confiar en la memoria.
- Cambios pequeños y verificables. Después de cada cambio, corre el lint, el typecheck y los tests que existan.
- No toques precios, pagos ni lógica de cobro sin mostrarme antes el cálculo de impacto.

## Diseño (OBLIGATORIO en cualquier cambio de UI)
1. Lee `DESIGN.md` antes de tocar cualquier componente o estilo.
2. Usa la skill **design-system** y, para decisiones estéticas nuevas, **frontend-design**.
3. Reutiliza primero los componentes de `src/components/ui`; si falta uno, créalo ahí siguiendo el mismo estilo y API que los existentes. **Nunca instales shadcn/ui ni otra librería de componentes sin preguntarme.**
4. **Nunca** pongas colores, tamaños o radios a mano (`#hex`, `px` sueltos): usa los tokens CSS de `DESIGN.md`.
5. Al terminar, **verifica visualmente** con la skill **ui-review** (MCP `playwright`): screenshots en 375, 768 y 1440 px (SEP tiene solo tema claro). No des por terminado un cambio de UI sin verlo.
6. Para auditar accesibilidad y UX, usa **web-design-guidelines**.

## Comandos disponibles
- `/paleta` — propone 3 direcciones visuales y actualiza DESIGN.md con la elegida
- `/redisenar <pantalla>` — rediseña una pantalla siguiendo DESIGN.md
- `/revisar-ui [ruta]` — revisión visual con screenshots y lista de problemas

## Subagentes
- **design-reviewer** — revisa la UI con ojos frescos (sin editar)
