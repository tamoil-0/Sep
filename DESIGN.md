# DESIGN.md — SEP (Semillero de Emprendedores Perú)

> Sistema visual **«Aurora nocturna»** (noviembre de 2026). Los tokens están en `@theme`, dentro de `src/app/globals.css`, y los componentes base en `src/components/ui`. Si cambias un token en `globals.css`, actualízalo aquí también.
> Un solo tema claro de base, con **bloques noche** (`theme-night`) para heros, bandas, navbar, footer y sidebar.

---

## 1. Principios

1. **Noche para la identidad, claro para leer.** Los heros, las bandas de cierre, el navbar, el footer y el sidebar del panel van en noche (`night-950`) con el halo aurora. El contenido largo, los formularios y las tablas van sobre claro (`surface-0/1`).
2. **Un solo gesto memorable: el halo aurora.** Violeta arriba y magenta abajo detrás de los bloques noche. No sumes brillos, partículas ni degradados en otros lugares.
3. **Una acción principal por pantalla.** `Button variant="primary"` o, en conversión de marketing, `variant="gradient"`.
4. **Accesible por defecto.** Contraste AA (verificado con axe), foco visible (`outline 2px sep-500`), objetivos táctiles de 44px (`h-control`) y `prefers-reduced-motion` respetado globalmente.
5. **Reutiliza antes de crear.** Usa primero `src/components/ui` (`Button`, `Container`, `Section`, `SectionHeader`, `PageHero`, `Card`, `Badge`, `EmptyState`, `ProgressBar`, `Stat`, `FilterPills`, `ArrowLink`, `BackLink`, `toast`) y `src/components/forms/field.tsx`.

---

## 2. Color

Todos los colores son tokens de Tailwind v4 (`bg-*`, `text-*`, `border-*`, `ring-*`). **Nunca** escribas `#hex`, `rgb()` ni colores por defecto de Tailwind (`bg-red-50`, `text-purple-600`).

### 2.1 Marca: violeta eléctrico calibrado
| Token | Valor | Para qué |
|---|---|---|
| `sep-50` / `sep-100` / `sep-200` | `#f3f0ff` / `#e6e0ff` / `#cfc4ff` | Tints: badge `brand`, pastillas de ícono, bordes suaves |
| `sep-300` | `#ae9bff` | Borde hover de `Card interactive`; texto de acento **sobre noche** (8.2:1) |
| `sep-400` | `#8f75ff` | Violeta luminoso sobre noche (5.7:1) |
| `sep-500` | `#7c5cff` | **Anillo de foco** y halo. No lo uses como texto sobre blanco (4.35:1) |
| **`sep-600`** | `#6440f0` | **Color de acción:** botón primary, links, iconos activos (5.9:1 sobre blanco) |
| `sep-700` | `#5230d6` | Hover del primario, texto de badge `brand`, eyebrows (7.6:1) |
| `sep-800` … `sep-950` | `#3e22a8` … `#170d40` | Active del primario y velos sobre fotos |
| `violet-brand` / `purple-brand` | `#7c5cff` / `#c026d3` | Paradas del degradado. `purple-brand` admite texto blanco (4.7:1) |
| `magenta` | `#e040fb` | **Solo** en el halo aurora. Nunca como texto ni fondo de texto |

### 2.2 Noche
| Token | Valor | Para qué |
|---|---|---|
| **`night-950`** | `#0d0b1e` | Fondo de heros, bandas, navbar, footer y sidebar |
| `night-900` / `800` / `700` | `#15122b` / `#1e1a3a` / `#2b2650` | Superficies y bordes dentro de noche; `.app-shell .sep-gradient` usa `night-900` |
| `haze` | `#b9b5d0` | Texto secundario sobre noche (9.8:1) |
| `haze-muted` | `#9c97b8` | Texto terciario sobre noche (7:1) |

### 2.3 Acentos
| Token | Valor | Para qué |
|---|---|---|
| **`gold-500`** | `#ffc629` | Chispa SEP: botón `gold`, puntos de estado, subrayado `.gold-underline`, `::selection`. **Siempre con texto `night-950`** (no `ink`: dentro de `theme-night`, `ink` es blanco) |
| `gold-50` / `gold-300` / `gold-400` / `gold-700` / `gold-800` | — | Fondo de badge, hovers y texto dorado legible sobre claro |
| `seed-50` / `seed-400` / `seed-700` / `seed-800` | `#eef8e4` … `#28550d` | Verde "brote" del logo: badge `seed`, "Acceso sin costo", franja de acento |

### 2.4 Neutrales (fríos, con un toque violeta)
| Token | Valor | Para qué |
|---|---|---|
| **`ink`** | `#0f0d1f` | Títulos y texto principal |
| `graphite` | `#34314a` | Texto secundario fuerte, botón `ghost` |
| **`slate-ui`** | `#5f5b75` | Cuerpo secundario, descripciones y labels |
| `mist` | `#6b6783` | Metadatos. Es el tono más claro que pasa AA sobre blanco (5.0:1) y hielo (4.8:1) |
| **`line`** | `#e6e3f2` | Bordes de tarjetas, inputs y separadores |
| `surface-0` | `#ffffff` | Fondo de tarjetas, inputs y botón `outline` (**usa `bg-surface-0`, no `bg-white`**, para que se adapte dentro de noche) |
| `surface-1` | `#f7f6fc` | "Hielo": fondo del producto y secciones `muted` |
| `surface-2` | `#efedf8` | Hover de `ghost`, pistas de progreso, skeleton |

### 2.5 Semánticos (texto + fondo)
`success`/`success-bg`, `warning`/`warning-bg`, `danger`/`danger-bg`, `info`/`info-bg` (con `success-700`, `danger-700`, `danger-800` para hovers). Usa siempre el par: `text-<estado>` sobre `bg-<estado>-bg`.

### 2.6 Bloques noche: `theme-night` + `aurora`
- **`.aurora`** pinta `night-950` con el halo (`--sep-aurora`). **`.aurora-grid`** añade una malla tenue (solo en el hero de la home).
- **`.theme-night`** reasigna los tokens neutros dentro del bloque: `ink`→blanco, `slate-ui`→`haze`, `mist`→`haze-muted`, `line` y `surface-*`→blancos translúcidos, `sep-50/100`→violeta translúcido, `sep-700`→`sep-300`. Así `SectionHeader`, `Card`, `Badge`, `Button outline` e `Input` funcionan sobre noche **sin variantes nuevas**.
- **`.theme-light`** restaura el tema claro dentro de un bloque noche (menús desplegables y diálogos).
- Atajos: `<Section tone="night">` (alias histórico: `tone="gradient"`) aplica `theme-night aurora`. El navbar, la barra móvil del panel y los heros ya lo usan.
- Dentro de noche **no uses `bg-white`** (queda blanco con texto blanco). Usa `bg-surface-0`.

### 2.7 Degradado de marca
`--sep-gradient` (`sep-600 → violet-brand → purple-brand`, 115°) con `.sep-gradient`. **Dónde sí:** botón `variant="gradient"` (uno por vista), franjas de acento de 4px, la barra de `ProgressBar`, el punto de los eyebrows, números de paso y el halo detrás de la foto del hero. **Dónde no:** fondos de sección (usa `aurora`), tarjetas en grilla, párrafos.

---

## 3. Tipografía

- **Sora** (`font-display`, variable): títulos de marketing y del producto (`PageHeader`, cifras de `Kpi`, `Stat`, `StatBlock`). Geométrica y técnica: es la voz "futurista" de SEP.
- **Geist** (`font-sans`, variable, por defecto): cuerpo, UI, formularios y tablas.

### Escala semántica
| Token | Tamaño / interlineado / tracking | Uso |
|---|---|---|
| `text-display` | clamp(41.6→72px) / 1.02 / -0.04em | H1 de la home, cifras de `StatBlock` |
| `text-hero` | 56px / 1.02 / -0.04em | H1 de páginas de marketing en desktop: `text-h1 lg:text-hero` |
| `text-h1` | clamp(34→44px) / 1.08 / -0.035em | Título de página, cifras del hero |
| `text-h2` | clamp(30→40px) / 1.12 / -0.03em | Título de sección, `PageHeader` en desktop |
| `text-h3` | 24px / 1.25 / -0.02em | Subtítulos, `PageHeader` en móvil, cifras de `Kpi` |
| `text-h4` | 20px / 1.35 / -0.01em | Título de tarjeta y de `EmptyState` |
| `text-body-lg` / `body` / `body-sm` / `caption` | 18 / 16 / 14 / 12px | Bajadas, cuerpo, UI y metadatos |

### Patrones fijos
- **Eyebrow** (etiqueta sobre el título): **frase normal**, nunca en MAYÚSCULAS espaciadas. En `SectionHeader`: `text-body-sm font-medium text-sep-700` con un punto `sep-gradient` de 6px. Etiquetas sueltas: `text-body-sm font-semibold tracking-eyebrow`.
- Títulos en `font-semibold` (600); `font-bold` no se usa con Sora.
- Ancho de lectura: `max-w-prose` (65ch). `text-wrap: balance` en títulos y `pretty` en párrafos (global).

---

## 4. Espaciado, tamaños y layout

**Escala:** la de Tailwind (4px), con medios pasos para ajustes finos. Sin valores arbitrarios (`p-[13px]`).

| Elemento | Valor |
|---|---|
| Sección vertical (`Section`) | `py-14 md:py-20 lg:py-24` |
| Padding de `Card` | `p-5` (tarjetas destacadas `p-6`/`p-7`) |
| `Kpi` | `p-4 sm:p-5`, cifra `text-h3 sm:text-h2` |
| Gutter de `Container` | `px-4 sm:px-6 md:px-8` |

**Tokens de tamaño:** `h-control` 44px (objetivo táctil mínimo), `h-control-lg` 52px, `h-nav` 56px, `size-icon-sm/md/lg/xl` 16/18/20/24px, `max-w-reading/content/wide` 48/72/80rem.

**Breakpoints:** `sm` 640, `md` 768, `lg` 1024, `xl` 1280. Diseña primero para 375px y verifica en 375, 768 y 1440px.

---

## 5. Radios y elevación

Jerarquía por tamaño: **control < tarjeta < superficie**.

| Token | Valor | Para qué |
|---|---|---|
| `rounded-full` | — | **Botones** (píldora), badges, avatares, píldoras de filtro, pastillas de ícono |
| `rounded-sm` | 10px | Inputs, ítems de navegación, contenedores de ícono cuadrados |
| `rounded-md` | 16px | **Tarjetas** (`Card`), `EmptyState`, `Kpi`, `StatBlock` |
| `rounded-lg` | 22px | **Superficies flotantes y fotos:** diálogos, menús, fotos del hero |
| `rounded-xl` | 28px | Halos decorativos (no en contenido) |

**Elevación (siempre con tinte violeta, nunca gris):**
- `shadow-soft`: KPI, hover de `Card interactive`, pastillas de ícono.
- `shadow-elevated`: diálogos, menús, toasts y fotos del hero.
- `shadow-glow` / `shadow-glow-gold`: hover de botones `primary`/`gradient` y `gold`.
- `shadow-highlight`: filo de luz superior de los botones rellenos.
- Las tarjetas en reposo van con `border border-line` y sin sombra.

---

## 6. Componentes y estados

- **Botones** (`Button`): variantes `primary` (por defecto), `gradient`, `gold`, `outline`, `outline-white`, `ghost`, `link` y `danger`; tamaños `sm`, `md`, `lg` e `icon`. Todos de 44px o más, en píldora (`rounded-full`). `gold` lleva texto `night-950`. Acepta `href` (usa `Link` interno o `<a target=_blank>` para enlaces externos).
- **Enlaces de texto** (`src/components/ui/arrow-link.tsx`): `ArrowLink` ("Ver detalle →", amplía el área táctil con un pseudo-elemento; `stretched` hace clicable toda la `Card`) y `BackLink` ("← Todos los cursos", `min-h-control`). No escribas a mano el enlace "volver" con `ArrowLeft`.
- **Filtros en píldora** (`FilterPills`): pestañas de una lista con conteo ("Por revisar 1", "Aprobados 3"); 44px, `aria-pressed` y `label` para el grupo.
- **Cabecera de página:** `PageHero` en marketing y `PageHeader` en el producto. Si la cabecera es un `SectionHeader`, pásale `as="h1"` (misma escala que el h1 de `PageHero`). **Toda página tiene exactamente un `h1`** y los niveles no saltan (`FaqAccordion` y `NewsCard` aceptan `headingLevel` para colgar directo del h1).
- **Enlaces dentro de un párrafo:** siempre subrayados (`underline underline-offset-4`), porque el color solo no distingue el enlace del texto (WCAG 1.4.1).
- **Fechas:** usa `formatDate` / `formatDateTime` de `@/lib/utils` (hora de Lima, iguales en servidor y cliente). Para la mayúscula inicial usa `first-letter:uppercase`, no `capitalize` (pondría "P. M.").
- **Badges** (`Badge`): tonos `brand`, `gold`, `seed`, `neutral`, `success`, `warning`, `danger` y `white`; `rounded-full text-caption font-semibold`.
- **Formularios:** `src/components/forms/field.tsx` con `react-hook-form` + `zod`; inputs `rounded-sm border border-line bg-surface-0 min-h-control` (se adaptan dentro de noche).
- **Estados obligatorios** en toda vista con datos: **vacío** (`EmptyState`: ícono + título `h4` + descripción + acción), **cargando** (`loading.tsx` con `.skeleton`), **error** (`error.tsx` con mensaje claro y reintentar) y **éxito** (`toast`).
- **Si falta un componente:** créalo en `src/components/ui` siguiendo el mismo estilo y API que los existentes (`cva` para variantes, `cn()` para combinar clases, props `className` y `tone`/`variant`). **No instales shadcn/ui ni otra librería de componentes sin preguntar.**

---

## 7. Movimiento

- Transiciones de UI: `duration-150` (hover y color) a `duration-200` (íconos, navbar). Máximo 300ms en interacciones (zoom de imágenes, barras de progreso).
- Entradas: `animate-fade-up` y `animate-fade-in` (500ms, `ease-out-soft`/`ease-out`), solo en marketing. No animes íconos en reposo (nada que "se menee"): el movimiento responde a una acción. Los diálogos usan `animate-scale-in` (220ms).
- `prefers-reduced-motion` ya está desactivado globalmente en `globals.css`; no agregues animaciones que dependan de JS sin respetarlo.

---

## 8. Inconsistencias a unificar

> Inventario medido en el código (noviembre de 2026). Los 13 puntos se unificaron en la rama `design/unificacion`, un commit por punto.

| # | Inconsistencia | Hoy | Propuesta |
|---|---|---|---|
| 1 | **Dos escalas de texto mezcladas** — ✅ **Resuelta** | `text-xs` (296) y `text-sm` (294) de Tailwind convivían con `text-caption` (63) y `text-body-sm` (164), junto con `text-lg` (36), `text-xl`, `text-2xl`, `text-3xl` y `text-base`. | Hecho: 643 clases migradas en 105 archivos (`xs→caption`, `sm→body-sm`, `base→body`, `lg→body-lg`, `xl→h4`, `2xl→h3`). **Más cercano:** `text-3xl` (30px, 1 uso) → `text-h2` (28–32px). Ya no quedan tamaños de Tailwind en el código. |
| 2 | **H1 del hero escrito a mano** — ✅ **Resuelta** | `text-h1 lg:text-[3.5rem]` estaba repetido en 5 archivos, con `leading-[1.04]`, `[1.06]` y `[1.08]` | Hecho: token `--text-hero: 3.5rem` (lh 1.06, -0.03em), registrado en `cn()`. Los 5 h1 usan `text-h1 lg:text-hero` y se quitaron los `leading`/`tracking` a mano. **Hallazgo:** la regla base `h1–h4 { line-height; letter-spacing }` de `globals.css` está fuera de `@layer` y le gana a toda utilidad de Tailwind, así que esos `leading` nunca se aplicaban. Ver #13. |
| 13 | **Base fuera de `@layer`** — ✅ **Resuelta** | `h1–h4 { line-height; letter-spacing }` y `button, input, select, textarea { font: inherit }` estaban sin capa y anulaban toda utilidad: los títulos ignoraban el interlineado de su token y los botones ignoraban `font-medium` (se veían con peso 400) | Hecho: la base (`*`, `html`, `body`, medios, `font: inherit`, títulos y párrafos) vive en `@layer base`. Quedan sin capa a propósito `:focus-visible` (que un `outline-none` no borre el foco de teclado), `prefers-reduced-motion` y `::selection`. Los 49 títulos con tamaño de cuerpo usan `leading-snug`. **Regla:** en `cn()`, el `leading-*` va después del `text-*`, porque tailwind-merge descarta un `leading` previo. |
| 3 | **Radios fuera de escala** — ✅ **Resuelta** | Había `rounded-xl` (5), `rounded-2xl` (1, en `(app)/error.tsx`), `rounded-t/b-[24px]` (fair-diagnostic) y `.skeleton` con 8px fijos | Hecho: paneles y diálogos de `apoya-hoy` → `rounded-lg` (con header/footer `rounded-t/b-lg`); alerta de `logout-dialog` → `rounded-md`; `.skeleton` → `var(--radius-sm)`. **Más cercano:** foto del hero (`real-photo`, 18px) → `rounded-lg`; ícono de `(app)/error.tsx` → `rounded-full`, igual que el ícono de `EmptyState`. Quedan 4 valores: sm, md, lg y full. |
| 4 | **Colores hex en clases** — ✅ **Resuelta** | Había 21 usos: `text-[#8A5A00]` (6, idéntico a `warning`), `bg-[#FFFBF0]` / `[#fff6de]` / `[#FFF6DE]` (tint dorado), `bg-[#eef8e4]` / `[#F5FBEF]` (tint verde), `bg-[#852d31]` / `[#70262a]` (hover del botón danger), `bg-[#066331]` y `bg-[#f5f3fb]`, más `bg-red-50` en `(app)/error.tsx`. | Hecho: tokens nuevos `gold-50`, `seed-50`, `danger-700`, `danger-800` y `success-700` (hover del botón de aprobar pago). `#8A5A00 → text-warning`; `#FFFBF0 → bg-gold-50/50` y `#F5FBEF → bg-seed-50/60` (mismo color resultante); `red-50 → danger-bg`. **Más cercano:** `#f5f3fb` (fondo de `(campaign)`) → `surface-2` (`#f4f3f6`). Los hex del CSS (degradado, selección, foco, subrayado, malla, scrollbar, autofill) ahora usan `var()` o `color-mix()` sobre tokens. **Excepciones:** estilos de impresión, imágenes generadas (`icon`, `apple-icon`, `opengraph-image`), `global-error.tsx`, `manifest.ts`, el QR, el Excel y la paleta SVG de `illustrations.tsx` (no pueden usar clases; su `line` quedó sincronizado con el token). |
| 5 | **Variables duplicadas en `:root`** — ✅ **Resuelta** | `--bg`, `--bg-1/2`, `--fg`, `--fg-2/3` y `--border` repetían los neutrales con **otros valores** (`--border #e6e4f0` frente a `line #e5e4e9`; `--fg-3 #6e6a85` frente a `mist #74717c`). | Hecho: `body` usa `surface-0`/`ink`, `.skeleton` usa `surface-2`, los fondos punteados de `/nosotros` y `/voluntariado` usan `var(--color-line)`, y se borraron `--bg*`, `--fg*` y `--border`. Excepción: `global-error.tsx` mantiene hex en línea porque se pinta sin `globals.css`. |
| 6 | **Tokens con el mismo valor** — ✅ **Resuelta** | `gold-600` = `gold-700` = `#735000`; `seed-500` = `seed-700` = `#326912` | Hecho: `gold-600 → gold-700` (9 usos) y `seed-500 → seed-700` (31 usos), y se borraron `gold-600` y `seed-500` de `@theme`. Sin cambio visual (mismo valor). |
| 7 | **Tracking de eyebrows** — ✅ **Resuelta** | `0.12em` (54), `0.1em` (17), `0.14em` (11), `0.08em` (9) y `0.06em` (1) | Hecho: token `--tracking-eyebrow: 0.12em` (clase `tracking-eyebrow`, registrada en `cn()`), aplicado en los 93 usos. No se creó el componente `<Eyebrow>` para no tocar 44 archivos de estructura; queda como mejora opcional. |
| 8 | **Sombras sin uso** — ✅ **Resuelta** | `shadow-subtle` y `shadow-card` estaban definidas con 0 usos | Hecho: se borraron de `@theme`. Queda una sola sombra de sistema: `shadow-elevated` (10 usos). |
| 9 | **`font-display` dentro del producto** — ✅ **Resuelta** | Las vistas de `(app)` pedían `font-display`, que `.app-shell` neutraliza por CSS | Hecho: se quitaron 71 `font-display` de `src/app/(app)` y `src/components/app` (35 archivos). La regla `.app-shell .font-display` queda como red de seguridad para componentes compartidos (`EmptyState`, `Stat`). Efecto lateral buscado: `LogoutDialog`, que se pinta fuera de `.app-shell`, ahora también usa Inter. |
| 10 | **Alturas de control** — ✅ **Resuelta** | `h-11` (24 usos = `h-control`), `h-12`, `h-10`, `h-9` y `h-13` en controles | Hecho: `h-11 → h-control` en 21 controles y skeletons de control; input del feed de comunidad `h-9 → h-control` (subió a 44px táctiles); newsletter (input y botón) `h-12 → h-control`; botón de `apoya-hoy` `h-13 → h-control-lg`. **Más cercano:** input de `apoya-hoy` `h-14` (56px) → `h-control-lg` (52px). Se dejaron a propósito los `h-9…h-14` de logos, skeletons de texto y los cuadros de ícono `size-11`, porque no son controles. |
| 11 | **Anchos máximos arbitrarios** — ✅ **Resuelta** | `max-w-[65ch]`, `[62ch]`, `[60ch]`, `[620px]`, `[440px]` y `[280px]` | Hecho: no hizo falta un token nuevo porque Tailwind v4 ya trae `max-w-prose` (65ch). `65ch/62ch/60ch → max-w-prose`. **Más cercano:** formulario de auth `440px → max-w-md` (448px); foto del hero `620px → max-w-xl` (576px; en la práctica la limita su columna, de unos 560px); QR de apoyo `280px → max-w-2xs` (288px). Se mantienen los porcentajes `max-w-[60%]` y `[85%]` porque son relativos al contenedor, no anchos fijos. |
| 12 | **Duraciones** — ✅ **Resuelta** | `duration-150/200/300/500/700` | Hecho: zoom de imágenes al pasar el cursor `500/700ms → 300ms` (cursos, `course-media`, `news-card`, `real-photo`); chevron del FAQ y fondo del navbar `300 → 200ms`; `animate-fade-up` `600 → 500ms`. Las barras de progreso se quedan en 300ms (dentro del máximo). Los bucles (`shimmer`, `float`, `marquee`) no son transiciones y quedan fuera de esta regla. |

---

## 9. Hacer / No hacer

✅ **Hacer**
- Reutilizar los componentes de `src/components/ui` y los tokens de `globals.css`.
- Un solo CTA principal por vista, en `sep-600` o, si es de conversión, con degradado.
- Heros y bandas de cierre en noche (`theme-night aurora` o `<Section tone="night">`).
- Texto secundario en `slate-ui` y metadatos en `mist`.
- Tarjetas con borde `line` y sin sombra.
- Mantener los objetivos táctiles en 44px o más.

❌ **No hacer**
- Escribir `#hex`, `rgb()`, `bg-red-*`, `text-purple-*` ni otros colores por defecto de Tailwind.
- Usar el degradado en el producto autenticado o más de una vez por viewport.
- Poner texto blanco sobre `gold-500`, o texto más claro que `mist` sobre blanco (o que `haze-muted` sobre noche).
- Agregar fuentes nuevas, radios fuera de la escala o sombras grises.
- Usar `bg-white` o `text-ink` sobre dorado dentro de un bloque noche (usa `bg-surface-0` y `text-night-950`).
- Etiquetas en MAYÚSCULAS espaciadas sobre los títulos.
- Instalar shadcn/ui u otra librería de componentes sin preguntar.
