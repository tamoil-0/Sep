# DESIGN.md — SEP (Semillero de Emprendedores Perú)

> Documenta el sistema de diseño **que SEP ya usa**. Los tokens están en `@theme`, dentro de `src/app/globals.css`, y los componentes base en `src/components/ui`. Este archivo describe lo que existe y cómo se usa. Si cambias un token en `globals.css`, actualízalo aquí también.
> Solo tema claro. Las frecuencias de uso se midieron sobre `src/**/*.tsx` en noviembre de 2026.

---

## 1. Principios

1. **Blanco y tinta, con la marca como acento.** La base es neutra (`surface-*`, `ink`, `slate-ui`) y el azul SEP marca la acción y la identidad. El color de marca no se usa como fondo de todo.
2. **Una acción principal por pantalla.** Se resuelve con `Button variant="primary"` o, en conversión, `variant="gradient"`.
3. **Marketing expresivo, producto sobrio.** Las páginas públicas usan Poppins y el degradado de marca. El producto autenticado (`.app-shell`) usa solo Inter y colores planos. `globals.css` ya lo fuerza.
4. **Accesible por defecto.** Contraste AA, foco visible (`outline 2px sep-500`), objetivos táctiles de 44px (`h-control`) y `prefers-reduced-motion` respetado globalmente.
5. **Reutiliza antes de crear.** Usa primero `src/components/ui` (`Button`, `Container`, `Section`, `SectionHeader`, `PageHero`, `Card`, `Badge`, `EmptyState`, `ProgressBar`, `Stat`, `toast`) y `src/components/forms/field.tsx`.

---

## 2. Color

Todos los colores son tokens de Tailwind v4 (`bg-*`, `text-*`, `border-*`, `ring-*`). **Nunca** escribas `#hex`, `rgb()` ni colores por defecto de Tailwind (`bg-red-50`, `text-purple-600`).

### 2.1 Marca: azul → violeta → púrpura
| Token | Valor | Usos | Para qué |
|---|---|---|---|
| `sep-50` | `#efecfe` | 41 | Fondo de badge `brand`, fondos de íconos y tints suaves |
| `sep-100` / `sep-200` | `#dcd5fd` / `#bcacfb` | 4 / 12 | Bordes y estados hover suaves |
| `sep-300` | `#9880f7` | 12 | Borde hover de `Card interactive` |
| `sep-400` | `#7050f2` | 6 | Poco uso: decorativo |
| `sep-500` | `#4a26ec` | 11 | **Anillo de foco** (`:focus-visible`, `outline-sep-500`) |
| **`sep-600`** | `#2e0be8` | **118** | **Color primario:** botón primary, links, eyebrows, barra de progreso |
| `sep-700` | `#2409b8` | 82 | Hover del primario, texto de badge `brand`, cifras de `Stat` |
| `sep-800` | `#1b078a` | 16 | Active del primario. Reemplaza al degradado dentro de `.app-shell` |
| `sep-900` / `sep-950` | `#12055c` / `#0a0333` | — / 5 | Velos oscuros sobre fotos (`from-sep-950/45`) |
| `violet-brand` | `#6a0dd9` | 0 directo | Parada media del degradado |
| `purple-brand` | `#a50fc6` | 0 directo | Parada final del degradado |

### 2.2 Acentos
| Token | Valor | Para qué |
|---|---|---|
| **`gold-500`** | `#ffc629` | Amarillo SEP (50 usos): botón `gold`, eyebrows sobre fondo oscuro, subrayado `.gold-underline`, `::selection`, cifras de `Stat` invertido. **Siempre con texto `ink`, nunca texto blanco encima.** |
| `gold-300` / `gold-400` | `#ffdc7a` / `#ffd24d` | Hover del botón `gold` |
| `gold-600` / `gold-700` | `#735000` | Texto dorado legible sobre fondo claro (badge `gold`) |
| `gold-800` | `#5c4000` | Texto dorado más oscuro |
| `seed-500` / `seed-700` | `#326912` | Verde "semilla" del logo (33 usos): badge `seed`, barra de progreso `seed` |
| `seed-400` / `seed-800` | `#9bd46a` / `#28550d` | Decorativo / texto verde intenso |

### 2.3 Neutrales
| Token | Valor | Usos | Para qué |
|---|---|---|---|
| **`ink`** | `#12101c` | 321 | Títulos y texto principal |
| `graphite` | `#373541` | 139 | Texto secundario fuerte, botón `ghost` |
| **`slate-ui`** | `#666370` | **379** | Texto de cuerpo secundario, descripciones y labels |
| `mist` | `#74717c` | 91 | Metadatos y texto terciario. Es el tono más claro que pasa AA sobre blanco (4.65:1): **no uses uno más claro para texto** |
| **`line`** | `#e5e4e9` | 216 | Bordes de tarjetas, inputs y separadores |
| `surface-0` | `#ffffff` | — | Fondo base (en el código se usa `bg-white`, 297 usos) |
| `surface-1` | `#faf9fb` | 85 | Fondo del producto (`.app-shell`), secciones `muted`, `PageHero` |
| `surface-2` | `#f4f3f6` | 38 | Hover de `ghost`, pistas de progreso, skeleton, badge `neutral` |

### 2.4 Semánticos (texto + fondo)
| Par | Valores | Para qué |
|---|---|---|
| `success` / `success-bg` | `#08783b` / `#e6f6ed` | Confirmaciones, pagos aprobados |
| `warning` / `warning-bg` | `#8a5a00` / `#fef4e4` | Pagos en revisión, avisos |
| `danger` / `danger-bg` | `#a3373b` / `#fdecec` | Errores, botón `danger`, acciones irreversibles |
| `info` / `info-bg` | `#245fbd` / `#eaf2fe` | Ayuda contextual (poco uso) |

Usa siempre el par: texto `text-<estado>` sobre `bg-<estado>-bg`.

### 2.5 Degradado de marca
`--sep-gradient: linear-gradient(100deg, sep-600 0%, violet-brand 52%, purple-brand 100%)` se aplica con la clase `.sep-gradient` (o `.sep-gradient-text` para texto). Para fotos, usa velos `bg-gradient-to-t from-sep-950/20…65`.

**✅ Dónde sí:**
- **Banda de CTA de cierre** de una página de marketing (`<Section tone="gradient">`, como en home, empresas, nosotros y programas).
- **El CTA de conversión principal** (registro, postular, donar) con `Button variant="gradient"`: **máximo uno por vista**.
- **Hero de landings de programa o campaña**, con `PageHero tone="gradient"`. El hero de la home es claro (`surface-1`).
- **Franjas de acento de 4px** (`h-1` arriba o `w-1` a la izquierda) en tarjetas destacadas, eventos y testimonios.
- **Cabecera de documentos de identidad:** verificación de certificados y vistas imprimibles. Se imprime con `print-color-adjust: exact`.
- Placeholders de imagen de cursos (`course-media`) y avatares de la ilustración de marca.

**❌ Dónde no:**
- **Dentro del producto autenticado** (`(app)`). `.app-shell` lo convierte en `sep-800` plano; no lo pelees.
- Como fondo de página completa, de tarjetas en grilla, tablas, formularios, inputs o badges.
- En párrafos. `.sep-gradient-text` solo va en una palabra o frase corta de un título de marketing.
- Dos elementos con degradado visibles a la vez en el mismo viewport (por ejemplo, botón degradado dentro de la banda degradada; ahí usa `variant="gold"` u `outline-white`).
- Con texto amarillo o gris encima: sobre el degradado solo van `white`, `white/75` o `gold-500`.

### 2.6 Utilidades de marca
- `.gold-underline` / `<GoldUnderline>`: subrayado amarillo trazado a mano bajo una palabra del título. Máximo uno por pantalla.
- `.grid-bg`: malla sutil de 64px para secciones neutras de marketing.
- `.tabular`: números tabulares para cifras, precios y estadísticas.

---

## 3. Tipografía

- **Poppins** (`font-display`, pesos 500/600/700): títulos de **marketing**. Se usa 198 veces, pero dentro de `.app-shell` se fuerza a Inter.
- **Inter** (`font-sans`, por defecto): todo lo demás: cuerpo, UI y todo el producto autenticado.

### Escala semántica (usa estos tokens)
| Token | Tamaño / interlineado | Uso real |
|---|---|---|
| `text-display` | clamp(40→68px) / 1.06, -0.035em | Hero de la home (9 usos) |
| `text-h1` | clamp(32→40px) / 1.15, -0.025em | Título de página. En el hero de marketing sube a 56px en `lg` (ver §8) |
| `text-h2` | clamp(28→32px) / 1.2, -0.02em | Título de sección (`SectionHeader`) |
| `text-h3` | 24px / 1.33 | Subtítulo, cifras de `PageHero` |
| `text-h4` | 20px / 1.4 | Título de tarjeta y de `EmptyState` |
| `text-body-lg` | 18px / 1.67 | Bajada de hero y de sección |
| `text-body` | 16px / 1.625 | Cuerpo y botón `lg` |
| `text-body-sm` | 14px / 1.57 | UI, botones `sm`/`md`, descripciones |
| `text-caption` | 12px / 1.5, +0.02em | Badges, metadatos, eyebrows |

### Pesos
| Peso | Usos | Dónde |
|---|---|---|
| `font-semibold` (600) | 324 | Títulos h1–h4 (base de `globals.css`), labels y badges |
| `font-medium` (500) | 194 | Botones, links de navegación y texto resaltado |
| `font-bold` (700) | 41 | Solo `h1` del hero de marketing |
| `font-normal` (400) | — | Cuerpo (por defecto) |

### Patrones fijos
- **Eyebrow** (etiqueta sobre el título): `text-caption font-semibold uppercase tracking-[0.12em] text-sep-600`, o `text-gold-500` sobre fondo oscuro.
- Interlineado de párrafos: `leading-relaxed` (147 usos).
- Ancho de lectura: `max-w-[65ch]` para bajadas y `max-w-reading` (48rem) para texto largo.
- `text-wrap: balance` en títulos y `pretty` en párrafos, ya aplicados globalmente.

---

## 4. Espaciado, tamaños y layout

**Escala:** la de Tailwind (4px). Lo más repetido: `gap-2/3/4`, `mt-4/5/8`, `p-5` (tarjetas), `px-4/5`. Se usan medios pasos (`gap-1.5`, `gap-2.5`, `mt-0.5`, `px-3.5`) para ajustes finos de UI. Están permitidos, pero no uses valores arbitrarios (`p-[13px]`).

| Elemento | Valor |
|---|---|
| Padding de `Card` | `p-5` (20px) |
| Sección vertical (`Section`) | `py-12 md:py-16 lg:py-18` |
| `PageHero` | `py-10 md:py-14 lg:py-16` |
| Gutter de `Container` | `px-4 sm:px-6 md:px-8` |
| Separación entre bloques de un formulario | `space-y-4` / `gap-4` |

**Tokens de tamaño:**
| Token | Valor | Uso |
|---|---|---|
| `h-control` / `min-h-control` / `size-control` | 44px | Botones `sm`/`md`, inputs y botones de ícono: **objetivo táctil mínimo** |
| `h-control-lg` | 52px | Botón `lg` |
| `h-nav` | 56px | Barra de navegación |
| `size-icon-sm/md/lg/xl` | 16/18/20/24px | Íconos lucide (en el código predominan `size-4` = 16px y `size-5` = 20px) |
| `max-w-reading` / `content` / `wide` | 48 / 72 / 80rem | `Container size="narrow" / "default" / "wide"` |

**Breakpoints** (los de Tailwind): `sm` 640px (el más usado, 250 usos), `md` 768px, `lg` 1024px (141 usos) y `xl` 1280px (casi sin uso). Diseña primero para móvil (375px) y verifica en 375, 768 y 1440px.

---

## 5. Radios y elevación

| Token | Valor | Usos | Para qué |
|---|---|---|---|
| `rounded-sm` | 6px | 140 | **Botones, inputs** y contenedores de íconos |
| `rounded-md` | 10px | 52 | **Tarjetas** (`Card`), `EmptyState`, media de cursos |
| `rounded-lg` | 14px | 29 | **Superficies flotantes:** diálogos, popovers, paneles con `shadow-elevated` |
| `rounded-xl` | 18px | 5 | Ver §8 |
| `rounded-full` | — | 84 | Badges, avatares, barras de progreso y puntos |

**Elevación:** las tarjetas **no llevan sombra**; se separan con `border border-line` sobre `bg-white` o `surface-1`. Usa sombra solo cuando algo flota:
- `shadow-elevated` (`0 12px 32px rgba(ink,.14)`): diálogos, menús y toasts (10 usos).
- `shadow-subtle` y `shadow-card` están definidos, pero hoy no se usan (ver §8).

---

## 6. Componentes y estados

- **Botones** (`Button`): variantes `primary` (por defecto), `gradient`, `gold`, `outline`, `outline-white`, `ghost`, `link` y `danger`; tamaños `sm`, `md`, `lg` e `icon`. Todos de 44px o más, con `rounded-sm`. Acepta `href` (usa `Link` interno o `<a target=_blank>` para enlaces externos).
- **Badges** (`Badge`): tonos `brand`, `gold`, `seed`, `neutral`, `success`, `warning`, `danger` y `white`; `rounded-full text-caption font-semibold`.
- **Formularios:** `src/components/forms/field.tsx` con `react-hook-form` + `zod`; inputs `rounded-sm border border-line bg-white min-h-control`.
- **Estados obligatorios** en toda vista con datos: **vacío** (`EmptyState`: ícono + título `h4` + descripción + acción), **cargando** (`loading.tsx` con `.skeleton`), **error** (`error.tsx` con mensaje claro y reintentar) y **éxito** (`toast`).
- **Si falta un componente:** créalo en `src/components/ui` siguiendo el mismo estilo y API que los existentes (`cva` para variantes, `cn()` para combinar clases, props `className` y `tone`/`variant`). **No instales shadcn/ui ni otra librería de componentes sin preguntar.**

---

## 7. Movimiento

- Transiciones de UI: `duration-150` (hover y color) a `duration-200` (progreso). Máximo 300ms en interacciones.
- Entradas: `animate-fade-up` (600ms, `ease-out-soft`) y `animate-fade-in` (500ms), solo en marketing. Los diálogos usan `animate-scale-in` (220ms).
- `prefers-reduced-motion` ya está desactivado globalmente en `globals.css`; no agregues animaciones que dependan de JS sin respetarlo.

---

## 8. Inconsistencias a unificar

> Inventario medido en el código. **No se ha cambiado nada todavía**; cada punto propone el valor estándar.

| # | Inconsistencia | Hoy | Propuesta |
|---|---|---|---|
| 1 | **Dos escalas de texto mezcladas** — ✅ **Resuelta** | `text-xs` (296) y `text-sm` (294) de Tailwind convivían con `text-caption` (63) y `text-body-sm` (164), junto con `text-lg` (36), `text-xl`, `text-2xl`, `text-3xl` y `text-base`. | Hecho: 643 clases migradas en 105 archivos (`xs→caption`, `sm→body-sm`, `base→body`, `lg→body-lg`, `xl→h4`, `2xl→h3`). **Más cercano:** `text-3xl` (30px, 1 uso) → `text-h2` (28–32px). Ya no quedan tamaños de Tailwind en el código. |
| 2 | **H1 del hero escrito a mano** — ✅ **Resuelta** | `text-h1 lg:text-[3.5rem]` estaba repetido en 5 archivos, con `leading-[1.04]`, `[1.06]` y `[1.08]` | Hecho: token `--text-hero: 3.5rem` (lh 1.06, -0.03em), registrado en `cn()`. Los 5 h1 usan `text-h1 lg:text-hero` y se quitaron los `leading`/`tracking` a mano. **Hallazgo:** la regla base `h1–h4 { line-height; letter-spacing }` de `globals.css` está fuera de `@layer` y le gana a toda utilidad de Tailwind, así que esos `leading` nunca se aplicaban. Ver #13. |
| 13 | **Base de títulos fuera de `@layer`** (nueva) | `h1, h2, h3, h4 { line-height: 1.15; letter-spacing: -0.02em }` está sin capa y anula el interlineado y el tracking de `text-display`, `text-h1…h4` y `text-hero` en los títulos | ⏳ **Pendiente:** mover esa regla a `@layer base`. Es un cambio visual en todos los títulos, así que conviene hacerlo con revisión visual propia. |
| 3 | **Radios fuera de escala** — ✅ **Resuelta** | Había `rounded-xl` (5), `rounded-2xl` (1, en `(app)/error.tsx`), `rounded-t/b-[24px]` (fair-diagnostic) y `.skeleton` con 8px fijos | Hecho: paneles y diálogos de `apoya-hoy` → `rounded-lg` (con header/footer `rounded-t/b-lg`); alerta de `logout-dialog` → `rounded-md`; `.skeleton` → `var(--radius-sm)`. **Más cercano:** foto del hero (`real-photo`, 18px) → `rounded-lg`; ícono de `(app)/error.tsx` → `rounded-full`, igual que el ícono de `EmptyState`. Quedan 4 valores: sm, md, lg y full. |
| 4 | **Colores hex en clases** — ✅ **Resuelta** | Había 21 usos: `text-[#8A5A00]` (6, idéntico a `warning`), `bg-[#FFFBF0]` / `[#fff6de]` / `[#FFF6DE]` (tint dorado), `bg-[#eef8e4]` / `[#F5FBEF]` (tint verde), `bg-[#852d31]` / `[#70262a]` (hover del botón danger), `bg-[#066331]` y `bg-[#f5f3fb]`, más `bg-red-50` en `(app)/error.tsx`. | Hecho: tokens nuevos `gold-50`, `seed-50`, `danger-700`, `danger-800` y `success-700` (hover del botón de aprobar pago). `#8A5A00 → text-warning`; `#FFFBF0 → bg-gold-50/50` y `#F5FBEF → bg-seed-50/60` (mismo color resultante); `red-50 → danger-bg`. **Más cercano:** `#f5f3fb` (fondo de `(campaign)`) → `surface-2` (`#f4f3f6`). Los hex del CSS (degradado, selección, foco, subrayado, malla, scrollbar, autofill) ahora usan `var()` o `color-mix()` sobre tokens. **Excepciones:** estilos de impresión, imágenes generadas (`icon`, `apple-icon`, `opengraph-image`), `global-error.tsx`, `manifest.ts`, el QR, el Excel y la paleta SVG de `illustrations.tsx` (no pueden usar clases; su `line` quedó sincronizado con el token). |
| 5 | **Variables duplicadas en `:root`** — ✅ **Resuelta** | `--bg`, `--bg-1/2`, `--fg`, `--fg-2/3` y `--border` repetían los neutrales con **otros valores** (`--border #e6e4f0` frente a `line #e5e4e9`; `--fg-3 #6e6a85` frente a `mist #74717c`). | Hecho: `body` usa `surface-0`/`ink`, `.skeleton` usa `surface-2`, los fondos punteados de `/nosotros` y `/voluntariado` usan `var(--color-line)`, y se borraron `--bg*`, `--fg*` y `--border`. Excepción: `global-error.tsx` mantiene hex en línea porque se pinta sin `globals.css`. |
| 6 | **Tokens con el mismo valor** | `gold-600` = `gold-700` = `#735000`; `seed-500` = `seed-700` = `#326912` | Dejar uno de cada par (`gold-700`, `seed-700`) o diferenciarlos. |
| 7 | **Tracking de eyebrows** | `0.12em` (54), `0.1em` (17), `0.14em` (11), `0.08em` (9) y `0.06em` (1) | Estandarizar en `0.12em`, idealmente con un componente `<Eyebrow>`. |
| 8 | **Sombras sin uso** | `shadow-subtle` y `shadow-card` definidas con 0 usos | Borrarlas, o documentar `shadow-card` para tarjetas arrastrables si se necesitan. |
| 9 | **`font-display` dentro del producto** | Vistas de `(app)` piden `font-display`, que `.app-shell` neutraliza por CSS | Quitar `font-display` del código de `(app)` y dejar la regla CSS solo como red de seguridad. |
| 10 | **Alturas de control** | `h-11` (24 usos = `h-control`), `h-12`, `h-10`, `h-9` y `h-13` | Usar `h-control` / `h-control-lg`. `h-9`/`h-10` solo para elementos no táctiles. |
| 11 | **Anchos máximos arbitrarios** | `max-w-[65ch]`, `[62ch]`, `[60ch]`, `[620px]`, `[440px]` y `[280px]` | Crear `--container-prose: 65ch` y usar `max-w-md`/`lg`/`xl` para el resto. |
| 12 | **Duraciones** | `duration-150/200/300/500/700` | UI: 150–200ms; solo las entradas de marketing pueden llegar a 500ms; eliminar 700ms. |

---

## 9. Hacer / No hacer

✅ **Hacer**
- Reutilizar los componentes de `src/components/ui` y los tokens de `globals.css`.
- Un solo CTA principal por vista, en `sep-600` o, si es de conversión, con degradado.
- Texto secundario en `slate-ui` y metadatos en `mist`.
- Tarjetas con borde `line` y sin sombra.
- Mantener los objetivos táctiles en 44px o más.

❌ **No hacer**
- Escribir `#hex`, `rgb()`, `bg-red-*`, `text-purple-*` ni otros colores por defecto de Tailwind.
- Usar el degradado en el producto autenticado o más de una vez por viewport.
- Poner texto blanco sobre `gold-500`, o texto más claro que `mist` sobre blanco.
- Agregar fuentes nuevas, radios fuera de sm/md/lg/full o sombras en tarjetas.
- Instalar shadcn/ui u otra librería de componentes sin preguntar.
