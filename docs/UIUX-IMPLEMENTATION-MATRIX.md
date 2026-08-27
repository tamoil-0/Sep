# Auditoría e implementación UI/UX — SEP

Fecha de cierre técnico: 2026-08-26  
Alcance inspeccionado: 84 rutas `page.tsx`, componentes compartidos, estados de carga/error/vacío, navegación, formularios y diálogos.

## Criterio de intervención

- **A — Solo UI:** tokens, jerarquía, espaciado, tipografía, color, radios, sombras y responsive.
- **B — UX compatible:** foco, semántica, mensajes, estados pendientes, confirmaciones y prevención de doble envío sin cambiar contratos.
- **C — Lógica de negocio:** no se realizaron cambios de esta clase.

## Matriz de rutas

| Ruta o conjunto exhaustivo | Problema principal encontrado | Severidad | Solución aplicada | Archivo principal | Clase | Estado |
|---|---|---:|---|---|:---:|---|
| `/` | Escala tipográfica y superficies no seguían un sistema único. | P1 | Tokens semánticos globales, contenedores y sombras normalizadas. | `src/app/(marketing)/page.tsx` | A | Completo |
| `/ai-design-thinking` | El programa prioritario no tenía página ni separación clara por audiencia. | P0 | Nueva landing con hero, dos audiencias, recorrido, seis sesiones por perfil, beneficios, requisitos, ética, FAQ y CTA. | `src/app/(marketing)/ai-design-thinking/page.tsx` | A | Completo |
| `/silp` | Componentes de programa no eran reutilizables para nuevas ofertas. | P1 | Sistema de bloques `Program*` preparado para SILP y futuros programas; estilo de la ruta normalizado. | `src/components/marketing/program.tsx` | A | Completo |
| `/blog`, `/blog/[slug]`, `/convocatorias`, `/eventos`, `/testimonios` | Variación de escalas, radios y sombras en contenido editorial. | P1 | Escala tipográfica, cards, badges y superficies migradas a tokens. | `src/app/(marketing)` | A | Completo |
| `/cursos`, `/cursos/[slug]`, `/precios` | Inconsistencia entre catálogo, detalle, CTAs y planes. | P1 | Jerarquía y controles normalizados; botones con objetivo táctil mínimo. | `src/app/(marketing)/cursos` | A | Completo |
| `/colegios`, `/docentes`, `/empresas`, `/speakers` | Las páginas por audiencia compartían intención, pero no lenguaje visual consistente. | P1 | Ritmo, títulos, cards y formularios alineados al sistema. | `src/app/(marketing)` | A | Completo |
| `/conocenos`, `/contacto`, `/donaciones`, `/voluntariado`, `/voluntariado/[rol]` | Flujos de captación con controles y feedback heterogéneos. | P1 | Campos, alertas, estados pendientes y tamaños táctiles estandarizados. | `src/components/forms/field.tsx` | B | Completo |
| `/faq`, `/nosotros`, `/legal/[doc]` | Lectura larga y acordeones con escalas ad hoc. | P2 | Ancho de lectura, tipografía, espaciado y focos consistentes. | `src/app/(marketing)` | A | Completo |
| `/verificar`, `/verificar/[codigo]` | Formulario y resultado visualmente aislados del sistema. | P1 | Controles, feedback y composición alineados al resto del sitio. | `src/app/(marketing)/verificar` | B | Completo |
| `/apoya-hoy` | Micrositio con exceso de valores visuales arbitrarios. | P1 | Diagnóstico y bloques migrados a radios, tipos y sombras semánticos. | `src/app/(campaign)/apoya-hoy` | A | Completo |
| `/login`, `/registro`, `/registro/[tipo]` | Envío duplicable, autocompletado incompleto y copy poco natural. | P0 | Botones pendientes, bloqueo de doble envío, `autocomplete`, ayudas accesibles y copy revisado. | `src/app/(auth)` | B | Completo |
| `/recuperar`, `/nueva-contrasena` | Feedback y controles no compartían las reglas del acceso. | P1 | Formularios migrados al mismo sistema de estados y controles. | `src/app/(auth)` | B | Completo |
| `/onboarding` | Progreso y propósito de las preguntas eran poco explícitos. | P0 | Contexto personalizado, explicación de tres módulos, progreso anunciado y recuperación de error más clara. | `src/app/(onboarding)/onboarding/onboarding-form.tsx` | B | Completo |
| `/panel`, `/cuenta`, `/cuenta/seguridad`, `/cuenta/notificaciones` | Navegación y acciones de cuenta tenían blancos táctiles y jerarquías dispares. | P0 | Sidebar/drawer accesible, rol visible, foco restaurado y controles de 44 px. | `src/components/app/app-sidebar.tsx` | B | Completo |
| `/estudiante`, `/estudiante/catalogo`, `/estudiante/mis-cursos`, `/estudiante/curso/[slug]`, `/estudiante/proyectos`, `/estudiante/membresia`, `/estudiante/certificados`, `/estudiante/eventos`, `/estudiante/comunidad` | Variación entre dashboards, catálogos y acciones compactas. | P1 | Primitivas de datos, jerarquía, tokens y objetivos táctiles normalizados. | `src/app/(app)/estudiante` | A/B | Completo |
| `/docente`, `/docente/programa`, `/docente/talleres`, `/docente/recursos`, `/docente/mi-colegio`, `/docente/certificados` | Densidad y estilos locales distintos por módulo. | P1 | Escala, cards, formularios y estados estandarizados sin cambiar datos. | `src/app/(app)/docente` | A/B | Completo |
| `/mentor`, `/mentor/mentorados`, `/mentor/sesiones`, `/mentor/horas`, `/mentor/canal` | Acciones pequeñas y prioridades visuales inconsistentes. | P1 | Controles táctiles, títulos y superficies alineados al sistema. | `src/app/(app)/mentor` | A | Completo |
| `/institucion`, `/institucion/estudiantes`, `/institucion/talleres`, `/institucion/impacto`, `/institucion/convenio`, `/institucion/facturacion`, `/institucion/perfil` | Métricas, acciones y detalles no tenían una escala transversal. | P1 | Tokens y componentes de dashboard normalizados. | `src/app/(app)/institucion` | A | Completo |
| `/speaker`, `/speaker/invitaciones`, `/speaker/participaciones`, `/speaker/perfil` | Navegación y estados no seguían el mismo ritmo del área privada. | P1 | Tipografía, espacios, controles y feedback alineados. | `src/app/(app)/speaker` | A/B | Completo |
| `/pagar/[orderId]` | Pago y carga de comprobante requerían mayor consistencia y claridad. | P0 | Formulario, resumen, estados y acciones normalizados sin cambiar el flujo de pago. | `src/app/(app)/pagar/[orderId]` | B | Completo |
| `/admin`, `/admin/impacto`, `/admin/auditoria`, `/admin/diagnostico` | Alta densidad y controles visuales incongruentes. | P1 | Jerarquía y tokens unificados preservando las vistas de datos. | `src/app/(app)/admin` | A | Completo |
| `/admin/usuarios`, `/admin/pagos` | Acciones sensibles sin confirmación contextual robusta; modales sin trampa/restauración de foco. | P0 | Confirmación con persona, monto/rol y consecuencia; modal accesible; toast de resultado. | `src/app/(app)/admin` | B | Completo |
| `/admin/postulaciones`, `/admin/colegios`, `/admin/inscripciones`, `/admin/instituciones` | Colas con acciones menores a 44 px y señales heterogéneas. | P0 | Acciones táctiles y estados visuales normalizados. | `src/app/(app)/admin` | A | Completo |
| `/admin/cursos`, `/admin/certificados`, `/admin/eventos`, `/admin/comunidad`, `/admin/donaciones`, `/admin/newsletter` | Módulos administrativos dependían de múltiples valores locales. | P1 | Migración transversal a tipos, radios y sombras semánticos. | `src/app/(app)/admin` | A | Completo |

## Hallazgos transversales cerrados

| Hallazgo | Antes | Después |
|---|---:|---:|
| Radios arbitrarios en `src` | 143 | 0 |
| Sombras arbitrarias en `src` | 37 | 0 |
| Tamaños tipográficos arbitrarios en `rem` | 276 | 0 |
| Anchos probados con desbordamiento horizontal | 9 | 0 fallos |
| Diálogos/drawers sin patrón común de foco | 5 | 0 |

## Segunda pasada de dirección visual

La segunda pasada aplica el principio **quiet interface, strong identity** sin modificar flujos ni contratos:

- los degradados se redujeron de 86 a 33 usos y se retiraron por completo del producto operativo;
- los blurs pasaron de 12 a 0;
- las sombras de cards normales pasaron de 36 a 1; la elevación restante se reserva para overlays y superficies realmente flotantes;
- Poppins queda reservado a jerarquía editorial de marketing; el área autenticada utiliza Inter;
- los currículos de IA Design Thinking y SILP comparten una composición editorial con número, tema, resultado y duración;
- la portada reduce el primer pliegue a un mensaje, un párrafo, dos acciones y una imagen; las métricas quedan en una franja neutral posterior;
- la carga del dashboard usa estructura skeleton en lugar de anillos, puntos y animaciones de marca;
- `tailwind-merge` reconoce la escala tipográfica personalizada, evitando que un token de color elimine tamaños como `text-h2` o que `text-body-sm` elimine el color de un botón.

La prueba responsive cubre 375, 390, 430, 640, 768, 834, 1024, 1280 y 1440 px. También se verifica navegación por teclado en acceso/registro, apertura y cierre de drawer con `Escape`, ciclo de foco, restauración al disparador y `prefers-reduced-motion`.

## Decisiones sobre fuentes

- `docs/UIUX.md` se trató como diagnóstico de diseño, no como especificación de negocio.
- `docs/PLAN-MAESTRO-SEP.md` se contrastó con la estructura real del repositorio y la documentación local de Next.js instalada.
- `docs/IA_Design_Thinking_Programas_Docentes_y_Universitarios.xlsx` es la fuente del contenido de las dos audiencias y sus seis clases. No se publicaron fechas absolutas porque las celdas del cronograma son ambiguas entre convenciones regionales; inventarlas habría cambiado el dato fuente.
