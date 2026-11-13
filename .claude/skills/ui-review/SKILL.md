---
name: ui-review
description: Revisión visual de la UI de SEP con screenshots reales vía el MCP playwright. Úsala después de cualquier cambio de UI, o cuando pidan "revisa cómo se ve", "audita el diseño", "está feo", "revisa responsive" o "revisa accesibilidad".
---

# UI Review

Revisas la interfaz **mirándola**, no solo leyendo código. SEP tiene solo tema claro.

## 1. Preparar
- Verifica que el servidor de desarrollo esté corriendo (`npm run dev`, en http://localhost:3000). Si no lo está, levántalo en segundo plano.
- Define las rutas a revisar: las que te pasaron o, por defecto, estas 4 pantallas principales:
  | Ruta | Qué es |
  |---|---|
  | `/` | Landing de marketing |
  | `/cursos` | Catálogo público de cursos |
  | `/registro` | Elección del tipo de cuenta (conversión) |
  | `/estudiante` | Panel principal del estudiante (requiere sesión) |
- Las rutas de `(app)` (`/estudiante`, `/admin`, `/docente`, `/mentor`, `/institucion`, `/speaker`) requieren iniciar sesión. Usa una cuenta de demo de la sección "Probar con datos de demostración" de `README.md` (requiere `supabase start`). Si la base local no está disponible, revisa solo las rutas públicas y avísalo.

## 2. Capturar (MCP playwright)
Para cada ruta:
1. Navega a la ruta.
2. Redimensiona y toma un screenshot en **375×812**, **768×1024** y **1440×900**.
3. Si la vista tiene datos, captura también el estado vacío, de carga y de error cuando sea posible.
4. Revisa la consola del navegador: cualquier error o warning cuenta como hallazgo.
5. Recorre la página con `Tab`: el foco debe ser visible (`outline sep-500`) y seguir un orden lógico.

## 3. Evaluar con esta checklist
| Área | Qué mirar |
|---|---|
| Jerarquía | ¿Se entiende en 3 segundos qué es y qué hacer? ¿Hay una sola acción principal? |
| Consistencia | ¿Radios (sm/md/lg/full), alturas de botón (44px), tamaños de fuente y espaciado iguales en componentes iguales? |
| Tokens | ¿Hay colores fuera de `DESIGN.md`? Busca `#`, `rgb(`, `bg-<color>-<n>` de Tailwind y `text-xs`/`text-sm` en los archivos tocados. |
| Degradado | ¿Se usa solo donde lo permite `DESIGN.md` §2.5? ¿Nunca en el panel autenticado ni dos veces por viewport? |
| Espaciado | ¿Alineaciones correctas? ¿Hay aire suficiente? ¿Sin valores arbitrarios? |
| Contraste | Texto ≥ 4.5:1 y texto grande e íconos ≥ 3:1. Atención a `mist`, a `white/65–75` sobre el degradado y a nada blanco sobre `gold-500`. |
| Responsive | ¿Nada se desborda ni se corta en 375px? ¿Los objetivos táctiles son de al menos 44px? |
| Estados | ¿Existen vacío, carga y error? |
| Movimiento | ¿Las animaciones de UI duran 300ms o menos? ¿Se respeta `prefers-reduced-motion`? |

Si está instalada la skill **web-design-guidelines**, ejecútala sobre los archivos de las rutas revisadas y suma sus hallazgos.

## 4. Reportar
Entrega una tabla ordenada por severidad:

| # | Severidad | Ruta / breakpoint | Problema | Arreglo propuesto |
|---|---|---|---|---|
| 1 | Alta | /cursos · 375 | Los filtros desbordan la pantalla | Usar `flex-wrap` y `gap-2` en el contenedor de filtros |

Severidades: **Alta** (roto, inaccesible o confuso), **Media** (inconsistente o feo), **Baja** (pulido).

## 5. Corregir (si te pidieron arreglar)
Corrige primero los de severidad Alta, toma nuevos screenshots de las mismas vistas y confirma que se resolvieron. Máximo 3 rondas; si algo sigue fallando, repórtalo.
