# UI/UX Visual QA — SEP

Auditoría realizada sobre la aplicación ejecutada con datos locales de demostración y capturas reales en 375, 390, 430, 640, 768, 834, 1024, 1280 y 1440 px. Las evidencias previas están en `docs/visual-qa/before/`.

## Matriz de hallazgos

| Ruta | Viewport | Problema | Severidad | Evidencia | Componente raíz | Solución propuesta |
|---|---:|---|---|---|---|---|
| `/onboarding` | Todos | El envío de las 15 respuestas falla y bloquea el acceso al panel. | P0 | `before/onboarding/completion-result--1440.png` | `src/server/actions/onboarding.ts` / RPC | Diagnosticar contrato del RPC sin alterar el flujo ni el modelo de datos. |
| `/colegios` | 390–1440 | La página cae en el límite de error con el seed oficial. | P0 | `before/marketing/colegios--390.png` | `src/app/(marketing)/colegios/page.tsx` | Corregir la consulta incompatible manteniendo contenido y ruta. |
| Varias rutas privadas | 390–1440 | Comunidad, sesiones, canal, talleres, institución y tres áreas admin muestran error. | P0 | `before/app/institucion/institucion--390.png` | Páginas y consultas de cada módulo | Corregir joins/selects incompatibles con el esquema estable. |
| `/admin/pagos` | 390–1440 | “Ver comprobante” no abre el archivo del pago pendiente. | P0 | `before/admin-states/pagos--1440--voucher.png` | `payment-queue.tsx` | Aceptar la ruta válida del seed y conservar validación de seguridad. |
| `/onboarding` | 375–834 | La primera pregunta queda fuera del primer viewport por una cabecera y tarjeta de progreso excesivas. | P1 | `before/onboarding/step-1--390.png` | `onboarding-form.tsx` | Compactar cabecera, integrar progreso y priorizar la tarea. |
| `/onboarding` | 390 | Un solo módulo supera ampliamente tres pantallas; exceso de cards, metadata y ayuda persistente. | P1 | `before/onboarding/step-1--390--full.png` | `onboarding-form.tsx` | Reducir padding, bordes, repetición de progreso y altura de opciones. |
| `/login` | 390 | Tras credenciales inválidas se pierde el correo ingresado. | P1 | `before/auth/login--390--error-settled.png` | `login-form.tsx` | Preservar el correo devuelto por el estado del formulario. |
| `/recuperar` | 390 | Éxito con alerta, tarjeta informativa, acciones y ayuda redundantes. | P1 | `before/auth/recuperar--390--success-settled.png` | `forgot-form.tsx` | Consolidar el estado en una sola superficie y una acción clara. |
| `/registro/estudiante` | 390 | Éxito con tarjeta, enlace duplicado de login y ayuda contextual. | P1 | `before/auth/registro-estudiante--390--success.png` | `signup-form.tsx` | Ocultar acciones/contexto redundantes cuando el registro termina. |
| `/estudiante` | 390–1440 | El contenido de estudiante aparece dentro de navegación rotulada como mentor en cuentas multirrol. | P1 | `before/app/mentor/mentor--390.png` | `app-sidebar.tsx` / layout | Derivar el panel activo de la ruta actual, no solo del rol prioritario. |
| `/mentor` | 390–1440 | Mentorados sin identidad visible y métricas inconsistentes. | P1 | `before/app/mentor/mentor--mentorados--390.png` | Página y consulta de mentor | Mostrar identidad disponible y evitar métricas engañosas. |
| Dashboards | 375–430 | Cada KPI ocupa una card completa; la acción principal queda varias pantallas abajo. | P1 | `before/app/admin/admin--390.png` | `data-views.tsx` y dashboards | Convertir KPIs móviles en una banda compacta de 2 columnas. |
| `/admin` | 390–1440 | “Accesos rápidos” duplica íntegramente la navegación lateral. | P1 | `before/app/admin/admin--390.png` | `src/app/(app)/admin/page.tsx` | Eliminar duplicación o limitarla a tareas primarias. |
| `/admin/pagos` | 390 | Cuatro KPIs anteceden al único pago pendiente y retrasan la tarea crítica. | P1 | `before/app/admin/admin--pagos--390.png` | Página de pagos / `StatCard` | Compactar métricas y priorizar la cola. |
| `/docente` | 390–1440 | Cuatro ceros y un empty state enorme dominan la pantalla. | P1 | `before/app/docente/docente--390.png` | Dashboard docente | Reducir altura y agrupar el estado vacío con su acción. |
| `/ai-design-thinking` | 390 | Página extremadamente larga con bloques y CTA repetidos. | P1 | `before/marketing/ai-design-thinking--390--full.png` | Página y `program.tsx` | Eliminar CTA duplicados y reducir secciones equivalentes. |
| Marketing | 390–1440 | Exceso de gradientes morados hace que varias páginas se sientan idénticas y fatigantes. | P2 | `before/marketing/home--390.png` | Heroes de marketing | Reservar el gradiente para hero principal y usar superficies neutrales. |
| Marketing secundario | 390–1440 | Títulos display y subrayados amarillos gruesos compiten con el contenido. | P2 | `before/marketing/contacto--1440.png` | Páginas secundarias | Reducir escala y convertir amarillo en acento corto. |
| `/contacto` | 390–1440 | Sin H1 semántico, correo se parte mal y hay exceso de cards/espacio. | P2 | `before/marketing/contacto--1440.png` | `contacto/page.tsx` | Restablecer jerarquía, permitir wrapping correcto y simplificar canales. |
| `/eventos`, `/faq`, `/blog`, `/testimonios` | 390–1440 | Cabeceras sin H1 claro y primer viewport con demasiado aire. | P2 | `before/marketing/eventos--1440.png` | Páginas secundarias | Unificar cabecera editorial compacta y semántica. |
| Marketing con fotos | 390–1440 | El placeholder inicial es un bloque oscuro que parece imagen rota. | P2 | `before/marketing/nosotros--1440.png` | `real-photo.tsx` | Usar neutral claro con shimmer sutil o color promedio. |
| Tablet | 640–834 | Varias superficies conservan patrón móvil de una columna; parece móvil estirado. | P2 | `before/marketing/home--834.png` | Breakpoints sistémicos | Introducir composición de dos columnas desde `md` donde haya espacio real. |
| App móvil | 390 | Drawer funciona, pero header y cards consumen demasiado alto útil. | P2 | `before/app-shell/admin-drawer--390.png` | Shell y `data-views.tsx` | Compactar encabezado y espaciado vertical sin reducir targets táctiles. |

## Criterio de implementación

1. P0 funcionales que impiden revisar o completar el producto.
2. P1 de jerarquía, comprensión y eficiencia.
3. P2 sistémicos con impacto transversal.
4. P3 únicamente si aparece una mejora clara durante la validación.

No se cambiarán negocio, permisos, rutas, contenidos confirmados, fechas, programas ni arquitectura estable.

## Primera corrección visual aplicada

Se corrigieron los P1/P2 visuales autorizados sin intervenir los P0 funcionales ni la lógica de negocio:

- onboarding más compacto y con la primera pregunta visible antes;
- KPIs móviles en dos columnas, empty states y shell de app con menor altura;
- panel multirrol derivado de la ruta visible;
- accesos rápidos redundantes eliminados del inicio de administración;
- correo preservado tras error de login y recuperación simplificada;
- heroes de portada, programas, Nosotros y Voluntariado convertidos a superficies neutrales;
- escala de títulos, secciones y subrayado amarillo reducida sistémicamente;
- placeholder de fotografías cambiado de bloque oscuro a neutral.

Evidencia posterior disponible en `docs/visual-qa/after/` para portada, AI Design Thinking y login en 390 y 1440 px. Los P0 de esta matriz permanecen abiertos porque esta pasada se limitó expresamente a lo visual.
