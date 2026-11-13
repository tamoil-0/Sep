---
description: Refina la paleta existente de SEP — auditoría de contraste AA, ajustes mínimos y una versión con mejor jerarquía, sin cambiar la identidad
argument-hint: [foco opcional, ej. "texto secundario", "badges", "estados semánticos"]
---

Refina la paleta **existente** de SEP. Foco opcional: $ARGUMENTS

**Regla de oro:** no cambies la identidad de la marca. El azul SEP (`sep-600`), el degradado azul→violeta→púrpura, el amarillo SEP (`gold-500`), el verde semilla y las fuentes Inter + Poppins se quedan. Solo se permiten ajustes de luminosidad y saturación pequeños, y tokens nuevos que llenen huecos.

1. Lee `DESIGN.md` (secciones 2 y 8) y los tokens de `@theme` en `src/app/globals.css`.
2. **Auditoría de contraste AA.** Calcula la relación de contraste de cada combinación que el código usa de verdad (busca en `src/**/*.tsx`), como mínimo:
   - Texto `ink`, `graphite`, `slate-ui` y `mist` sobre `white`, `surface-1` y `surface-2`
   - `sep-600`/`sep-700` sobre blanco y `sep-700` sobre `sep-50`
   - `white`, `white/75` y `white/65` sobre el degradado (en sus 3 paradas) y sobre `sep-600`/`sep-800`
   - `ink` sobre `gold-500`; `gold-700` sobre su fondo de badge; `seed-700` sobre su fondo de badge
   - Cada par semántico: `success`, `warning`, `danger` e `info` sobre su `-bg`
   - Anillo de foco `sep-500` contra fondos claros (≥ 3:1)
   
   Entrega una tabla: combinación · ratio · AA texto normal (4.5) · AA texto grande/UI (3.0) · dónde se usa.
3. **Ajustes mínimos:** para cada combinación que falle, propone el cambio más pequeño posible (por ejemplo, oscurecer un token un paso o usar el token vecino) con el ratio resultante. Incluye también los arreglos de la sección 8 de `DESIGN.md` relacionados con color (hex sueltos, tokens duplicados y variables `:root` duplicadas).
4. **Versión con mejor jerarquía:** propone una variante que mejore la jerarquía visual sin tocar la identidad. Por ejemplo: diferenciar `gold-600`/`gold-700` y `seed-500`/`seed-700`, agregar tints `gold-50`/`seed-50`, separar mejor `slate-ui` de `mist`, o aclarar qué tono es "primario", "hover" y "active".
5. Crea `preview-paleta.html` (un solo archivo, sin dependencias) que muestre **lado a lado la paleta actual, la de ajustes mínimos y la de mejor jerarquía**, con elementos reales de SEP: navbar, hero con eyebrow y título, botones (`primary`, `gradient`, `gold`, `outline`, `danger`), una tarjeta de curso con badges, una banda de CTA con degradado, alertas semánticas y un bloque de texto con `slate-ui`/`mist`. Solo tema claro.
6. Ábrelo con el MCP **playwright**, toma screenshots en 375 y 1440 px y muéstramelos junto con la tabla de contraste.
7. **Espera a que elija** una opción (o una mezcla).
8. Con la elegida, actualiza los tokens en `src/app/globals.css` y las secciones 2 y 8 de `DESIGN.md`. No toques componentes todavía; dime qué archivos usan los hex que conviene migrar.
