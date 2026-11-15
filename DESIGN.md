# DESIGN.md — SEP (Semillero de Emprendedores Perú)

> Sistema visual **«Lavanda neón»** (noviembre de 2026; reemplaza a «Aurora nocturna»). Es la fuente de verdad.
> Tokens en `@theme` de `src/app/globals.css`; componentes base en `src/components/ui`. Si cambias un token, actualízalo aquí.
> Página de muestra (sin enlazar ni indexar): `/dev/estilo` (en producción solo con `SEP_ESTILO=1`).
> Método completo y fases: `REDISENO-COMO-ECOING.md`. Textos con fuente: `contenido/`.

---

## 1. Principios

1. **Noche para la identidad, claro para leer.** Heros, bandas de cierre, navbar, footer y sidebar en noche con el halo.
   Formularios, tablas y lecciones largas sobre claro (`surface-1` de fondo, tarjetas `surface-0`).
2. **Un solo gesto memorable: el halo «Lavanda neón».** Violeta arriba a la izquierda y cian abajo a la derecha detrás
   de los bloques noche. No sumes otros brillos.
3. **Violeta para actuar, turquesa para avanzar, cian para lo que brilla sobre oscuro.**
4. **Una acción principal por pantalla.** `Button variant="primary"`; en la conversión principal del marketing, sobre
   noche, `variant="neon"` (máximo uno por pantalla).
5. **Accesible por defecto y verificado con números** (§3). Foco visible, objetivos táctiles ≥ 44 px,
   `prefers-reduced-motion` global.
6. **Reutiliza antes de crear** (`src/components/ui`, `src/components/forms/field.tsx`).

---

## 2. Paleta

### 2.1 Colores base (fijos)
| Color | Hex | Token | Rol |
|---|---|---|---|
| Violeta lavanda | `#7265FF` | `violeta-500` | Marca: acentos, brillo de botones, anillo de foco, bordes activos, íconos, degradado y títulos grandes |
| Cian neón | `#04FFE1` | `cian-500` | **Solo sobre oscuro**: hover, highlights, íconos activos, indicador de pestaña, «en vivo», botón neón |
| Verde turquesa | `#0BC6AB` | `turquesa-500` | Secundario: éxito, progreso completado, badges y enlaces sobre oscuro |
| Azul pizarra | `#374658` | `noche-700` | Tarjetas, inputs y bordes en bloques oscuros |
| Azul noche | `#212B38` | `noche-900` | Fondo oscuro principal: hero, navbar, panel de marca del login |

### 2.2 Escalas (`bg-*`, `text-*`, `border-*`, `ring-*`)
| Paso | `violeta-*` | `turquesa-*` | `noche-*` |
|---|---|---|---|
| 50 | `#F4F3FF` | `#EBFAF8` | `#F5F7FA` fondo claro «hielo» |
| 100 | `#E8E6FF` | `#D8F6F2` | `#EEF1F5` |
| 200 | `#D2CEFF` | `#B1EDE4` | `#E2E7EE` bordes sobre claro |
| 300 | `#B1AAFF` | `#79E0D1` | `#B6C2D1` texto secundario sobre oscuro |
| 400 | `#9187FF` | `#41D3BD` | `#8D9AAB` terciario sobre noche (no sobre pizarra) |
| 500 | **`#7265FF`** | **`#0BC6AB`** | `#5B6878` metadatos sobre claro |
| 600 | `#6257DB` acción | `#09AA93` | `#4A5869` texto secundario sobre claro |
| 700 | `#5249B8` | `#088F7B` íconos sobre claro | **`#374658`** pizarra |
| 800 | `#423B94` | `#067363` texto éxito | `#2A3545` |
| 900 | `#322C70` | `#05574B` | **`#212B38`** noche |
| 950 | — | — | `#151C24` sidebar y footer |

Cian: solo `cian-500` `#04FFE1` y `cian-600` `#03DBC2` (hover).
La paleta por defecto de Tailwind está **desactivada** (`--color-*: initial`): `bg-blue-500` no existe. Solo hay `white` y `black` además de lo anterior.

### 2.3 Roles (lo que usan los componentes)
Los componentes usan **roles**, no pasos de escala: `.theme-night` los reasigna y el mismo componente se lee bien sobre
claro y sobre noche.

| Rol | Sobre claro | Dentro de `.theme-night` | Uso |
|---|---|---|---|
| `ink` | `noche-900` | blanco | Títulos y texto principal |
| `graphite` | `noche-800` | blanco 86 % | Texto fuerte secundario, botón `ghost` |
| `slate-ui` | `noche-600` | `noche-300` | Cuerpo secundario, descripciones, labels |
| `mist` | `noche-500` | `noche-400` 65 % + `noche-300` | Metadatos (el tono más claro permitido) |
| `line` | `noche-200` | blanco 12 % | Bordes y separadores |
| `surface-0` | blanco | blanco 6 % | Tarjetas, inputs, botón `outline` (**usa `bg-surface-0`, no `bg-white`**) |
| `surface-1` | `noche-50` | blanco 4 % | Fondo del producto y secciones `muted` |
| `surface-2` | `noche-100` | blanco 10 % | Hover de `ghost`, pistas de progreso, skeleton |
| `acento` | `violeta-700` | `violeta-300` | **Todo texto violeta**: enlaces, eyebrows, íconos activos |
| `success` / `-bg` | `turquesa-800` / `turquesa-50` | `turquesa-500` / turquesa 14 % | Éxito y progreso |
| `danger` / `-bg` | `#C9354A` / `#FDEEF0` | `#FF7A88` / 14 % | Error |
| `warning` / `-bg` | `#A15C00` / `#FFF4E5` | `#FFC266` / 14 % | Advertencia |
| `info` / `-bg` | `violeta-700` / `violeta-50` | — | Información |

La escala violeta **no** se reasigna dentro de noche (salvo los tintes 50/100): el hover `violeta-700` del botón
primario sigue siendo oscuro. Para texto violeta usa siempre `text-acento`, no `text-violeta-*`.
`.theme-light` restaura el claro dentro de un bloque noche (menús y diálogos que flotan).

### 2.4 Degradado y halo
- **`--grad-marca`** (`.grad-marca`): `linear-gradient(135deg, #7265FF 0%, #0BC6AB 65%, #04FFE1 100%)`. **Decorativo**:
  bordes encendidos, reglas, barra de progreso, punto del eyebrow, anillo de logro y halo. **Nunca** lleva texto encima
  ni se usa como color de texto. `AccentUnderline` (`.subrayado-marca`) subraya una palabra con este trazo.
- **`--halo-marca`** (`.halo`): radial violeta 35 % arriba a la izquierda + radial cian 12 % abajo a la derecha sobre
  `noche-900`. Atajos: `<Section tone="night">`, `PageHero tone="gradient"` y `className="theme-night halo"`.
  `.halo-grid` añade una malla tenue (solo en el hero de la home).
- **Proporción por pantalla:** ~60 % neutros, ~25 % violeta, ~10 % turquesa, ≤ 5 % cian.

### 2.5 Excepciones con hex (no pueden usar clases)
`opengraph-image.tsx`, `manifest.ts`, `layout.tsx` (`themeColor`), `global-error.tsx` (se pinta sin `globals.css`),
`components/brand/illustrations.tsx` (atributos SVG) y los estilos de impresión. Usan los hex de esta tabla.
**Pendiente (fase 6):** `lib/pdf/certificate.ts` y `lib/excel/diagnostic-workbook.ts` siguen con la paleta anterior.

---

## 3. Contraste verificado (WCAG 2.1)

AA = 4.5:1 texto normal; 3:1 texto grande (≥ 24 px o ≥ 18.66 px en negrita), íconos y bordes.
Recalcula con `node .claude/skills/ui-review/scripts/contrast.mjs <fg> <bg>`.

| Par | Razón | Veredicto |
|---|---|---|
| Blanco sobre `violeta-600` (botón primario) | 5.38 | ✅ |
| Blanco sobre `violeta-700` (hover) | 6.99 | ✅ |
| Blanco sobre `violeta-500` | 4.18 | ❌ texto normal · ✅ solo grande |
| `violeta-500` sobre blanco / `noche-50` | 4.18 / 3.90 | Solo títulos grandes, íconos, bordes y foco |
| `acento` (`violeta-700`) sobre blanco / `noche-50` / `violeta-50` | 6.99 / 6.51 / 6.36 | ✅ |
| `acento` (`violeta-300`) sobre `noche-900` / tarjeta translúcida | 6.86 / 5.70 | ✅ |
| `noche-900` sobre cian (botón neón) / `cian-600` (hover) | 11.17 / 8.12 | ✅ |
| Cian sobre `noche-900` / `noche-950` | 11.17 / 13.40 | ✅ |
| Cian sobre blanco | 1.28 | ❌ **nunca** |
| `turquesa-800` sobre blanco / `turquesa-50` | 5.77 / 5.37 | ✅ (blanco sobre `turquesa-800`: 5.77) |
| `turquesa-700` sobre blanco | 4.02 | Íconos y barras (≥ 3:1) |
| `turquesa-500` sobre blanco | 2.17 | ❌ como texto · blanco encima ❌ → texto noche (6.60) |
| `turquesa-500` sobre `noche-900` | 6.60 | ✅ |
| `ink` sobre blanco / `noche-50` | 14.31 / 13.34 | ✅ |
| `graphite` sobre blanco | 12.40 | ✅ |
| `slate-ui` sobre blanco / `noche-50` | 7.26 / 6.77 | ✅ |
| `mist` sobre blanco / `noche-50` / `noche-100` | 5.68 / 5.29 / 5.01 | ✅ |
| `noche-300` sobre `noche-900` / tarjeta translúcida (`#2E3844`) | 7.92 / 6.59 | ✅ |
| `noche-400` sobre `noche-900` / tarjeta translúcida | 5.00 / 4.16 | ❌ en tarjeta → por eso `mist` en noche usa la mezcla (5.9 / 4.9) |
| Blanco 75 % / 65 % sobre `noche-900` | 8.71 / 6.94 | ✅ |
| `danger` sobre blanco / `danger-bg` | 5.13 / 4.56 | ✅ |
| `warning` sobre blanco / `warning-bg` | 5.19 / 4.78 | ✅ |
| `#FF7A88` / `#FFC266` sobre `noche-900` | 5.72 / 8.97 | ✅ |
| Foco `violeta-500` sobre blanco · cian sobre noche | 4.18 · 11.17 | ✅ (≥ 3:1) |

---

## 4. Tipografía

- **Sora** (`font-display`, variable): títulos de marketing y del producto, cifras (`Stat`, `StatBlock`, `Kpi`).
- **Geist** (`font-sans`, por defecto): cuerpo, UI, formularios y tablas.
- Cargadas con `next/font/google` en `src/app/layout.tsx`. No se cambian sin aprobación.

| Token | Tamaño / interlineado / tracking | Uso |
|---|---|---|
| `text-display` | clamp(41.6→72px) / 1.02 / -0.04em | H1 de la home, cifras de `StatBlock` |
| `text-hero` | 56px / 1.02 / -0.04em | H1 de marketing en desktop: `text-h1 lg:text-hero` |
| `text-h1` | clamp(34→44px) / 1.08 / -0.035em | Título de página |
| `text-h2` | clamp(30→40px) / 1.12 / -0.03em | Título de sección |
| `text-h3` | 24px / 1.25 / -0.02em | Subtítulos, cifras de `Kpi` |
| `text-h4` | 20px / 1.35 / -0.01em | Título de tarjeta y de `EmptyState` |
| `text-body-lg` / `body` / `body-sm` / `caption` | 18 / 16 / 14 / 12px | Bajadas, cuerpo, UI y metadatos |

- **Eyebrow:** frase normal (nunca MAYÚSCULAS espaciadas), `text-body-sm font-medium text-acento` con punto `grad-marca`
  de 6 px. Úsalo poco: no en todas las secciones.
- Títulos en `font-semibold`. Ancho de lectura `max-w-prose`. `text-wrap: balance` en títulos y `pretty` en párrafos.
- En `cn()`, el `leading-*` va después del `text-*` (tailwind-merge descarta un `leading` previo).

---

## 5. Espaciado, tamaños, radios y elevación

| Elemento | Valor |
|---|---|
| Sección vertical (`Section`) | `py-14 md:py-20 lg:py-24` |
| Padding de `Card` | `p-5` (destacadas `p-6`/`p-7`) |
| Gutter de `Container` | `px-4 sm:px-6 md:px-8` |

**Tokens:** `h-control` 44 px, `h-control-lg` 52 px, `h-nav` 56 px, `size-icon-sm/md/lg/xl` 16/18/20/24 px,
`max-w-reading/content/wide` 48/72/80 rem. Sin valores arbitrarios (`p-[13px]`).

**Radios** (control < tarjeta < superficie): `rounded-full` botones, badges, avatares y píldoras · `rounded-sm` 10 px
inputs y nav · `rounded-md` 16 px tarjetas · `rounded-lg` 22 px diálogos, menús y fotos · `rounded-xl` 28 px halos.

**Elevación** (tinte noche/violeta, nunca gris): `shadow-soft` (hover de tarjeta, KPI), `shadow-elevated` (diálogos,
menús, toasts), `shadow-glow` (botón primario: `0 10px 30px -10px #7265FF`), `shadow-glow-neon` (botón neón),
`shadow-highlight` (filo de luz de botones rellenos). Tarjetas en reposo: `border border-line`, sin sombra.

---

## 6. Componentes

- **`Button`**: `primary` (por defecto), `neon`, `outline`, `outline-white`, `ghost`, `link`, `danger`; tamaños `sm`,
  `md`, `lg`, `icon`; todos ≥ 44 px, en píldora. `neon` solo sobre noche y uno por pantalla. Acepta `href`.
  La variante `gradient` y `gold` **ya no existen**.
- **`Badge`** tonos: `brand`, `neon` (chip noche con texto cian; sirve sobre claro y noche), `success`, `neutral`,
  `warning`, `danger`, `white`. (`gold` → `neon`, `seed` → `success`.)
- **`ProgressBar`** tonos: `brand` (degradado) y `success` (`turquesa-700`).
- **`StatBlock`** (ilustraciones) tonos: `brand`, `neon` (franja cian, solo sobre noche), `success`.
- **`AccentUnderline`**: subraya una palabra con el trazo de marca (antes `GoldUnderline`).
- **Cabeceras:** `PageHero` en marketing, `PageHeader` en el producto, `SectionHeader as="h1"` cuando hace de cabecera.
  **Un solo `h1` por página**, niveles sin saltos.
- **Enlaces** dentro de párrafos siempre subrayados. `ArrowLink` y `BackLink` para «Ver detalle →» y «← Volver».
- **`FilterPills`**, **`EmptyState`**, `toast`, `Field`/`Input`/`Select`/`Textarea`/`Checkbox`/`FormAlert`.
- **Fechas:** `formatDate` / `formatDateTime` de `@/lib/utils` (hora de Lima).
- **Estados obligatorios** en toda vista con datos: vacío, cargando (`loading.tsx` con `.skeleton`), error (con
  reintentar) y éxito (`toast`).
- **Fase 3 (hecho):**
  - `Button`: `primary` usa `btn-desliza` (el fondo se desliza en violeta 600→800, sube 2 px, brillo y `scale(0.98)` al
    presionar, 300 ms); prop `loading` con spinner que no cambia el ancho.
  - `Card interactive` → `tarjeta-viva`: borde de 1 px que se enciende con `--grad-marca`, sube 4 px y sombra con tinte.
  - `enlace-trazo`: subrayado en degradado que se dibuja de izquierda a derecha. `regla-marca` / `BrandRule`: regla de 3 px.
  - `Eyebrow`: caption en mayúsculas, `tracking-marca` (0.15em), color `acento`. Úsalo poco.
  - `Dialog` (`ui/dialog.tsx`): `<dialog>` nativo con `showModal()`, `aria-labelledby`, foco de vuelta, hoja inferior en móvil.
  - `Tabs` (`ui/tabs.tsx`): compuesto (`Tabs.List/Tab/Panel`), flechas/Inicio/Fin, indicador que se desliza con transform.
  - `Skeleton`, `ProgressBar` que se llena con `scaleX` (`barra-progreso`), `velo-foto` para texto sobre fotos.
- **Pendiente:** migrar los 4 diálogos hechos a mano a `Dialog`, `Table` adaptable y `loading.tsx` por ruta.
- **Íconos:** solo `lucide-react`, `strokeWidth` 1.75. Nunca emojis.

---

## 7. Movimiento

- Solo `transform` y `opacity`; ≤ 300 ms en la interfaz. Tokens: `--duration-fast` 150 ms, `--duration-base` 200 ms,
  `--duration-slow` 300 ms; curvas `--ease-out` y `--ease-out-soft`.
- `prefers-reduced-motion` apaga todo globalmente. El contenido nunca queda oculto si falla el JS.
- **`RevealObserver`** (layout raíz): `data-reveal` aparece una vez (fade + 12 px); `data-anim` se pausa fuera de
  pantalla. Primero marca lo visible y luego pone `.js` en `<html>`: sin JS nada queda oculto.
- **`app/template.tsx`**: transición entre páginas (fade + 8 px, 300 ms) solo al navegar (`.navegado`); la primera
  carga queda `ya-vista` para no retrasar el LCP.
- **Motivo de marca «Semilla en cadena»** (`components/brand/motivo-semilla.tsx`): una semilla que se ramifica 1 → 3 → 9
  («formamos a quien formará a diez más»). Ramas que se dibujan, nodos que aparecen y un pulso cian que recorre la red.
  Es el único efecto firma: hero, panel de marca del login (y su banda en móvil), banda de cierre y logros.

---

## 8. Responsive

Breakpoints `sm` 640, `md` 768, `lg` 1024, `xl` 1280. Diseña primero para 375 px y verifica en 375, 768 y 1440 px
(`node .claude/skills/ui-review/scripts/shoot.mjs`). Sin scroll horizontal.

## 9. Maquetas

`components/maquetas/maquetas.tsx`: marcos `Telefono` y `Laptop` dibujados con CSS y pantallas `PantallaLeccion` y
`PantallaCertificado` con **datos ficticios** («Ana Q.», código `SEP-0000-EJEMPLO`, QR que no codifica nada).
Escenas solo con CSS (`.escena`, ciclo `--d`, retraso `--t`, keyframes `esc-*`), `role="img"` + `aria-label` que dice
que es una maqueta, pausadas fuera de pantalla y quietas con movimiento reducido. Nunca capturas con datos reales.

---

## 10. Hacer / No hacer

✅ **Hacer**
- Usar roles (`ink`, `slate-ui`, `mist`, `line`, `surface-*`, `acento`, `success`…) y las escalas de §2.2.
- Un solo CTA principal por vista: `primary`, o `neon` sobre noche en la conversión del marketing.
- Heros y bandas de cierre en noche (`<Section tone="night">` o `theme-night halo`).
- Turquesa para éxito y progreso; texto turquesa sobre claro en `turquesa-800`.
- Tarjetas con borde `line` y sin sombra; objetivos táctiles ≥ 44 px.

❌ **No hacer**
- Escribir `#hex`, `rgb()` o colores de Tailwind por defecto en componentes (no existen).
- **Cian sobre fondo claro**, ni como texto ni como relleno. Cian > 5 % de la pantalla.
- **Texto blanco normal sobre `violeta-500`** (4.18) o **sobre turquesa** (2.17): usa `violeta-600` o texto noche.
- **Texto sobre el degradado**, o el degradado como color de texto, fondo de sección o de tarjeta.
- Intercambiar cian (interactivo/destacado) y turquesa (estado/éxito).
- Usar `noche-400` como texto sobre pizarra o tarjetas translúcidas (3.37 / 4.16).
- `text-violeta-*` para texto: usa `text-acento` (se adapta a noche).
- `bg-white` dentro de un bloque noche (usa `bg-surface-0`).
- Añadir brillos, partículas o degradados además del halo; glassmorphism sin motivo; sombras grises.
- Eyebrows en todas las secciones; grillas de tarjetas idénticas; emojis.
- Fuentes nuevas, radios fuera de escala, librerías de componentes o de animación sin preguntar.
- Datos inventados: cifras, testimonios, logos o alumnos sin fuente en `contenido/`.
