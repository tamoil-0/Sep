# Plataforma SEP

**Semillero de Emprendedores Perú** — *¡Emprende hoy, lidera mañana!*

Plataforma de formación en metodologías ágiles para jóvenes universitarios,
docentes e instituciones de todas las regiones del Perú.

---

## Inicio rápido

```bash
npm install
cp .env.example .env.local     # rellenar con las claves de Supabase
npm run dev                    # http://localhost:3000
```

## Probar con datos de demostración

```bash
supabase start          # necesita Docker Desktop abierto
supabase db reset       # esquema + datos de referencia + ecosistema de demo
```

Entra con cualquiera de estas cuentas — contraseña **`SepDemo2026!`**:

| Correo | Rol | Qué muestra |
|---|---|---|
| `celeste@sep.pe` | super_admin + mentor + estudiante | Todo, con cambio de panel |
| `diana@sep.pe` | admin | Conciliación de pagos y postulaciones |
| `andrea@demo.sep.pe` | estudiante + mentor | Certificado emitido, membresía activa, 2 mentorados |
| `milagros@demo.sep.pe` | estudiante | **Pago en revisión** — para probar la aprobación |
| `rosa@demo.sep.pe` | docente | Panel docente |
| `marco@demo.sep.pe` | speaker | Perfil público e invitaciones |
| `colegio@demo.sep.pe` | institución | 3 talleres, 78 estudiantes, reporte de impacto |
| `empresa@demo.sep.pe` | institución (RSE) | Métricas y ODS |

El recorrido guiado está en [`docs/PUESTA-EN-MARCHA.md`](./docs/PUESTA-EN-MARCHA.md) §A.6.

---

## Documentación

| Documento | Contenido |
|---|---|
| [`docs/SUPABASE-PASO-A-PASO.md`](./docs/SUPABASE-PASO-A-PASO.md) | **Empieza aquí.** Crear la cuenta de Supabase y migrar los datos, campo por campo |
| [`docs/PUESTA-EN-MARCHA.md`](./docs/PUESTA-EN-MARCHA.md) | De cero a producción: local → Supabase → Vercel → pagos |
| [`docs/PLAN-MAESTRO-SEP.md`](./docs/PLAN-MAESTRO-SEP.md) | Documento único de verdad: marca, paleta, roles, modelo de datos, precios |
| [`docs/DEPLOY.md`](./docs/DEPLOY.md) | Referencia operativa de despliegue y checklist de lanzamiento |
| [`docs/SECURITY.md`](./docs/SECURITY.md) | Reglas de seguridad innegociables y cumplimiento legal |

---

## Stack

| Capa | Elección |
|---|---|
| Framework | Next.js 16 (App Router, Server Components, Server Actions) |
| Lenguaje | TypeScript estricto |
| Estilos | Tailwind CSS v4 con tokens de marca |
| Base de datos | Supabase Postgres + RLS |
| Auth | Supabase Auth (email, Google, magic link, TOTP) |
| Storage | Supabase Storage (6 buckets con políticas) |
| Validación | Zod |
| Iconos | lucide-react |
| Hosting | Vercel · worker opcional en Render |

> **Next.js 16:** `middleware.ts` se llama ahora `proxy.ts`; `params`,
> `searchParams` y `cookies()` son asíncronos.

---

## Estructura

```
src/
├── app/
│   ├── (marketing)/     Sitio público — landing, cursos, precios, verificar
│   ├── (auth)/          Login, 3 flujos de registro, recuperación
│   ├── (app)/           Área privada — 6 paneles por rol
│   ├── api/             Route handlers y webhooks
│   └── auth/callback/   Intercambio de código OAuth / confirmación de email
├── components/
│   ├── brand/           Logo e isotipo vectoriales
│   ├── ui/              Design system (button, primitives)
│   ├── marketing/       Navbar, footer, secciones de la landing
│   ├── app/             Sidebar, cabecera de página, KPIs
│   └── forms/           Campos accesibles reutilizables
├── config/              Fuente única: sitio, precios, cursos, roles, regiones
├── lib/                 Supabase, auth, validaciones, rate limiting, utils
├── server/actions/      Server Actions por dominio
├── types/               Roles y tipos de la base de datos
└── proxy.ts             Refresco de sesión + protección de rutas

supabase/
├── migrations/          10 migraciones: enums → tablas → funciones → RLS → storage
└── seed.sql             Cursos, sesiones, planes, aliados, 45 preguntas del diagnóstico

worker/                  Servicio opcional en Render para lotes pesados
docs/                    Plan maestro, deploy y seguridad
```

---

## Qué hace la plataforma

**Aprendizaje**
- Catálogo con inscripción en un clic y control de cupos
- Aula con sesiones por semana, enlace de Meet solo para inscritos y progreso que se recalcula solo
- Comunidad con publicaciones, comentarios y likes

**Pagos** — el flujo real del Perú
- QR de Yape/Plin generado en el servidor, con referencia única por orden
- El estudiante sube la captura y el código de operación
- El admin ve el comprobante con un enlace firmado que caduca en 5 minutos
- Al aprobar: el certificado se emite, se genera su código y llega la notificación
- Culqi (tarjeta) preparado para confirmación automática vía webhook

**Certificados**
- PDF real generado con `pdf-lib` — A4 horizontal, con la identidad de SEP
- Código de verificación único, comprobable públicamente sin iniciar sesión
- Revocación auditada

**Gestión**
- Roles otorgados y revocados con doble control (solo super_admin para admin)
- Embudo de postulaciones de voluntariado y speakers
- Aprobación de horas de voluntariado
- Reporte de impacto institucional imprimible, mapeado a los ODS
- Diagnóstico público de 45 preguntas con resultados agregados para el equipo

---

## Los 6 roles

| Rol | Registro | Panel |
|---|---|---|
| Estudiante | Abierto | `/estudiante` |
| Docente | Abierto | `/docente` |
| Institución | Abierto + verificación | `/institucion` |
| Mentor / Voluntario | Postulación aprobada | `/mentor` |
| Speaker | Registro + aprobación | `/speaker` |
| Admin / Super admin | Asignación manual | `/admin` |

Un usuario **acumula** roles: los roles viven en la tabla `user_roles` (N:M),
nunca en una columna de `profiles` ni en metadata editable por el cliente.

---

## Precios

| Producto | Precio | Estado |
|---|---|---|
| Cursos del catálogo | **Gratis** | Confirmado |
| Certificado SEP | S/ 30 | Confirmado |
| Certificado Internacional | S/ 50 | Confirmado |
| SILP (tarifa social) | S/ 200 | Confirmado |
| Membresías Raíz / Tronco / Bosque | S/ 45 / 80 / 140 | Propuesta |
| Programas B2B | S/ 900 – S/ 25,000+ | Propuesta |
| Red de colegios sin patrocinio | **Gratis** | Confirmado |

Fuente única: [`src/config/pricing.ts`](./src/config/pricing.ts).
En producción, el servidor **siempre** lee el precio de la base de datos.

---

## Comandos

```bash
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run start    # servir el build
npm run lint     # ESLint

supabase db push                                          # aplicar migraciones
supabase db seed                                          # cargar datos iniciales
supabase gen types typescript --linked > src/types/database.ts
```

---

## Marca

| Token | HEX | Uso |
|---|---|---|
| `sep-600` | `#2E0BE8` | Azul de marca, botones primarios |
| `violet-brand` | `#6A0DD9` | Punto medio del degradado |
| `purple-brand` | `#A50FC6` | Fin del degradado |
| `gold-500` | `#FFC629` | Acento: subrayados, métricas, CTA |
| `seed-500` | `#7CC242` | Verde semilla, progreso |
| `ink` | `#12101C` | Texto principal |

Tipografía: **Poppins** (display) + **Inter** (UI).
Estilo: minimal — el degradado aparece máximo dos veces por pantalla y el
amarillo es puntuación, no párrafo.

---

## Contacto

**Semillero de Emprendedores Perú** · Organización juvenil reconocida por SENAJU
Fundada el 7 de abril de 2024 en Casma, Áncash.

- semilleroemprendedorperu@gmail.com
- WhatsApp: +51 946 370 641
- [Instagram](https://instagram.com/semillerodemprendedoresperu) ·
  [Facebook](https://facebook.com/Semillerodeemprendedoresperu) ·
  [TikTok](https://tiktok.com/@semillerodeemprendedores)
