---
description: Rediseña una pantalla o componente de SEP siguiendo DESIGN.md, con verificación visual
argument-hint: <pantalla, ruta o archivo — ej. /, /cursos, /registro, /estudiante, components/marketing/navbar.tsx>
---

Rediseña: **$ARGUMENTS** (si está vacío, pregúntame cuál: `/`, `/cursos`, `/registro` o `/estudiante`).

1. Usa las skills **design-system** y **frontend-design**. Lee `DESIGN.md`.
2. Abre la pantalla actual con el MCP **playwright** y toma screenshots en 375, 768 y 1440 px. Dime en 5 viñetas qué está mal hoy (jerarquía, espaciado, contraste, consistencia, estados).
3. Propón el nuevo layout en texto (estructura y qué componentes de `src/components/ui` reutilizarás o crearás) y **espera mi OK** si el cambio es grande. Si es solo pulido, continúa.
4. Implementa:
   - Reutiliza primero los componentes de `src/components/ui`. Si falta uno, créalo ahí siguiendo el mismo estilo y API que los existentes. No instales shadcn/ui ni otra librería de componentes sin preguntarme.
   - Solo tokens de `DESIGN.md` (cero colores escritos a mano) y degradado solo donde lo permite §2.5.
   - Estados vacío / carga / error.
   - Mobile-first.
5. Verifica con la skill **ui-review** (screenshots antes y después) y corrige los problemas de severidad Alta.
6. Entrégame: los screenshots antes/después, la lista de archivos cambiados y lo que quedó pendiente.
