# Guía de despliegue — Plataforma SEP

> Referencia operativa. El razonamiento completo está en
> [`PLAN-MAESTRO-SEP.md`](./PLAN-MAESTRO-SEP.md) §11.

---

## 0. Requisitos

| Herramienta | Versión |
|---|---|
| Node.js | ≥ 20 (probado en 22.17) |
| npm | ≥ 10 |
| Supabase CLI | última |
| Cuenta de GitHub, Vercel y Supabase | — |

```bash
npm i -g supabase
```

---

## 1. Supabase — base de datos

### 1.1 Crear el proyecto

1. `supabase.com` → **New project**
2. Región: **South America (São Paulo)** — la más cercana a Perú (~40 ms)
3. Guardar la contraseña de la base de datos en un gestor
4. Plan: **Free** en desarrollo → **Pro ($25/mes)** en producción
   (obligatorio: PITR y backups diarios)

### 1.2 Aplicar el esquema

```bash
supabase login
supabase link --project-ref <tu-project-ref>

# Aplica supabase/migrations/0001 … 0007
supabase db push

# Carga cursos, sesiones, planes, roles de voluntariado,
# aliados y las 45 preguntas del diagnóstico
supabase db seed

# Regenera los tipos (reemplaza el esqueleto escrito a mano)
supabase gen types typescript --linked > src/types/database.ts
```

### 1.3 Configurar Auth

**Authentication → URL Configuration**

| Campo | Valor |
|---|---|
| Site URL | `https://sep.edu.pe` |
| Redirect URLs | `https://sep.edu.pe/**`, `https://*-sep.vercel.app/**`, `http://localhost:3000/**` |

**Authentication → Providers**
- Email: activo, **Confirm email** obligatorio
- Google: activo (credenciales de Google Cloud Console)

**Authentication → Multi-Factor**
- TOTP: activo (obligatorio para `admin` y `super_admin`, §9.1)

**Authentication → Email Templates**
- Traducir las 5 plantillas al español con la marca SEP

### 1.4 Verificar la seguridad

```bash
supabase db lint
```

En el dashboard: **Advisors → Security Advisor** debe quedar **sin advertencias**.
Comprobar manualmente que **ninguna** tabla aparece sin RLS.

---

## 2. Vercel — aplicación web

### 2.1 Importar

1. Vercel → **Add New → Project** → importar el repo
2. Framework: Next.js (autodetectado)
3. Root Directory: `sep-platform`

### 2.2 Variables de entorno

| Variable | Production | Preview | Development |
|---|:-:|:-:|:-:|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ✅ | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | ✅ | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | ✅ | ✅ |
| `NEXT_PUBLIC_SITE_URL` | ✅ | ✅ | ✅ |
| `RESEND_API_KEY` | ✅ | — | — |
| `CULQI_SECRET_KEY` · `NEXT_PUBLIC_CULQI_PUBLIC_KEY` | ✅ | — | — |
| `CULQI_WEBHOOK_SECRET` | ✅ | — | — |
| `HCAPTCHA_SECRET` · `NEXT_PUBLIC_HCAPTCHA_SITEKEY` | ✅ | ✅ | ✅ |
| `CRON_SECRET` | ✅ | — | — |
| `SENTRY_DSN` | ✅ | — | — |

> **`SUPABASE_SERVICE_ROLE_KEY` nunca lleva el prefijo `NEXT_PUBLIC_`.**
> Comprobación tras el build:
> ```bash
> grep -r "$(echo $SUPABASE_SERVICE_ROLE_KEY | head -c 20)" .next/static/ && echo "FUGA" || echo "OK"
> ```

### 2.3 Dominio

1. **Settings → Domains** → añadir `sep.edu.pe` y `www.sep.edu.pe`
2. `www` → redirección 308 al apex
3. SSL automático

### 2.4 Cron

`vercel.json` ya declara los dos jobs. Vercel los detecta al desplegar.
Los handlers deben validar `CRON_SECRET`:

```ts
if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
  return new Response("Unauthorized", { status: 401 });
}
```

### 2.5 Protecciones

- **Deploy Protection** activo en Preview (evita indexar borradores)
- **Analytics** y **Speed Insights** activados

---

## 3. Flujo de trabajo

```
feature/*  →  Pull Request
             ├─ Vercel Preview
             └─ CI: lint + typecheck + build
          →  merge a main
             ├─ Deploy a producción
             └─ supabase db push
```

**Regla:** nunca se edita una migración ya aplicada. Siempre se crea una nueva.

---

## 4. Render — solo si hace falta

Render **no forma parte del MVP**. Se activa cuando aparezca alguna de estas
necesidades:

| Necesidad | ¿Vercel alcanza? | Solución |
|---|---|---|
| Recordatorios de sesión por email | ✅ | Vercel Cron |
| Generar 1 certificado PDF | ✅ | Route Handler |
| **Generar 200 certificados PDF en lote** | ❌ timeout | Render Worker |
| **Newsletter a 1,200+ suscriptores con reintentos** | ❌ riesgoso | Render Worker |
| **Reporte anual de impacto** | ❌ timeout | Render Cron |
| **Reprocesar imágenes de talleres** | ❌ CPU | Render Worker |

Configuración lista en [`worker/render.yaml`](../worker/render.yaml).
Patrón: la web encola en `job_queue`, el worker procesa con reintento exponencial.

---

## 5. Costos mensuales

| Servicio | MVP | Producción |
|---|---|---|
| Vercel | Hobby $0 | Pro $20 |
| Supabase | Free $0 | Pro $25 |
| Render | — | Starter $7 (solo si se activa) |
| Resend | Free $0 | Pro $20 |
| Dominio `.edu.pe` | ~$25/año | ~$25/año |
| Sentry | Free | Free |
| Instituto Internacional de Ingeniería | — | $100/año |
| **Total** | **≈ $2/mes** | **≈ $72–79/mes** |

---

## 6. Checklist previo al lanzamiento

### Seguridad
- [ ] Todas las tablas con RLS activo y política explícita
- [ ] Security Advisor de Supabase sin advertencias
- [ ] `SUPABASE_SERVICE_ROLE_KEY` ausente del bundle del cliente
- [ ] MFA obligatorio verificado para `/admin`
- [ ] Rate limiting probado en login y formularios públicos
- [ ] securityheaders.com → calificación **A+**
- [ ] Prueba manual de escalada de privilegios: un `estudiante` intentando
      `/admin` y `update user_roles` debe fallar en las 3 capas

### Funcional
- [ ] Registro → confirmación por email → onboarding → panel correcto por rol
- [ ] Inscripción a curso → marcar sesión → progreso recalculado
- [ ] Compra de certificado (sandbox Culqi + voucher Yape) → emisión → PDF
- [ ] Verificación pública de certificado end-to-end
- [ ] Formularios públicos (voluntariado, colegios, speakers, newsletter)
- [ ] Diagnóstico completo en los 3 perfiles

### Calidad
- [ ] Lighthouse ≥ 95 en las 4 categorías de la landing
- [ ] Navegación completa por teclado
- [ ] Responsive verificado en 360 px, 768 px y 1440 px

### Legal
- [ ] Términos, privacidad y cookies publicados y enlazados
- [ ] Banco de datos personales registrado ante la **ANPD** (Ley N.º 29733)
- [ ] SPF, DKIM y DMARC configurados en el dominio
- [ ] Consentimiento documentado para migrar los 1,200 suscriptores actuales

### Operación
- [ ] Backup manual verificado y restauración probada
- [ ] Sentry recibiendo errores
- [ ] Sitemap enviado a Google Search Console
