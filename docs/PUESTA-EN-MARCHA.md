# Puesta en marcha — paso a paso

> De cero a producción. Cada bloque es copiar, pegar y verificar.
> Tiempo estimado: **45 minutos** la primera vez.

---

## Índice

| Parte | Qué haces |
|---|---|
| [A](#parte-a--probar-todo-en-tu-computadora) | Probar todo en tu computadora con datos de demo |
| [B](#parte-b--exportar-a-supabase-en-la-nube) | Exportar la base de datos a Supabase |
| [C](#parte-c--desplegar-en-vercel) | Desplegar la web en Vercel |
| [D](#parte-d--configurar-los-pagos) | Configurar Yape, Plin y Culqi |
| [E](#parte-e--verificación-final) | Verificación final |

---

## PARTE A — Probar todo en tu computadora

Sirve para ver la plataforma funcionando con los datos de demostración antes de
tocar nada en la nube.

### A.1 Requisitos

```bash
node -v     # necesitas 20 o superior
docker -v   # Docker Desktop debe estar corriendo
```

Si no tienes Docker: descárgalo de `docker.com/products/docker-desktop` y ábrelo.

### A.2 Instalar y arrancar

```bash
cd sep-platform
npm install
npm i -g supabase

# Levanta Postgres, Auth, Storage y Studio en local
supabase start
```

Al terminar, la consola imprime algo así. **Copia esos tres valores:**

```
API URL: http://127.0.0.1:54321
anon key: eyJhbGciOi...
service_role key: eyJhbGciOi...
```

### A.3 Cargar el esquema y los datos

```bash
supabase db reset
```

Un solo comando hace todo: crea las tablas, las políticas RLS, las funciones,
carga los datos de referencia (4 cursos, 45 preguntas del diagnóstico, planes)
y el ecosistema de demostración.

Al final verás el resumen:

```
═══════════════════════════════════════════════
 SEED DE DEMO CARGADO
═══════════════════════════════════════════════
 Usuarios:      15
 Inscripciones: 9
 Certificados:  4
 Pagos:         5
 Talleres:      7
 Escolares:     130
 Diagnóstico:   1200+ respuestas

 Contraseña de todas las cuentas: SepDemo2026!
```

### A.4 Conectar la app

Crea `.env.local` con los valores del paso A.2:

```bash
NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54321"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<anon key>"
SUPABASE_SERVICE_ROLE_KEY="<service_role key>"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

```bash
npm run dev
```

Abre `http://localhost:3000`.

### A.5 Cuentas de demostración

Todas usan la contraseña **`SepDemo2026!`**

| Correo | Rol | Qué ver en su panel |
|---|---|---|
| `celeste@sep.pe` | super_admin + mentor + estudiante | Todo. Puede cambiar de panel desde el sidebar |
| `diana@sep.pe` | admin | Conciliación de pagos, postulaciones, usuarios |
| `andrea@demo.sep.pe` | estudiante + mentor | Curso completado, certificado emitido, membresía Tronco, 2 mentorados |
| `ricardo@demo.sep.pe` | estudiante | Curso al 50 %, postulación en entrevista |
| `milagros@demo.sep.pe` | estudiante | **Pago en revisión** — para probar la conciliación |
| `kevin@demo.sep.pe` | estudiante | **Pago rechazado** — para ver el mensaje de error |
| `rosa@demo.sep.pe` | docente | Panel docente y recursos de aula |
| `marco@demo.sep.pe` | speaker | Perfil público e invitaciones |
| `colegio@demo.sep.pe` | institución (colegio) | 3 talleres realizados, 78 estudiantes, reporte de impacto |
| `empresa@demo.sep.pe` | institución (empresa) | Vista RSE con métricas y ODS |

### A.6 Recorrido recomendado (10 minutos)

1. **Entra como `milagros@demo.sep.pe`** → `/estudiante/certificados` → verás su pago en revisión.
2. **Entra como `diana@sep.pe`** → `/admin/pagos` → pestaña «Por revisar» → clic en **Ver comprobante** → **Aprobar y emitir**.
3. **Vuelve como `milagros@demo.sep.pe`** → su certificado ya está emitido → **Descargar PDF**.
4. Copia el código de verificación y ábrelo en `/verificar/SEP-2026-XXXXXX` **sin iniciar sesión**.
5. **Entra como `andrea@demo.sep.pe`** → `/estudiante/comunidad` → publica algo, dale like, comenta.
6. **Entra como `colegio@demo.sep.pe`** → `/institucion/impacto` → **Imprimir / Guardar PDF**.
7. Sin sesión, abre `/conocenos` y completa el diagnóstico. Luego entra como admin a `/admin/postulaciones`.

### A.7 Herramientas locales

| Servicio | URL |
|---|---|
| Supabase Studio (ver tablas) | http://127.0.0.1:54323 |
| Inbucket (correos de prueba) | http://127.0.0.1:54324 |
| La app | http://localhost:3000 |

Para reiniciar todo desde cero: `supabase db reset`.

---

## PARTE B — Exportar a Supabase en la nube

### B.1 Crear el proyecto

1. Entra a `supabase.com` → **New project**
2. Nombre: `sep-produccion`
3. **Región: South America (São Paulo)** — es la más cercana a Perú (~40 ms)
4. Genera una contraseña larga y **guárdala en un gestor de contraseñas**
5. Plan: **Free** para probar → **Pro ($25/mes)** antes de recibir usuarios reales
   (el plan Pro es el que trae backups diarios y recuperación punto en el tiempo)

### B.2 Enlazar tu proyecto local con el de la nube

```bash
supabase login
supabase link --project-ref <TU_PROJECT_REF>
```

> El `project-ref` es la parte del medio de tu URL:
> `https://`**`abcdefghijklm`**`.supabase.co`

### B.3 Subir el esquema

```bash
supabase db push
```

Esto aplica las 9 migraciones en orden: tipos → tablas → funciones →
**políticas RLS** → storage → lógica de negocio → vistas.

Verifica que todo subió:

```bash
supabase migration list
```

Las 9 deben aparecer con marca en las columnas *Local* y *Remote*.

### B.4 Cargar los datos de referencia

Los datos de referencia (cursos, sesiones, planes, roles de voluntariado,
aliados y las 45 preguntas del diagnóstico) **sí van a producción**.
Los de demostración **no**.

**Opción 1 — desde el panel (más simple):**
Supabase → **SQL Editor** → **New query** → pega el contenido de
`supabase/seed.sql` → **Run**.

**Opción 2 — desde la terminal:**

```bash
supabase db push --include-seed
```

> ⚠️ **Nunca ejecutes `supabase/seeds/demo.sql` en producción.** Crea 15 usuarios
> falsos con una contraseña conocida. Solo va en local y en staging.

### B.5 Configurar Auth

**Authentication → URL Configuration**

| Campo | Valor |
|---|---|
| Site URL | `https://sep.edu.pe` |
| Redirect URLs | `https://sep.edu.pe/**`<br>`https://*-sep.vercel.app/**`<br>`http://localhost:3000/**` |

**Authentication → Providers**
- **Email**: activado, con *Confirm email* obligatorio
- **Google**: activado (necesitas credenciales de Google Cloud Console)

**Authentication → Multi-Factor**
- **TOTP**: activado (es obligatorio para los roles `admin` y `super_admin`)

**Authentication → Email Templates**
Traduce las 5 plantillas al español. Ejemplo para «Confirm signup»:

```html
<h2>Confirma tu correo</h2>
<p>¡Bienvenid@ a SEP! Haz clic para activar tu cuenta:</p>
<p><a href="{{ .ConfirmationURL }}">Confirmar mi correo</a></p>
<p style="color:#6E6A85;font-size:12px">
  Si no creaste esta cuenta, ignora este mensaje.
</p>
```

### B.6 Crear los buckets de Storage

La migración `0007_storage.sql` ya los crea con sus políticas. Verifica en
**Storage** que existan los seis:

`avatars` · `public-assets` · `course-materials` · `certificates` · `vouchers` · `institution-docs`

### B.7 Verificar la seguridad (no te saltes esto)

Supabase → **Advisors → Security Advisor**

Debe quedar **sin advertencias**. Especialmente revisa que ninguna tabla aparezca
como *RLS disabled*.

```bash
supabase db lint
```

### B.8 Crear tu primer administrador

1. Regístrate normalmente en la web con tu correo real
2. Confirma el correo
3. En Supabase → **SQL Editor**, ejecuta:

```sql
insert into user_roles (user_id, role)
select id, 'super_admin' from profiles where email = 'tu-correo@ejemplo.com';
```

4. Cierra sesión, vuelve a entrar → ya ves `/admin`

> A partir de aquí, todos los demás roles se otorgan desde
> `/admin/usuarios`. Nunca vuelvas a tocar la tabla a mano.

### B.9 Regenerar los tipos de TypeScript

```bash
supabase gen types typescript --linked > src/types/database.ts
```

Esto reemplaza el archivo escrito a mano por el generado desde tu esquema real.

---

## PARTE C — Desplegar en Vercel

### C.1 Subir el código a GitHub

```bash
cd sep-platform
git init                      # si aún no es un repo
git add .
git commit -m "Plataforma SEP"
gh repo create sep-platform --private --source=. --push
```

> Sin `gh`: crea el repositorio en github.com y luego
> `git remote add origin <url>` + `git push -u origin main`.

### C.2 Importar en Vercel

1. `vercel.com` → **Add New → Project**
2. Importa el repositorio
3. **Root Directory**: `sep-platform` (si el repo tiene más carpetas)
4. Framework: Next.js — se detecta solo
5. **No despliegues todavía**: primero las variables

### C.3 Variables de entorno

En **Settings → Environment Variables**, añade una por una:

| Variable | Valor | Entornos |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Los 3 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` | Los 3 |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` | Production, Preview |
| `NEXT_PUBLIC_SITE_URL` | `https://sep.edu.pe` | Production |
| `NEXT_PUBLIC_YAPE_NUMBER` | `+51946370641` | Los 3 |
| `NEXT_PUBLIC_YAPE_HOLDER` | `Semillero de Emprendedores Perú` | Los 3 |
| `CRON_SECRET` | Cadena aleatoria de 32+ caracteres | Production |
| `RESEND_API_KEY` | `re_...` | Production |

Genera el `CRON_SECRET` así:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> 🔴 **`SUPABASE_SERVICE_ROLE_KEY` NUNCA lleva el prefijo `NEXT_PUBLIC_`.**
> Esa clave salta todas las políticas de seguridad. Si la expones, cualquiera
> puede leer y borrar toda la base de datos.

### C.4 Desplegar

**Deploy**. Tarda 2–3 minutos.

### C.5 Conectar el dominio

**Settings → Domains** → añade `sep.edu.pe` y `www.sep.edu.pe`.

En tu proveedor de dominio (por ejemplo, en el panel de `.pe`):

| Tipo | Nombre | Valor |
|---|---|---|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

El certificado SSL se emite solo en unos minutos.

Después, **vuelve a Supabase** y actualiza el *Site URL* con tu dominio real.

### C.6 Verificar que la clave secreta no se filtró

```bash
npm run build
grep -r "$(echo $SUPABASE_SERVICE_ROLE_KEY | head -c 20)" .next/static/ \
  && echo "🔴 FUGA — DETENTE" \
  || echo "✅ La clave no está en el bundle del cliente"
```

---

## PARTE D — Configurar los pagos

### D.1 Yape y Plin (el flujo principal en Perú)

**Ya funciona sin configurar nada más.** El sistema:

1. Genera un **QR** con el monto y una referencia única de la orden
2. El estudiante paga desde su app
3. Sube la **captura** y el **código de operación**
4. Aparece en `/admin/pagos` → **Por revisar**
5. El admin abre el comprobante (enlace firmado que caduca en 5 min) y aprueba
6. Al aprobar, **el certificado se emite solo** y el estudiante recibe su notificación

Para personalizarlo, cambia estas dos variables en Vercel:

```
NEXT_PUBLIC_YAPE_NUMBER="+51 9XX XXX XXX"
NEXT_PUBLIC_YAPE_HOLDER="Semillero de Emprendedores Perú"
```

> **Recomendación operativa:** abre una cuenta bancaria y un Yape a nombre de la
> organización, no de una persona. Facilita la contabilidad y da confianza.

### D.2 Culqi (tarjeta — opcional)

Para que la confirmación sea instantánea en lugar de manual:

1. Regístrate en `culqi.com` y completa la validación de la empresa
2. Copia tus llaves de **Desarrollo** primero, luego las de **Producción**
3. Añádelas en Vercel:
   ```
   NEXT_PUBLIC_CULQI_PUBLIC_KEY="pk_test_..."
   CULQI_SECRET_KEY="sk_test_..."
   CULQI_WEBHOOK_SECRET="..."
   ```
4. En el panel de Culqi, registra el webhook:
   `https://sep.edu.pe/api/webhooks/culqi`

> El botón «Pagar con tarjeta» está en la interfaz pero deshabilitado hasta que
> existan las llaves. Yape cubre el 100 % del flujo mientras tanto.

### D.3 Probar el flujo completo en producción

1. Crea una cuenta de prueba
2. Inscríbete a Design Thinking
3. Marca las 6 sesiones
4. Pide el certificado SEP (S/30)
5. Yapea **S/1** a la cuenta real y sube esa captura
6. Desde tu cuenta admin, apruébalo
7. Descarga el PDF y verifica el código en `/verificar/...`

Si eso funciona, el sistema de pagos está en producción.

---

## PARTE E — Verificación final

### Seguridad

- [ ] Security Advisor de Supabase sin advertencias
- [ ] Ninguna tabla sin RLS
- [ ] `SUPABASE_SERVICE_ROLE_KEY` ausente del bundle del cliente (paso C.6)
- [ ] MFA activo en tu cuenta de super_admin
- [ ] Un usuario `estudiante` **no** puede abrir `/admin` (pruébalo)
- [ ] securityheaders.com da calificación **A** o superior

### Funcional

- [ ] Registro → correo de confirmación → panel correcto según el rol
- [ ] Inscripción a curso → marcar sesión → el progreso sube
- [ ] Completar curso → pedir certificado → QR → subir voucher
- [ ] Admin aprueba → certificado emitido → PDF descargable
- [ ] Verificación pública del certificado sin iniciar sesión
- [ ] Diagnóstico completo en los 3 perfiles
- [ ] Formularios de voluntariado, colegios y speakers llegan a `/admin`

### Contenido

- [ ] Cursos reales cargados con sus fechas y enlaces de Meet
- [ ] Precios revisados por el equipo (los marcados como «Propuesta»)
- [ ] Términos, privacidad y cookies revisados
- [ ] Banco de datos personales registrado ante la **ANPD**

### Correo

- [ ] SPF, DKIM y DMARC configurados en el dominio
- [ ] Los correos de confirmación llegan a la bandeja de entrada, no a spam

---

## Problemas frecuentes

| Síntoma | Causa y solución |
|---|---|
| `Invalid API key` | Copiaste la clave con un salto de línea. Vuelve a copiarla. |
| El registro no envía correo | Falta `RESEND_API_KEY`, o Supabase agotó su cuota gratuita de correos. |
| «Row level security policy» al guardar | Estás usando el cliente equivocado. Las escrituras de admin van por RPC. |
| El QR no aparece | `qrcode` se genera en el servidor: revisa que la página no sea `"use client"`. |
| Redirige a `/login` en bucle | El *Site URL* de Supabase no coincide con tu dominio real. |
| `supabase db push` falla | Ya aplicaste esa migración. Nunca edites una migración existente: crea una nueva. |
| Los tipos de TS no cuadran | Regenera: `supabase gen types typescript --linked > src/types/database.ts` |

---

## Costos reales

| Servicio | Al inicio | Con usuarios reales |
|---|---|---|
| Vercel | Hobby — $0 | Pro — $20/mes |
| Supabase | Free — $0 | Pro — $25/mes |
| Resend | Free (3.000 correos) — $0 | $20/mes |
| Dominio `.edu.pe` | ~$25/año | ~$25/año |
| Instituto Internacional de Ingeniería | — | $100/año |
| **Total mensual** | **≈ $2** | **≈ $67** |

Con S/1,520 de ganancia neta por cada 100 alumnos certificados
(proyección del deck), la plataforma se paga sola desde la primera cohorte.
