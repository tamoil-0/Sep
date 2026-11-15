# contenido/ — fichas de hechos de SEP

Todo texto visible del sitio y de la plataforma sale de estas fichas. Igual que en ECOING: **sin fuente no entra en la web.**

## Reglas

1. Cada dato lleva su fuente (`[pitch]`, `[deck]`, `[plan]`, `[web]`, `[equipo]`). Las claves están en `fuentes.md`.
2. Estado de cada cifra:
   - ✅ **verificada**: aparece en un documento primario (pitch o deck).
   - ⚠️ **secundaria**: solo aparece en el Plan Maestro (que la tomó de la web anterior) — se puede mostrar, pero pide confirmación.
   - ❌ **inconsistente**: el sitio dice algo distinto a la fuente. Hay que corregirla antes del rediseño de esa pantalla.
3. Lo que falte se marca **[COMPLETAR]** aquí, **nunca** en la web. Si un dato no está, la web lo omite.
4. No se inventan testimonios, logos, alumnos, aliados, premios ni cifras. Las maquetas usan datos ficticios
   (nombres tipo «Ana Q.») y nunca datos de las cuentas demo reales.
5. Precios y montos: se documentan tal como están en `src/config/pricing.ts`; **no se cambian** desde el rediseño.
6. Al cambiar un texto en la web, actualiza aquí la ficha y el `archivo:línea`.

## Fichas

| Archivo | Qué contiene |
|---|---|
| `fuentes.md` | Qué se leyó y con qué clave se cita |
| `sep.md` | Identidad, misión, problema, cadena de impacto, equipo, alianzas |
| `cifras.md` | Cada número visible en la web, dónde aparece, fuente y estado |
| `programas.md` | Cursos, malla, SILP, certificados y membresías |
| `comunidad.md` | Voluntariado, red de colegios, speakers, newsletter, FAQ |
| `testimonios.md` | Encuestas de los webinars: cifras y citas anónimas |
| `pendientes.md` | Preguntas para el equipo SEP |
