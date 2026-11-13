# Kit de diseño de SEP para el agente de código

Configuración del agente para trabajar la UI de SEP (Semillero de Emprendedores Perú) de forma consistente con su sistema de diseño. Incluye:

- **2 MCPs:** Playwright (el agente abre la web, toma screenshots y se corrige) y Context7 (documentación actualizada de librerías)
- **2 skills propias:** `design-system` (reglas de diseño de SEP) y `ui-review` (revisión visual con screenshots)
- **6 skills externas** gratuitas (Anthropic, Vercel y UI UX Pro Max), instaladas con un script
- **3 comandos:** `/paleta`, `/redisenar` y `/revisar-ui`
- **1 subagente:** `design-reviewer`
- **DESIGN.md:** el sistema de diseño real de SEP (tokens de `globals.css`, tipografía, radios y una lista de inconsistencias a unificar)
- **PROMPTS.md:** prompts para copiar y pegar, pensados para las pantallas reales

---

## Estructura

```
sep-platform/
├── CLAUDE.md                  ← instrucciones generales del proyecto (el agente lo lee siempre)
├── DESIGN.md                  ← sistema de diseño: colores, fuentes, espaciado, radios, reglas
├── PROMPTS.md                 ← prompts para copiar y pegar
├── .mcp.json                  ← MCPs del proyecto (playwright, context7)
├── skills-lock.json           ← versiones de las skills externas instaladas
├── instalar-skills.sh         ← instala skills externas (Mac/Linux/Git Bash)
├── instalar-skills.ps1        ← lo mismo para Windows PowerShell
└── .claude/
    ├── skills/
    │   ├── design-system/     ← reglas de diseño de SEP
    │   ├── ui-review/         ← revisión visual con screenshots
    │   └── (6 skills externas)
    ├── commands/              ← /paleta, /redisenar, /revisar-ui
    └── agents/                ← design-reviewer
```

---

## Instalación en otra máquina

**Requisitos:** Node.js 18+ y Git. Python 3 es opcional (lo usan `ui-ux-pro-max` y `webapp-testing`).

1. **Instala las skills externas:**
   - Mac/Linux/Git Bash: `bash instalar-skills.sh`
   - Windows PowerShell: `powershell -ExecutionPolicy Bypass -File instalar-skills.ps1`
   - Si una skill falla con "No matching skills found", vuelve a correr solo esa línea; a veces la búsqueda rápida del repo no la encuentra.
2. **Instala el navegador de Playwright** (una sola vez): `npx playwright install chromium`
3. **Abre el agente** en la carpeta del proyecto, acepta los MCPs del proyecto y escribe `/mcp`. Deberías ver `playwright` y `context7` como **connected**.
4. **Primer prompt:** copia el prompt "0. Arranque" de `PROMPTS.md`.

> **Windows:** `.mcp.json` ya usa `"command": "cmd"` con `"/c", "npx"` al inicio de los `args`. En Mac o Linux, cámbialo a `"command": "npx"` y quita `"/c", "npx"`.

---

## Flujo recomendado

| Paso | Qué hacer | Comando |
|---|---|---|
| 1 | Auditar el contraste y refinar la paleta sin cambiar la marca | `/paleta` |
| 2 | Unificar las inconsistencias de `DESIGN.md` §8, una por una | Prompt 2 de `PROMPTS.md` |
| 3 | Rediseñar las pantallas principales | `/redisenar /`, `/redisenar /cursos`, `/redisenar /registro`, `/redisenar /estudiante` |
| 4 | Revisar con screenshots y corregir | `/revisar-ui` |
| 5 | Segunda opinión independiente | subagente `design-reviewer` |

---

## Skills externas

| Skill | Para qué |
|---|---|
| `frontend-design` (Anthropic) | Interfaces con intención, evita el "look genérico" |
| `webapp-testing` (Anthropic) | Probar la web con Playwright: screenshots, logs, flujos |
| `skill-creator` (Anthropic) | Crear skills nuevas |
| `web-design-guidelines` (Vercel) | Auditoría de UI/UX y accesibilidad con hallazgos `archivo:línea` |
| `vercel-react-best-practices` (Vercel) | Buenas prácticas de rendimiento en React/Next.js |
| `ui-ux-pro-max` | Librería de estilos, paletas, combinaciones de fuentes y reglas UX |

El script también clona **awesome-design-md** en `.referencias/` (ignorado por git): son DESIGN.md de marcas conocidas, solo como referencia.

> ⚠️ Las skills externas corren con los mismos permisos que el agente. Revisa su código antes de usarlas, sobre todo las que traen scripts (`webapp-testing/scripts/with_server.py`).

---

## Reglas clave del kit

- **Componentes:** se reutilizan los de `src/components/ui`; si falta uno, se crea ahí con el mismo estilo y API. **No se instala shadcn/ui ni otra librería de componentes sin preguntar.**
- **Solo tema claro.** Las revisiones visuales se hacen en 375, 768 y 1440 px.
- **Tokens:** solo los de `src/app/globals.css` documentados en `DESIGN.md`. Nada de `#hex` sueltos.
