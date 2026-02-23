create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  username text unique not null,
  email text unique not null,
  gender text not null check (gender in ('male','female','other')),
  birthdate date not null,
  bio text,
  avatar_url text,
  preferences jsonb not null default '{"age_range": {"min": 18, "max": 50}, "distance": 25, "gender_preference": []}',
  location_lat numeric(10,8),
  location_lng numeric(11,8),
  last_active timestamptz not null default now(),
  is_verified boolean not null default false,
  is_online boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_users_username on public.users (username);
create index if not exists idx_users_email on public.users (email);

create table if not exists public.likes (
  id uuid primary key default uuid_generate_v4(),
  from_user_id uuid not null references public.users(id) on delete cascade,
  to_user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint likes_unique_pair unique (from_user_id, to_user_id)
);

create index if not exists idx_likes_from on public.likes (from_user_id);
create index if not exists idx_likes_to on public.likes (to_user_id);

create table if not exists public.matches (
  id uuid primary key default uuid_generate_v4(),
  user1_id uuid not null references public.users(id) on delete cascade,
  user2_id uuid not null references public.users(id) on delete cascade,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from pg_indexes where schemaname='public' and indexname='matches_unique_pair_idx'
  ) then
    execute 'create unique index matches_unique_pair_idx on public.matches ((least(user1_id,user2_id)), (greatest(user1_id,user2_id)))';
  end if;
end $$;

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (
    id,
    full_name,
    username,
    email,
    gender,
    birthdate,
    bio,
    avatar_url,
    preferences
  ) values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1), 'User'),
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1), 'user'),
    new.email,
    'other',
    current_date,
    '',
    null,
    '{"age_range": {"min": 18, "max": 50}, "distance": 25, "gender_preference": []}'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.update_last_active()
returns trigger as $$
begin
  update public.users set last_active = now(), updated_at = now() where id = new.from_user_id;
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_last_active_trigger on public.likes;
create trigger update_last_active_trigger after insert on public.likes for each row execute function public.update_last_active();

create or replace function public.create_match_on_reciprocal_like()
returns trigger as $$
declare
  u1 uuid;
  u2 uuid;
begin
  if exists (
    select 1 from public.likes l
    where l.from_user_id = new.to_user_id and l.to_user_id = new.from_user_id
  ) then
    u1 := least(new.from_user_id, new.to_user_id);
    u2 := greatest(new.from_user_id, new.to_user_id);
    insert into public.matches (user1_id, user2_id)
    values (u1, u2)
    on conflict do nothing;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists create_match_on_like_trigger on public.likes;
create trigger create_match_on_like_trigger after insert on public.likes for each row execute function public.create_match_on_reciprocal_like();

alter table public.users enable row level security;
alter table public.likes enable row level security;
alter table public.matches enable row level security;

drop policy if exists users_select_all on public.users;
create policy users_select_all on public.users for select using (auth.role() = 'service_role' or auth.role() = 'anon' or auth.role() = 'authenticated');

drop policy if exists users_update_self on public.users;
create policy users_update_self on public.users for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists likes_select_own_or_related on public.likes;
create policy likes_select_own_or_related on public.likes for select using (auth.uid() = from_user_id or auth.uid() = to_user_id);

drop policy if exists likes_insert_self on public.likes;
create policy likes_insert_self on public.likes for insert with check (auth.uid() = from_user_id);

drop policy if exists matches_select_participant on public.matches;
create policy matches_select_participant on public.matches for select using (auth.uid() = user1_id or auth.uid() = user2_id);

drop policy if exists matches_insert_service_only on public.matches;
create policy matches_insert_service_only on public.matches for insert to service_role with check (true);

do $$
begin
  if exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where p.proname = 'create_bucket' and n.nspname = 'storage'
  ) then
    perform storage.create_bucket('profile-photos', public => true);
  else
    if exists (
      select 1
      from information_schema.columns
      where table_schema = 'storage' and table_name = 'buckets' and column_name = 'name'
    ) then
      insert into storage.buckets (id, name, public)
      values ('profile-photos', 'profile-photos', true)
      on conflict (id) do nothing;
    else
      insert into storage.buckets (id, public)
      values ('profile-photos', true)
      on conflict (id) do nothing;
    end if;
  end if;
end $$;

drop policy if exists profile_photos_read on storage.objects;
create policy profile_photos_read on storage.objects for select using (bucket_id = 'profile-photos');

drop policy if exists profile_photos_insert_auth on storage.objects;
create policy profile_photos_insert_auth on storage.objects for insert to authenticated with check (bucket_id = 'profile-photos');

drop policy if exists profile_photos_update_auth on storage.objects;
create policy profile_photos_update_auth on storage.objects for update to authenticated using (bucket_id = 'profile-photos') with check (bucket_id = 'profile-photos');

drop policy if exists profile_photos_delete_auth on storage.objects;
create policy profile_photos_delete_auth on storage.objects for delete to authenticated using (bucket_id = 'profile-photos');
