-- ProtocolLink core schema — run in the Supabase SQL editor (or via `supabase db push`).
-- See PROTOCOL_LINK_PROJECT_SPEC.md section 8 for the source design.

-- ============================================================
-- Tables
-- ============================================================

create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  role text not null check (role in ('client', 'provider', 'admin')),
  full_name text,
  phone text,
  avatar_url text,
  company_name text,
  created_at timestamptz default now()
);

create table if not exists providers (
  id uuid primary key references profiles (id) on delete cascade,
  business_name text,
  bio text,
  years_experience int,
  verification_status text default 'pending' check (verification_status in ('pending', 'approved', 'rejected')),
  verified_at timestamptz,
  service_areas text[] default '{}',
  average_rating numeric(3, 2),
  total_reviews int default 0,
  is_featured boolean default false
);

create table if not exists provider_documents (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid references providers on delete cascade,
  document_type text not null check (document_type in ('cac', 'red_card', 'id', 'association', 'insurance')),
  file_path text not null,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_at timestamptz,
  reviewer_notes text,
  created_at timestamptz default now()
);

create table if not exists provider_team_members (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid references providers on delete cascade,
  full_name text not null,
  role_title text,
  phone text,
  email text,
  bio text,
  headshot_path text,
  created_at timestamptz default now()
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid references providers on delete cascade,
  title text not null,
  description text,
  service_type text not null,
  base_price numeric not null,
  currency text default 'NGN',
  duration_hours int,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references profiles on delete set null,
  provider_id uuid references providers on delete set null,
  service_id uuid references services on delete set null,
  status text default 'pending' check (
    status in ('pending', 'accepted', 'paid', 'in_progress', 'completed', 'cancelled', 'disputed')
  ),
  booking_date date not null,
  start_time time not null,
  end_time time,
  location text not null,
  flight_number text,
  passenger_count int default 1,
  special_requests text,
  total_amount numeric not null,
  platform_fee numeric not null default 0,
  provider_amount numeric not null default 0,
  paystack_reference text,
  created_at timestamptz default now(),
  completed_at timestamptz
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings on delete cascade,
  sender_id uuid references profiles on delete set null,
  content text not null,
  created_at timestamptz default now(),
  read_at timestamptz
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid unique references bookings on delete cascade,
  client_id uuid references profiles on delete set null,
  provider_id uuid references providers on delete set null,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

create table if not exists payouts (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid references providers on delete cascade,
  amount numeric not null,
  status text default 'pending' check (status in ('pending', 'processing', 'paid', 'failed')),
  paystack_transfer_code text,
  created_at timestamptz default now()
);

-- ============================================================
-- Auto-create a profile row when a new auth user signs up.
-- Expects role/full_name/phone in raw_user_meta_data (set at sign-up time).
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'role', 'client'),
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone'
  );

  if coalesce(new.raw_user_meta_data ->> 'role', 'client') = 'provider' then
    insert into public.providers (id) values (new.id);
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================

alter table profiles enable row level security;
alter table providers enable row level security;
alter table provider_documents enable row level security;
alter table provider_team_members enable row level security;
alter table services enable row level security;
alter table bookings enable row level security;
alter table messages enable row level security;
alter table reviews enable row level security;
alter table payouts enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- profiles: users read/update their own row; admins read all
create policy "profiles_select_own_or_admin" on profiles
  for select using (id = auth.uid() or is_admin());
create policy "profiles_update_own" on profiles
  for update using (id = auth.uid());

-- providers: public read for approved providers; owner + admin full read/write
create policy "providers_select_approved_or_owner" on providers
  for select using (verification_status = 'approved' or id = auth.uid() or is_admin());
create policy "providers_update_own_or_admin" on providers
  for update using (id = auth.uid() or is_admin());

-- provider_documents: owner + admin only
create policy "provider_documents_owner_or_admin" on provider_documents
  for all using (
    provider_id = auth.uid() or is_admin()
  ) with check (
    provider_id = auth.uid() or is_admin()
  );

-- provider_team_members: public read (shown on the public profile); owner + admin write
create policy "provider_team_members_select_all" on provider_team_members
  for select using (true);
create policy "provider_team_members_write_owner_or_admin" on provider_team_members
  for all using (
    provider_id = auth.uid() or is_admin()
  ) with check (
    provider_id = auth.uid() or is_admin()
  );

-- services: public read for active services; provider manages own
create policy "services_select_active_or_owner" on services
  for select using (is_active or provider_id = auth.uid() or is_admin());
create policy "services_write_owner" on services
  for insert with check (provider_id = auth.uid());
create policy "services_update_owner_or_admin" on services
  for update using (provider_id = auth.uid() or is_admin());
create policy "services_delete_owner_or_admin" on services
  for delete using (provider_id = auth.uid() or is_admin());

-- bookings: visible to the client, the provider involved, or admin
create policy "bookings_select_participant_or_admin" on bookings
  for select using (client_id = auth.uid() or provider_id = auth.uid() or is_admin());
create policy "bookings_insert_client" on bookings
  for insert with check (client_id = auth.uid());
create policy "bookings_update_participant_or_admin" on bookings
  for update using (client_id = auth.uid() or provider_id = auth.uid() or is_admin());

-- messages: only participants of the related booking
create policy "messages_select_participant" on messages
  for select using (
    exists (
      select 1 from bookings b
      where b.id = messages.booking_id
        and (b.client_id = auth.uid() or b.provider_id = auth.uid())
    ) or is_admin()
  );
create policy "messages_insert_participant" on messages
  for insert with check (
    sender_id = auth.uid()
    and exists (
      select 1 from bookings b
      where b.id = messages.booking_id
        and (b.client_id = auth.uid() or b.provider_id = auth.uid())
    )
  );

-- reviews: public read; only the booking's client can write
create policy "reviews_select_all" on reviews for select using (true);
create policy "reviews_insert_client" on reviews
  for insert with check (
    client_id = auth.uid()
    and exists (
      select 1 from bookings b
      where b.id = reviews.booking_id and b.client_id = auth.uid() and b.status = 'completed'
    )
  );

-- payouts: provider sees own, admin sees all
create policy "payouts_select_owner_or_admin" on payouts
  for select using (provider_id = auth.uid() or is_admin());

-- ============================================================
-- Storage: private bucket for provider verification documents.
-- Files are stored at `<provider_id>/<document_type>-<filename>`.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('provider-documents', 'provider-documents', false)
on conflict (id) do nothing;

create policy "provider_documents_storage_owner_rw" on storage.objects
  for all using (
    bucket_id = 'provider-documents'
    and (auth.uid() = (storage.foldername(name))[1]::uuid or is_admin())
  ) with check (
    bucket_id = 'provider-documents'
    and auth.uid() = (storage.foldername(name))[1]::uuid
  );

-- ============================================================
-- Storage: public bucket for team member headshots, shown on the
-- public provider profile. Files are stored at `<provider_id>/<filename>`.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('team-headshots', 'team-headshots', true)
on conflict (id) do nothing;

create policy "team_headshots_public_read" on storage.objects
  for select using (bucket_id = 'team-headshots');

create policy "team_headshots_owner_write" on storage.objects
  for insert with check (
    bucket_id = 'team-headshots'
    and auth.uid() = (storage.foldername(name))[1]::uuid
  );

create policy "team_headshots_owner_update_delete" on storage.objects
  for update using (
    bucket_id = 'team-headshots'
    and auth.uid() = (storage.foldername(name))[1]::uuid
  );

create policy "team_headshots_owner_delete" on storage.objects
  for delete using (
    bucket_id = 'team-headshots'
    and auth.uid() = (storage.foldername(name))[1]::uuid
  );
