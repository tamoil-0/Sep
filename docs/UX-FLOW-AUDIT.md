# Auditoría UX de flujos críticos

Fecha de la pasada: 2026-08-26. Criterio rector: identificar qué puede confundir, frustrar, hacer perder información o provocar un error. Este documento registra el estado encontrado antes del refactor de interacción; no redefine reglas de negocio, permisos ni rutas.

## Mapa de fricciones previo a cambios

| Perfil | Recorrido observado | Fricción o riesgo encontrado | Severidad UX | Tratamiento definido |
| --- | --- | --- | --- | --- |
| Visitante | Inicio → programa → detalle → registro/postulación | Los programas explican contenido y audiencia, pero la ayuda contextual no usa un patrón común y la confirmación de algunos formularios no orienta el seguimiento. | Media | Patrón de ayuda reusable y confirmaciones con siguiente acción. |
| Nuevo usuario | Registro → correo → login → onboarding → panel | La confirmación de cuenta no identifica con claridad el correo usado ni ofrece una salida; recuperación termina en un aviso aislado; un error SMTP mostraba lenguaje interno. | Alta | Confirmación estructurada, correo enmascarado, alternativas reales y errores humanos sin detalles técnicos. |
| Nuevo usuario | Onboarding de 15 preguntas | Las respuestas sobreviven a un error de red, pero se pierden al recargar o cerrar la pestaña; el usuario no sabe si hay borrador. | Alta | Borrador local explícito por perfil, estado de guardado y limpieza al completar. |
| Estudiante | Panel → catálogo → curso → sesión → progreso → certificado | Los estados asíncronos principales evitan doble envío, pero los filtros vacíos no explican siempre cómo volver al catálogo completo. | Media | Estado vacío diferenciado y control “Limpiar filtros”. |
| Docente | Panel → programa/materiales → talleres | El formulario evita doble envío, aunque los errores largos pueden quedar fuera del foco. | Media | Resumen accesible y foco al primer campo inválido. |
| Institución | Panel → convenio/impacto | La jerarquía y próximos pasos son visibles; la ayuda contextual depende de la página. | Baja | Soporte consistente desde el shell y pantallas críticas. |
| Mentor/voluntario | Registro → oportunidad → participación → seguimiento | Las postulaciones conservan campos tras error, pero el reporte de error no mueve foco en formularios largos. | Media | Feedback reusable con foco accesible. |
| Speaker | Registro/invitación → información → actividad | Misma deuda de foco; algunas aprobaciones administrativas ocurren sin revisión suficientemente explícita. | Media/alta | Foco de error y revisión previa para transiciones irreversibles o reputacionales. |
| Admin | Login → panel → tablas → revisar → aprobar/rechazar | Las tablas genéricas dependen de scroll horizontal en móvil; los filtros vacíos pueden parecer ausencia de datos; algunas acciones directas tienen feedback local que desaparece al refrescar. | Alta | Vista móvil por registro, filtros activos/limpieza, prevención previa y toast global persistente. |

## Matriz de severidad de acciones

| Nivel | Acciones SEP auditadas | Patrón requerido |
| --- | --- | --- |
| S0 — trivial | Copiar código/enlace, abrir detalle o comprobante, cambiar pestaña/filtro | Feedback inmediato cuando aporta; sin confirmación. |
| S1 — reversible | Guardar perfil, marcar notificaciones, completar una sesión, editar preferencias | Estado pendiente y confirmación inline/toast; sin modal. |
| S2 — importante | Crear cuenta, postular, inscribirse, solicitar taller/certificado, enviar voucher, registrar horas o publicación | Validación previa, bloqueo de doble envío, conservar datos ante error y confirmación posterior con siguiente paso. |
| S3 — destructiva | Rechazar pago/postulación/colegio, retirar un rol no privilegiado, despublicar speaker | Separación visual, contexto del elemento afectado, motivo cuando corresponde y confirmación explícita con verbo concreto. |
| S4 — crítica | Aprobar un pago que dispara la emisión asociada; otorgar o retirar roles administrativos | Revisión reforzada de identidad/importe/consecuencia, restricciones por permiso, CTA nominativo, registro de auditoría y feedback global. |

## Criterios de implementación

- El guardado explícito se mantiene cuando confirma una intención o dispara una acción de negocio. No se introduce autosave remoto ambiguo.
- El único autosave nuevo es un borrador local del onboarding; no envía información al servidor y se elimina al completar.
- Los modales se reservan para decisiones enfocadas o para inspeccionar un comprobante. Las confirmaciones contextuales inline se prefieren cuando permiten revisar datos sin perder contexto.
- Los errores se agrupan en validación, permisos/sesión, red y servidor mediante los contratos existentes; ningún error técnico o dato sensible se muestra a la persona.
- No se modifica lógica de autenticación, certificados, pagos, programas, base de datos, rutas ni permisos.

## Mejoras funcionales no ejecutadas

- Reenviar el correo de confirmación desde el estado posterior al registro requeriría una nueva operación de autenticación, rate limit y definición de soporte. Se documenta como evolución; esta pasada ofrece reintento seguro mediante el flujo existente y cambio de correo sin inventar una nueva acción.
- Persistir formularios públicos en servidor o entre dispositivos requeriría consentimiento, retención y reglas de privacidad. No se implementa.
- Instrumentación de embudos y tasas de error queda preparada mediante estados y acciones con nombres claros, pero no se agrega analítica externa.

## Resultado de la pasada

- Los formularios críticos mantienen los datos ante validación o fallo de red, bloquean el doble envío, describen la operación en curso y llevan el foco al primer campo inválido o al resumen de error.
- Registro y recuperación muestran el correo enmascarado, tiempos y pasos de seguimiento; los mensajes técnicos quedan reservados al registro del servidor.
- El onboarding conserva en esta pestaña un borrador local identificado por perfil, comunica cuándo fue guardado y lo elimina al completar el proceso.
- Los listados distinguen ausencia real de datos, filtros sin resultados y error de carga. Las tablas reutilizables y la gestión de usuarios cuentan con una representación móvil por registro.
- Las acciones administrativas S3 y S4 exponen la identidad afectada y la consecuencia antes de ejecutarse; después informan el resultado con feedback global.
- Las consultas críticas dejan de convertir silenciosamente un fallo de datos en una pantalla vacía. Las páginas públicas dependientes de datos se resuelven dinámicamente para que una caída durante el build no publique contenido incompleto como si fuera válido.
- 404 y errores globales ofrecen recuperación, retorno seguro y canales reales de soporte sin prometer que datos no confirmados fueron guardados.

## Evidencia de validación

- `npm run lint`: aprobado.
- `npx tsc --noEmit`: aprobado.
- `npm run build`: aprobado con Next.js 16.3.
- Prueba automatizada sobre el servidor de producción: navegación por teclado en acceso y registro, cierre de diálogo con Escape y restauración de foco, ausencia de desborde horizontal entre 375 y 1440 px, preferencia de movimiento reducido, 404 recuperable y fallback de error de datos.
- El entorno de validación no tuvo conexión disponible con Supabase. Por ello se verificó de forma efectiva la recuperación ante caída de datos, pero no se emitieron pagos, certificados, altas ni cambios administrativos reales.
