# Supabase paso a paso — de cero a la nube

> Guía literal: qué botón tocar, qué escribir en cada campo y cómo mover
> tu base de datos local a la nube.
>
> **Tiempo:** 25–30 minutos · **Costo:** S/ 0 (plan gratuito)

---

## Antes de empezar

Ten a la mano:

- [ ] Un correo (usa uno del equipo, no personal: `semilleroemprendedorperu@gmail.com`)
- [ ] Un gestor de contraseñas o un lugar seguro para guardar claves
- [ ] La terminal abierta en la carpeta del proyecto
- [ ] Docker Desktop **cerrado** (no hace falta para esta parte)

---

# PASO 1 — Crear la cuenta

1. Entra a **https://supabase.com**
2. Botón **Start your project** (arriba a la derecha)
3. Elige **Continue with GitHub**

> **¿Por qué GitHub y no correo?** Porque el repo ya está en
> `github.com/tamoil-0/Sep`. Con la misma cuenta, Supabase y Vercel se conectan
> solos y te ahorras una contraseña más.

4. GitHub te pide autorizar → **Authorize Supabase**

Ya estás dentro.

---

# PASO 2 — Crear la organización

La primera vez te pide crear una organización.

| Campo | Qué escribir |
|---|---|
| **Organization name** | `Semillero de Emprendedores Peru` |
| **Type of organization** | `Non-profit` |
| **Plan** | `Free — $0/month` |

> ⚠️ **Escribe el nombre sin tildes** (`Peru`, no `Perú`). Supabase lo usa para
> generar identificadores internos y las tildes a veces dan problemas.

Botón **Create organization**.

---

# PASO 3 — Crear el proyecto

Ahora la pantalla **New project**. Cada campo importa:

| Campo | Qué poner | Por qué |
|---|---|---|
| **Project name** | `sep-produccion` | Nombre interno, lo verás en el panel |
| **Database Password** | *(ver abajo)* | La contraseña maestra de Postgres |
| **Region** | **South America (São Paulo)** | La más cercana a Perú: ~40 ms. Si eliges Virginia, cada consulta tarda 3× más |
| **Security options** | Déjalo por defecto | |

### La contraseña de la base de datos

Botón **Generate a password** — Supabase crea una fuerte.

**Cópiala y guárdala AHORA.** No la vuelves a ver. Si la pierdes tendrás que
resetearla desde *Settings → Database*.

Guárdala así:

```
Supabase — sep-produccion
Password DB: ································
Creada: (fecha de hoy)
```

Botón **Create new project**.

> ⏳ Tarda **2–3 minutos** en aprovisionar. Verás una barra de progreso.
> No cierres la pestaña.

---

# PASO 4 — Copiar las 3 llaves

Cuando termine de crear el proyecto:

**Menú lateral → Project Settings (⚙️) → API**

Verás tres cosas. Cópialas a un archivo temporal:

| Qué copias | Se ve así | Para qué sirve |
|---|---|---|
| **Project URL** | `https://abcdefghijk.supabase.co` | La dirección de tu base de datos |
| **anon / public** | `eyJhbGciOiJIUzI1...` (largo) | La usa el navegador. RLS la controla |
| **service_role** | `eyJhbGciOiJIUzI1...` (largo) | 🔴 **Salta toda la seguridad** |

### 🔴 Sobre la `service_role`

Esta clave **ignora todas las políticas de seguridad**. Con ella cualquiera puede
leer, modificar y borrar toda la base de datos.

**Reglas:**
- Nunca la pegues en un chat, correo o captura de pantalla
- Nunca la subas a GitHub
- Nunca le pongas el prefijo `NEXT_PUBLIC_`
- Solo va en las variables de entorno de Vercel

La `anon` sí es pública: va en el navegador y RLS la mantiene a raya.

### El `project ref`

Es la parte del medio de tu Project URL:

```
https://abcdefghijk.supabase.co
        ^^^^^^^^^^^
        este es tu project ref
```

Anótalo, lo usas en el paso 5.

---

# PASO 5 — Conectar tu proyecto local con la nube

En la terminal, dentro de `sep-platform`:

### 5.1 Iniciar sesión

```bash
npx supabase@latest login
```

Se abre el navegador → **Authorize**. Vuelve a la terminal, ya está.

### 5.2 Enlazar

```bash
npx supabase@latest link --project-ref TU_PROJECT_REF
```

Te pide la **contraseña de la base de datos** (la del paso 3). Pégala.

> Al escribirla no verás nada — ni asteriscos. Es normal. Pega y dale Enter.

Si sale `Finished supabase link`, estás conectado.

---

# PASO 6 — Migrar el esquema

Aquí es donde tu base de datos local viaja a la nube.

```bash
npx supabase@latest db push
```

Verás la lista de las 10 migraciones y te pedirá confirmar. Escribe `Y` + Enter.

```
Applying migration 0001_extensions_enums.sql...
Applying migration 0002_core_tables.sql...
Applying migration 0003_programs_community.sql...
Applying migration 0004_diagnostic_growth.sql...
Applying migration 0005_functions_triggers.sql...
Applying migration 0006_rls_policies.sql...
Applying migration 0007_storage.sql...
Applying migration 0008_business_functions.sql...
Applying migration 0009_views_analytics.sql...
Applying migration 0010_grants.sql...
Finished supabase db push.
```

**Qué acabas de subir:** 40 tablas, todas con seguridad a nivel de fila,
las funciones de negocio (inscripciones, pagos, certificados, roles) y los
6 buckets de archivos.

### Verificar

```bash
npx supabase@latest migration list
```

Las 10 deben tener marca en las columnas **Local** y **Remote**.

---

# PASO 7 — Cargar los datos de referencia

Esto carga los cursos, las sesiones, los planes, los roles de voluntariado,
los aliados y las **45 preguntas del diagnóstico**.

1. En Supabase: **SQL Editor** (menú lateral) → **New query**
2. Abre `supabase/seed.sql` en tu editor
3. **Copia todo** el contenido (Ctrl+A, Ctrl+C)
4. Pégalo en el SQL Editor
5. Botón **Run** (o Ctrl+Enter)

Debe decir `Success. No rows returned`.

### ⚠️ Lo que NO debes ejecutar en producción

**`supabase/seeds/demo.sql`** — crea 15 usuarios falsos con la contraseña
`SepDemo2026!` escrita en el código. Es solo para tu computadora.

Si lo ejecutas por error:

```sql
select public.demo_reset();
```

---

# PASO 8 — Configurar el acceso de usuarios

**Authentication → URL Configuration**

| Campo | Qué poner |
|---|---|
| **Site URL** | `https://sep.vercel.app` *(o tu dominio cuando lo tengas)* |
| **Redirect URLs** | Añade estas tres, una por una: |

```
https://sep.vercel.app/**
https://*.vercel.app/**
http://localhost:3000/**
```

> **Si te saltas esto**, al confirmar el correo el usuario termina en
> `localhost` y no puede entrar. Es el error más común.

### Confirmación de correo

**Authentication → Providers → Email**

- ✅ **Enable email provider**
- ✅ **Confirm email** (obligatorio: evita cuentas con correos falsos)

### Doble factor para los admins

**Authentication → Multi-Factor**

- ✅ **TOTP (Authenticator app)**

La plataforma exige doble factor para entrar a `/admin`.

### Traducir los correos

**Authentication → Emails → Templates**

Cambia **Confirm signup** por esto:

```html
<h2>Confirma tu correo</h2>
<p>¡Bienvenid@ a SEP! Haz clic para activar tu cuenta:</p>
<p><a href="{{ .ConfirmationURL }}">Confirmar mi correo</a></p>
<p style="color:#6E6A85;font-size:12px">
  Si no creaste esta cuenta, ignora este mensaje.
</p>
<p style="color:#6E6A85;font-size:12px">
  Semillero de Emprendedores Perú · ¡Emprende hoy, lidera mañana!
</p>
```

Repite con **Reset password** y **Magic Link**.

---

# PASO 9 — Revisar la seguridad

**Advisors → Security Advisor**

Debe salir **sin advertencias**.

Si aparece alguna tabla marcada como *RLS disabled*, **detente y avísame** —
significa que algo no se aplicó bien y la tabla quedaría abierta.

---

# PASO 10 — Crear tu cuenta de administrador

**No se crea desde el panel de Supabase.** Se hace así:

### 10.1 Regístrate como un usuario normal

Entra a tu web (o a `http://localhost:3000` apuntando a la nube) y crea tu
cuenta con tu **correo real**.

### 10.2 Confirma el correo

Revisa tu bandeja (y spam). Haz clic en el enlace.

### 10.3 Date el rol de super administrador

Supabase → **SQL Editor** → nueva consulta:

```sql
insert into user_roles (user_id, role)
select id, 'super_admin'
from profiles
where email = 'TU-CORREO-REAL@ejemplo.com';
```

Cambia el correo por el tuyo. **Run**.

### 10.4 Vuelve a entrar

Cierra sesión y entra de nuevo. Ya verás `/admin` en tu menú.

> **A partir de aquí no vuelvas a tocar la tabla a mano.** Todos los demás roles
> se otorgan desde `/admin/usuarios`, y ahí quedan registrados en el log de
> auditoría con quién los dio y cuándo.

---

# PASO 11 — Conectar tu app local a la nube (opcional)

Si quieres probar contra la base de datos real antes de desplegar, edita
`.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://TU-REF.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu anon key"
SUPABASE_SERVICE_ROLE_KEY="tu service_role key"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

```bash
npm run dev
```

> Para volver a local, `npx supabase@latest status` te reimprime las claves
> locales.

### Regenerar los tipos de TypeScript

```bash
npx supabase@latest gen types typescript --linked > src/types/database.ts
```

Reemplaza el archivo escrito a mano por uno generado desde tu esquema real.

---

# Qué hacer cuando cambies la base de datos

**Nunca edites una migración que ya subiste.** Siempre creas una nueva:

```bash
npx supabase@latest migration new nombre_del_cambio
# escribes el SQL en el archivo que te crea
npx supabase@latest db reset      # lo pruebas en local
npx supabase@latest db push       # lo subes
```

---

# Problemas frecuentes

| Síntoma | Causa y solución |
|---|---|
| `failed SASL auth` al hacer `link` | La contraseña de la BD está mal. Resetéala en *Settings → Database → Reset database password* |
| `password authentication failed` | Igual que arriba |
| El registro no envía correo | Supabase gratuito da ~4 correos/hora. Para producción conecta Resend en *Settings → Auth → SMTP* |
| Al confirmar el correo va a `localhost` | Falta configurar *Site URL* (paso 8) |
| `permission denied for table X` | No se aplicó la migración `0010_grants.sql`. Corre `db push` otra vez |
| `relation already exists` en `db push` | Esa migración ya se aplicó. Revisa con `migration list` |
| El proyecto se pausó solo | El plan gratuito pausa proyectos tras 7 días sin uso. Botón **Restore** en el panel |
| No veo `/admin` | ¿Cerraste sesión y volviste a entrar después del paso 10.3? |

---

# Límites del plan gratuito

| Recurso | Free | Cuándo te queda corto |
|---|---|---|
| Base de datos | 500 MB | ~50.000 usuarios |
| Archivos | 1 GB | ~2.000 certificados PDF |
| Usuarios activos | 50.000/mes | Muy lejos |
| Correos | ~4/hora | **Esto se queda corto rápido** |
| Pausa automática | A los 7 días sin uso | Molesto en producción |
| Backups | ❌ | **Este es el motivo real para pagar** |

**Sube a Pro ($25/mes) antes de recibir usuarios reales.** No por el espacio,
sino por los backups diarios y la recuperación punto en el tiempo. Sin eso, un
error borra datos de gente real sin vuelta atrás.

---

# Lista de verificación

Antes de pasar al deploy en Vercel:

- [ ] Proyecto creado en la región de São Paulo
- [ ] Contraseña de la BD guardada en un lugar seguro
- [ ] Las 3 llaves copiadas (`URL`, `anon`, `service_role`)
- [ ] `migration list` muestra las 10 en Local y Remote
- [ ] `seed.sql` ejecutado (los cursos aparecen en *Table Editor → courses*)
- [ ] `demo.sql` **NO** ejecutado
- [ ] Site URL y Redirect URLs configuradas
- [ ] Confirmación de correo activada
- [ ] TOTP activado
- [ ] Security Advisor sin advertencias
- [ ] Tu cuenta de super_admin creada y probada

---

**Siguiente paso:** el despliegue en Vercel está en
[`PUESTA-EN-MARCHA.md`](./PUESTA-EN-MARCHA.md) parte C.
