-- Orbita Z: clientes por usuario.
-- Comparte el proyecto de Supabase con Orbita, por eso las tablas llevan el prefijo oz_.

create table public.oz_clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  name text not null check (char_length(name) between 1 and 200),
  phone text not null default '',
  email text not null default '',
  company text not null default '',
  status text not null default 'potencial' check (status in ('activo', 'potencial', 'inactivo')),
  tags text[] not null default '{}',
  last_contact date,
  next_follow_up date,
  notes jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index oz_clients_user_id_idx on public.oz_clients (user_id);

alter table public.oz_clients enable row level security;

create policy "oz_clients: ver los propios"
  on public.oz_clients for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "oz_clients: crear los propios"
  on public.oz_clients for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "oz_clients: editar los propios"
  on public.oz_clients for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "oz_clients: borrar los propios"
  on public.oz_clients for delete
  to authenticated
  using ((select auth.uid()) = user_id);
