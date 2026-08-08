# HANDOFF — Plataforma SEP

Repo: https://github.com/tamoil-0/Sep · rama `main` · Next.js 16 + Supabase + Tailwind v4

---

## ✅ SQL EJECUTADO Y VALIDADO EN LOCAL

Las 10 migraciones aplican limpias y el seed carga. Verificado con Postgres real:

```
usuarios: 15 | roles: 23 | cursos: 5 | sesiones: 24 | inscripciones: 9
certificados: 4 | pagos: 5 | talleres: 7 | escolares: 130 | diagnóstico: 1350
```

**Pruebas de seguridad pasadas** (Kevin, estudiante):
- `grant_role` sobre sí mismo → `FORBIDDEN`
- `review_payment` → `FORBIDDEN`
- `insert into certificates` → violación de RLS
- Ve **1 perfil de 15** y **1 pago de 5**

**Flujo de negocio pasado:** inscripción bloqueada en curso cerrado → marcar
6 sesiones → progreso 100% → `create_order` con precio de la BD (S/50) →
voucher → admin aprueba → certificado `SEP-2026-B1708B` emitido + job PDF
encolado + notificación + auditoría.

**App verificada** contra la BD real: `/cursos`, `/colegios`, `/speakers`,
`/eventos` renderizan datos del seed. Login OK con las 3 cuentas probadas.

### Arrancar en local
```bash
npx supabase@latest start     # necesita Docker Desktop abierto
npm run dev
```
Las claves locales ya están en `.env.local` (no versionado). Si lo pierdes,
`npx supabase@latest status` las vuelve a imprimir.

---

## Estado: ~85% hecho

### ✅ Funciona
- **Landing** (19 secciones) + 20 páginas públicas: cursos, curso/[slug], SILP,
  voluntariado + postulación, colegios + formulario, speakers + formulario,
  precios, donaciones, nosotros, faq, eventos, empresas, docentes, blog,
  testimonios, convocatorias, contacto, legal (3 docs), verificar certificado
- **Diagnóstico público** `/conocenos`: wizard de 45 preguntas, 3 perfiles, sin login
- **Auth**: login, 3 flujos de registro, recuperar contraseña, callback OAuth
- **6 paneles**: estudiante (dashboard, catálogo, aula con progreso, comunidad,
  certificados, mis-cursos), docente, mentor (+ registro de horas),
  institución (+ reporte de impacto imprimible), speaker,
  admin (KPIs, usuarios/roles, pagos, postulaciones)
- **Pagos**: QR Yape/Plin generado en servidor → subida de voucher → conciliación
  en `/admin/pagos` → emite certificado automáticamente
- **Certificados**: PDF real (pdf-lib) + verificación pública por código
- **BD**: 9 migraciones, 40 tablas, **todas con RLS y política explícita**
- **Seed demo**: 15 usuarios, pagos en 3 estados, comunidad, talleres, 1200+
  respuestas de diagnóstico. Contraseña: `SepDemo2026!`

Build verde (54 rutas), lint limpio.

### ❌ Falta

| Prioridad | Qué | Dónde |
|---|---|---|
| **Alta** | Ejecutar y validar el SQL | `supabase db reset` |
| **Alta** | Emails transaccionales (Resend) — hoy no se envía ninguno | crear `src/lib/email/` |
| **Alta** | `/cuenta` y `/cuenta/seguridad` (perfil, MFA) — enlazados pero no existen → 404 | `src/app/(app)/cuenta/` |
| Media | Subpáginas admin: `/admin/cursos`, `/certificados`, `/colegios`, `/diagnostico`, `/auditoria`, `/eventos`, `/comunidad`, `/newsletter`, `/donaciones`, `/impacto`, `/instituciones`, `/inscripciones` → 404 | `src/app/(app)/admin/` |
| Media | Subpáginas estudiante: `/eventos`, `/proyectos`, `/membresia` → 404 | `src/app/(app)/estudiante/` |
| Media | Subpáginas docente/mentor/institución/speaker (solo el dashboard existe) | ver `src/config/navigation.ts` |
| Media | Culqi: checkout + webhook `/api/webhooks/culqi` | botón ya está, deshabilitado |
| Media | `/onboarding` tras primer login | `src/app/(auth)/` |
| Baja | hCaptcha en formularios públicos (env vars ya declaradas) | |
| Baja | Rate limit → Upstash Redis (hoy en memoria, no sirve multi-instancia) | `src/lib/rate-limit.ts` |
| Baja | Worker de Render (solo `render.yaml`, sin código) | `worker/` |
| Baja | Tests (0 escritos) | |
| Baja | Assets reales: logo SVG oficial, fotos de talleres | `public/` |

> **Regla:** todas las rutas 404 están declaradas en `src/config/navigation.ts`.
> Esa es la lista de trabajo pendiente.

---

## Arquitectura — 3 reglas que NO se rompen

1. **La lógica de negocio vive en Postgres.** Inscribirse, crear órdenes, aprobar
   pagos, otorgar roles y el diagnóstico son funciones `SECURITY DEFINER` en
   `supabase/migrations/0008_business_functions.sql`. Se llaman con
   `supabase.rpc(...)`. **No reimplementar esa lógica en TypeScript.**

2. **3 capas de autorización, ninguna sustituye a otra:**
   `src/proxy.ts` (filtro grueso) → `requireRole()` en cada página → RLS en Postgres.

3. **El precio siempre sale de la base de datos.** El cliente manda `item_id`,
   nunca un monto.

### Convenciones Next.js 16 (¡distintas de v15!)
- `middleware.ts` → **`proxy.ts`**
- `params`, `searchParams` y `cookies()` son **async**

### Dónde está cada cosa
```
src/config/          fuente única: precios, cursos, roles, navegación, textos
src/server/actions/  Server Actions (devuelven ActionResult, nunca lanzan)
src/server/queries/  lecturas con cache()
src/lib/result.ts    errores de Postgres → mensajes en español
src/types/roles.ts   los 6 roles y sus permisos
supabase/migrations/ 0001→0009 en orden
```

### Añadir una página de panel
1. Crear `src/app/(app)/<rol>/<pagina>/page.tsx`
2. Empezar con `const user = await requireRole([...])`
3. Usar `PageHeader`, `Kpi`, `Card`, `EmptyState` de los componentes existentes
4. Datos: query nueva en `src/server/queries/`

---

## Deploy

Guía completa: **`docs/PUESTA-EN-MARCHA.md`**

Resumen: `supabase link` → `db push` → pegar `seed.sql` en el SQL Editor →
Vercel con las env vars → crear el primer super_admin con:

```sql
insert into user_roles (user_id, role)
select id, 'super_admin' from profiles where email = 'TU@CORREO.com';
```

---

## Marca

Azul `#2E0BE8` → violeta `#6A0DD9` → púrpura `#A50FC6`, acento amarillo `#FFC629`,
verde semilla `#7CC242`. Poppins (display) + Inter (UI).
Estilo minimal: el degradado aparece **máximo 2 veces por pantalla**, el amarillo
es puntuación (subrayados, métricas) y nunca fondo de párrafos.

Tokens en `src/app/globals.css`. Detalle completo en `docs/PLAN-MAESTRO-SEP.md` §2.

---

## Pendiente del negocio (no es código)

- Validar precios marcados «Propuesta» (membresías S/45·80·140, B2B) con el diagnóstico
- Tarifa comercial del SILP (el deck no la dice)
- Registrar el banco de datos personales ante la **ANPD** (Ley 29733) antes de producción
- Confirmar dominio: `sep.edu.pe` (exige acreditación educativa) o `semillero.pe`
- Firmar el convenio con el Instituto Internacional de Ingeniería ($100/año)

---

## Otros docs

| Archivo | Qué tiene |
|---|---|
| `docs/PUESTA-EN-MARCHA.md` | Deploy paso a paso + cuentas de demo + troubleshooting |
| `docs/PLAN-MAESTRO-SEP.md` | Toda la info de SEP, paleta, modelo de datos, precios |
| `docs/SECURITY.md` | Las 10 reglas innegociables |
