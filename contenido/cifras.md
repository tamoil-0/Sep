# Cifras visibles en la web

Estado: ✅ verificada en pitch/deck · ⚠️ solo en el Plan Maestro (web anterior) · ❌ inconsistente con la fuente.

## Problema
| Cifra en la web | Dónde | Fuente | Estado | Nota |
|---|---|---|---|---|
| 80 % de programas en Lima | `src/config/site.ts:57`, `src/app/(marketing)/page.tsx:243` | [deck] «El 80 % de los programas de emprendimiento e innovación están en Lima» | ✅ | |
| 9× menos probabilidad de éxito en regiones | `site.ts:62`, `page.tsx:248` | [pitch] «9 veces menos probabilidad de éxito en regiones» | ✅ | En `site.ts` el título dice «Brechas en universidades»: mezcla la cifra con otra brecha → reescribir |
| 70 % del talento emprendedor vive en regiones | `site.ts:67`, `page.tsx:254` | [pitch] «70 % del talento emprendedor del país» | ✅ | En `site.ts` el título dice «Escolares sin referentes»: misma mezcla |
| 90 % de espacios de innovación centralizados | — (no se usa) | [pitch] | ✅ | Disponible |
| 40 % comprometido con su comunidad | — (no se usa) | [pitch] | ✅ | Disponible; redacción ambigua en el pitch, mejor no usarla sin contexto |

## Tracción
| Cifra en la web | Dónde | Fuente | Estado | Nota |
|---|---|---|---|---|
| +135 jóvenes líderes formados | `site.ts:47` (hero de la home); «135+ Jóvenes formados» en `conocenos/wizard.tsx:483` | [pitch] «+135 jóvenes líderes capacitados y validados en Áncash» | ✅ | Texto fiel: «capacitados en Áncash» |
| 60 universitarios | — | [pitch] | ✅ | Disponible |
| 5 colegios aliados | `site.ts:49` | [pitch] «5 colegios impactados (15 escolares por colegio)» | ✅ | «impactados», no «aliados»: el [plan §1.10] lista solo 2 colegios activos |
| 10+ regiones | `site.ts:48`, `(auth)/layout.tsx:13`, `navigation.ts:61`, `empresas/page.tsx:86`, `voluntariado/page.tsx:87`, `conocenos/wizard.tsx:484`, `speakers/page.tsx:20`, `speaker/invitaciones/page.tsx:53`, `estudiante/page.tsx:103` | [plan §1.5] «Regiones activas 6–10» | ❌ | La fuente dice **6 a 10**, no «10+». Aparece en 9 lugares |
| 18 talleres realizados | `site.ts:50` | [plan §1.5] | ⚠️ | No está en los PDF |
| 48 speakers en la red | `site.ts:51` | [plan §1.5] | ⚠️ | No está en los PDF |
| Comunidad de 75+ jóvenes formados | `(auth)/layout.tsx:15` | [plan §1.5] «Miembros de comunidad 75+» | ❌ | La fuente habla de **miembros de comunidad**, no de formados; y choca con «+135 formados» de la home |
| 1,000+ jóvenes de alcance | `speaker/invitaciones/page.tsx:53` | [plan §1.11] | ⚠️ | |
| 1,200+ suscriptores / apertura 89–94 % | (no visible hoy) | [plan §1.12] | ⚠️ | No usar sin confirmar |
| 300+ escolares | — | [plan §1.5] | ⚠️ | El pitch da 5 × 15 = 75; no cuadra con 300+ |
| 12 voluntarios / equipo de 9 | `/contacto` | [pitch] «+12 voluntarios profesionales» | ✅ | |

## Datos de demo (paneles)
Los paneles muestran datos de `supabase/seeds/demo.sql` en local. No son cifras de SEP y no deben copiarse al sitio público.
