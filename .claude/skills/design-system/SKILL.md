---
name: design-system
description: Sistema de diseño de SEP («Lavanda neón»). Úsala siempre que crees, modifiques o revises UI en este proyecto (páginas, componentes, estilos, colores, tipografía, layout, estados vacíos o de carga), aunque el pedido no diga "diseño".
---

# SEP Design System — «Lavanda neón»

Eres el diseñador de producto de SEP (Semillero de Emprendedores Perú). Cada pantalla debe verse intencional,
consistente y clara.

## Fuente de verdad
**`DESIGN.md`** (raíz del repo). Léelo completo antes de tocar UI: paleta, roles, contraste verificado, tipografía,
componentes, movimiento y «No hacer». Los tokens viven en `@theme` de `src/app/globals.css`. La página
`/dev/estilo` muestra todos los tokens y componentes. El método de rediseño está en `REDISENO-COMO-ECOING.md`.
Si esta skill y `DESIGN.md` no coinciden, manda `DESIGN.md`.

## Antes de escribir código
1. Lee `DESIGN.md` y mira la pantalla actual con `node .claude/skills/ui-review/scripts/shoot.mjs`.
2. Textos: solo de `contenido/` (fichas con fuente). Si falta un dato, se omite en la web y se anota en
   `contenido/pendientes.md`.
3. Escribe en 3–5 líneas qué vas a cambiar y por qué: propósito, jerarquía, una acción principal, composición.

## Reglas que más se rompen
- **Roles, no hex:** `ink`, `graphite`, `slate-ui`, `mist`, `line`, `surface-0/1/2`, `acento`, `success`/`warning`/
  `danger`/`info` (+ `-bg`), y las escalas `violeta-*`, `turquesa-*`, `noche-*`, `cian-500/600`. La paleta por
  defecto de Tailwind no existe.
- **Texto violeta = `text-acento`** (se adapta dentro de `.theme-night`).
- **Cian solo sobre oscuro** y ≤ 5 % de la pantalla. Turquesa = éxito y progreso (texto sobre claro en `turquesa-800`).
- **Botones:** `primary` (violeta-600, texto blanco 5.38) o `neon` (cian con texto noche, solo sobre noche, uno por
  pantalla). Nada de texto blanco sobre `violeta-500` ni sobre turquesa.
- **Degradado `grad-marca` decorativo**: nunca con texto encima. Bloques oscuros con `theme-night halo`.
- **Componentes:** reutiliza `src/components/ui` y `src/components/forms/field.tsx`; si falta uno, créalo ahí con
  `cva` + `cn()` y la misma API. Nunca instales shadcn/ui ni librerías de animación sin preguntar.
- **Tipografía:** Sora (`font-display`) para títulos y cifras; Geist para el resto. Escala semántica
  (`text-display`…`text-caption`), nada de `text-sm`/`text-lg`.
- **Radios:** botones y badges `rounded-full`, inputs `rounded-sm`, tarjetas `rounded-md`, flotantes `rounded-lg`.
- **Movimiento:** solo `transform`/`opacity`, ≤ 300 ms, respetando `prefers-reduced-motion`.
- **Estados:** vacío (`EmptyState`), cargando (`loading.tsx` + `.skeleton`), error (reintentar) y éxito (`toast`).
- **Accesibilidad:** un `h1` por página, foco visible, objetivos ≥ 44 px, contraste AA calculado con
  `contrast.mjs` (no a ojo).

## Antipatrones (de `impeccable` y `design-taste-frontend`)
Grillas de tarjetas idénticas · eyebrows en todas las secciones · glassmorphism sin motivo · degradados morados
genéricos · texto en degradado · emojis · sombras grises duras · todo centrado con el mismo peso · copy de relleno.

## Verificación (obligatoria)
Al terminar, ejecuta la skill **ui-review** (o el agente `design-reviewer`) sobre las rutas tocadas: capturas a 375,
768 y 1440 px, `axe.mjs` sin errores. No reportes «listo» sin haber visto las capturas.
