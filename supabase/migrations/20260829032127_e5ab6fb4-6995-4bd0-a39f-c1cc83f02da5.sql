create type public.app_role as enum ('admin','prestador');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  whatsapp text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles_select_own" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "user_roles_select_own" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'name')
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role)
  values (new.id, 'prestador')
  on conflict do nothing;
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  name text not null,
  slug text unique not null,
  category text not null,
  zone text not null,
  description text,
  whatsapp text not null,
  photo_url text,
  cover_url text,
  bid_amount numeric not null default 0,
  subdomain text unique,
  active boolean not null default false,
  views bigint not null default 0,
  clicks bigint not null default 0,
  created_at timestamptz not null default now()
);
create index properties_leaderboard_idx on public.properties (category, zone, active, bid_amount desc, created_at desc);
grant select, insert, update, delete on public.properties to authenticated;
grant select on public.properties to anon;
grant all on public.properties to service_role;
alter table public.properties enable row level security;
create policy "properties_public_read_active" on public.properties for select to anon, authenticated using (active = true);
create policy "properties_owner_read" on public.properties for select to authenticated using (auth.uid() = owner_id);
create policy "properties_admin_read" on public.properties for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "properties_owner_insert" on public.properties for insert to authenticated
  with check (auth.uid() = owner_id and active = false and bid_amount = 0 and subdomain is null);
create policy "properties_admin_all" on public.properties for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create or replace function public.protect_property_fields()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if public.has_role(auth.uid(),'admin') then
    return new;
  end if;
  new.bid_amount := old.bid_amount;
  new.subdomain := old.subdomain;
  new.active := old.active;
  new.owner_id := old.owner_id;
  new.views := old.views;
  new.clicks := old.clicks;
  return new;
end;
$$;
create trigger properties_protect before update on public.properties
for each row execute function public.protect_property_fields();

create policy "properties_owner_update" on public.properties for update to authenticated
  using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create table public.banners (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  category text,
  zone text,
  target_url text,
  position text not null default 'top',
  active boolean not null default false,
  created_at timestamptz not null default now()
);
grant select on public.banners to anon;
grant select, insert, update, delete on public.banners to authenticated;
grant all on public.banners to service_role;
alter table public.banners enable row level security;
create policy "banners_public_read_active" on public.banners for select to anon, authenticated using (active = true);
create policy "banners_admin_all" on public.banners for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create or replace function public.increment_views(_slug text)
returns void language sql security definer set search_path = public as $$
  update public.properties set views = views + 1 where slug = _slug and active = true;
$$;
create or replace function public.increment_clicks(_slug text)
returns void language sql security definer set search_path = public as $$
  update public.properties set clicks = clicks + 1 where slug = _slug and active = true;
$$;
grant execute on function public.increment_views(text) to anon, authenticated;
grant execute on function public.increment_clicks(text) to anon, authenticated;

insert into public.properties (name, slug, category, zone, description, whatsapp, photo_url, bid_amount, active) values
('Villa D2','villad2','hostal','vedado','Hostal boutique con piscina y desayuno incluido en el corazón del Vedado.','5351234567','https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=70',50,true),
('Casa Habana Vieja','casa-habana-vieja','hostal','habana-vieja','Habitaciones coloniales a dos cuadras del Malecón.','5351234568','https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=70',20,true),
('Hostal Centro Sol','hostal-centro-sol','hostal','centro','Céntrico, económico y con terraza.','5351234569','https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=70',0,true),
('Taxi Yoandry Clásico','taxi-yoandry','taxi','vedado','Almendrón descapotable para tours por La Habana.','5351234570','https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=70',35,true),
('Transfer Habana Airport','transfer-habana','taxi','centro','Traslados al aeropuerto 24 horas.','5351234571','https://images.unsplash.com/photo-1549194898-6c1e33e79e0c?w=800&q=70',0,true),
('Paladar La Guarida del Sabor','paladar-guarida','restaurante','centro','Cocina cubana de autor en azotea con vista.','5351234572','https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=70',40,true),
('Restaurante Mar y Ron','mar-y-ron','restaurante','vedado','Mariscos frescos y coctelería cubana.','5351234573','https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=70',0,true);