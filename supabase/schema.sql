-- ============================================
-- Mi Vida - Activity Tracker Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Categories table
create table categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  icon text not null default 'folder',
  color text not null default '#6366f1',
  is_preset boolean default false,
  fields jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- Activities table
create table activities (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  category_id uuid references categories(id) on delete cascade not null,
  title text not null,
  date date not null default current_date,
  date_end date,
  rating integer check (rating >= 1 and rating <= 5),
  notes text,
  fields jsonb default '{}'::jsonb,
  tags text[] default '{}',
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index idx_activities_user on activities(user_id);
create index idx_activities_category on activities(category_id);
create index idx_activities_date on activities(date desc);
create index idx_categories_user on categories(user_id);

-- Row Level Security
alter table categories enable row level security;
alter table activities enable row level security;

create policy "Users can view own categories"
  on categories for select using (auth.uid() = user_id);

create policy "Users can insert own categories"
  on categories for insert with check (auth.uid() = user_id);

create policy "Users can update own categories"
  on categories for update using (auth.uid() = user_id);

create policy "Users can delete own categories"
  on categories for delete using (auth.uid() = user_id);

create policy "Users can view own activities"
  on activities for select using (auth.uid() = user_id);

create policy "Users can insert own activities"
  on activities for insert with check (auth.uid() = user_id);

create policy "Users can update own activities"
  on activities for update using (auth.uid() = user_id);

create policy "Users can delete own activities"
  on activities for delete using (auth.uid() = user_id);

-- Function to auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger activities_updated_at
  before update on activities
  for each row execute function update_updated_at();

-- Function to seed preset categories for new users
create or replace function seed_preset_categories()
returns trigger as $$
begin
  insert into categories (user_id, name, icon, color, is_preset, fields) values
    (new.id, 'Libros', 'book-open', '#8b5cf6', true,
      '[{"key":"author","label":"Autor","type":"text"},{"key":"genre","label":"Genero","type":"text"},{"key":"pages","label":"Paginas","type":"number"}]'::jsonb),
    (new.id, 'Conciertos', 'music', '#ec4899', true,
      '[{"key":"artist","label":"Artista","type":"text"},{"key":"venue","label":"Lugar","type":"text"},{"key":"city","label":"Ciudad","type":"text"}]'::jsonb),
    (new.id, 'Viajes', 'plane', '#06b6d4', true,
      '[{"key":"destination","label":"Destino","type":"text"},{"key":"country","label":"Pais","type":"text"}]'::jsonb),
    (new.id, 'Peliculas', 'film', '#f59e0b', true,
      '[{"key":"director","label":"Director","type":"text"},{"key":"genre","label":"Genero","type":"text"},{"key":"year","label":"Ano","type":"number"}]'::jsonb),
    (new.id, 'Series', 'tv', '#10b981', true,
      '[{"key":"seasons","label":"Temporadas","type":"number"},{"key":"platform","label":"Plataforma","type":"text"},{"key":"genre","label":"Genero","type":"text"}]'::jsonb),
    (new.id, 'Restaurantes', 'utensils', '#f97316', true,
      '[{"key":"cuisine","label":"Tipo de cocina","type":"text"},{"key":"city","label":"Ciudad","type":"text"},{"key":"price_range","label":"Rango de precio","type":"text"}]'::jsonb);
  return new;
end;
$$ language plpgsql;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function seed_preset_categories();
