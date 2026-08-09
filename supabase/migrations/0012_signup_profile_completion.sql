-- SEP · 0012 — El registro ya completa el perfil antes de confirmar el correo

-- `handle_new_user` no especifica esta columna, por lo que los perfiles nuevos
-- quedan listos desde el registro y no repiten el formulario de onboarding.
alter table public.profiles
  alter column onboarding_done set default true;

-- Cuentas creadas con el flujo anterior que ya entregaron nombre y región no
-- deben volver a escribir la misma información al confirmar su correo.
update public.profiles
   set onboarding_done = true,
       updated_at = now()
 where onboarding_done = false
   and nullif(trim(full_name), '') is not null
   and nullif(trim(region), '') is not null;

