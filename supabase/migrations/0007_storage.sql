-- ═══════════════════════════════════════════════════════════
-- SEP · 0007 — Buckets de Storage y sus políticas
-- Plan Maestro §8.5
-- ═══════════════════════════════════════════════════════════

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars',           'avatars',           true,  2097152,
     array['image/jpeg','image/png','image/webp','image/avif']),
  ('public-assets',     'public-assets',     true,  10485760,
     array['image/jpeg','image/png','image/webp','image/avif','image/svg+xml']),
  ('course-materials',  'course-materials',  false, 52428800, null),
  ('certificates',      'certificates',      false, 5242880,  array['application/pdf']),
  ('vouchers',          'vouchers',          false, 5242880,
     array['image/jpeg','image/png','image/webp','application/pdf']),
  ('institution-docs',  'institution-docs',  false, 20971520, null)
on conflict (id) do nothing;

-- ── avatars: público para leer, cada quien escribe el suyo ─
create policy "avatars_public_read" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "avatars_own_write" on storage.objects
  for insert with check (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars_own_update" on storage.objects
  for update using (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars_own_delete" on storage.objects
  for delete using (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ── public-assets: lectura pública, escritura solo admin ───
create policy "public_assets_read" on storage.objects
  for select using (bucket_id = 'public-assets');

create policy "public_assets_admin_write" on storage.objects
  for all using (bucket_id = 'public-assets' and public.is_admin())
  with check (bucket_id = 'public-assets' and public.is_admin());

-- ── course-materials: solo inscritos ───────────────────────
-- Ruta esperada: course-materials/{course_id}/{archivo}
create policy "course_materials_enrolled_read" on storage.objects
  for select using (
    bucket_id = 'course-materials'
    and (
      public.is_admin()
      or public.has_role('mentor')
      or exists (
        select 1 from public.enrollments e
        where e.user_id = auth.uid()
          and e.course_id::text = (storage.foldername(name))[1]
          and e.status in ('activo','completado')
      )
    )
  );

create policy "course_materials_admin_write" on storage.objects
  for all using (bucket_id = 'course-materials' and public.is_admin())
  with check (bucket_id = 'course-materials' and public.is_admin());

-- ── certificates: el dueño y el admin ──────────────────────
-- Ruta esperada: certificates/{user_id}/{certificate_id}.pdf
create policy "certificates_own_read" on storage.objects
  for select using (
    bucket_id = 'certificates'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  );

create policy "certificates_admin_write" on storage.objects
  for all using (bucket_id = 'certificates' and public.is_admin())
  with check (bucket_id = 'certificates' and public.is_admin());

-- ── vouchers: sube el dueño, lee solo el admin ─────────────
create policy "vouchers_own_upload" on storage.objects
  for insert with check (
    bucket_id = 'vouchers' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "vouchers_admin_read" on storage.objects
  for select using (
    bucket_id = 'vouchers'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  );

create policy "vouchers_admin_manage" on storage.objects
  for update using (bucket_id = 'vouchers' and public.is_admin());

-- ── institution-docs: la institución y el admin ────────────
create policy "institution_docs_read" on storage.objects
  for select using (
    bucket_id = 'institution-docs'
    and (
      public.is_admin()
      or (storage.foldername(name))[1] = public.my_institution_id()::text
    )
  );

create policy "institution_docs_write" on storage.objects
  for all using (
    bucket_id = 'institution-docs'
    and (
      public.is_admin()
      or (storage.foldername(name))[1] = public.my_institution_id()::text
    )
  )
  with check (
    bucket_id = 'institution-docs'
    and (
      public.is_admin()
      or (storage.foldername(name))[1] = public.my_institution_id()::text
    )
  );
