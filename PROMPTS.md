# PROMPTS.md — Prompts de diseño listos para copiar

Copia y pega en el agente, desde la raíz del proyecto. Los que empiezan con `/` son comandos del kit (`.claude/commands/`).

Pantallas principales de SEP: `/` (landing), `/cursos` (catálogo), `/registro` (elección de cuenta) y `/estudiante` (panel del estudiante; requiere sesión con una cuenta de demo del `README.md`).

---

## 0. Arranque (primera vez)
```
Lee CLAUDE.md, DESIGN.md y README.md. Verifica que los MCPs playwright y context7 estén conectados y que las skills design-system, ui-review, frontend-design, web-design-guidelines y ui-ux-pro-max estén disponibles.
Después, levanta `npm run dev`, abre /, /cursos, /registro y /estudiante con playwright y dime en 10 viñetas como máximo:
- qué tan fiel es la UI actual a DESIGN.md
- las 3 inconsistencias de la sección 8 de DESIGN.md que más se notan a simple vista
- qué pantalla necesita trabajo primero y por qué
No modifiques nada todavía.
```

---

## PALETA Y SISTEMA

### 1. Refinar la paleta (sin cambiar la marca)
```
/paleta
```
o con foco:
```
/paleta texto secundario y estados semánticos
```

### 2. Unificar una inconsistencia de DESIGN.md §8
```
Usa la skill design-system. Toma el punto <N> de la sección 8 de DESIGN.md ("Inconsistencias a unificar"). Muéstrame primero la lista de archivos y líneas afectadas y el cambio exacto que harías. Espera mi OK, aplica, corre `npm run lint` y verifica con ui-review las pantallas afectadas.
```
Orden sugerido: 4 (hex en clases) → 3 (radios) → 1 (escala de texto) → 7 (eyebrows) → el resto.

### 3. Componente que falta
```
Usa la skill design-system. Necesito un componente <nombre> para <uso>. Revisa src/components/ui y confirma que no existe algo reutilizable. Si no existe, créalo en src/components/ui con la misma API que Button y Badge (cva + cn, props variant/className), solo con tokens de DESIGN.md. Muéstrame sus variantes en una ruta temporal y verifícalo con ui-review. No instales librerías.
```

---

## PANTALLAS

### 4. Landing (`/`)
```
/redisenar /
Objetivo: que en 5 segundos un joven universitario entienda qué es SEP, que aprender es gratis y cómo entrar. Revisa la jerarquía entre las secciones ("¿Para quién es SEP?", "Cómo funciona", catálogo, SILP, certificación, "Hay más de una forma de entrar", FAQ): ¿sobran secciones o compiten entre sí? Debe haber un solo CTA principal por viewport y el degradado solo en la banda de cierre y el CTA de conversión. Copy concreto, nada de relleno.
```

### 5. Catálogo de cursos (`/cursos` y `/cursos/[slug]`)
```
/redisenar /cursos
Prioridades: 1) escanear rápido los cursos (título, duración, modalidad, gratis o con certificado), 2) tarjetas consistentes (Card + Badge, rounded-md, sin sombra), 3) dejar claro que el certificado es opcional sin esconder el precio, 4) filtros usables en 375px, 5) estado vacío si no hay resultados. Revisa también una ficha /cursos/[slug].
```

### 6. Registro (`/registro` y `/registro/[tipo]`)
```
/redisenar /registro
Objetivo: que cada persona encuentre su tipo de cuenta (estudiante, docente, institución, speaker…) en un vistazo y llegue al formulario sin dudas. Revisa las tarjetas de elección (área táctil, foco visible, hover), y en /registro/[tipo] los errores de validación inline, los labels y el botón de envío con estado de carga. Un solo CTA con degradado.
```

### 7. Panel del estudiante (`/estudiante`)
```
/redisenar /estudiante
Entra con la cuenta de demo de estudiante del README. Prioridades: 1) qué hago ahora (continuar mi curso) como acción principal, 2) métricas ("Cursos en progreso", "Certificados", "Horas completadas") legibles y con números tabulares, 3) estado vacío ("Aún no estás en ningún curso") con una acción clara, 4) nada de degradado ni Poppins dentro del panel, 5) loading.tsx con skeleton coherente.
```

---

## REVISIÓN

### 8. Revisión rápida
```
/revisar-ui
```

### 9. Segunda opinión
```
Usa el subagente design-reviewer sobre /, /cursos, /registro y /estudiante.
```

### 10. Accesibilidad
```
Usa la skill web-design-guidelines sobre los componentes de src/components/ui y las páginas /, /cursos y /registro. Luego corrige solo los hallazgos de accesibilidad (contraste, foco, labels, teclado, objetivos táctiles de 44px) y verifica con ui-review.
```

---

## EXTRA

### 11. Crear una skill nueva
```
Usa la skill skill-creator para crear una skill de proyecto en .claude/skills/<nombre> que <qué debe hacer>. Sigue el estilo de design-system y ui-review.
```

### 12. Documentación actualizada de una librería
```
use context7 — ¿cómo se leen las cookies de sesión de Supabase en un Server Component con @supabase/ssr y Next.js 16? Dame un ejemplo en TypeScript.
```
