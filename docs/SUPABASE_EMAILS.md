# Correos de autenticación SEP

Las plantillas versionadas están en:

- `supabase/templates/confirmation.html`
- `supabase/templates/recovery.html`

`supabase/config.toml` las carga automáticamente en Supabase local después de
reiniciar los servicios.

## Proyecto alojado en Supabase

Supabase alojado no sincroniza las plantillas HTML del repositorio mediante una
migración SQL. Para publicar el diseño:

1. Abre **Authentication → Email Templates** en el Dashboard de Supabase.
2. En **Confirm signup**, usa el asunto `Confirma tu correo y empieza en SEP` y
   pega el contenido de `supabase/templates/confirmation.html`.
3. En **Reset password**, usa el asunto `Crea una nueva contraseña · SEP` y
   pega el contenido de `supabase/templates/recovery.html`.
4. Guarda ambos cambios y envía un correo de prueba a Gmail y Outlook.

Las plantillas usan `{{ .TokenHash }}`, `{{ .SiteURL }}` y `{{ .Email }}`,
variables oficiales de Supabase. El enlace llega a `/auth/confirm`, donde el
servidor verifica el token y crea la sesión. Esto permite abrir el mensaje en
un dispositivo diferente al utilizado durante el registro.

## URLs obligatorias

En **Authentication → URL Configuration** configura la URL pública como Site
URL y permite también:

```text
https://TU-DOMINIO/auth/callback
```

El valor de `NEXT_PUBLIC_SITE_URL` debe usar exactamente ese mismo dominio, sin
una barra final adicional.

En producción se recomienda SMTP propio con remitente visible como
`SEP · Semillero de Emprendedores Perú`. Desactiva el seguimiento de enlaces
del proveedor SMTP porque puede modificar los enlaces de confirmación.
