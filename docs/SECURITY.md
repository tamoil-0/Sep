# Seguridad — Plataforma SEP

> Resumen operativo. Detalle completo en
> [`PLAN-MAESTRO-SEP.md`](./PLAN-MAESTRO-SEP.md) §9.

---

## Las tres capas de autorización

Ninguna sustituye a las otras. Una petición debe pasar por las tres.

```
1. proxy.ts          → filtro grueso: ¿hay sesión? ¿la ruta es privada?
2. requireRole()     → cada página y Server Action revalida el rol en el servidor
3. RLS en Postgres   → última línea de defensa: la base de datos decide
```

Si alguien salta el proxy (petición directa a la API) y salta el guard
(bug en el código), **RLS lo detiene**. Por eso toda tabla tiene RLS.

---

## Reglas innegociables

| # | Regla | Dónde se aplica |
|---|---|---|
| 1 | La `SUPABASE_SERVICE_ROLE_KEY` jamás llega al cliente | `lib/supabase/admin.ts` empieza con `import "server-only"` |
| 2 | Los roles no se autoasignan | Política RLS `user_roles_admin_write` + el trigger `handle_new_user` solo acepta los 3 tipos de cuenta abiertos |
| 3 | Los precios se leen de la base de datos | El cliente envía `item_id`, nunca un monto |
| 4 | El usuario no aprueba su propio pago | Política `payments_insert_own_pending` fuerza `status = 'pendiente'` |
| 5 | Los certificados los emite el servidor | Solo `is_admin()` puede insertar en `certificates` |
| 6 | El enlace de Meet solo lo ven los inscritos | Política `course_sessions_select_enrolled` |
| 7 | Todo input pasa por Zod en el servidor | `lib/validations/*` |
| 8 | Los webhooks verifican firma y son idempotentes | Índice único en `payments.provider_ref` |
| 9 | El log de auditoría es inmutable | Sin políticas de UPDATE/DELETE en `audit_log` |
| 10 | No se crean cuentas para menores de edad | `workshop_attendees` guarda solo nombre y grado, bajo responsabilidad del colegio |

---

## Rate limiting

Implementado en `lib/rate-limit.ts`.

| Acción | Límite |
|---|---|
| Login | 5 por 15 min (IP + email) |
| Registro | 3 por hora (IP) |
| Formularios públicos | 5 por hora (IP) |
| Newsletter | 3 por hora (IP) |
| Diagnóstico | 1 envío por email |

> ⚠️ La implementación actual es **en memoria**: solo sirve para una instancia.
> Antes de escalar a varias regiones de Vercel, migrar a Upstash Redis
> (`@upstash/ratelimit`) manteniendo la misma firma.

---

## Cabeceras HTTP

Definidas en `next.config.ts`. Objetivo: **A+** en securityheaders.com.

- `Content-Security-Policy` con allowlist explícita (Supabase, Culqi, hCaptcha)
- `Strict-Transport-Security` con `preload`
- `X-Frame-Options: DENY` + `frame-ancestors 'none'`
- `Permissions-Policy` cerrando cámara, micrófono y geolocalización

---

## Datos personales (Ley N.º 29733, Perú)

| Obligación | Cómo se cumple |
|---|---|
| Consentimiento explícito y separado | Dos checkboxes distintos: términos/privacidad y comunicaciones comerciales |
| Finalidad declarada | `/legal/privacidad` |
| Derechos ARCO | Formulario en `/cuenta` + correo dedicado. Respuesta ≤ 20 días |
| Registro del banco de datos | Ante la ANPD, antes del lanzamiento |
| Menores de edad | Sin cuentas. Datos mínimos en `workshop_attendees`, con consentimiento del apoderado gestionado por el colegio |

**Retención:** leads del diagnóstico 24 meses · logs de auditoría 5 años ·
vouchers de pago 5 años (obligación tributaria).

---

## Reportar una vulnerabilidad

Escribir a **semilleroemprendedorperu@gmail.com** con el asunto
`[SEGURIDAD]`. No abrir un issue público.

Compromiso: acuse de recibo en 72 horas.
