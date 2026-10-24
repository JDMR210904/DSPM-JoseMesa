-- Ejecutar en Supabase -> SQL Editor

-- 1. Tabla de tareas
create table if not exists tareas (
  id bigint generated always as identity primary key,
  titulo text not null,
  completada boolean default false,
  user_id uuid references auth.users default auth.uid(),
  created_at timestamptz default now()
);

-- 2. RLS: cada usuario solo ve y modifica SUS tareas
alter table tareas enable row level security;

create policy "ver mis tareas" on tareas
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "crear mis tareas" on tareas
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "editar mis tareas" on tareas
  for update to authenticated using ((select auth.uid()) = user_id);
create policy "borrar mis tareas" on tareas
  for delete to authenticated using ((select auth.uid()) = user_id);

-- 3. Realtime para la lista en vivo
alter publication supabase_realtime add table tareas;

-- 4. Bucket de avatares (público para poder mostrar la imagen con su URL)
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- 5. Políticas de Storage: cada usuario solo escribe en su carpeta (<user_id>/...)
create policy "subir a mi carpeta" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "reemplazar mis archivos" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "eliminar mis archivos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
