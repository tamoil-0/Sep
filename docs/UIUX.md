# UI/UX — Plataforma SEP · Estado actual y oportunidades de mejora

> **Para qué sirve este documento.** Es un briefing de diseño para que otra IA (o
> un diseñador) entienda cómo está construida la interfaz de SEP hoy, con datos
> medidos sobre el código real —no sobre lo que el plan dice que debería ser— y
> pueda proponer cambios concretos sin romper lo que ya funciona.
>
> Todo lo que aparece aquí está verificado contra el repositorio. Los números
> (usos, ratios de contraste, cantidades) salen de contar y calcular sobre
> `src/`, no de estimaciones.
>
> Fecha de la auditoría: **26 de agosto de 2026** · rama `main`

---

## 1. Qué es el producto

**Semillero de Emprendedores Perú (SEP)** — organización juvenil reconocida por
SENAJU, fundada en Casma, Áncash. Forma a jóvenes universitarios, docentes e
instituciones de todas las regiones del Perú en metodologías ágiles y
emprendimiento.

La plataforma es un **producto híbrido**: sitio de marketing público + aplicación
privada con seis paneles por rol.

| Superficie | Rutas | Quién la ve |
|---|---|---|
| `(marketing)` | ~30 páginas públicas | Cualquiera, sin sesión |
| `(auth)` | Login, 3 flujos de registro, recuperación | Anónimos |
| `(onboarding)` | Diagnóstico obligatorio tras el primer login | Cuentas nuevas |
| `(app)` | 6 paneles por rol, ~45 pantallas | Sesión iniciada |
| `(campaign)` | `/apoya-hoy` — captación en ferias presenciales | Público, sin login |

**83 archivos `page.tsx` en total.**

### Los seis roles

Estudiante · Docente · Institución · Mentor/Voluntario · Speaker · Admin/Super
admin. **Un usuario acumula roles** y puede cambiar de panel desde la barra
lateral. Esto condiciona toda la navegación privada.

### Contexto de uso que importa para el diseño

- **Perú, regiones fuera de Lima.** Conexiones lentas y móviles de gama media son
  el caso normal, no el borde.
- **Público joven (17–25) + docentes (35–60).** Dos alfabetizaciones digitales muy
  distintas usando las mismas pantallas.
- **Ferias presenciales.** `/apoya-hoy` se llena de pie, en un móvil prestado, con
  poca luz y prisa. Es el flujo con peor contexto físico de todo el producto.
- **Datos personales bajo Ley 29733.** Los paneles muestran nombres, correos y
  teléfonos de terceros.

---

## 2. Stack de interfaz

| Capa | Elección | Nota para quien proponga cambios |
|---|---|---|
| Framework | **Next.js 16**, App Router, React Server Components | `middleware.ts` se llama `proxy.ts`; `params`, `searchParams` y `cookies()` son **async** |
| Estilos | **Tailwind CSS v4** | **No hay `tailwind.config.js`.** Los tokens viven en `@theme` dentro de [globals.css](../src/app/globals.css) |
| Componentes | **Propios, sin librería** (no shadcn, no Radix, no MUI) | Todo se escribe a mano; no hay primitivas accesibles heredadas |
| Variantes | `class-variance-authority` | Solo en [button.tsx](../src/components/ui/button.tsx) |
| Iconos | `lucide-react` | Tamaños entre 12 y 20 px |
| Fuentes | `next/font/google` — Poppins + Inter | `display: swap`, self-hosted por Next |
| Animación | CSS puro (`@keyframes`) | Sin framer-motion ni librerías |

**Restricción dura:** hay una **CSP estricta** en [next.config.ts](../next.config.ts).
`default-src 'self'`, sin CDNs externos. Cualquier propuesta que cargue una
fuente, un script o una imagen de un tercero **no funcionará** sin tocar la CSP.

---

## 3. Sistema de diseño actual

### 3.1 Paleta

Definida en [`globals.css`](../src/app/globals.css) bajo `@theme`. La marca es un
**degradado azul eléctrico → violeta → púrpura** con **amarillo dorado** como
acento y un **verde brote** que viene del logo.

#### Marca

| Token | HEX | Uso real en el código |
|---|---|---|
| `sep-600` | `#2E0BE8` | Botón primario, enlaces, cabeceras de tabla |
| `violet-brand` | `#6A0DD9` | Punto medio del degradado |
| `purple-brand` | `#A50FC6` | Fin del degradado |
| `sep-800` | `#1B078A` | **Fondo de la barra lateral de los paneles** |
| `sep-50` | `#EFECFE` | Fondo de badges de marca, fila seleccionada |
| — | `linear-gradient(100deg, #2E0BE8 0%, #6A0DD9 52%, #A50FC6 100%)` | Clase `.sep-gradient` |

Escala completa del azul: `50 #EFECFE` · `100 #DCD5FD` · `200 #BCACFB` ·
`300 #9880F7` · `400 #7050F2` · `500 #4A26EC` · `600 #2E0BE8` · `700 #2409B8` ·
`800 #1B078A` · `900 #12055C` · `950 #0A0333`.

#### Acentos

| Token | HEX | Uso |
|---|---|---|
| `gold-300/400/500/600/700` | `#FFDC7A` · `#FFD24D` · `#FFC629` · `#E0A800` · `#996F00` | `500` es el acento principal: subrayados, métricas, borde activo del menú |
| `seed-400/500/700` | `#9BD46A` · `#7CC242` · `#4C8A1F` | Crecimiento, progreso, "semilla plantada" |

#### Neutrales — el 85 % de la interfaz

| Token | HEX | Uso | Contraste sobre blanco |
|---|---|---|---|
| `ink` | `#12101C` | Texto principal | **18.81:1** ✅ |
| `graphite` | `#3A3550` | Texto secundario | **11.63:1** ✅ |
| `slate-ui` | `#6E6A85` | Texto terciario (354 usos) | **5.17:1** ✅ |
| `mist` | `#A8A4BC` | Hints, placeholders, iconos (84 usos) | **2.41:1** ❌ |
| `line` | `#E6E4F0` | Bordes 1 px | — |
| `surface-2` | `#F2F1F8` | Hover, superficie elevada | — |
| `surface-1` | `#F7F6FC` | Fondo de secciones y de los paneles | — |
| `surface-0` | `#FFFFFF` | Fondo base | — |

#### Semánticos

`success #12A150` / bg `#E6F6ED` · `warning #F5A524` / bg `#FEF4E4` ·
`danger #E5484D` / bg `#FDECEC` · `info #3B82F6` / bg `#EAF2FE`.

### 3.2 Reglas de marca vigentes

Están escritas en el plan maestro y **el código las respeta**:

1. **Blanco domina.** El degradado aparece **máximo 2 veces por pantalla** (hero y
   bloque de cierre).
2. **Amarillo = puntuación, no párrafo.** Subrayados, métricas, iconos, borde
   activo del menú. Nunca como fondo de bloques de texto.
3. **Bordes de 1 px `line`.** Nada de bordes gruesos.
4. **Aire generoso.** Secciones a `py-16 sm:py-24`.
5. Un solo peso de sombra —aunque **esto ya no se cumple**, ver §6.2.

### 3.3 Tipografía

| Rol | Fuente | Pesos cargados |
|---|---|---|
| Display (h1–h4) | **Poppins** | 500, 600, 700 |
| Cuerpo y UI | **Inter** | variable (todos) |
| Datos numéricos | Inter con `.tabular` (`font-variant-numeric: tabular-nums`) | — |

Base global: `16px / 1.625`. Los títulos llevan `letter-spacing: -0.02em`,
`line-height: 1.15` y `text-wrap: balance`; los párrafos, `text-wrap: pretty`.

**La escala teórica del plan maestro** (`display-xl 72` · `display-lg 56` ·
`h1 40` · `h2 32` · `h3 24` · `h4 20` · `body-lg 18` · `body 16` · `body-sm 14` ·
`caption 12`) **no está implementada como tokens**. En su lugar hay **30 tamaños
arbitrarios distintos** escritos a mano —ver §6.1.

### 3.4 Radios, sombras y motion

```css
--radius-sm: 8px;  --radius-md: 12px;  --radius-lg: 16px;  --radius-xl: 24px;
--shadow-soft: 0 1px 3px rgba(18,16,28,.06);
--shadow-card: 0 2px 12px rgba(18,16,28,.07);
--shadow-lift: 0 12px 32px rgba(46,11,232,.14);
--ease-out-soft: cubic-bezier(0.2, 0.8, 0.2, 1);
```

**Los tres tokens de sombra se usan 0 veces.** Los cuatro de radio, casi nunca.
Ver §6.2.

Motion: `150ms` micro-interacciones, `200–250ms` paneles, `600ms` entradas.
`prefers-reduced-motion` está respetado globalmente (todas las animaciones caen a
`0.01ms`).

### 3.5 Utilidades de marca propias

| Clase | Qué hace |
|---|---|
| `.sep-gradient` | Fondo con el degradado de marca |
| `.sep-gradient-text` | Texto recortado sobre el degradado |
| `.gold-underline` | Subrayado amarillo trazado a mano detrás de una palabra (pseudo-elemento `::after`, `z-index: -1`) |
| `.tabular` | Cifras de ancho fijo |
| `.grid-bg` | Malla sutil con `mask-image` radial |
| `.skeleton` | Shimmer de carga (10 usos) |
| `.animate-fade-up` / `.animate-fade-in` / `.animate-scale-in` / `.animate-float` / `.animate-marquee` | Entradas y bucles |

---

## 4. Inventario de componentes

### 4.1 Primitivas — [`src/components/ui/`](../src/components/ui/)

| Componente | Archivo | Variantes |
|---|---|---|
| `Button` | [button.tsx](../src/components/ui/button.tsx) | 8 variantes (`primary`, `gradient`, `gold`, `outline`, `outline-white`, `ghost`, `link`, `danger`) × 4 tamaños (`sm` 36px, `md` 44px, `lg` 52px, `icon` 40px). Renderiza `<button>`, `<Link>` o `<a>` externo según `href` |
| `Container` | [primitives.tsx](../src/components/ui/primitives.tsx) | `narrow` (48rem) · `default` (72rem) · `wide` (80rem) |
| `Section` | ídem | `base` · `muted` · `gradient` |
| `SectionHeader` | ídem | eyebrow + título + bajada, alineación izquierda o centro, modo invertido |
| `PageHero` | ídem | Hero de páginas internas con `stats`, `action`, `aside` |
| `Card` | ídem | `interactive` añade hover con elevación |
| `Badge` | ídem | 8 tonos: `brand`, `gold`, `seed`, `neutral`, `success`, `warning`, `danger`, `white` |
| `EmptyState` | ídem | Icono + título + descripción + acción, borde discontinuo |
| `ProgressBar` | ídem | Tonos `brand`/`gold`/`seed`, con `role="progressbar"` y `aria-value*` |
| `Stat` | ídem | Métrica grande con degradado o amarillo |
| `GoldUnderline` | ídem | Envuelve una palabra con el subrayado de marca |

### 4.2 Formularios — [`src/components/forms/field.tsx`](../src/components/forms/field.tsx)

`Field` (label + hint + error con `role="alert"`), `Input`, `Select` (flecha SVG
inline en `data:` URI), `Textarea`, `Checkbox`, `FormAlert`.

Todos los controles comparten una base: `h-11` (44 px), `rounded-[10px]`,
borde `line`, y foco con `border-sep-400` + `ring-4 ring-sep-500/10`.
`aria-invalid` se propaga.

**Validación:** `react-hook-form` + `zod` en cliente, y Server Actions que
devuelven `ActionResult` con mensajes en español ([result.ts](../src/lib/result.ts)).
Los errores de Postgres se traducen a lenguaje humano.

### 4.3 Piezas de panel — [`src/components/app/`](../src/components/app/)

| Componente | Qué resuelve |
|---|---|
| `AppSidebar` | Barra lateral fija `232px` en desktop, drawer `min(82vw,280px)` en móvil. Fondo `sep-800`. Item activo: borde izquierdo `gold-500` + `bg-white/12`. Incluye cambio de panel entre roles y prefetch al hover/focus |
| `PageHeader` | Título + descripción + slot `action`. Estandariza el alto de todas las pantallas |
| `Kpi` / `KpiGrid` | Tarjetas de métrica, grid 1→2→4 columnas |
| `DataTable` | Tabla con `min-w-[560px]`, scroll horizontal con `tabIndex={0}`, `<caption>` sr-only |
| `StatusBadge` | Mapea ~25 estados del dominio (pagos, inscripciones, certificados, talleres…) a tonos de `Badge` |
| `PanelSection` | Cabecera de sección en versalitas + enlace "ver todo" |
| `ComingSoon` | Estado vacío con guía de qué vendrá |
| `AdminList` | Vista de listado genérica: una vista nueva son ~20 líneas en [`_registry.tsx`](../src/app/(app)/admin/_registry.tsx) |
| `AppLoadingSplash` | Splash con logo y anillos girando, con `role="status"` y `aria-live` |
| `LogoutDialog` | Confirmación + pantalla de despedida animada |
| `PrintButton` / `CopyButton` | Utilidades de acción |

### 4.4 Marketing — [`src/components/marketing/`](../src/components/marketing/)

`Navbar` (sticky, menús desplegables con 140 ms de gracia al salir, prefetch,
scroll pasivo con `requestAnimationFrame`), `Footer`, `NewsletterForm`,
`FaqAccordion`, `CountUp`, `CourseMedia`, `RealPhoto`, `SupportQrDialog`,
`NewsCard`.

`RealPhoto` mantiene un **mapa editorial de 18 fotografías reales** con nombres
semánticos (`community`, `workshop`, `heroPresentation`…) para que las páginas no
referencien UUIDs sueltos.

---

## 5. Patrones de UX por superficie

### 5.1 Sitio público

- **Navbar sticky** que gana borde y `backdrop-blur` al pasar de 8 px de scroll.
- **Landing** de ~10 bloques, cada uno con `SectionHeader` (eyebrow + título +
  bajada) y alternancia de fondo `white` / `surface-1`.
- **Enlace "Saltar al contenido"** en el layout raíz, visible solo al enfocar.
- **Fotografía real** de talleres y comunidad, no stock.
- **Verificación pública de certificados** sin login (`/verificar/[codigo]`).

### 5.2 Autenticación y onboarding

Layout propio, sin navbar. Tres flujos de registro según tipo de usuario
(`/registro/[tipo]`). Tras el primer login, **el diagnóstico de 15 preguntas es
obligatorio** antes de acceder al panel: `AppLayout` redirige a `/onboarding` si
`onboardingDone` es falso.

### 5.3 Paneles privados

Estructura constante: sidebar + `main` con `max-w-6xl`, `PageHeader`, `KpiGrid`,
contenido. Fondo `surface-1` para que las tarjetas blancas floten.

Al navegar entre secciones se muestra un **splash a pantalla completa** montado
por portal (`AppLoadingSplash overlay`), que en desktop respeta el ancho de la
barra lateral (`lg:left-[232px]`).

### 5.4 Feedback y estados

- **No hay sistema de toasts.** Todo el feedback es **inline**: `FormAlert`
  arriba del formulario, errores de campo bajo el control. Es una decisión
  coherente con RSC y evita una dependencia, pero deja las acciones de tabla
  (aprobar un pago, otorgar un rol) sin confirmación visible fuera del propio
  bloque.
- **Estados de carga:** `loading.tsx` en `(app)` y `(marketing)`; `.skeleton`
  para bloques concretos; `isPending` / `useTransition` en 20 formularios.
- **Estados vacíos:** `EmptyState` y `ComingSoon`, siempre con texto que explica
  qué hacer.
- **Error:** solo hay [`(app)/error.tsx`](../src/app/(app)/error.tsx).
- **No existe ningún `not-found.tsx`** en todo el proyecto.

### 5.5 Diálogos

Cuatro diálogos ([logout](../src/components/app/logout-dialog.tsx),
[QR de apoyo](../src/components/marketing/support-qr-dialog.tsx),
[cola de pagos](../src/app/(app)/admin/pagos/payment-queue.tsx),
[usuarios](../src/app/(app)/admin/usuarios/user-table.tsx)). Todos con
`role="dialog"` + `aria-modal`, cierre con `Escape` y foco inicial en el
contenedor. **Ninguno atrapa el foco ni lo devuelve al cerrar.**

### 5.6 Impresión

`globals.css` tiene un bloque `@media print` cuidado: oculta navegación y
botones, fuerza `11pt`, evita cortar tarjetas entre páginas
(`break-inside: avoid`), imprime el degradado de marca con
`print-color-adjust: exact` y añade la URL entre paréntesis tras los enlaces.
Se usa en el reporte de impacto institucional y los certificados.

---

## 6. Hallazgos — dónde está la deuda

Ordenados por impacto. Cada uno lleva la evidencia medida.

### 6.1 P0 · Contraste por debajo de AA en piezas de uso masivo

Ratios calculados con la fórmula WCAG 2.1 sobre los hex reales del tema.
El umbral para texto normal es **4.5:1**; para texto ≥ 24 px o ≥ 18.7 px en
negrita, **3:1**.

| Combinación | Ratio | Usos | Veredicto |
|---|---|---|---|
| `text-mist` `#A8A4BC` sobre blanco | **2.41:1** | 84 | ❌ Falla incluso para texto grande |
| `text-gold-600` `#E0A800` sobre blanco | **2.15:1** | 11 | ❌ El plan maestro lo declara "accesible" y **no lo es** |
| `text-gold-500` `#FFC629` sobre blanco | **1.57:1** | 34 | ❌ Solo válido como decoración |
| `text-seed-500` `#7CC242` sobre blanco | **2.18:1** | — | ❌ |
| Badge `warning`: `#F5A524` sobre `#FEF4E4` | **1.87:1** | — | ❌ |
| Badge `success`: `#12A150` sobre `#E6F6ED` | **3.01:1** | — | ❌ (texto 12 px) |
| Badge `danger`: `#E5484D` sobre `#FDECEC` | **3.43:1** | — | ❌ |
| Badge `seed`: `#4C8A1F` sobre `#EEF8E4` | **3.87:1** | — | ❌ |
| Badge `gold`: `#996F00` sobre `#FFF6DE` | **4.21:1** | — | ⚠️ Al límite |
| Sidebar `text-white/45` sobre `sep-800` | **3.70:1** | 4 | ❌ (correo del usuario, 11 px) |
| Sidebar `text-white/40` y `/35` | 3.14 / 2.69:1 | 2 | ❌ (etiquetas de rol y sección) |

**Lo que sí pasa:** `graphite` 11.63:1 · `slate-ui` 5.17:1 · `sep-600` sobre
blanco 9.02:1 · blanco sobre `sep-600` 9.02:1 · `ink` sobre `gold-500` 11.97:1 ·
badge `brand` 10.02:1 · sidebar `white/60` 5.71:1.

> **Ojo con el badge de estado.** `StatusBadge` es la pieza más repetida de todo
> el panel de admin —aparece en cada fila de pagos, inscripciones, certificados,
> talleres y postulaciones— y **cuatro de sus ocho tonos fallan AA**. Arreglar
> `badgeTones` en [primitives.tsx](../src/components/ui/primitives.tsx) es el
> cambio con mejor relación esfuerzo/impacto de toda la lista.
>
> El tono `warning` ya demuestra la solución correcta: usa `text-[#8A5A00]` en
> lugar de `text-warning`, y eso da **5.44:1**. Basta con aplicar el mismo
> criterio —un tono 700/800 del color para el texto— a `success`, `danger` y
> `seed`.

### 6.2 P0 · Los tokens existen pero nadie los usa

| Token | Definido en | Usos reales |
|---|---|---|
| `--shadow-soft` / `--shadow-card` / `--shadow-lift` | `@theme` | **0** |
| `--radius-sm/md/lg/xl` | `@theme` | 22 (`rounded-lg` 21, `rounded-xl` 1) |

En su lugar el código escribe valores a mano:

- **35 sombras arbitrarias distintas** en 49 lugares
  (`shadow-[0_8px_24px_rgba(46,11,232,.3)]`, `.32`, `.28`, `.25`, `.22`, `.2`…).
  La regla del plan —"un solo peso de sombra"— está rota.
- **13 radios distintos** en píxeles: `5, 6, 8, 9, 10, 11, 12, 14, 15, 16, 18,
  20, 24`. El más usado es `rounded-[10px]` (73 veces), que **no corresponde a
  ningún token**.
- **30 tamaños de fuente arbitrarios** en `rem`. Los más frecuentes:
  `[0.9375rem]` (106), `[1.0625rem]` (47), `[2rem]` (19), `[1.75rem]` (19).
  Hay rarezas de una sola aparición: `[0.65rem]`, `[0.72rem]`, `[0.82rem]`,
  `[1.35rem]`, `[1.45rem]`, `[2.2rem]`, `[3.35rem]`, `[3.65rem]`.

**Consecuencia:** no se puede cambiar la identidad visual desde un sitio. Un
ajuste de radio o de elevación exige tocar decenas de archivos.

**Propuesta natural:** completar `@theme` con la escala tipográfica y de
elevación que el plan ya define, y reemplazar los arbitrarios por tokens. Es un
cambio mecánico, verificable y sin riesgo funcional.

### 6.3 P1 · Modo oscuro declarado pero inexistente

- `.dark` está definido en `globals.css` con seis tokens
  (`--bg #0B0916`, `--bg-1`, `--bg-2`, `--fg`, `--fg-2`, `--fg-3`, `--border`).
- **Cero utilidades `dark:` en todo `src/`.** Cero mecanismos para añadir la
  clase `.dark`. Ningún selector de tema.
- Pero [`layout.tsx`](../src/app/layout.tsx) **sí declara**
  `themeColor` para `prefers-color-scheme: dark` con `#0b0916`.

**Resultado:** en un móvil con el sistema en oscuro, la barra del navegador se
pinta oscura y la página aparece en blanco puro. Es un salto visual desagradable
y una promesa incumplida.

Hay dos caminos coherentes —implementarlo de verdad, o retirar los tokens y el
`themeColor` oscuro— y ninguno de los dos está tomado.

### 6.4 P1 · Foco y teclado en capas superpuestas

- **Ningún diálogo atrapa el foco.** Con `Tab` se sale del modal hacia el
  contenido de detrás, que sigue siendo interactivo.
- **Al cerrar, el foco no vuelve** al elemento que abrió el diálogo.
- **El drawer móvil de la barra lateral** ([app-sidebar.tsx](../src/components/app/app-sidebar.tsx))
  no cierra con `Escape`, no atrapa el foco y el fondo no queda inerte.
- El fondo oscuro del drawer es un `<div>` con `onClick` y `aria-hidden`: cierra
  con ratón pero no con teclado.

Lo que sí está bien: `:focus-visible` global con `outline: 2px solid #4A26EC` y
`outline-offset: 2px`; enlace de salto al contenido; `aria-current` en la
navegación; `aria-expanded` en los desplegables; el contenedor con scroll de
`DataTable` es enfocable (`tabIndex={0}`), que es exactamente lo correcto para
tablas que desbordan.

### 6.5 P1 · Objetivos táctiles por debajo del mínimo

El mínimo recomendado (WCAG 2.5.5 AAA / Material) es **44 × 44 px**.

| Elemento | Tamaño | Estado |
|---|---|---|
| `Button size="md"` (por defecto) | 44 px | ✅ |
| `Button size="sm"` | **36 px** | ❌ |
| `Button size="icon"` | **40 px** | ❌ |
| Botón del menú móvil | **40 px** | ❌ |
| `CopyButton` | **28 px** | ❌ |
| Inputs, selects, textareas | 44 px | ✅ |
| Items de la barra lateral | ~38 px de alto | ⚠️ |

En el panel de admin, donde las acciones de fila usan `size="sm"`, esto se nota
en móvil.

### 6.6 P2 · Cobertura de estados incompleta

| Estado | Situación |
|---|---|
| `not-found.tsx` | **No existe en ninguna ruta.** Un 404 muestra la página por defecto de Next, sin marca ni navegación |
| `error.tsx` | Solo en `(app)`. Un fallo en marketing o auth cae al error genérico de Next |
| `global-error.tsx` | No existe |
| Carga | ✅ Bien cubierto |
| Vacío | ✅ Bien cubierto |

### 6.7 P2 · El splash de navegación es agresivo

Al pulsar cualquier item del menú se monta un overlay a pantalla completa con el
logo, dos anillos girando y tres puntos pulsando. En una navegación rápida
(RSC + prefetch al hover, que ya está implementado) el splash **aparece y
desaparece en menos de 200 ms**, produciendo un parpadeo.

Un patrón más suave —barra de progreso superior, o un retardo de 300 ms antes de
mostrar el splash— daría la misma tranquilidad sin el destello.

### 6.8 P2 · Sin feedback global de acciones

Aprobar un pago, otorgar un rol o revocar un certificado son acciones
irreversibles que hoy solo confirman dentro del propio bloque. Al recargarse la
lista, la confirmación desaparece con ella. Un patrón de notificación efímera
—propio, sin dependencias nuevas, respetando la CSP— cerraría el ciclo.

### 6.9 P2 · Breakpoints desequilibrados

Uso medido: `sm` 222 · `lg` 133 · `md` 42 · `xl` 5 · `2xl` 0.

El salto de `sm` (640 px) a `lg` (1024 px) sin pasar por `md` significa que en
**tablet vertical (768–1023 px)** muchas pantallas siguen mostrando el layout de
móvil. La barra lateral, por ejemplo, solo se fija a partir de `lg`: en un iPad
en vertical se navega con el drawer.

---

## 7. Lo que funciona y no conviene tocar

Para que la próxima iteración no rompa lo bueno:

1. **La disciplina de marca.** Degradado máximo dos veces por pantalla y amarillo
   como puntuación. Es lo que hace que el producto no parezca una plantilla.
2. **`prefers-reduced-motion`** respetado globalmente.
3. **El bloque de impresión.** Está mejor resuelto que en la mayoría de productos
   y es un entregable real para instituciones y patrocinadores.
4. **La consistencia de los paneles.** `PageHeader` + `KpiGrid` + `Card` +
   `EmptyState` hacen que 45 pantallas se sientan como un solo producto.
5. **El registro de vistas de admin** (`_registry.tsx`): añadir una pantalla
   cuesta ~20 líneas. No conviene sustituirlo por componentes sueltos.
6. **Los micro-arreglos de formulario** en `globals.css`: autofill de Chrome
   neutralizado, flechas de `input[type=number]` ocultas, `input[type=date]` con
   la tipografía correcta. Son detalles que ya se resolvieron.
7. **El prefetch al hover/focus** de la barra lateral y la navbar.
8. **Mensajes de error en español real**, traducidos desde los códigos de
   Postgres.

---

## 8. Prioridades sugeridas

| # | Cambio | Esfuerzo | Impacto |
|---|---|---|---|
| 1 | Arreglar los 8 tonos de `Badge` y los usos de `text-mist` / `text-gold-600` | Bajo | **Alto** — accesibilidad legal + legibilidad |
| 2 | Llevar sombras, radios y escala tipográfica a `@theme` y sustituir los arbitrarios | Medio | Alto — hace mantenible todo lo demás |
| 3 | Foco atrapado y restaurado en diálogos y drawer; `Escape` en el drawer | Bajo | Alto — bloquea a usuarios de teclado |
| 4 | Decidir el modo oscuro: implementarlo o retirar tokens y `themeColor` | Medio / Bajo | Medio |
| 5 | Subir `size="sm"` e `icon` a 44 px, o al menos ampliar el área táctil | Bajo | Medio |
| 6 | `not-found.tsx` y `error.tsx` con marca en las rutas públicas | Bajo | Medio |
| 7 | Suavizar el splash de navegación (retardo o barra de progreso) | Bajo | Medio |
| 8 | Introducir `md:` en las pantallas de panel para tablet vertical | Medio | Medio |
| 9 | Notificación efímera para acciones de admin | Medio | Medio |

---

## 9. Cómo trabajar sobre este código

### Reglas que no se pueden romper

1. **No hay `tailwind.config.js`.** Los tokens se añaden en `@theme` dentro de
   [globals.css](../src/app/globals.css).
2. **CSP estricta.** Nada de CDNs, fuentes externas ni scripts de terceros.
3. **Next.js 16:** `params`, `searchParams` y `cookies()` son `async`;
   `middleware.ts` se llama `proxy.ts`.
4. **Server Components por defecto.** Añadir `"use client"` solo cuando haga
   falta estado o eventos. Muchos componentes de UI son servidor puro a
   propósito.
5. **Copy en español de Perú.** Tuteo, tono cercano y directo. Sin anglicismos
   innecesarios ("descargar", no "download").
6. **Los textos de marca** viven en [`src/config/`](../src/config/) —site,
   pricing, courses, navigation, volunteering—. No incrustar copy en los
   componentes.

### Comprobación

```bash
npm run lint      # ESLint, debe salir limpio
npx tsc --noEmit  # tipos, debe salir limpio
npm run build     # build de producción
npm run dev       # http://localhost:3000
```

Para ver los paneles con datos: `npx supabase start` y `supabase db reset`
(necesita Docker). Las cuentas de demo y la contraseña están en el
[README](../README.md).

### Archivos que concentran el sistema de diseño

| Archivo | Qué contiene |
|---|---|
| [`src/app/globals.css`](../src/app/globals.css) | **Todos los tokens**, utilidades de marca, animaciones, impresión — 455 líneas |
| [`src/components/ui/primitives.tsx`](../src/components/ui/primitives.tsx) | Container, Section, Card, Badge, EmptyState, ProgressBar, Stat — 387 líneas |
| [`src/components/ui/button.tsx`](../src/components/ui/button.tsx) | Todas las variantes de botón |
| [`src/components/forms/field.tsx`](../src/components/forms/field.tsx) | Todos los controles de formulario |
| [`src/components/app/data-views.tsx`](../src/components/app/data-views.tsx) | Tabla, StatusBadge, PanelSection, ComingSoon |
| [`src/components/app/app-sidebar.tsx`](../src/components/app/app-sidebar.tsx) | Navegación privada completa |
| [`docs/PLAN-MAESTRO-SEP.md`](./PLAN-MAESTRO-SEP.md) §2 | La intención de diseño original |

---

## 10. Resumen en una página

**Lo que hay:** un sistema de diseño propio, coherente y con personalidad —
degradado azul-púrpura con amarillo de acento, Poppins + Inter, neutrales con
tinte violeta, minimalismo disciplinado—. 83 pantallas construidas sin librería
de componentes, con buena cobertura de estados vacíos y de carga, impresión
cuidada y respeto por `prefers-reduced-motion`.

**Lo que falta:** el sistema **está definido pero no centralizado**. Los tokens de
sombra se usan cero veces y hay 35 sombras escritas a mano; hay 13 radios y 30
tamaños de fuente arbitrarios. La accesibilidad tiene una base sólida (foco
visible, skip link, ARIA correcto) con dos agujeros concretos: **contraste
insuficiente en badges de estado y textos secundarios**, y **ausencia de trampa
de foco en modales y drawer**. El modo oscuro está prometido en los tokens y en
la meta `themeColor`, pero no existe.

**Dónde empezar:** los tonos de `Badge` y `text-mist`. Es el cambio más pequeño
con el mayor efecto sobre personas reales usando el producto.
