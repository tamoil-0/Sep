# Programas, cursos y certificados

## Formato estándar de los cursos [deck]
2 semanas · interdiario (3 sesiones/semana) · sesiones de 2 h · **8 h por curso** · 100 % virtual, plataforma SEP ·
**acceso gratuito siempre**. (En la web: `src/config/courses.ts:38-42`.)

> El [deck] dice «2 h por sesión» y «8 h en total» con 6 sesiones: 6 × 2 = 12 h, no 8. La web muestra «8 h · 6 sesiones».
> → [COMPLETAR] confirmar si son 8 h (6 sesiones de ~80 min) o 12 h.

## Catálogo [deck] [plan §1.8] → `src/config/courses.ts`
| Curso | Público | Estado en la web | Fuente |
|---|---|---|---|
| Design Thinking aplicado — «Tu primera experiencia en Design Thinking» | Universitarios | Disponible | [deck] programa piloto |
| Scrum para proyectos sociales | Universitarios | Próximamente | [deck] Gantt mes 4 |
| Liderazgo e impacto regional | Universitarios | Próximamente | [plan §1.8] ⚠️ |
| Metodologías ágiles en el aula | Docentes | Próximamente | [deck] «programa para docentes» |
| AI Design Thinking (docentes y universitarios) | Ambos | Página `/ai-design-thinking` | `docs/IA_Design_Thinking_Programas_Docentes_y_Universitarios.xlsx` ⚠️ |

### Malla del curso 1 [deck] (idéntica en `courses.ts:66-106`)
Semana 1 — Empatía y definición: 1) ¿Qué es Design Thinking? 2) Empatía — conoce a tu usuario 3) Definición del problema (POV).
Semana 2 — Ideación, prototipado y testeo: 4) Brainstorming sin límites (SCAMPER, mapa mental, Crazy 8s) 5) Prototipado
rápido («fallar rápido para aprender rápido») 6) Testeo + presentación de proyectos (mini-pitch).

## SILP — Social Impact Leadership Program
- Programa de liderazgo de **6 semanas** [deck]; «18 sesiones en vivo» en `silp/page.tsx:64` y `courses.ts:170` ⚠️.
- Tarifa social **S/ 200** [pitch] ✅ (`pricing.ts`, `confirmed: true`). Tarifa comercial S/ 350 (`confirmed: false`) ⚠️.
  Becado para voluntarios activos ✅ (`confirmed: true`).

## Certificados [deck] ✅
| Certificado | Precio | Aval | Web |
|---|---|---|---|
| Certificado SEP | S/ 30 | Semillero de Emprendedores Perú | ✅ publicado |
| Certificado Internacional | S/ 50 | Instituto Internacional de Ingeniería | Se muestra «En trámite», sin precio (correcto mientras no haya convenio firmado) |

## Membresías y B2B (`pricing.ts`) — propuestas
Semilla (gratis), Raíz S/ 45, Tronco S/ 80, Bosque S/ 140; B2B: Taller Semilla S/ 900, Programa Raíz S/ 3,200,
Cohorte Bosque S/ 9,000, Alianza Anual desde S/ 25,000. El [deck] solo dice «membresías de 3, 6 y 12 meses» y el [plan §10.4–10.5]
las marca como **propuesta a validar**. 9 precios con `confirmed: false`.
**El rediseño no cambia ningún monto**; solo puede mejorar cómo se marca lo «propuesto» frente a lo «confirmado».

## Donaciones
Montos S/ 10 · 20 · 50 · personalizado (`pricing.ts:181`) [plan §10.6]. Causas: formación en regiones, talleres en colegios, becas SILP.
