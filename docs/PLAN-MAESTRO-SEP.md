# PLAN MAESTRO — Plataforma SEP
### Semillero de Emprendedores Perú · *¡Emprende hoy, lidera mañana!*

> Documento único de verdad. Contiene: (1) toda la información extraída de las fuentes,
> (2) identidad visual y paleta, (3) arquitectura de carpetas, (4) tipos de usuario y sus paneles,
> (5) modelo de datos completo, (6) seguridad, (7) precios organizados, (8) despliegue.
>
> **Fecha:** 7 de agosto de 2026 · **Versión:** 1.0 · **Estado:** listo para ejecutar

---

## ÍNDICE

| # | Sección |
|---|---|
| 0 | [Fuentes analizadas](#0-fuentes-analizadas) |
| 1 | [Qué es SEP — información consolidada](#1-qué-es-sep--información-consolidada) |
| 2 | [Identidad visual y paleta de colores](#2-identidad-visual-y-paleta-de-colores) |
| 3 | [Stack tecnológico](#3-stack-tecnológico) |
| 4 | [Arquitectura de carpetas](#4-arquitectura-de-carpetas) |
| 5 | [Tipos de usuario, roles y permisos](#5-tipos-de-usuario-roles-y-permisos) |
| 6 | [Paneles — uno por rol](#6-paneles--uno-por-rol) |
| 7 | [Landing page — estructura completa](#7-landing-page--estructura-completa) |
| 8 | [Modelo de datos (Supabase / PostgreSQL)](#8-modelo-de-datos-supabase--postgresql) |
| 9 | [Seguridad](#9-seguridad) |
| 10 | [Precios y modelo de negocio](#10-precios-y-modelo-de-negocio) |
| 11 | [Despliegue: Supabase + Vercel + Render](#11-despliegue-supabase--vercel--render) |
| 12 | [Roadmap de ejecución](#12-roadmap-de-ejecución) |

---

## 0. FUENTES ANALIZADAS

| Fuente | Qué aportó |
|---|---|
| `https://sep-emprendedores.vercel.app/` | Web actual: navegación, hero, métricas, servicios, footer, redes |
| `/nosotros` | Misión, visión, valores, historia, público objetivo, beneficios |
| `/register` | Formulario actual (departamento, área de interés, términos) |
| `/donaciones` | Montos S/10 · S/20 · S/50 · personalizado; única / mensual; causas |
| `/preguntas_respuestas` | 6 FAQs oficiales (voluntariado, speakers, marcas, asesorías) |
| `/eventos`, `/convocatorias`, `/blog`, `/testimonios` | Rutas existentes, sin contenido cargado |
| `data/sep_plataforma_ux.html` | Mockup: dashboard, catálogo, curso, comunidad, certificados |
| `data/sep_voluntariado_colegios.html` | Mockup: 3 roles de voluntariado, red de colegios, formularios |
| `data/sep_voluntarios_speakers.html` | Mockup: beneficios por rol, newsletter, red de speakers |
| `data/sep_diagnostico_entrada.html` | Flujo del diagnóstico público, 3 perfiles, captura de lead |
| `data/sep_diagnostico_final.html` | 45 preguntas (15 × 3 perfiles) con hipótesis a validar |
| `SEP - Deck Propuesta.pdf` (12 slides) | Problema, propuesta de valor, modelo de impacto, portafolio, precios, Gantt 12 meses, stakeholders |
| `PITCH - SEP PDC ODS.pdf` (12 slides) | Cadena de impacto, tracción (+135), modelo de sostenibilidad, alianzas, equipo |
| `image.png` | Equipo directivo (Celeste Ulloa, Diana Gamboa, Jhon Aracayo) |
| `data.txt` | Referencias: mayugo.net (EdTech), Instituto de Ingeniería (aval), PMI, Agile Alliance |

---

## 1. QUÉ ES SEP — INFORMACIÓN CONSOLIDADA

### 1.1 Identidad

| Campo | Valor |
|---|---|
| **Nombre legal** | Semillero de Emprendedores Perú |
| **Marca corta** | SEP |
| **Tagline** | ¡Emprende hoy, lidera mañana! |
| **Fundación** | 7 de abril de 2024 — Casma, Áncash |
| **Reconocimiento** | Organización juvenil reconocida por **SENAJU** |
| **Email** | semilleroemprendedorperu@gmail.com |
| **WhatsApp** | +51 946 370 641 |
| **Facebook** | facebook.com/Semillerodeemprendedoresperu |
| **Instagram** | @semillerodemprendedoresperu |
| **TikTok** | @semillerodeemprendedores |
| **LinkedIn** | @linkedin.semilleroemprendedoresperu |
| **Dominio objetivo** | `sep.edu.pe` o `semillero.pe` |

### 1.2 Misión, visión, propuesta

- **Misión:** impulsar el desarrollo de jóvenes y emprendedores en los campos de la innovación y la tecnología.
- **Visión:** promover una educación descentralizada y construir un sistema económico basado en la generación de valor consciente.
- **Propuesta de valor:** *Democratizamos metodologías ágiles (Design Thinking, Scrum, Lean Startup) para jóvenes universitarios y docentes, generando impacto en cadena hacia estudiantes de secundaria.*
- **Posicionamiento:** llevamos la innovación **directo al territorio del talento**, no al revés.

### 1.3 El problema (datos del pitch)

| Dato | Cifra |
|---|---|
| Programas de emprendimiento concentrados en Lima | **80 %** |
| Espacios de innovación centralizados | **90 %** |
| Talento emprendedor que vive en regiones | **70 %** |
| Talento comprometido con su comunidad | **40 %** |
| Menor probabilidad de éxito en regiones | **9× menos** |

Tres brechas: **(a)** concentración en Lima, **(b)** universidades sin formación práctica en liderazgo/gestión/oratoria en primeros ciclos, **(c)** escolares sin referentes ni mentores cercanos a su edad.

### 1.4 Modelo de impacto en cadena

```
SEP (plataforma digital)
   → UNIVERSITARIOS (primeros ciclos, cualquier carrera, cualquier región)
      → SE FORMAN EN (Design Thinking · Scrum · Lean · Liderazgo · Oratoria)
         → IMPACTAN A (estudiantes de secundaria en sus propias regiones)
            → SUSTENTABILIDAD (las aulas producen ideas reales; ya no hay que migrar a Lima)
```

Los universitarios además pueden crear proyectos propios de innovación social e integrarse a las áreas funcionales de SEP (formación, alianzas, comunicación, gestión).

### 1.5 Tracción actual

| Métrica | Valor |
|---|---|
| Jóvenes líderes capacitados y validados en Áncash | **+135** |
| Universitarios formados | **60** |
| Colegios impactados | **5** (≈15 escolares por colegio) |
| Estudiantes escolares impactados | **300+** |
| Talleres realizados | **18** |
| Regiones activas | **6–10** |
| Voluntarios activos | **12** |
| Suscriptores al newsletter | **1,200+** |
| Speakers registrados | **48** |
| Miembros de comunidad | **75+** |

### 1.6 Equipo

| Persona | Cargo |
|---|---|
| Celeste Ulloa Jara | Managing Director / CEO & Founder |
| Diana Gamboa | CMO — Content & Social Media Analyst |
| Jhon Aracayo | CTO |
| Anabell Corales | Talent Strategy Analyst |
| Jennifer Lopez | Learning Design Analyst |
| Daniela Gamboa | Program Coordination Analyst |
| Astrid Verde | Community Engagement Analyst |
| Claudia Grados | Recruitment & Onboarding Analyst |
| Max Orihuela | Partnerships Strategy Analyst |
| + 12 voluntarios profesionales | — |

### 1.7 Alianzas y respaldo

- **Redes:** SENAJU, Proa
- **Alianzas estratégicas:** CONEII, CODE (Congreso de Desarrollo Emprendedor), Innovation Challenge (PUCP · equipu), Start Lima
- **Mentorías activas:** Hult Prize Perú, UTP, Universidad Científica del Sur, UPN, Huánuco Innova
- **Premios:** SpinOut Awards 2025
- **Aval de certificación:** Instituto Internacional de Ingeniería (`institutodeingenieria.org`) — $100 USD/año fijo
- **Referencias futuras:** PMI América Latina, Agile Alliance
- **Referencia EdTech de diseño:** mayugo.net
- **Stakeholders prioritarios:** Incuba UNS · AIESEC Perú · Centros federados · Instituto Internacional de Ingeniería

### 1.8 Catálogo de cursos

Formato estándar de **todos** los cursos: **2 semanas · interdiario (3 sesiones/semana) · 2 h por sesión · 8 h totales · 100 % virtual · acceso gratuito siempre**.

| # | Curso | Estado | Público | Certificado |
|---|---|---|---|---|
| 1 | **Design Thinking aplicado** — Empatía, ideación y prototipado para el cambio social | Disponible | Universitarios | S/30 SEP · S/50 Internacional |
| 2 | **Scrum para proyectos sociales** — Gestión ágil de proyectos de impacto regional | Próximamente | Universitarios | idem |
| 3 | **Liderazgo e impacto regional** — Desarrolla tu perfil de líder desde tu región | Próximamente | Universitarios | idem |
| 4 | **Metodologías ágiles en el aula** — DT y Scrum aplicados al entorno escolar | Próximamente | Docentes | idem |
| ★ | **SILP — Social Impact Leadership Program** | Programa insignia | Universitarios | 6 semanas · desde S/200 |

**Malla del Curso 1 — "Tu primera experiencia en Design Thinking"**

| Semana | Sesión | Título | Contenido |
|---|---|---|---|
| 1 — Empatía y Definición | 1 | ¿Qué es Design Thinking? | Introducción al método, casos de éxito en América Latina, diferencia vs pensamiento tradicional |
| | 2 | Empatía — Conoce a tu usuario | Técnicas de observación, entrevistas de usuario, mapa de empatía. Ejercicio práctico en vivo |
| | 3 | Definición del problema (POV) | Sintetizar hallazgos en un "Point of View" potente. Redacción de "¿Cómo podríamos…?" |
| 2 — Ideación, Prototipado y Testeo | 4 | Ideación — Brainstorming sin límites | SCAMPER, mapa mental, "Crazy 8s". Reglas del brainstorming y selección de ideas |
| | 5 | Prototipado rápido | Prototipo en papel en menos de 30 min. Principio "fallar rápido para aprender rápido" |
| | 6 | Testeo + Presentación de proyectos | Feedback de usuarios reales, iteración del prototipo, mini-pitch final ante el grupo |

### 1.9 Programa de voluntariado — 3 roles

| Rol | Vacantes | Descripción | Requisitos | Beneficios exclusivos |
|---|---|---|---|---|
| **Mentor SEP** (Mentor Junior — exclusivo SILP) | 2 | Acompaña a universitarios en el diseño de sus proyectos de innovación social. Guía, retroalimenta y celebra logros | Egresado del SILP o 1 curso SEP completado · 4 h/semana · interés genuino en impacto regional | Certificado Mentor Junior SEP · carta de recomendación personalizada · canal privado de mentores · prioridad para ascender a Mentor Senior · facilitador oficial en Demo Days |
| **Community Manager** | 1 | Gestiona la voz digital de SEP: redes, foro de la plataforma, comunidad de egresados | Instagram, TikTok y LinkedIn · Canva · 5 h/semana | Portafolio digital certificado · reconocimiento público como co-creador · formación en marketing digital social · acceso a métricas y analítica SEP · mentoría en comunicación estratégica |
| **Organizador de eventos** | 1 | Coordina Demo Days, ferias, talleres y workshops | Experiencia organizando actividades estudiantiles · proactividad y detalle · 6 h/semana | Certificado en gestión de eventos · mención oficial en cada evento · red de aliados institucionales · experiencia en eventos de 200+ personas · acceso a speakers de Latam |

**Beneficios comunes a todos los voluntarios:** cursos exclusivos SEP (catálogo completo + SILP gratis) · oportunidad de generar impacto social real · acceso anticipado a eventos y recursos · networking con profesionales de Latam.

**Proceso de selección:** enviar formulario → entrevista virtual de 15 min → confirmación e inducción. Respuesta en 48 h.

### 1.10 Red de colegios

**Beneficios para el colegio (100 % gratuito):**
1. Talleres de innovación social (DT, Scrum, liderazgo) dictados por universitarios de su propia región
2. Certificado de participación firmado por SEP para cada estudiante
3. Mentores universitarios cercanos — rompe el mito de "para innovar hay que ir a Lima"
4. Proyectos de impacto propios: prototipos para problemas reales de su comunidad
5. Acceso a la plataforma SEP al concluir 5to de secundaria

**Formulario de inscripción:** nombre del colegio · región · provincia · nombre del director(a) · teléfono/WhatsApp · correo institucional · N.º aproximado de estudiantes de 3ro–5to · qué espera de SEP.

**Flujo:** 1) Envías la solicitud → 2) Te contactamos en 72 h (reunión virtual) → 3) Firmamos convenio SEP → 4) Primer taller en tu colegio.

**Colegios activos:** I.E. San Bartolomé (Casma, Áncash — 2 talleres) · I.E. República de Perú (Chimbote, Áncash — 5 talleres).

### 1.11 Red de speakers

Formulario: nombre · país · región/ciudad · profesión o expertise · temas (Design Thinking, Scrum, Lean Startup, Liderazgo social, Innovación regional, OKRs, Emprendimiento, Otro) · oportunidades que le abrió el impacto social · historia en 2–3 oraciones · experiencia previa dando charlas (varias veces / una vez / quiero empezar) · LinkedIn o Instagram · correo · disponibilidad para talleres virtuales (sí / depende de la fecha / solo presencial).

**Qué gana:** visibilidad ante 1,000+ jóvenes de 10+ regiones · constancia de speaker SEP · red de contactos con organizadores y fundadores de Latam · cursos exclusivos SEP.

### 1.12 Newsletter

2 ediciones/mes · 1,200+ suscriptores · 48 h de anticipación sobre el anuncio público · tasa de apertura 89–94 %.
Contenido: eventos y convocatorias · recursos y herramientas · llamados a voluntarios y speakers · historias de impacto regional.

### 1.13 Diagnóstico de validación (público, sin login)

Página `/conocenos` — 15 preguntas por perfil, 3 minutos, sin crear cuenta, captura de email al final y "reveal" con SEP como solución.

**3 perfiles:** 🎓 Universitario · 📚 Docente · 🏢 Empresa u organización → **45 preguntas totales**.

**Estructura (5 bloques por perfil):** 1) ¿Quién eres? · 2) El dolor · 3) Aspiraciones y demanda de contenido · 4) Experiencia previa · 5) Disposición.

**Hipótesis que valida:**
- *Universitarios:* no acceden a formación práctica en liderazgo e innovación, están dispuestos a pagar por un certificado accesible y quieren replicar el conocimiento en su comunidad.
- *Docentes:* no tienen acceso a formación en metodologías activas, pagarían por un certificado con reconocimiento institucional y aceptarían universitarios en sus aulas.
- *Empresas:* necesitan demostrar impacto social en regiones con métricas claras y buscan aliados que conviertan su inversión RSE en resultados medibles.

> El banco completo de 45 preguntas con sus opciones está en `data/sep_diagnostico_final.html` y se migra tal cual a la tabla `survey_questions`.

### 1.14 FAQs oficiales

1. **¿Cómo puedo ser voluntario en SEP?** — SEP convoca una vez al año en las áreas de Cultura y Talento, Marketing y Comunicaciones, Administración y Finanzas, e Innovación y Tecnología.
2. **¿Cómo puedo apoyar la misión de la comunidad SEP?** — Escríbenos en redes o a semilleroemprendedorperu@gmail.com
3. **¿Cómo promociono mi marca en los eventos de SEP?** — Escríbenos en redes o al correo.
4. **¿A quiénes está dirigido el voluntariado?** — Estudiantes universitarios y profesionales jóvenes con tiempo para actividades.
5. **¿Cómo postulo para ser speaker?** — Envía tu CV a nuestras redes o al correo.
6. **¿Cómo accedo a una asesoría para mi emprendimiento?** — Envía tu CV a nuestras redes o al correo.

---

## 2. IDENTIDAD VISUAL Y PALETA DE COLORES

### 2.1 Lectura de la marca

El logotipo, ambos decks y la web actual comparten un **degradado azul eléctrico → púrpura magenta** con **amarillo dorado** para titulares y acentos, blanco puro para el logo, y un **brote verde** como símbolo de "semillero". Esa es la marca real y es la que manda.

> Los mockups de `data/` usan verde bosque `#1A5C38` + ámbar `#E8A020`: eso era una maqueta de estructura, **no** la marca. Se descarta ese verde salvo como color semántico de éxito.

### 2.2 Paleta oficial SEP

**Marca — degradado principal**

| Token | HEX | Uso |
|---|---|---|
| `sep-blue-600` | `#2E0BE8` | Inicio del degradado, botones primarios, links |
| `sep-violet-600` | `#6A0DD9` | Punto medio del degradado |
| `sep-purple-600` | `#A50FC6` | Fin del degradado, hovers |
| `sep-gradient` | `linear-gradient(100deg, #2E0BE8 0%, #6A0DD9 52%, #A50FC6 100%)` | Hero, badges, superficies de marca |

**Escala del azul de marca (para estados y superficies)**

| Token | HEX |
|---|---|
| `sep-blue-50` | `#EFECFE` |
| `sep-blue-100` | `#DCD5FD` |
| `sep-blue-200` | `#BCACFB` |
| `sep-blue-300` | `#9880F7` |
| `sep-blue-400` | `#7050F2` |
| `sep-blue-500` | `#4A26EC` |
| `sep-blue-600` | `#2E0BE8` |
| `sep-blue-700` | `#2409B8` |
| `sep-blue-800` | `#1B078A` |
| `sep-blue-900` | `#12055C` |
| `sep-blue-950` | `#0A0333` |

**Acento — amarillo SEP**

| Token | HEX | Uso |
|---|---|---|
| `sep-yellow-300` | `#FFDC7A` | Fondos suaves, badges |
| `sep-yellow-400` | `#FFD24D` | Hover |
| `sep-yellow-500` | `#FFC629` | **Acento principal**: subrayados, iconos, CTA secundario, números de métrica |
| `sep-yellow-600` | `#E0A800` | Texto amarillo sobre blanco (accesible) |
| `sep-yellow-700` | `#996F00` | Texto sobre fondos amarillos claros |

**Acento — verde semilla** (el brote del logo)

| Token | HEX | Uso |
|---|---|---|
| `sep-seed-400` | `#9BD46A` | Fondos suaves |
| `sep-seed-500` | `#7CC242` | Iconografía de crecimiento, progreso, "semilla plantada" |
| `sep-seed-700` | `#4C8A1F` | Texto sobre claro |

**Neutrales minimal** (base del sistema — el 85 % de la interfaz)

| Token | HEX | Uso |
|---|---|---|
| `ink` | `#12101C` | Texto principal (casi negro, con tinte violeta) |
| `graphite` | `#3A3550` | Texto secundario |
| `slate` | `#6E6A85` | Texto terciario, placeholders |
| `mist` | `#A8A4BC` | Texto deshabilitado, iconos sutiles |
| `line` | `#E6E4F0` | Bordes (0.5–1 px) |
| `surface-2` | `#F2F1F8` | Superficie elevada / hover |
| `surface-1` | `#F7F6FC` | Fondo de secciones alternas |
| `surface-0` | `#FFFFFF` | Fondo base |

**Semánticos**

| Token | HEX | Fondo suave |
|---|---|---|
| `success` | `#12A150` | `#E6F6ED` |
| `warning` | `#F5A524` | `#FEF4E4` |
| `danger` | `#E5484D` | `#FDECEC` |
| `info` | `#3B82F6` | `#EAF2FE` |

**Modo oscuro** (para los paneles)

| Token | HEX |
|---|---|
| `dark-surface-0` | `#0B0916` |
| `dark-surface-1` | `#12101F` |
| `dark-surface-2` | `#1A1730` |
| `dark-line` | `#2A2545` |
| `dark-ink` | `#F4F3FA` |
| `dark-slate` | `#9B96B4` |

### 2.3 Reglas de uso (estilo minimal)

1. **Blanco domina.** El degradado de marca aparece máximo **2 veces por pantalla**: hero y un bloque de cierre/CTA.
2. **Amarillo = puntuación, no párrafo.** Se usa en subrayados de títulos, números de métricas, iconos y el borde activo del menú. Nunca como fondo de bloques grandes de texto.
3. **Un solo peso de sombra.** `0 1px 3px rgba(18,16,28,.06)`. Nada de sombras dramáticas.
4. **Bordes de 1 px `line`**, radios `12px` (tarjetas) / `8px` (inputs, botones) / `999px` (pills).
5. **Aire generoso:** secciones con `padding-block: 96px` en desktop, `64px` en móvil.
6. **Contraste AA garantizado:** texto amarillo sobre blanco usa `sep-yellow-600`, nunca `500`.

### 2.4 Tipografía

| Rol | Fuente | Notas |
|---|---|---|
| Display / titulares | **Poppins** (600/700) | Geométrica y redonda, es la que más se acerca al wordmark "sep" |
| Cuerpo / UI | **Inter** (400/500/600) | Legibilidad en tablas y formularios |
| Números / datos | **Inter Tight** o Inter con `font-variant-numeric: tabular-nums` | Métricas y precios alineados |

**Escala tipográfica**

| Token | Tamaño / Interlineado | Uso |
|---|---|---|
| `display-xl` | 72 / 76 px, -0.03em | Hero desktop |
| `display-lg` | 56 / 60 px, -0.03em | Hero móvil, títulos de sección grandes |
| `h1` | 40 / 46 px, -0.02em | Títulos de página |
| `h2` | 32 / 40 px, -0.02em | Secciones |
| `h3` | 24 / 32 px, -0.01em | Tarjetas |
| `h4` | 20 / 28 px | Subtítulos |
| `body-lg` | 18 / 30 px | Intros |
| `body` | 16 / 26 px | Cuerpo base |
| `body-sm` | 14 / 22 px | UI, tablas |
| `caption` | 12 / 18 px, +0.02em | Etiquetas, mayúsculas |

### 2.5 Espaciado, radios y motion

- **Espaciado:** escala de 4 px → `4, 8, 12, 16, 24, 32, 48, 64, 96, 128`
- **Radios:** `sm 8` · `md 12` · `lg 16` · `xl 24` · `full 999`
- **Motion:** `150ms ease-out` (micro) · `250ms cubic-bezier(.2,.8,.2,1)` (paneles) · `400ms` (transición de página). Respetar `prefers-reduced-motion`.

---

## 3. STACK TECNOLÓGICO

| Capa | Elección | Por qué |
|---|---|---|
| Framework | **Next.js 15** (App Router, Server Components, Server Actions) | SSR para SEO de la landing + app auth en el mismo repo |
| Lenguaje | **TypeScript** estricto | |
| Estilos | **Tailwind CSS v4** + tokens CSS de la §2 | Minimal, sin librería de UI pesada |
| Componentes | **shadcn/ui** (Radix) — copiados al repo, re-tematizados | Accesibilidad gratis, control total del estilo |
| Iconos | **lucide-react** | Trazo fino, coherente con el estilo minimal |
| Base de datos | **Supabase Postgres** | Requisito del proyecto |
| Auth | **Supabase Auth** (email+password, Google, Magic Link) | |
| Storage | **Supabase Storage** (avatares, vouchers, materiales, certificados) | |
| Realtime | **Supabase Realtime** (comunidad, notificaciones) | |
| Validación | **Zod** + `react-hook-form` | Mismo esquema en cliente y servidor |
| Estado servidor | **TanStack Query** | Solo en zonas cliente del panel |
| Emails | **Resend** + **React Email** | Transaccionales y newsletter |
| Pagos | **Culqi** (tarjeta, Perú) + **Yape/Plin** con voucher | Contexto peruano |
| PDFs | **@react-pdf/renderer** | Certificados con código de verificación |
| Analítica | **Vercel Analytics** + **PostHog** (opcional) | |
| Errores | **Sentry** | |
| Tests | **Vitest** + **Playwright** | |
| Hosting web | **Vercel** | Requisito |
| Worker/cron | **Render** (Background Worker) | Solo si Vercel Cron no alcanza — ver §11.4 |
| CI | **GitHub Actions** | Lint + typecheck + tests + migraciones |

---

## 4. ARQUITECTURA DE CARPETAS

```
sep-platform/
├── .github/
│   └── workflows/
│       ├── ci.yml                      # lint + typecheck + test en cada PR
│       └── deploy-migrations.yml       # supabase db push en merge a main
│
├── public/
│   ├── brand/                          # logo-sep.svg, logo-sep-white.svg, isotipo.svg, favicon
│   ├── images/                          # fotos de talleres, hero, equipo
│   ├── partners/                        # senaju.svg, proa.svg, coneii.svg, code.svg, hultprize.svg…
│   └── og/                              # imágenes Open Graph por ruta
│
├── src/
│   ├── app/
│   │   ├── (marketing)/                 # ── SITIO PÚBLICO ──
│   │   │   ├── layout.tsx               # Navbar público + Footer
│   │   │   ├── page.tsx                 # LANDING
│   │   │   ├── nosotros/page.tsx
│   │   │   ├── cursos/
│   │   │   │   ├── page.tsx             # Catálogo público
│   │   │   │   └── [slug]/page.tsx      # Detalle de curso
│   │   │   ├── silp/page.tsx            # Programa insignia
│   │   │   ├── docentes/page.tsx        # Landing del segmento docente
│   │   │   ├── empresas/page.tsx        # Landing B2B / RSE
│   │   │   ├── colegios/page.tsx        # Red de colegios + formulario
│   │   │   ├── voluntariado/
│   │   │   │   ├── page.tsx             # 3 roles + beneficios
│   │   │   │   └── [rol]/page.tsx       # Postulación por rol
│   │   │   ├── speakers/page.tsx        # Red de speakers + formulario
│   │   │   ├── eventos/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── convocatorias/page.tsx
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── testimonios/page.tsx
│   │   │   ├── precios/page.tsx         # Certificados + membresías + SILP
│   │   │   ├── donaciones/page.tsx
│   │   │   ├── faq/page.tsx
│   │   │   ├── contacto/page.tsx
│   │   │   ├── conocenos/page.tsx       # DIAGNÓSTICO público (sin login)
│   │   │   ├── verificar/[codigo]/page.tsx   # Verificación pública de certificado
│   │   │   └── legal/
│   │   │       ├── terminos/page.tsx
│   │   │       ├── privacidad/page.tsx
│   │   │       └── cookies/page.tsx
│   │   │
│   │   ├── (auth)/                      # ── AUTENTICACIÓN ──
│   │   │   ├── layout.tsx               # Split screen: marca | formulario
│   │   │   ├── login/page.tsx
│   │   │   ├── registro/
│   │   │   │   ├── page.tsx             # Selector de tipo de cuenta
│   │   │   │   ├── estudiante/page.tsx
│   │   │   │   ├── docente/page.tsx
│   │   │   │   └── institucion/page.tsx
│   │   │   ├── recuperar/page.tsx
│   │   │   ├── nueva-contrasena/page.tsx
│   │   │   ├── verificar-email/page.tsx
│   │   │   ├── onboarding/page.tsx      # Completar perfil tras 1er login
│   │   │   └── mfa/page.tsx             # TOTP para staff
│   │   │
│   │   ├── (app)/                       # ── ÁREA PRIVADA ──
│   │   │   ├── layout.tsx               # Sidebar dinámico por rol + topbar
│   │   │   ├── panel/page.tsx           # Redirige al panel según rol
│   │   │   ├── estudiante/
│   │   │   │   ├── page.tsx             # Dashboard
│   │   │   │   ├── mis-cursos/page.tsx
│   │   │   │   ├── catalogo/page.tsx
│   │   │   │   ├── curso/[slug]/
│   │   │   │   │   ├── page.tsx         # Aula: sesiones, progreso
│   │   │   │   │   └── sesion/[n]/page.tsx
│   │   │   │   ├── comunidad/page.tsx
│   │   │   │   ├── certificados/page.tsx
│   │   │   │   ├── eventos/page.tsx
│   │   │   │   ├── proyectos/page.tsx   # Proyectos de innovación social
│   │   │   │   └── membresia/page.tsx
│   │   │   ├── docente/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── programa/page.tsx
│   │   │   │   ├── recursos/page.tsx    # Guías descargables para el aula
│   │   │   │   ├── mi-colegio/page.tsx
│   │   │   │   ├── talleres/page.tsx    # Solicitar taller para su aula
│   │   │   │   └── certificados/page.tsx
│   │   │   ├── mentor/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── mentorados/page.tsx
│   │   │   │   ├── sesiones/page.tsx
│   │   │   │   ├── canal/page.tsx       # Canal privado de mentores
│   │   │   │   └── horas/page.tsx       # Registro de horas de voluntariado
│   │   │   ├── institucion/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── perfil/page.tsx
│   │   │   │   ├── talleres/page.tsx
│   │   │   │   ├── estudiantes/page.tsx
│   │   │   │   ├── impacto/page.tsx     # Reporte de impacto descargable
│   │   │   │   ├── convenio/page.tsx
│   │   │   │   └── facturacion/page.tsx
│   │   │   ├── speaker/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── perfil/page.tsx
│   │   │   │   ├── invitaciones/page.tsx
│   │   │   │   └── participaciones/page.tsx
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx             # KPIs globales
│   │   │   │   ├── usuarios/page.tsx
│   │   │   │   ├── cursos/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx    # Editor de curso/sesiones
│   │   │   │   ├── inscripciones/page.tsx
│   │   │   │   ├── certificados/page.tsx    # Emisión y revocación
│   │   │   │   ├── pagos/page.tsx           # Conciliación Yape/Culqi
│   │   │   │   ├── postulaciones/page.tsx   # Voluntariado + speakers
│   │   │   │   ├── colegios/page.tsx
│   │   │   │   ├── instituciones/page.tsx
│   │   │   │   ├── eventos/page.tsx
│   │   │   │   ├── blog/page.tsx
│   │   │   │   ├── comunidad/page.tsx       # Moderación
│   │   │   │   ├── diagnostico/page.tsx     # Resultados del survey
│   │   │   │   ├── newsletter/page.tsx
│   │   │   │   ├── donaciones/page.tsx
│   │   │   │   ├── impacto/page.tsx         # Reporte anual
│   │   │   │   └── auditoria/page.tsx
│   │   │   └── cuenta/
│   │   │       ├── page.tsx             # Perfil
│   │   │       ├── seguridad/page.tsx   # Contraseña, MFA, sesiones
│   │   │       └── notificaciones/page.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── auth/callback/route.ts
│   │   │   ├── webhooks/
│   │   │   │   ├── culqi/route.ts
│   │   │   │   └── resend/route.ts
│   │   │   ├── certificates/[id]/pdf/route.ts
│   │   │   ├── cron/
│   │   │   │   ├── session-reminders/route.ts
│   │   │   │   └── newsletter-digest/route.ts
│   │   │   └── health/route.ts
│   │   │
│   │   ├── layout.tsx                   # Root: fuentes, providers, metadata
│   │   ├── globals.css                  # Tokens de la §2 como CSS vars
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   └── opengraph-image.tsx
│   │
│   ├── components/
│   │   ├── ui/                          # shadcn re-tematizado: button, input, card…
│   │   ├── brand/                       # Logo, Isotipo, GradientBlock, YellowUnderline
│   │   ├── marketing/                   # Hero, StatsRow, CourseCard, ImpactChain,
│   │   │                                # PricingTable, TestimonialCard, PartnersMarquee,
│   │   │                                # FaqAccordion, CtaBanner, NewsletterForm
│   │   ├── app/                         # AppSidebar, Topbar, RoleSwitcher, ProgressRing,
│   │   │                                # SessionRow, CertificateCard, DataTable, EmptyState
│   │   ├── forms/                       # VolunteerForm, SpeakerForm, SchoolForm,
│   │   │                                # DiagnosticWizard, PaymentForm
│   │   └── providers/                   # ThemeProvider, QueryProvider, ToastProvider
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                # Browser client
│   │   │   ├── server.ts                # Server client (cookies)
│   │   │   ├── admin.ts                 # Service-role — SOLO en servidor
│   │   │   └── middleware.ts            # Refresh de sesión
│   │   ├── auth/
│   │   │   ├── session.ts               # getSession, getUser, requireUser
│   │   │   ├── rbac.ts                  # can(), hasRole(), ROLE_HOME
│   │   │   └── guards.ts                # requireRole() para Server Components
│   │   ├── validations/                 # Esquemas Zod por dominio
│   │   ├── payments/                    # culqi.ts, yape.ts, prices.ts
│   │   ├── email/                       # resend.ts + plantillas React Email
│   │   ├── pdf/                         # certificate-template.tsx, generate.ts
│   │   ├── analytics/
│   │   ├── rate-limit.ts
│   │   ├── logger.ts
│   │   └── utils.ts
│   │
│   ├── server/
│   │   ├── actions/                     # Server Actions por dominio
│   │   │   ├── auth.ts
│   │   │   ├── enrollment.ts
│   │   │   ├── progress.ts
│   │   │   ├── certificates.ts
│   │   │   ├── payments.ts
│   │   │   ├── applications.ts
│   │   │   ├── schools.ts
│   │   │   ├── community.ts
│   │   │   ├── diagnostic.ts
│   │   │   └── newsletter.ts
│   │   └── queries/                     # Lecturas tipadas
│   │
│   ├── types/
│   │   ├── database.ts                  # Generado: supabase gen types
│   │   ├── roles.ts
│   │   └── index.ts
│   │
│   ├── config/
│   │   ├── site.ts                      # Nombre, URLs, redes, contacto
│   │   ├── navigation.ts                # Menús público y por rol
│   │   ├── pricing.ts                   # Fuente única de precios (§10)
│   │   └── regions.ts                   # 25 departamentos del Perú
│   │
│   ├── content/                         # MDX del blog y páginas legales
│   │
│   └── middleware.ts                    # Sesión + protección de rutas por rol
│
├── supabase/
│   ├── config.toml
│   ├── migrations/
│   │   ├── 0001_extensions.sql
│   │   ├── 0002_enums.sql
│   │   ├── 0003_profiles_roles.sql
│   │   ├── 0004_institutions.sql
│   │   ├── 0005_courses.sql
│   │   ├── 0006_enrollments_progress.sql
│   │   ├── 0007_certificates.sql
│   │   ├── 0008_payments_memberships.sql
│   │   ├── 0009_volunteers_speakers.sql
│   │   ├── 0010_community_events.sql
│   │   ├── 0011_diagnostic.sql
│   │   ├── 0012_newsletter_donations.sql
│   │   ├── 0013_audit_notifications.sql
│   │   ├── 0014_rls_policies.sql
│   │   ├── 0015_functions_triggers.sql
│   │   └── 0016_storage_buckets.sql
│   ├── seed.sql                         # Cursos, sesiones, planes, 45 preguntas
│   └── functions/                       # Edge Functions (si hacen falta)
│
├── worker/                              # Servicio en Render (opcional, §11.4)
│   ├── src/index.ts
│   ├── src/jobs/
│   ├── package.json
│   ├── Dockerfile
│   └── render.yaml
│
├── e2e/                                 # Playwright
├── docs/
│   ├── PLAN-MAESTRO-SEP.md              # Este documento
│   ├── DEPLOY.md
│   ├── SECURITY.md
│   └── CONTENIDO.md                     # Copy de la landing para revisión del equipo
│
├── .env.example
├── .env.local                           # No versionado
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── vercel.json
└── README.md
```

---

## 5. TIPOS DE USUARIO, ROLES Y PERMISOS

### 5.1 Respuesta directa: **no son 3, son 6**

El diagnóstico define **3 perfiles de captación** (universitario, docente, empresa), pero la operación real de SEP —cursos, voluntariado, colegios, speakers y equipo interno— necesita **6 roles con panel propio**.

Se modela como **3 tipos de cuenta con registro abierto** + **3 roles internos que SEP otorga**:

| # | Rol | `role` | Cómo se obtiene | Panel |
|---|---|---|---|---|
| 1 | **Estudiante** (universitario / joven / egresado escolar) | `estudiante` | Registro abierto | `/estudiante` |
| 2 | **Docente / Educador** | `docente` | Registro abierto | `/docente` |
| 3 | **Institución** (colegio · universidad · empresa/ONG) | `institucion` | Registro abierto + verificación por SEP | `/institucion` |
| 4 | **Mentor / Voluntario** | `mentor` | Postulación aprobada por SEP | `/mentor` |
| 5 | **Speaker** | `speaker` | Registro en la red + aprobación | `/speaker` |
| 6 | **Admin / Staff SEP** | `admin`, `super_admin` | Asignación manual | `/admin` |

### 5.2 Reglas del modelo

- Un usuario tiene **un tipo de cuenta base** (1–3) y puede **acumular roles adicionales** (4–6). Ejemplo real: Celeste es `estudiante` + `mentor` + `super_admin`.
- Los roles viven en la tabla `user_roles` (N:M), **nunca** en `profiles`, y **nunca** en metadata editable por el cliente.
- El sidebar y el `RoleSwitcher` se construyen desde los roles activos del usuario.
- `super_admin` es el único que puede otorgar o revocar `admin` y `super_admin`.

### 5.3 Sub-roles del voluntariado

`mentor` lleva un campo `volunteer_type`:

| `volunteer_type` | Etiqueta |
|---|---|
| `mentor_junior` | Mentor Junior (exclusivo egresados SILP) |
| `mentor_senior` | Mentor Senior |
| `community_manager` | Community Manager |
| `event_organizer` | Organizador de eventos |

### 5.4 Sub-tipos de institución

`institution_type`: `colegio` · `universidad` · `empresa` · `ong` · `gobierno`.
Determina qué ve en su panel (talleres y estudiantes para `colegio`; impacto y facturación RSE para `empresa`).

### 5.5 Matriz de permisos

Leyenda: ✅ total · 🔸 solo lo propio · ⬜ sin acceso

| Recurso | Estudiante | Docente | Institución | Mentor | Speaker | Admin |
|---|---|---|---|---|---|---|
| Catálogo de cursos (lectura) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Inscribirse a curso | ✅ | ✅ | ⬜ | ✅ | ✅ | ✅ |
| Ver contenido de sesión | 🔸 inscrito | 🔸 inscrito | ⬜ | ✅ | 🔸 inscrito | ✅ |
| Marcar progreso | 🔸 | 🔸 | ⬜ | 🔸 | 🔸 | ✅ |
| Comprar certificado | 🔸 | 🔸 | ⬜ | 🔸 | 🔸 | ✅ |
| Emitir / revocar certificado | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ✅ |
| Publicar en comunidad | ✅ | ✅ | ⬜ | ✅ | ✅ | ✅ |
| Moderar comunidad | ⬜ | ⬜ | ⬜ | 🔸 su cohorte | ⬜ | ✅ |
| Canal privado de mentores | ⬜ | ⬜ | ⬜ | ✅ | ⬜ | ✅ |
| Ver mentorados asignados | ⬜ | ⬜ | ⬜ | 🔸 | ⬜ | ✅ |
| Recursos para el aula | ⬜ | ✅ | 🔸 colegio | ✅ | ⬜ | ✅ |
| Solicitar taller para su aula | ⬜ | ✅ | ✅ | ⬜ | ⬜ | ✅ |
| Gestionar convenio | ⬜ | ⬜ | 🔸 | ⬜ | ⬜ | ✅ |
| Reporte de impacto institucional | ⬜ | ⬜ | 🔸 | ⬜ | ⬜ | ✅ |
| Perfil público de speaker | ⬜ | ⬜ | ⬜ | ⬜ | 🔸 | ✅ |
| Aceptar invitación a charla | ⬜ | ⬜ | ⬜ | ⬜ | 🔸 | ✅ |
| Gestionar usuarios y roles | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ✅ |
| Conciliar pagos | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ✅ |
| Ver resultados del diagnóstico | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ✅ |
| Log de auditoría | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | 🔸 `super_admin` |

### 5.6 Registro por tipo de cuenta

**Común a los tres:** nombre completo · email · contraseña · región (25 departamentos + "otro país") · aceptación de términos y política de privacidad · checkbox opcional de newsletter.

| Estudiante | Docente | Institución |
|---|---|---|
| Fecha de nacimiento (15+) | Institución donde enseña | Nombre de la institución |
| Situación actual (universitario 1–3 / 4+ / egresado / emprendedor / trabaja y estudia) | Nivel (primaria / secundaria / superior) | Tipo (colegio / universidad / empresa / ONG / gobierno) |
| Universidad + carrera + ciclo | Área o curso | RUC (opcional) |
| Áreas de interés (múltiple) | Años de experiencia | Cargo del contacto |
| WhatsApp (opcional) | N.º de estudiantes a cargo | WhatsApp institucional |
| | UGEL / DRE (opcional) | Web / LinkedIn |

---

## 6. PANELES — UNO POR ROL

Todos comparten el layout: **sidebar izquierdo** (fondo `sep-gradient` en versión sólida `sep-blue-800`, ítem activo con borde izquierdo `sep-yellow-500`), **topbar** con título + búsqueda + notificaciones + avatar, y **contenido** sobre `surface-0`.

### 6.1 Panel Estudiante — `/estudiante`

**Sidebar:** Dashboard · Mis cursos · Catálogo · Comunidad · Certificados · Eventos · Mis proyectos · Membresía

**Dashboard:**
- Saludo contextual: *"Buenos días, {nombre} 🌱"* + badge del plan
- 3 KPIs: cursos en progreso · certificados obtenidos · horas completadas
- **Continúa aprendiendo:** tarjetas con barra de progreso, sesión actual y fecha de la siguiente
- **Próxima sesión en vivo:** título, día, hora, curso, botón *Unirme*
- **Comunidad SEP:** últimas 3 publicaciones con avatar, región y tiempo
- Banner de siguiente hito (ej. *"Completa 3 sesiones más para desbloquear tu certificado"*)

**Mis cursos:** en progreso (progreso %, sesiones completadas) · completados · descubrir más.

**Catálogo:** buscador + filtros pill (Todos · Metodologías ágiles · Liderazgo · Para docentes · SILP). Cada tarjeta: estado (Disponible / Próximamente), precio (Gratuito), título, descripción, horas, n.º de sesiones, duración, línea de certificado.

**Aula del curso:** cabecera (estado, %, horas, semanas, sesiones, frecuencia) · barra de progreso *"3/6 sesiones"* · próxima sesión destacada · acordeón por semana con las 6 sesiones (número, título, subtítulo, estado: `Lista` / `Unirme` / `Pendiente`) · bloque de certificados al finalizar (SEP S/30 · Internacional S/50 "Recomendado").

**Comunidad:** contador de miembros activos, KPIs (jóvenes formados, regiones activas), feed con badges de rol (`Mentor`, `Equipo SEP`), composer, filtro por curso/tema.

**Certificados:** en progreso con % y requisito · obtenidos (descargar PDF, copiar link de verificación, compartir en LinkedIn) · tipos de certificado con precios.

**Membresía:** plan actual, beneficios, uso, botón de mejora, historial de pagos.

### 6.2 Panel Docente — `/docente`

**Sidebar:** Dashboard · Mi programa · Recursos para el aula · Mi colegio · Solicitar taller · Certificados

- **Dashboard:** progreso en "Metodologías ágiles en el aula", próxima sesión, recursos nuevos, estado de la solicitud de taller.
- **Recursos:** biblioteca descargable (guías de sesión, plantillas de mapa de empatía, rúbricas, presentaciones) filtrable por metodología y nivel.
- **Mi colegio:** vincularse a un colegio de la red o invitarlo; ver talleres realizados y estudiantes impactados.
- **Solicitar taller:** formulario (tema, fechas propuestas, grado, n.º de estudiantes, modalidad) → crea `workshop_requests`.
- **Certificados:** los suyos + constancias de los estudiantes de sus talleres.

### 6.3 Panel Mentor / Voluntario — `/mentor`

**Sidebar:** Dashboard · Mis mentorados · Sesiones · Canal de mentores · Mis horas · Recursos

- **Dashboard:** rol y nivel (Junior/Senior/CM/Organizador), horas del mes vs compromiso (4/5/6 h semana), próximas sesiones, mentorados activos, avisos del equipo.
- **Mis mentorados:** lista con avance del proyecto, última interacción, notas privadas; ficha con historial.
- **Sesiones:** agenda 1:1 y grupales, registrar acta y feedback.
- **Canal de mentores:** foro cerrado con recursos, casos y formación en mentoría.
- **Mis horas:** registro de horas certificable → alimenta el certificado de voluntariado y la carta de recomendación.
- Vistas específicas: `community_manager` ve calendario editorial y métricas; `event_organizer` ve eventos, logística y checklist.

### 6.4 Panel Institución — `/institucion`

**Sidebar:** Dashboard · Perfil institucional · Talleres · Estudiantes · Reporte de impacto · Convenio · Facturación

- **Dashboard (colegio):** talleres realizados, estudiantes impactados, próximo taller, universitarios asignados, estado del convenio.
- **Dashboard (empresa):** cohortes patrocinadas, jóvenes formados, regiones alcanzadas, ODS alineados, presupuesto ejecutado.
- **Talleres:** solicitar, programar, confirmar asistencia, evaluar.
- **Estudiantes:** listado, asistencia, constancias emitidas (con consentimiento; menores anonimizados por defecto).
- **Reporte de impacto:** PDF descargable con métricas, fotos, testimonios y mapeo a ODS — el entregable clave para las empresas RSE.
- **Convenio:** documento, estado, fechas, renovación.
- **Facturación:** órdenes, comprobantes, datos de RUC.

### 6.5 Panel Speaker — `/speaker`

**Sidebar:** Dashboard · Mi perfil público · Invitaciones · Mis participaciones · Recursos

- **Dashboard:** invitaciones pendientes, próxima charla, alcance acumulado (jóvenes alcanzados, regiones).
- **Mi perfil público:** foto, país, región, expertise, temas, historia, redes, disponibilidad → alimenta la vitrina pública `/speakers`.
- **Invitaciones:** aceptar / rechazar / proponer otra fecha.
- **Mis participaciones:** historial + constancia de speaker descargable.

### 6.6 Panel Admin — `/admin`

**Sidebar:** KPIs · Usuarios · Cursos · Inscripciones · Certificados · Pagos · Postulaciones · Colegios · Instituciones · Eventos · Blog · Comunidad · Diagnóstico · Newsletter · Donaciones · Impacto · Auditoría

- **KPIs:** usuarios por rol y región (mapa del Perú), inscripciones, tasa de completación por curso, certificados emitidos y su mix, ingresos del mes, embudo de postulaciones, crecimiento del newsletter.
- **Usuarios:** buscar, ver, asignar/revocar roles, suspender, impersonar (solo `super_admin`, siempre auditado).
- **Cursos:** CRUD de curso, semanas, sesiones, materiales, cupos, fechas y enlaces de Meet.
- **Certificados:** cola de solicitudes → validar requisitos → emitir → PDF con código único; revocar con motivo.
- **Pagos:** conciliar vouchers de Yape/Plin (imagen + monto + fecha), ver transacciones Culqi, reembolsos.
- **Postulaciones:** voluntariado y speakers en kanban (Recibida → Entrevista → Aprobada / Rechazada) con notas y correo automático.
- **Diagnóstico:** respuestas agregadas por perfil, cruces (región × barrera, disposición a pagar × perfil), exportar CSV.
- **Impacto:** generador del reporte anual (formados, regiones, proyectos, colegios, horas de voluntariado).
- **Auditoría:** quién hizo qué y cuándo, inmutable.

---

## 7. LANDING PAGE — ESTRUCTURA COMPLETA

Estilo: **minimal, mucho blanco, tipografía grande, degradado de marca solo en hero y cierre, amarillo como puntuación.**

| # | Sección | Contenido |
|---|---|---|
| 1 | **Navbar** | Logo SEP · Cursos · SILP · Voluntariado · Colegios · Empresas · Nosotros · Blog → botones *Iniciar sesión* (ghost) y *Crear cuenta* (sólido). Sticky, fondo translúcido con blur al hacer scroll |
| 2 | **Hero** | Fondo `sep-gradient`. Badge: *"Reconocidos por SENAJU · Desde Áncash para el Perú"*. H1: **"Emprende hoy, lidera mañana."** Sub: *"Democratizamos metodologías ágiles para jóvenes de todas las regiones del Perú. 100 % virtual. Cursos gratuitos siempre."* CTAs: *Empezar gratis* (amarillo) · *Ver cursos* (outline blanco). Debajo: 4 métricas en línea |
| 3 | **Barra de métricas** | +135 jóvenes formados · 10+ regiones · 5 colegios aliados · 18 talleres · 48 speakers. Números en `sep-yellow-500`, tabular-nums, animación de conteo |
| 4 | **El problema** | 3 tarjetas minimal sobre blanco: *Concentración en Lima (80 %)* · *Brechas en universidades* · *Escolares sin referentes*. Dato grande arriba, texto corto abajo |
| 5 | **Cadena de impacto** | Diagrama horizontal de 4 pasos con flechas amarillas: SEP → Universitarios → Se forman en → Impactan a. Responsive: vertical en móvil |
| 6 | **Cursos** | Grid de 4 tarjetas: badge de estado, título, descripción, 8 h · 6 sesiones · 2 semanas, "Gratuito", línea de certificado. CTA *Ver catálogo completo* |
| 7 | **SILP destacado** | Bloque ancho con fondo `surface-1` y borde: *Programa insignia · Social Impact Leadership Program · 6 semanas · Liderazgo social completo · Desde S/200*. CTA *Ver detalles* |
| 8 | **Cómo funciona** | 4 pasos numerados: 1) Crea tu cuenta gratis · 2) Elige tu curso · 3) 6 sesiones en vivo, 2 h c/u · 4) Obtén tu certificado |
| 9 | **Certificados** | 2 tarjetas comparativas: Certificado SEP S/30 · Certificado Internacional S/50 (badge *Recomendado*, aval del Instituto Internacional de Ingeniería). Nota: *el curso siempre es gratis; el certificado es opcional* |
| 10 | **Para docentes** | Banda con imagen + copy del segmento docente y CTA *Conocer el programa docente* |
| 11 | **Red de colegios** | Copy + beneficios en 3 puntos + CTA *Inscribir mi colegio* + logos/nombres de colegios activos |
| 12 | **Voluntariado** | 3 tarjetas de rol (Mentor · Community Manager · Organizador) con vacantes y CTA *Postular* |
| 13 | **Comunidad y testimonios** | 3 testimonios reales con avatar, nombre, región y curso |
| 14 | **Aliados** | Marquee en escala de grises que pasa a color en hover: SENAJU, Proa, CONEII, CODE, Hult Prize, UTP, Científica del Sur, UPN, Huánuco Innova, Start Lima, Innovation Challenge PUCP, SpinOut Awards 2025 |
| 15 | **Para empresas / RSE** | Bloque B2B: *"Convierte tu inversión social en resultados medibles"* — métricas claras, reporte de impacto, alineación a ODS, co-branding de cohortes. CTA *Hablar con el equipo* |
| 16 | **Diagnóstico** | Banner: *"3 minutos. Sin crear cuenta. Ayúdanos a construir lo que necesitas."* CTA → `/conocenos` |
| 17 | **Newsletter** | Campo de email + *Suscribirme*. Copy: 2 ediciones al mes, 48 h antes del anuncio público, sin spam |
| 18 | **FAQ** | Acordeón con las 6 preguntas oficiales |
| 19 | **CTA final** | Bloque `sep-gradient` a ancho completo: *"¿Listos para sembrar el cambio?"* + *Crear cuenta gratis* + WhatsApp |
| 20 | **Footer** | Logo blanco · tagline · 4 columnas (Programas / Comunidad / Organización / Legal) · email · WhatsApp · redes (FB, IG, TikTok, LinkedIn) · sello SENAJU · © 2026 Semillero de Emprendedores Perú |

**SEO:** metadata por ruta, Open Graph dinámico, JSON-LD (`Organization`, `Course`, `Event`, `FAQPage`), sitemap y robots automáticos, `hreflang` es-PE.

**Rendimiento objetivo:** LCP < 2.0 s, CLS < 0.05, Lighthouse ≥ 95 en las 4 categorías. `next/image` con AVIF/WebP, fuentes con `next/font`, hero sin JS bloqueante.

**Accesibilidad:** WCAG 2.1 AA · navegación completa por teclado · foco visible (anillo `sep-blue-500`) · `aria-label` en iconos · `prefers-reduced-motion`.

---

## 8. MODELO DE DATOS (Supabase / PostgreSQL)

### 8.1 Diagrama lógico

```
auth.users (Supabase)
  └─1:1─ profiles
          ├─1:N─ user_roles ──────────► role (enum)
          ├─1:N─ enrollments ─────N:1─► courses ─1:N─ course_sessions
          │        └─1:N─ session_progress
          ├─1:N─ certificates ────N:1─► certificate_types
          ├─1:N─ orders ─1:N─ payments
          ├─1:N─ memberships ─────N:1─► membership_plans
          ├─0:1─ volunteer_profiles ─1:N─ volunteer_hours
          │        └─1:N─ mentorships ──► profiles (mentee)
          ├─0:1─ speaker_profiles ─1:N─ speaker_invitations
          ├─N:1─ institutions ─1:N─ workshops ─1:N─ workshop_attendees
          ├─1:N─ posts ─1:N─ comments
          ├─1:N─ event_registrations ──► events
          ├─1:N─ projects
          └─1:N─ notifications

Independientes:
  survey_questions ─1:N─ survey_responses ──► survey_leads
  newsletter_subscribers
  donations
  partners
  blog_posts
  audit_log
```

### 8.2 Enums

```sql
create type user_role as enum (
  'estudiante','docente','institucion','mentor','speaker','admin','super_admin'
);

create type volunteer_type as enum (
  'mentor_junior','mentor_senior','community_manager','event_organizer'
);

create type institution_type as enum (
  'colegio','universidad','empresa','ong','gobierno'
);

create type course_level     as enum ('basico','intermedio','avanzado');
create type course_status    as enum ('borrador','proximamente','disponible','archivado');
create type course_audience  as enum ('universitario','docente','escolar','general');
create type enrollment_status as enum ('activo','completado','abandonado','expulsado');
create type session_status   as enum ('programada','en_vivo','finalizada','cancelada');
create type certificate_kind as enum ('sep','internacional','voluntariado','speaker','participacion');
create type certificate_status as enum ('pendiente','pagado','emitido','revocado');
create type payment_method   as enum ('yape','plin','culqi_card','transferencia','gratuito');
create type payment_status   as enum ('pendiente','en_revision','pagado','rechazado','reembolsado');
create type application_status as enum ('recibida','en_revision','entrevista','aprobada','rechazada');
create type workshop_status  as enum ('solicitado','confirmado','realizado','cancelado');
create type membership_status as enum ('activa','vencida','cancelada');
create type survey_profile   as enum ('universitario','docente','empresa');
```

### 8.3 Tablas núcleo

```sql
-- ─────────── PERFILES Y ROLES ───────────
create table profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  full_name         text not null,
  email             text not null unique,
  avatar_url        text,
  phone             text,
  birth_date        date,
  region            text,                    -- departamento del Perú
  province          text,
  country           text default 'PE',
  bio               text,
  university        text,
  career            text,
  study_cycle       text,
  current_situation text,
  linkedin_url      text,
  instagram_url     text,
  institution_id    uuid references institutions(id) on delete set null,
  interests         text[] default '{}',
  onboarding_done   boolean not null default false,
  newsletter_opt_in boolean not null default false,
  terms_accepted_at timestamptz,
  privacy_accepted_at timestamptz,
  last_seen_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table user_roles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  role        user_role not null,
  granted_by  uuid references profiles(id),
  granted_at  timestamptz not null default now(),
  revoked_at  timestamptz,
  unique (user_id, role)
);
create index on user_roles(user_id) where revoked_at is null;

-- ─────────── INSTITUCIONES ───────────
create table institutions (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  type              institution_type not null,
  ruc               text,
  region            text not null,
  province          text,
  district          text,
  address           text,
  contact_name      text,
  contact_role      text,
  contact_email     text,
  contact_phone     text,
  website           text,
  students_count    int,
  logo_url          text,
  is_verified       boolean not null default false,
  agreement_signed_at date,
  agreement_url     text,
  notes             text,
  created_by        uuid references profiles(id),
  created_at        timestamptz not null default now()
);

-- ─────────── CURSOS ───────────
create table courses (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  subtitle        text,
  description     text,
  audience        course_audience not null default 'universitario',
  level           course_level not null default 'basico',
  status          course_status not null default 'borrador',
  category        text,                       -- 'Metodologías ágiles' | 'Liderazgo' | 'Para docentes' | 'SILP'
  total_hours     numeric(4,1) not null default 8,
  sessions_count  int not null default 6,
  weeks           int not null default 2,
  frequency       text default 'Interdiario',
  is_free         boolean not null default true,
  price_cents     int not null default 0,     -- solo SILP y premium
  cover_url       text,
  capacity        int,
  order_index     int not null default 0,
  published_at    timestamptz,
  created_at      timestamptz not null default now()
);

create table course_sessions (
  id            uuid primary key default gen_random_uuid(),
  course_id     uuid not null references courses(id) on delete cascade,
  number        int not null,
  week          int not null,
  title         text not null,
  subtitle      text,
  description   text,
  duration_min  int not null default 120,
  scheduled_at  timestamptz,
  meet_url      text,                          -- protegido por RLS
  recording_url text,
  materials     jsonb default '[]',
  status        session_status not null default 'programada',
  unique (course_id, number)
);

-- ─────────── INSCRIPCIONES Y PROGRESO ───────────
create table enrollments (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  course_id     uuid not null references courses(id) on delete cascade,
  cohort        text,
  status        enrollment_status not null default 'activo',
  progress_pct  int not null default 0 check (progress_pct between 0 and 100),
  enrolled_at   timestamptz not null default now(),
  completed_at  timestamptz,
  unique (user_id, course_id, cohort)
);

create table session_progress (
  id            uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references enrollments(id) on delete cascade,
  session_id    uuid not null references course_sessions(id) on delete cascade,
  attended      boolean not null default false,
  completed_at  timestamptz,
  unique (enrollment_id, session_id)
);

-- ─────────── CERTIFICADOS ───────────
create table certificate_types (
  id           uuid primary key default gen_random_uuid(),
  kind         certificate_kind not null,
  name         text not null,
  issuer       text not null,               -- 'SEP' | 'Instituto Internacional de Ingeniería'
  price_cents  int not null,
  description  text,
  is_active    boolean not null default true
);

create table certificates (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references profiles(id) on delete cascade,
  enrollment_id      uuid references enrollments(id) on delete set null,
  certificate_type_id uuid not null references certificate_types(id),
  verification_code  text not null unique,   -- ej. SEP-2026-A7K3M9
  status             certificate_status not null default 'pendiente',
  issued_at          timestamptz,
  pdf_url            text,
  revoked_at         timestamptz,
  revoked_reason     text,
  issued_by          uuid references profiles(id),
  created_at         timestamptz not null default now()
);
create index on certificates(verification_code);

-- ─────────── PAGOS Y MEMBRESÍAS ───────────
create table orders (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references profiles(id) on delete cascade,
  item_type      text not null,              -- 'certificate' | 'membership' | 'silp' | 'b2b_program'
  item_id        uuid,
  amount_cents   int not null,
  currency       text not null default 'PEN',
  status         payment_status not null default 'pendiente',
  institution_id uuid references institutions(id),
  created_at     timestamptz not null default now()
);

create table payments (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid not null references orders(id) on delete cascade,
  method          payment_method not null,
  amount_cents    int not null,
  status          payment_status not null default 'pendiente',
  provider_ref    text,                       -- id de Culqi
  voucher_url     text,                       -- imagen de Yape/Plin
  operation_code  text,
  paid_at         timestamptz,
  reviewed_by     uuid references profiles(id),
  reviewed_at     timestamptz,
  reject_reason   text,
  created_at      timestamptz not null default now()
);

create table membership_plans (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  name           text not null,
  duration_months int not null,
  price_cents    int not null,
  benefits       jsonb not null default '[]',
  is_active      boolean not null default true,
  order_index    int not null default 0
);

create table memberships (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  plan_id    uuid not null references membership_plans(id),
  status     membership_status not null default 'activa',
  starts_at  timestamptz not null default now(),
  ends_at    timestamptz not null,
  order_id   uuid references orders(id)
);

-- ─────────── VOLUNTARIADO ───────────
create table volunteer_roles (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  name            text not null,
  type            volunteer_type not null,
  description     text,
  requirements    jsonb default '[]',
  benefits        jsonb default '[]',
  hours_per_week  int,
  open_positions  int not null default 0,
  is_open         boolean not null default true
);

create table volunteer_applications (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references profiles(id) on delete set null,
  volunteer_role_id uuid not null references volunteer_roles(id),
  full_name         text not null,
  email             text not null,
  phone             text,
  region            text,
  university        text,
  career_cycle      text,
  motivation        text,
  completed_courses text,
  status            application_status not null default 'recibida',
  reviewer_notes    text,
  reviewed_by       uuid references profiles(id),
  created_at        timestamptz not null default now()
);

create table volunteer_profiles (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null unique references profiles(id) on delete cascade,
  type           volunteer_type not null,
  started_at     date not null default current_date,
  hours_committed int,
  is_active      boolean not null default true
);

create table volunteer_hours (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  date        date not null,
  hours       numeric(4,1) not null,
  activity    text not null,
  approved_by uuid references profiles(id),
  approved_at timestamptz
);

create table mentorships (
  id         uuid primary key default gen_random_uuid(),
  mentor_id  uuid not null references profiles(id) on delete cascade,
  mentee_id  uuid not null references profiles(id) on delete cascade,
  course_id  uuid references courses(id),
  started_at date not null default current_date,
  ended_at   date,
  notes      text,
  unique (mentor_id, mentee_id, course_id)
);

-- ─────────── SPEAKERS ───────────
create table speaker_profiles (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references profiles(id) on delete set null,
  full_name     text not null,
  email         text not null,
  country       text not null default 'PE',
  region        text,
  expertise     text,
  topics        text[] default '{}',
  story         text,
  opportunities text,
  talk_experience text,
  availability  text,
  linkedin_url  text,
  photo_url     text,
  is_approved   boolean not null default false,
  is_public     boolean not null default false,
  created_at    timestamptz not null default now()
);

create table speaker_invitations (
  id          uuid primary key default gen_random_uuid(),
  speaker_id  uuid not null references speaker_profiles(id) on delete cascade,
  event_id    uuid references events(id),
  topic       text,
  proposed_at timestamptz,
  status      text not null default 'pendiente',   -- pendiente|aceptada|rechazada|reprogramada
  created_at  timestamptz not null default now()
);

-- ─────────── COLEGIOS Y TALLERES ───────────
create table school_applications (
  id              uuid primary key default gen_random_uuid(),
  school_name     text not null,
  region          text not null,
  province        text,
  director_name   text not null,
  contact_phone   text not null,
  contact_email   text not null,
  students_3to5   int,
  expectations    text,
  status          application_status not null default 'recibida',
  institution_id  uuid references institutions(id),
  reviewed_by     uuid references profiles(id),
  created_at      timestamptz not null default now()
);

create table workshops (
  id             uuid primary key default gen_random_uuid(),
  institution_id uuid not null references institutions(id) on delete cascade,
  title          text not null,
  topic          text,
  scheduled_at   timestamptz,
  modality       text default 'presencial',
  grade          text,
  students_count int,
  status         workshop_status not null default 'solicitado',
  requested_by   uuid references profiles(id),
  created_at     timestamptz not null default now()
);

create table workshop_facilitators (
  workshop_id uuid not null references workshops(id) on delete cascade,
  user_id     uuid not null references profiles(id) on delete cascade,
  primary key (workshop_id, user_id)
);

create table workshop_attendees (
  id            uuid primary key default gen_random_uuid(),
  workshop_id   uuid not null references workshops(id) on delete cascade,
  student_name  text not null,
  grade         text,
  attended      boolean not null default true,
  certificate_id uuid references certificates(id)
);

-- ─────────── COMUNIDAD Y EVENTOS ───────────
create table posts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  course_id  uuid references courses(id),
  content    text not null,
  media_urls text[] default '{}',
  is_pinned  boolean not null default false,
  is_hidden  boolean not null default false,
  likes_count int not null default 0,
  created_at timestamptz not null default now()
);

create table comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references posts(id) on delete cascade,
  user_id    uuid not null references profiles(id) on delete cascade,
  content    text not null,
  is_hidden  boolean not null default false,
  created_at timestamptz not null default now()
);

create table post_likes (
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  primary key (post_id, user_id)
);

create table events (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  description   text,
  kind          text,                        -- demo_day | taller | feria | webinar
  starts_at     timestamptz not null,
  ends_at       timestamptz,
  location      text,
  is_online     boolean not null default true,
  meet_url      text,
  capacity      int,
  cover_url     text,
  is_published  boolean not null default false
);

create table event_registrations (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references events(id) on delete cascade,
  user_id    uuid references profiles(id) on delete cascade,
  email      text,
  attended   boolean not null default false,
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);

create table projects (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  course_id   uuid references courses(id),
  title       text not null,
  problem     text,
  solution    text,
  region      text,
  cover_url   text,
  is_public   boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ─────────── DIAGNÓSTICO ───────────
create table survey_questions (
  id          uuid primary key default gen_random_uuid(),
  profile     survey_profile not null,
  block       int not null,
  block_title text,
  number      int not null,
  question    text not null,
  input_type  text not null,                -- single | multiple | scale_1_5 | email
  options     jsonb default '[]',
  validates   text,
  tag         text,                          -- 'Presupuesto' | 'Willingness to pay' | 'Filtro SILP'…
  is_key      boolean not null default false,
  unique (profile, number)
);

create table survey_leads (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  profile     survey_profile not null,
  region      text,
  utm_source  text,
  completed   boolean not null default false,
  created_at  timestamptz not null default now()
);

create table survey_responses (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid not null references survey_leads(id) on delete cascade,
  question_id uuid not null references survey_questions(id),
  answer      jsonb not null,
  created_at  timestamptz not null default now()
);

-- ─────────── NEWSLETTER, DONACIONES, ALIADOS, BLOG ───────────
create table newsletter_subscribers (
  id             uuid primary key default gen_random_uuid(),
  email          text not null unique,
  full_name      text,
  region         text,
  source         text,
  is_confirmed   boolean not null default false,
  confirmed_at   timestamptz,
  unsubscribed_at timestamptz,
  created_at     timestamptz not null default now()
);

create table donations (
  id           uuid primary key default gen_random_uuid(),
  donor_name   text,
  donor_email  text,
  amount_cents int not null,
  currency     text not null default 'PEN',
  is_recurring boolean not null default false,
  cause        text,
  method       payment_method not null,
  status       payment_status not null default 'pendiente',
  provider_ref text,
  is_anonymous boolean not null default false,
  created_at   timestamptz not null default now()
);

create table partners (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  logo_url    text,
  website     text,
  category    text,                           -- red | alianza | mentoria | premio | aval
  order_index int not null default 0,
  is_active   boolean not null default true
);

create table blog_posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  excerpt      text,
  content_mdx  text,
  cover_url    text,
  author_id    uuid references profiles(id),
  tags         text[] default '{}',
  published_at timestamptz,
  is_published boolean not null default false
);

-- ─────────── AUDITORÍA Y NOTIFICACIONES ───────────
create table audit_log (
  id          bigserial primary key,
  actor_id    uuid references profiles(id),
  action      text not null,
  entity      text not null,
  entity_id   text,
  before_data jsonb,
  after_data  jsonb,
  ip          inet,
  user_agent  text,
  created_at  timestamptz not null default now()
);

create table notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  kind       text not null,
  title      text not null,
  body       text,
  link       text,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);
create index on notifications(user_id, read_at);
```

### 8.4 Funciones y triggers clave

```sql
-- Crear perfil automáticamente al registrarse
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name',''));

  insert into user_roles (user_id, role)
  values (new.id, coalesce((new.raw_user_meta_data->>'account_type')::user_role, 'estudiante'));

  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Helpers de RBAC usados por todas las políticas
create or replace function has_role(check_role user_role) returns boolean
language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from user_roles
    where user_id = auth.uid() and role = check_role and revoked_at is null
  );
$$;

create or replace function is_admin() returns boolean
language sql security definer stable set search_path = public as $$
  select has_role('admin') or has_role('super_admin');
$$;

-- Recalcular progreso al marcar una sesión
create or replace function recalc_progress() returns trigger
language plpgsql security definer set search_path = public as $$
declare total int; done int; e_id uuid;
begin
  e_id := coalesce(new.enrollment_id, old.enrollment_id);
  select c.sessions_count into total
    from enrollments en join courses c on c.id = en.course_id where en.id = e_id;
  select count(*) into done
    from session_progress where enrollment_id = e_id and completed_at is not null;

  update enrollments
     set progress_pct = least(100, round(done::numeric * 100 / nullif(total,0))),
         status       = case when done >= total then 'completado' else status end,
         completed_at = case when done >= total then now() else completed_at end
   where id = e_id;
  return new;
end $$;

create trigger trg_recalc_progress
  after insert or update or delete on session_progress
  for each row execute function recalc_progress();

-- Código de verificación de certificado
create or replace function gen_verification_code() returns text
language sql as $$
  select 'SEP-' || to_char(now(),'YYYY') || '-' ||
         upper(substr(replace(gen_random_uuid()::text,'-',''), 1, 6));
$$;
```

### 8.5 Buckets de Storage

| Bucket | Público | Contenido | Política |
|---|---|---|---|
| `avatars` | Sí | Fotos de perfil | Escribe solo el dueño; lee cualquiera |
| `course-materials` | No | PDFs, plantillas, slides | Lee solo si está inscrito o es admin |
| `certificates` | No | PDFs emitidos | Lee el dueño o admin; la verificación pública usa un endpoint firmado |
| `vouchers` | No | Capturas de Yape/Plin | Escribe el dueño; lee solo admin |
| `institution-docs` | No | Convenios, logos | Lee la institución y admin |
| `public-assets` | Sí | Fotos de talleres, portadas de blog/eventos | Escribe solo admin |

---

## 9. SEGURIDAD

### 9.1 Autenticación

- **Supabase Auth**: email+contraseña, **Google OAuth**, y **Magic Link** para docentes con baja alfabetización digital.
- Contraseñas: mínimo 10 caracteres, verificación contra HaveIBeenPwned (Supabase lo trae), sin obligar rotación.
- **Verificación de email obligatoria** antes de inscribirse a un curso.
- **MFA (TOTP) obligatorio para `admin` y `super_admin`.** El middleware bloquea `/admin` sin AAL2.
- Sesiones: JWT de 1 h, refresh rotativo, cookies `httpOnly` + `secure` + `sameSite=lax`.
- Cierre de sesión remoto desde `/cuenta/seguridad`.

### 9.2 Autorización — 3 capas

1. **Middleware** (`src/middleware.ts`): protege prefijos de ruta y redirige según rol.
2. **Server Components / Actions** (`requireRole()`): cada página y acción privada revalida el rol en el servidor. Nunca se confía en el cliente.
3. **RLS en Postgres**: la última línea de defensa. **Toda tabla tiene `enable row level security` y una política explícita** — sin excepciones.

```sql
alter table profiles          enable row level security;
alter table user_roles        enable row level security;
alter table enrollments       enable row level security;
alter table session_progress  enable row level security;
alter table certificates      enable row level security;
alter table orders            enable row level security;
alter table payments          enable row level security;
alter table posts             enable row level security;
-- … y así para las 30+ tablas

-- Ejemplos representativos
create policy "perfil propio: leer" on profiles
  for select using (id = auth.uid() or is_admin());

create policy "perfil propio: actualizar" on profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- Los roles NO se autoasignan
create policy "roles: solo admin escribe" on user_roles
  for all using (is_admin()) with check (is_admin());
create policy "roles: cada quien ve los suyos" on user_roles
  for select using (user_id = auth.uid() or is_admin());

create policy "inscripciones propias" on enrollments
  for all using (user_id = auth.uid() or is_admin())
  with check (user_id = auth.uid() or is_admin());

-- El enlace de Meet solo lo ve quien está inscrito
create policy "sesiones: inscritos y admin" on course_sessions
  for select using (
    is_admin() or exists (
      select 1 from enrollments e
      where e.course_id = course_sessions.course_id
        and e.user_id = auth.uid()
        and e.status = 'activo'
    )
  );

-- Los certificados los emite el servidor, nunca el usuario
create policy "certificados: leer los propios" on certificates
  for select using (user_id = auth.uid() or is_admin());
create policy "certificados: solo admin escribe" on certificates
  for insert with check (is_admin());
create policy "certificados: solo admin modifica" on certificates
  for update using (is_admin());

-- Un estudiante no puede marcar su pago como pagado
create policy "pagos: crear el propio" on payments
  for insert with check (
    exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid())
  );
create policy "pagos: aprobar solo admin" on payments
  for update using (is_admin());

create policy "comunidad: leer autenticados" on posts
  for select using (auth.uid() is not null and (not is_hidden or is_admin()));
create policy "comunidad: publicar como uno mismo" on posts
  for insert with check (user_id = auth.uid());
create policy "comunidad: editar lo propio" on posts
  for update using (user_id = auth.uid() or is_admin());

-- Auditoría: solo super_admin lee, nadie modifica
create policy "auditoria: solo super_admin" on audit_log
  for select using (has_role('super_admin'));
```

### 9.3 Reglas de servidor innegociables

- La **`SUPABASE_SERVICE_ROLE_KEY` jamás** se importa en un archivo con `"use client"` ni se expone con `NEXT_PUBLIC_`. Vive solo en `lib/supabase/admin.ts`, que empieza con `import 'server-only'`.
- **Todo input pasa por Zod** en el servidor, aunque ya se haya validado en el cliente.
- Los **precios se leen de la base de datos**, nunca del cuerpo de la petición. El cliente envía un `item_id`, no un monto.
- Los **webhooks verifican firma** (Culqi HMAC, Resend) y son idempotentes por `provider_ref`.
- **Rate limiting** en login (5/15 min por IP+email), registro (3/h por IP), formularios públicos (5/h por IP), diagnóstico (1 envío por email), newsletter (3/h).
- **hCaptcha** en formularios públicos: registro, voluntariado, speakers, colegios, newsletter, diagnóstico.

### 9.4 Cabeceras y protecciones web

```
Content-Security-Policy: default-src 'self';
  script-src 'self' 'unsafe-inline' https://*.supabase.co https://checkout.culqi.com https://va.vercel-scripts.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://*.supabase.co;
  connect-src 'self' https://*.supabase.co https://api.culqi.com;
  frame-ancestors 'none';
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

CSRF: Server Actions de Next.js ya validan origen; los endpoints `POST` de la API verifican `Origin`/`Referer`.

### 9.5 Datos personales y menores

- **Ley N.º 29733** (Protección de Datos Personales del Perú) y su reglamento:
  - Consentimiento explícito y separado para tratamiento y para comunicaciones comerciales.
  - Finalidad declarada en `/legal/privacidad`.
  - Derechos ARCO: formulario en `/cuenta` + correo dedicado; respuesta ≤ 20 días.
  - Registro del banco de datos personales ante la ANPD.
- **Menores de edad (escolares):** SEP **no crea cuentas para menores**. En `workshop_attendees` se guarda solo nombre y grado, bajo responsabilidad del colegio y con consentimiento del apoderado, y por defecto se muestran anonimizados (`J. P***`). El acceso a la plataforma se habilita al concluir 5.º de secundaria.
- Retención: leads del diagnóstico 24 meses; logs de auditoría 5 años; vouchers de pago 5 años (obligación tributaria).
- **Cifrado:** TLS 1.3 en tránsito; AES-256 en reposo (nativo de Supabase). El DNI, si algún día se recoge, va cifrado a nivel de columna con `pgsodium`.

### 9.6 Operación

- Backups: PITR de Supabase (7 días en el plan Pro) + `pg_dump` semanal a almacenamiento externo.
- Secretos: solo en Vercel/Render env vars. Rotación de la service-role key cada 6 meses.
- Dependencias: Dependabot semanal + `npm audit` bloqueante en CI para severidad alta.
- Monitoreo: Sentry (errores), Vercel Analytics (RUM), alerta a Slack/WhatsApp si 5xx > 1 % en 5 min.
- Antes de producción: `supabase db lint`, revisión de que **ninguna** tabla quede sin RLS, y prueba manual de escalada de privilegios (un `estudiante` intentando `/admin` y `update user_roles`).

---

## 10. PRECIOS Y MODELO DE NEGOCIO

> **Regla de oro de SEP:** *el curso siempre es gratis; lo que se paga es la acreditación, la profundidad o el servicio institucional.* Nunca se cobra por aprender.

### 10.1 Certificados — **confirmados en el deck**

| Certificado | Precio | Emisor | Qué da |
|---|---|---|---|
| **Certificado SEP** | **S/ 30** | Semillero de Emprendedores Perú | Aval de organización formal reconocida por SENAJU. Válido para voluntariado, portafolio y postulaciones nacionales |
| **Certificado Internacional** ⭐ | **S/ 50** | Instituto Internacional de Ingeniería | Mayor peso en CV y aplicaciones internacionales. Costo fijo para SEP: **$100 USD/año** |

**Proyección de ingresos por certificados (del deck):**

| Alumnos | Cert. SEP (30 % toma) | Cert. Internacional (20 % toma) | Costo Instituto | **Ganancia neta** |
|---|---|---|---|---|
| 50 | S/ 450 | S/ 500 | − S/ 380 | **S/ 570** |
| 100 | S/ 900 | S/ 1,000 | − S/ 380 | **S/ 1,520** |
| 200 | S/ 1,800 | S/ 2,000 | − S/ 380 | **S/ 3,420** |

### 10.2 Cursos

| Producto | Precio |
|---|---|
| Cursos del catálogo (Design Thinking, Scrum social, Liderazgo, Metodologías en el aula) | **Gratuito, siempre** |
| Certificado del curso | Opcional: S/30 o S/50 |

### 10.3 SILP — Social Impact Leadership Program

| Modalidad | Precio | Segmento |
|---|---|---|
| **Tarifa social** | **S/ 200** | Red SEP / público externo — *confirmado en el pitch* |
| Tarifa comercial | Por definir | Público general — *el pitch dice "Comercial" sin monto; se sugiere S/ 350* |
| Becado | S/ 0 | Voluntarios activos y egresados destacados |

Duración: 6 semanas · liderazgo social completo · incluye certificado.

### 10.4 Membresías — *propuesta a validar con el diagnóstico*

El deck confirma **membresías de 3, 6 y 12 meses**, y el pitch aclara que la **membresía base es gratuita y se gana siendo voluntario**. Los montos de abajo son propuesta calibrada con la pregunta 7 del diagnóstico (gasto mensual actual en formación) y la 11 (disposición a pagar por certificado); **se ajustan tras la primera cohorte.**

| Plan | Duración | Precio | Equivalente/mes | Incluye |
|---|---|---|---|---|
| 🌱 **Semilla** | Permanente | **Gratis** | — | Todos los cursos · comunidad · newsletter · eventos abiertos |
| 🌿 **Raíz** | 3 meses | **S/ 45** | S/ 15 | Semilla + 1 certificado SEP incluido · sesiones de mentoría grupal · acceso anticipado a cohortes |
| 🌳 **Tronco** | 6 meses | **S/ 80** | S/ 13.3 | Raíz + 2 certificados SEP · 1 mentoría 1:1 al mes · prioridad en Demo Day |
| 🌲 **Bosque** | 12 meses | **S/ 140** | S/ 11.7 | Tronco + 1 certificado Internacional · SILP con 30 % de descuento · badge de miembro fundador |
| ⭐ **Voluntario** | Mientras esté activo | **Gratis** | — | Todo lo de Bosque, sin costo, por su servicio a SEP |

### 10.5 B2B institucional — *propuesta*

El pitch confirma **"Pago B2B por programa completo"** para colegios y universidades, sin monto. Propuesta según el presupuesto RSE declarado en la pregunta 7 del diagnóstico de empresas:

| Paquete | Alcance | Precio referencial | Entregables |
|---|---|---|---|
| **Taller Semilla** | 1 taller · 1 aula (≈30 estudiantes) | **S/ 900** | Taller de 3 h · constancias · mini-reporte |
| **Programa Raíz** | 4 talleres · 1 colegio · 1 ciclo | **S/ 3,200** | 4 talleres · constancias · reporte de impacto · 1 Demo Day interno |
| **Cohorte Bosque** | Cohorte completa de 30 universitarios (curso + SILP) | **S/ 9,000** | Formación completa · certificados · reporte con métricas y ODS · co-branding |
| **Alianza Anual** | Programa a medida multi-región | **Desde S/ 25,000** | Cohortes patrocinadas · becas · voluntariado corporativo · reporte trimestral · pipeline de talento |

> Para colegios de la **red gratuita** (sin patrocinio), el servicio se mantiene **100 % gratis** — es el corazón del impacto social y no se toca.

### 10.6 Donaciones — **confirmado en la web**

| Montos preestablecidos | S/ 10 · S/ 20 · S/ 50 · monto personalizado |
|---|---|
| **Frecuencia** | Única o mensual |
| **Causas** | Formación de jóvenes en regiones · talleres en colegios · becas SILP |

### 10.7 Otros ingresos

| Fuente | Modelo |
|---|---|
| Patrocinio de eventos | Marcas en Demo Days y ferias (por paquete) |
| Fondos concursables | PROINNOVATE · SENAJU/MINJUSDH · GOREs · municipalidades · concursos internacionales de innovación social |
| Convenios universitarios | Créditos extracurriculares · RSU |

### 10.8 Métodos de pago

| Método | Uso | Implementación |
|---|---|---|
| **Yape / Plin** | Principal en Perú para montos bajos (S/30–S/200) | QR + código de operación + captura del voucher → conciliación manual en `/admin/pagos` |
| **Culqi** | Tarjeta de crédito/débito | Checkout + webhook firmado, confirmación automática |
| **Transferencia bancaria** | B2B y donaciones grandes | Datos de cuenta institucional + comprobante |

**Flujo de compra de certificado:**
```
Estudiante completa 6/6 sesiones
   → botón "Obtener mi certificado" (elige SEP S/30 o Internacional S/50)
      → se crea `orders` con el precio LEÍDO DE LA BD
         → paga con Culqi (automático) o sube voucher de Yape (revisión)
            → admin aprueba (o el webhook confirma)
               → se emite `certificates` con código único
                  → se genera el PDF y se notifica por email
                     → verificable en /verificar/SEP-2026-A7K3M9
```

### 10.9 Resumen de una mirada

| Producto | Precio | Estado |
|---|---|---|
| Cursos del catálogo | Gratis | ✅ Confirmado |
| Certificado SEP | S/ 30 | ✅ Confirmado |
| Certificado Internacional | S/ 50 | ✅ Confirmado |
| SILP tarifa social | S/ 200 | ✅ Confirmado |
| SILP comercial | ~S/ 350 | 🟡 Propuesta |
| Membresía Semilla | Gratis | ✅ Confirmado (modelo) |
| Membresía Raíz / Tronco / Bosque | S/ 45 / 80 / 140 | 🟡 Propuesta |
| Membresía de voluntario | Gratis | ✅ Confirmado |
| Programas B2B | S/ 900 – S/ 25,000+ | 🟡 Propuesta |
| Red de colegios (sin patrocinio) | Gratis | ✅ Confirmado |
| Donaciones | S/ 10 / 20 / 50 / libre | ✅ Confirmado |

---

## 11. DESPLIEGUE: SUPABASE + VERCEL + RENDER

### 11.1 Supabase — base de datos

1. Crear proyecto en `supabase.com` → región **South America (São Paulo)** (la más cercana a Perú, ~40 ms).
2. Plan: **Free** para desarrollo → **Pro ($25/mes)** en producción (obligatorio por PITR y backups diarios).
3. Guardar `Project URL`, `anon key` y `service_role key`.
4. Local:
   ```bash
   npm i -g supabase
   supabase login
   supabase link --project-ref <ref>
   supabase db push          # aplica supabase/migrations/*
   supabase db seed          # carga seed.sql
   supabase gen types typescript --linked > src/types/database.ts
   ```
5. **Auth → URL Configuration:** Site URL `https://sep.edu.pe`; Redirect URLs: `https://sep.edu.pe/**`, `https://*-sep.vercel.app/**`, `http://localhost:3000/**`.
6. **Auth → Providers:** activar Google OAuth (credenciales en Google Cloud Console).
7. **Auth → Email templates:** traducir al español con la marca SEP.
8. **Auth → MFA:** habilitar TOTP.
9. **Storage:** crear los 6 buckets de §8.5 con sus políticas.
10. **Database → Extensions:** `pgcrypto`, `pg_cron`, `pg_net`, `uuid-ossp`.
11. Verificar que **toda** tabla tenga RLS activo (`supabase db lint` + revisión del Security Advisor).

### 11.2 Vercel — aplicación web

1. Conectar el repo de GitHub. Framework: Next.js (autodetectado). Root: `sep-platform/`.
2. **Variables de entorno:**

| Variable | Entorno | Notas |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | todos | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | todos | |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview | **Nunca** con prefijo `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_SITE_URL` | todos | |
| `RESEND_API_KEY` | Production | |
| `CULQI_PUBLIC_KEY` / `CULQI_SECRET_KEY` | Production | |
| `CULQI_WEBHOOK_SECRET` | Production | |
| `HCAPTCHA_SITEKEY` / `HCAPTCHA_SECRET` | todos | |
| `SENTRY_DSN` | Production | |
| `CRON_SECRET` | Production | Protege `/api/cron/*` |

3. **Dominio:** `sep.edu.pe` + `www` → redirección a apex. SSL automático.
4. **Vercel Cron** (`vercel.json`):
   ```json
   {
     "crons": [
       { "path": "/api/cron/session-reminders", "schedule": "0 13 * * *" },
       { "path": "/api/cron/newsletter-digest",  "schedule": "0 14 1,15 * *" }
     ]
   }
   ```
   > Vercel Cron tiene **1 min de límite** en Hobby y 5 min en Pro. Suficiente para recordatorios; **no** para generar 200 PDFs.
5. **Deploy Protection** activo en Preview (evita que borradores se indexen).
6. Analytics + Speed Insights activados.

### 11.3 Flujo de trabajo

```
feature/*  → PR → Vercel Preview + CI (lint, typecheck, test)
           → merge a main → deploy a producción + supabase db push
```
Migraciones: **nunca** se edita una migración ya aplicada; siempre se crea una nueva.

### 11.4 Render — *solo si hace falta*

Render **no es necesario para el MVP.** Se incorpora cuando aparezca alguna de estas necesidades:

| Necesidad | ¿Vercel alcanza? | Solución |
|---|---|---|
| Recordatorios de sesión por email | ✅ Sí | Vercel Cron |
| Generar 1 certificado PDF | ✅ Sí | Route Handler |
| **Generar 200 certificados PDF en lote** | ❌ No (timeout) | **Render Background Worker** |
| **Envío del newsletter a 1,200+ suscriptores con reintentos** | ❌ Riesgoso | **Render Worker + cola** |
| **Reporte anual de impacto (agregaciones pesadas + PDF)** | ❌ No | **Render Cron Job** |
| **Reprocesar imágenes de talleres** | ❌ No | **Render Worker** |

**Configuración (`worker/render.yaml`):**
```yaml
services:
  - type: worker
    name: sep-worker
    runtime: node
    plan: starter               # $7/mes
    region: oregon
    buildCommand: npm ci && npm run build
    startCommand: npm start
    envVars:
      - key: SUPABASE_URL
        sync: false
      - key: SUPABASE_SERVICE_ROLE_KEY
        sync: false
      - key: RESEND_API_KEY
        sync: false

  - type: cron
    name: sep-impact-report
    runtime: node
    schedule: "0 6 1 * *"       # 1.º de cada mes, 06:00 UTC
    buildCommand: npm ci
    startCommand: node dist/jobs/impact-report.js
```

El worker consume una tabla `job_queue` en Supabase (patrón outbox): la web encola, el worker procesa, marca `done` o `failed` con reintento exponencial.

### 11.5 Costos mensuales estimados

| Servicio | Fase MVP | Producción |
|---|---|---|
| Vercel | Hobby $0 | Pro $20 |
| Supabase | Free $0 | Pro $25 |
| Render | — | Starter $7 (solo si se activa) |
| Resend | Free (3k emails) $0 | Pro $20 |
| Dominio `.edu.pe` | ~$25/año | ~$25/año |
| Sentry | Free | Free |
| Instituto Internacional de Ingeniería | — | $100/año |
| **Total** | **≈ $2/mes** | **≈ $72–79/mes** |

### 11.6 Checklist previo al lanzamiento

- [ ] Todas las tablas con RLS y política explícita
- [ ] Security Advisor de Supabase sin advertencias
- [ ] `SUPABASE_SERVICE_ROLE_KEY` ausente del bundle del cliente (`grep` en `.next/static`)
- [ ] MFA obligatorio verificado para `/admin`
- [ ] Rate limiting probado en login y formularios públicos
- [ ] Cabeceras de seguridad verificadas en securityheaders.com (objetivo A+)
- [ ] Lighthouse ≥ 95 en las 4 categorías de la landing
- [ ] Verificación pública de certificado funcionando end-to-end
- [ ] Flujo de pago probado en sandbox de Culqi + voucher de Yape
- [ ] Emails transaccionales llegando (SPF, DKIM, DMARC del dominio)
- [ ] Términos, privacidad y cookies publicados y enlazados
- [ ] Banco de datos personales registrado ante la ANPD
- [ ] Backup manual verificado y restauración probada
- [ ] Sitemap enviado a Google Search Console

---

## 12. ROADMAP DE EJECUCIÓN

| Sprint | Entregable | Estado |
|---|---|---|
| **S1** | Scaffold Next.js 15 + TS + Tailwind v4 + tokens de la §2 + estructura de carpetas | ⬜ |
| **S2** | Design system: Button, Input, Card, Badge, Logo, GradientBlock, YellowUnderline | ⬜ |
| **S3** | **Landing page completa** (20 secciones de la §7) + SEO + legal | ⬜ |
| **S4** | Migraciones SQL completas + RLS + seed (4 cursos, 6 sesiones, planes, 45 preguntas) | ⬜ |
| **S5** | Auth: login, 3 registros, recuperación, onboarding, middleware + RBAC | ⬜ |
| **S6** | Layout de app + sidebar dinámico + **Panel Estudiante** completo | ⬜ |
| **S7** | Paneles Docente, Mentor, Institución, Speaker | ⬜ |
| **S8** | Panel Admin (usuarios, cursos, certificados, pagos, postulaciones) | ⬜ |
| **S9** | Pagos (Culqi + Yape) + emisión de certificados PDF + verificación pública | ⬜ |
| **S10** | Diagnóstico público `/conocenos` + formularios (voluntariado, speakers, colegios) + newsletter | ⬜ |
| **S11** | Comunidad, eventos, blog MDX | ⬜ |
| **S12** | Hardening de seguridad, tests E2E, deploy a producción, checklist §11.6 | ⬜ |

### Correspondencia con el Gantt de 12 meses del deck

| Fase del deck | Meses | Sprints de plataforma |
|---|---|---|
| **Fase 1 — Construir** | 1–3 | S1–S9 (plataforma BETA con Curso 1 y pagos activos) |
| **Fase 2 — Crecer** | 4–6 | S10–S12 (comunidad, Demo Day, segmento docente, membresías) |
| **Fase 3 — Escalar** | 7–12 | Embajadores regionales, SILP en plataforma, convenios universitarios, reporte anual de impacto |

---

## ANEXO A — Decisiones tomadas y supuestos

| # | Decisión | Fundamento |
|---|---|---|
| 1 | La marca es **azul-violeta + amarillo**, no verde | Logo, ambos decks y la web actual coinciden; el verde de los mockups era estructura, no marca |
| 2 | **6 roles**, no 3 | Los 3 perfiles del diagnóstico son captación; la operación (voluntariado, colegios, speakers, staff) exige 6 paneles |
| 3 | Roles en tabla N:M, no columna en `profiles` | Un usuario real acumula roles (estudiante + mentor + admin) |
| 4 | Supabase Auth en lugar de NextAuth | RLS necesita el JWT de Supabase para funcionar en la capa de datos |
| 5 | Render solo para lotes pesados | Vercel Cron cubre el MVP; Render entra cuando haya 200+ PDFs o 1,200+ emails |
| 6 | Yape/Plin con voucher manual | Es el método real de pago en Perú para S/30; Culqi cubre tarjeta |
| 7 | Precios de membresía y B2B marcados como propuesta | El deck confirma la existencia de los planes pero no los montos; el diagnóstico los calibra |
| 8 | Sin cuentas para menores de edad | Ley 29733 y responsabilidad del colegio; acceso al terminar 5.º de secundaria |
| 9 | Los precios se leen de la BD, nunca del cliente | Evita manipulación del monto en el checkout |
| 10 | Español peruano en toda la UI | Público 100 % nacional |

## ANEXO B — Preguntas abiertas para el equipo SEP

1. ¿Se confirman los precios propuestos de membresía (S/45 · S/80 · S/140) o se esperan los resultados del diagnóstico?
2. ¿Cuál es la tarifa comercial del SILP (el pitch dice "Comercial" sin monto)?
3. ¿Dominio final: `sep.edu.pe` o `semillero.pe`? El `.edu.pe` exige acreditación educativa.
4. ¿La cuenta bancaria institucional y el Yape corporativo ya están abiertos?
5. ¿El convenio con el Instituto Internacional de Ingeniería está firmado?
6. ¿Se migran los datos de la web actual en Vercel o se parte de cero?
7. ¿Quién modera la comunidad en el día a día — el CM voluntario o el equipo?
8. ¿Los 1,200 suscriptores del newsletter tienen consentimiento documentado para migrarlos?

---

*Documento generado el 7 de agosto de 2026 a partir de la web pública de SEP, 5 mockups UX, 2 decks institucionales y notas del equipo.*
