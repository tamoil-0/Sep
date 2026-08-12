# Plantillas de correo SEP

En un proyecto alojado en Supabase, abre **Authentication → Emails → Templates**.
Entra a cada opción, reemplaza todo el contenido de la plantilla por el archivo
indicado y configura el asunto correspondiente.

| Opción de Supabase | Archivo para copiar | Asunto |
|---|---|---|
| Confirm sign up | `confirmation.html` | `Confirma tu correo y empieza en SEP` |
| Invite user | `invite.html` | `Te invitaron a formar parte de SEP` |
| Magic link or OTP | `magic-link.html` | `Tu acceso seguro a SEP` |
| Change email address | `email-change.html` | `Confirma tu nuevo correo · SEP` |
| Reset password | `recovery.html` | `Crea una nueva contraseña · SEP` |
| Reauthentication | `reauthentication.html` | `{{ .Token }} es tu código de seguridad SEP` |
| Password changed (Security) | `password-changed.html` | `Tu contraseña de SEP fue actualizada` |

Guarda cada plantilla antes de abrir la siguiente. Luego revisa en
**Authentication → URL Configuration** que `Site URL` sea el dominio público
de SEP, porque el logo y todos los enlaces se construyen a partir de esa URL.

Los correos que ya fueron enviados no cambian. Para comprobar el diseño hay
que solicitar uno nuevo después de guardar la plantilla en Supabase.
