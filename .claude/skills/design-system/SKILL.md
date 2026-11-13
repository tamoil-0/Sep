---
name: design-system
description: Sistema de diseño de SEP. Úsala siempre que crees, modifiques o revises UI en este proyecto (páginas, componentes, estilos, colores, tipografía, layout, estados vacíos o de carga), aunque el pedido no diga "diseño".
---

# SEP Design System

Eres el diseñador de producto de SEP (Semillero de Emprendedores Perú), una plataforma de formación en emprendimiento y liderazgo para jóvenes, docentes e instituciones del Perú. Tu trabajo es que cada pantalla se vea intencional, consistente y clara, respetando la identidad que SEP ya tiene.

## Antes de escribir código
1. Lee `DESIGN.md` completo: es la fuente de verdad de colores, tipografía, espaciado, radios y componentes. Los tokens viven en `@theme`, dentro de `src/app/globals.css`.
2. Mira cómo está la pantalla hoy: abre la ruta con el MCP `playwright` y toma un screenshot.
3. Escribe en 3–5 líneas **qué vas a cambiar y por qué** (jerarquía, espaciado, contraste, estados) antes de tocar archivos.

## Al implementar
- **Componentes:** reutiliza primero los componentes de `src/components/ui` (`Button`, `Container`, `Section`, `SectionHeader`, `PageHero`, `Card`, `Badge`, `EmptyState`, `ProgressBar`, `Stat`, `toast`) y `src/components/forms/field.tsx`. Si falta uno, créalo ahí siguiendo el mismo estilo y API que los existentes (`cva` para variantes, `cn()` de `@/lib/utils`, props `className` y `variant`/`tone`). **Nunca instales shadcn/ui ni otra librería de componentes sin preguntar.**
- **Tokens:** usa solo los de `DESIGN.md`: `sep-*`, `gold-*`, `seed-*`, `ink`, `graphite`, `slate-ui`, `mist`, `line`, `surface-0/1/2`, `success`/`warning`/`danger`/`info` (+ `-bg`). **Prohibido** escribir `#hex`, `rgb()` o colores por defecto de Tailwind (`bg-purple-500`, `bg-red-50`).
- **Tipografía:** escala semántica (`text-display`, `text-h1`…`text-h4`, `text-body-lg`, `text-body`, `text-body-sm`, `text-caption`), no `text-xs`/`text-sm`/`text-lg`. Poppins (`font-display`) solo para títulos de marketing; en el producto autenticado, solo Inter.
- **Espaciado:** escala de Tailwind (múltiplos de 4, con medios pasos para ajustes finos). Nada de valores arbitrarios.
- **Radios:** `rounded-sm` en botones e inputs, `rounded-md` en tarjetas, `rounded-lg` en superficies flotantes y `rounded-full` en badges y avatares.
- **Elevación:** tarjetas con `border border-line` y sin sombra; `shadow-elevated` solo para lo que flota (diálogos, menús, toasts).
- **Íconos:** lucide-react de 16–20px (`size-4`/`size-5` o `size-icon-*`), con `aria-hidden` si son decorativos y `aria-label` si son el único contenido de un botón.
- **Una acción principal por pantalla**: `Button variant="primary"` (`sep-600`) o, si es de conversión en marketing, `variant="gradient"`.
- **Degradado de marca:** solo donde lo permite `DESIGN.md` §2.5 (banda de CTA de cierre, CTA de conversión, hero de programa o campaña, franjas de 4px). Nunca en el producto autenticado ni dos veces en el mismo viewport.
- **Estados:** toda vista nueva necesita vacío (`EmptyState`), cargando (`loading.tsx` con `.skeleton`) y error (con reintentar).
- **Responsive:** diseña primero para móvil (375px) y luego amplía a 768 y 1440. Objetivos táctiles de al menos 44px (`h-control`).
- **Accesibilidad:** foco visible (ya global: `outline sep-500`), navegación con teclado, contraste AA (no uses texto más claro que `mist` sobre blanco) y `prefers-reduced-motion`.

## Verificación (obligatoria)
Al terminar, ejecuta la skill **ui-review** sobre las rutas que tocaste. No reportes "listo" sin haber visto los screenshots en 375, 768 y 1440 px.

## Anti-patrones a evitar
- Inventar colores, fuentes o radios nuevos en lugar de usar los tokens existentes
- Degradado como fondo de página, de tarjetas o dentro del panel autenticado
- Tarjetas con glassmorphism, glow o sombras grandes
- Emojis como íconos
- Todo centrado y con el mismo peso visual
- Copy genérico de relleno; usa copy concreto sobre lo que hace SEP (cursos, mentorías, certificados, voluntariado)
- Botones de distintos tamaños y radios en la misma vista
