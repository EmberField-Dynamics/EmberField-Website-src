-- Emberfield Dynamics: auth schema
-- Run this once in Supabase Dashboard -> SQL Editor
--
-- Profiles link to Supabase auth.users. Role is 'member' by default;
-- the configured admin email gets 'admin'.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique not null,
  full_name text not null default '',
  avatar_url text default null,
  role text not null default 'member' check (role in ('member', 'staff', 'admin', 'banned')),
  password_set boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Auto-create a profile row on signup. Seed role from the admin email.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role, password_set)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''),
    new.raw_user_meta_data ->> 'avatar_url',
    case when new.email = 'mcminedime@gmail.com' then 'admin' else 'member' end,
    case
      when new.raw_user_meta_data ->> 'password_set' = 'true' then true
      when coalesce(new.raw_app_meta_data ->> 'provider', 'email') = 'google' then false
      else true
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Prevent multiple accounts with the same email (case-insensitive).
-- Blocks signup for an email that already exists on an active account,
-- regardless of provider (email/password, Google, etc.).
create or replace function public.prevent_duplicate_email()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  has_deleted_at boolean;
  email_taken boolean;
begin
  select count(*) > 0
    into has_deleted_at
    from information_schema.columns
   where table_schema = 'auth'
     and table_name = 'users'
     and column_name = 'deleted_at';

  if has_deleted_at then
    select exists (
      select 1 from auth.users u
       where lower(u.email) = lower(new.email)
         and u.id <> new.id
         and u.deleted_at is null
    ) into email_taken;
  else
    select exists (
      select 1 from auth.users u
       where lower(u.email) = lower(new.email)
         and u.id <> new.id
    ) into email_taken;
  end if;

  if email_taken then
    raise exception 'An account with this email already exists.';
  end if;

  return new;
end;
$$;

create trigger on_auth_user_before_insert
  before insert on auth.users
  for each row execute procedure public.prevent_duplicate_email();

-- Helpers: current user id, role checks
create or replace function public.current_profile_id()
returns uuid
language sql stable security definer set search_path = public
as $$
  select auth.uid()
$$;

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  )
$$;

-- RLS policies
-- Users can read/update their own profile.
create policy "users read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "users update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

-- Admins can read and update everyone.
create policy "admins read all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "admins update all profiles"
  on public.profiles for update
  using (public.is_admin());

-- Grant access to the anon role (required for RLS-guarded table access).
grant select, update on public.profiles to anon, authenticated, service_role;

-- Avatar storage bucket
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "public read avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "authenticated upload avatars"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

create policy "authenticated update avatars"
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.role() = 'authenticated');

create policy "authenticated delete avatars"
  on storage.objects for delete
  using (bucket_id = 'avatars' and auth.role() = 'authenticated');

-- Emberfield Dynamics team content stays in its existing local context;
-- real registered users now live in auth.users + profiles.
--
-- ============================================================================
-- Checkout: promo codes + purchases
-- Run this block once in Supabase Dashboard -> SQL Editor (re-runnable).
-- ============================================================================

create table if not exists public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_percent integer not null default 10 check (discount_percent between 0 and 100),
  enabled boolean not null default true,
  max_uses integer,
  times_used integer not null default 0,
  expires_at timestamptz,
  note text,
  created_at timestamptz default now()
);

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  plan text not null check (plan in ('anticheat', 'servermode', 'discordbot')),
  full_name text not null default '',
  email text not null,
  note text,
  promo_code text,
  discount_percent integer not null default 0,
  base_price numeric not null default 0,
  total numeric not null default 0,
  status text not null default 'pending' check (status in ('pending', 'contacted', 'completed', 'cancelled')),
  created_at timestamptz default now()
);

alter table public.promo_codes enable row level security;
alter table public.purchases enable row level security;

-- Atomically claim one promo-code use. Returns false when invalid/exhausted.
create or replace function public.increment_promo_use(code_text text)
returns boolean
language plpgsql
security definer set search_path = public
as $$
declare
  row public.promo_codes%rowtype;
begin
  select * into row from public.promo_codes where code = upper(code_text) for update;
  if row.id is null then
    return false;
  end if;
  if row.enabled = false then
    return false;
  end if;
  if row.expires_at is not null and row.expires_at < now() then
    return false;
  end if;
  if row.max_uses is not null and row.times_used >= row.max_uses then
    return false;
  end if;
  update public.promo_codes set times_used = times_used + 1 where id = row.id;
  return true;
end;
$$;

-- Promo codes are public only when enabled (checkout validation).
create policy "public read enabled promo codes"
  on public.promo_codes for select
  using (enabled = true);

create policy "admins read all promo codes"
  on public.promo_codes for select
  using (public.is_admin());

create policy "admins insert promo codes"
  on public.promo_codes for insert
  with check (public.is_admin());

create policy "admins update promo codes"
  on public.promo_codes for update
  using (public.is_admin());

create policy "admins delete promo codes"
  on public.promo_codes for delete
  using (public.is_admin());

-- Anyone can place an order (guest checkout); reading is restricted.
create policy "public insert purchases"
  on public.purchases for insert
  with check (true);

create policy "users read own purchases"
  on public.purchases for select
  using (auth.uid() = user_id);

create policy "admins read all purchases"
  on public.purchases for select
  using (public.is_admin());

create policy "admins update purchases"
  on public.purchases for update
  using (public.is_admin());

grant select, insert on public.promo_codes to anon, authenticated, service_role;
grant select, insert, update on public.purchases to anon, authenticated, service_role;
grant execute on function public.increment_promo_use(text) to anon, authenticated, service_role;