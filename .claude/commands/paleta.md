---
description: Audita y refina la paleta «Lavanda neón» de SEP — contraste AA con números, ajustes mínimos y reglas de uso, sin cambiar los 5 colores base
argument-hint: [foco opcional, ej. "texto secundario", "badges", "estados", "bloques noche"]
---

Audita y refina la paleta **«Lavanda neón»** de SEP. Foco opcional: $ARGUMENTS

**Regla de oro:** los 5 colores base son fijos y los eligió el dueño (`violeta-500` #7265FF, `cian-500` #04FFE1,
`turquesa-500` #0BC6AB, `noche-700` #374658, `noche-900` #212B38). Las fuentes Sora + Geist se quedan. Solo se
permiten ajustes en las escalas derivadas, en los roles (`ink`, `slate-ui`, `mist`, `acento`…) y tokens nuevos que
llenen huecos. No propongas otra paleta.

1. Lee `DESIGN.md` (§2 y §3) y los tokens de `@theme` en `src/app/globals.css`.
2. **Auditoría de contraste con números** (`node .claude/skills/ui-review/scripts/contrast.mjs <fg> <bg>`) de cada
   combinación que el código usa de verdad (busca en `src/**/*.tsx`), como mínimo:
   - Roles `ink`, `graphite`, `slate-ui`, `mist` y `acento` sobre `surface-0/1/2`
   - Los mismos roles dentro de `.theme-night`, sobre `noche-900` y sobre una tarjeta translúcida (blanco 6 % sobre noche)
   - Blanco sobre `violeta-600/700`; noche sobre `cian-500/600`
   - Cada par funcional (`success`, `warning`, `danger`, `info`) sobre su `-bg`, en claro y en noche
   - Anillo de foco (`violeta-500` sobre claro, cian sobre noche) ≥ 3:1
   Entrega una tabla: combinación · ratio · AA normal (4.5) · AA grande/UI (3.0) · dónde se usa (`archivo:línea`).
3. **Usos indebidos:** busca cian sobre claro, texto sobre `grad-marca`, texto blanco sobre `violeta-500` o turquesa,
   `text-violeta-*` en lugar de `text-acento`, y hex sueltos fuera de las excepciones de `DESIGN.md` §2.5.
4. **Ajustes mínimos:** para cada fallo, el cambio más pequeño posible con su ratio resultante.
5. Muestra los cambios en `/dev/estilo` (captura a 375 y 1440 px con `shoot.mjs`) junto con la tabla.
6. **Espera mi OK** antes de cambiar tokens. Con el OK, actualiza `globals.css`, `DESIGN.md` §2–3 y `/dev/estilo`.
