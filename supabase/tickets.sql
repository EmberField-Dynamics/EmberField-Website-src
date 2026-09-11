-- Emberfield Dynamics: support tickets + licenses + staff roles
-- Run statements in the Supabase Dashboard -> SQL Editor, ONE STATEMENT AT A TIME.
-- Numbered below so you can run 1, 2, 3, ... in order.

-- 1) Allow 'staff' role alongside member/admin/banned
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('member', 'staff', 'admin', 'banned'));

-- 2) Staff helper: true for staff & admin
create or replace function public.is_staff()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role in ('staff', 'admin')
  )
$$;

-- 3) Tickets
create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null check (category in ('general', 'technical', 'billing')),
  status text not null default 'open' check (status in ('open', 'closed')),
  created_by uuid not null references public.profiles (id) on delete cascade,
  assignee_id uuid default null references public.profiles (id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  closed_at timestamptz default null
);

alter table public.tickets enable row level security;

-- 4) Ticket messages (transcript)
create table if not exists public.ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  author_name text not null default '',
  body text not null,
  edited_at timestamptz default null,
  created_at timestamptz default now()
);

alter table public.ticket_messages enable row level security;

-- 5) RLS: tickets select (owner, assignee, staff)
create policy "tickets select"
  on public.tickets for select
  using (
    auth.uid() = created_by
    or auth.uid() = assignee_id
    or public.is_staff()
  );

-- 6) RLS: tickets insert (creator only)
create policy "tickets insert"
  on public.tickets for insert
  with check (auth.uid() = created_by);

-- 7) RLS: tickets update (owner or staff)
create policy "tickets update"
  on public.tickets for update
  using (auth.uid() = created_by or public.is_staff());

-- 8) RLS: tickets delete (staff only)
create policy "tickets delete"
  on public.tickets for delete
  using (public.is_staff());

-- 9) RLS: messages select (participant or staff)
create policy "messages select"
  on public.ticket_messages for select
  using (
    exists (
      select 1 from public.tickets t
      where t.id = ticket_id
        and (auth.uid() = t.created_by or auth.uid() = t.assignee_id or public.is_staff())
    )
  );

-- 10) RLS: messages insert (participant or staff)
create policy "messages insert"
  on public.ticket_messages for insert
  with check (
    exists (
      select 1 from public.tickets t
      where t.id = ticket_id
        and (auth.uid() = t.created_by or public.is_staff())
    )
  );

-- 11) RLS: messages update (author owns message)
create policy "messages update"
  on public.ticket_messages for update
  using (author_id = auth.uid());

-- 12) RLS: messages delete (staff, or author)
create policy "messages delete"
  on public.ticket_messages for delete
  using (author_id = auth.uid() or public.is_staff());

-- 13) Grant access
grant select, insert, update, delete on public.tickets to authenticated, service_role;
grant select, insert, update, delete on public.ticket_messages to authenticated, service_role;

-- 14) Licenses
create table if not exists public.licenses (
  id uuid primary key default gen_random_uuid(),
  license_key text unique not null,
  user_id uuid not null references public.profiles (id) on delete cascade,
  product text not null default 'EmberGuard',
  status text not null default 'active' check (status in ('active', 'expired', 'revoked')),
  expires_at timestamptz default null,
  created_at timestamptz default now()
);

alter table public.licenses enable row level security;

-- 15) Licenses RLS (owner reads own, staff reads all)
create policy "licenses select"
  on public.licenses for select
  using (auth.uid() = user_id or public.is_staff());

-- 16) Staff can insert/update/delete licenses
create policy "licenses admin insert"
  on public.licenses for insert
  with check (public.is_staff());

create policy "licenses admin update"
  on public.licenses for update
  using (public.is_staff());

create policy "licenses admin delete"
  on public.licenses for delete
  using (public.is_staff());

-- 17) Grant
grant select on public.licenses to authenticated, service_role;
grant insert, update, delete on public.licenses to authenticated, service_role;

-- 18) Staff can read all profiles (needed to resolve names across the app)
create policy "staff read all profiles"
  on public.profiles for select
  using (public.is_staff());

-- 19) Ensure messages carry a name snapshot (for existing databases)
alter table public.ticket_messages add column if not exists author_name text not null default '';