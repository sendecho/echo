create table accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domain text not null,
  domain_verified boolean default false,
  from_name text not null,
  street_address text,
  city text,
  state text,
  postal_code text,
  country text,
  created_at timestamp with time zone default now()
);

create table users (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  account_id uuid references accounts (id),
  created_at timestamp with time zone default now(),
  last_login timestamp with time zone
);

create table account_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users (id),
  account_id uuid references accounts (id),
  role text not null check (role in ('owner', 'member')),
  joined_at timestamp with time zone default now()
);

create table emails (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references accounts (id),
  subject text not null,
  content text not null,
  preview text,
  from_name text,
  from_email text,
  created_at timestamp with time zone default now(),
  sent_at timestamp with time zone
);

create table contacts (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references accounts (id),
  first_name text,
  last_name text,
  email text not null,
  phone_number text,
  address text,
  city text,
  state text,
  zip_code text,
  country text,
  source text, -- how the contact was added (e.g. "imported", "manual", "api", etc.)
  subscribed_at timestamp with time zone default now(), -- when the contact was subscribed
  verified_at timestamp with time zone, -- when the contact was verified
  unsubscribed_at timestamp with time zone, -- when the contact was unsubscribed
  imported_at timestamp with time zone, -- when the contact was imported
  created_at timestamp with time zone default now()
);

create table outbound_emails (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references contacts (id),
  email_id uuid references emails (id),
  sent_at timestamp with time zone default now()
);

create table analytics (
  id uuid primary key default gen_random_uuid(),
  email_id uuid references emails (id),
  views int default 0,
  clicks int default 0,
  created_at timestamp with time zone default now()
);

create table lists (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references accounts (id),
  name text not null,
  description text,
  unique_identifier text unique,
  created_at timestamp with time zone default now()
);

create table list_contacts (
  id uuid primary key default gen_random_uuid(),
  list_id uuid references lists (id),
  contact_id uuid references contacts (id),
  created_at timestamp with time zone default now(),
  unique (list_id, contact_id)
);

CREATE TABLE waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamp with time zone default now()
);

-- Create account and account_users for the initial user
create or replace function create_account_and_link_user(
  name text,
  domain text,
  from_name text,
  user_id uuid
) returns uuid as $$
declare
  new_account_id uuid;
begin
  -- Insert into accounts
  insert into accounts (name, domain, from_name)
  values (name, domain, from_name)
  returning id into new_account_id;

  -- Insert into account_users
  insert into account_users (user_id, account_id, role)
  values (user_id, new_account_id, 'owner');

  -- Update the user with the new account_id
  update users
  set account_id = new_account_id
  where id = user_id;

  return new_account_id;
end;
$$ language plpgsql security definer;

-- Grant execute permission to authenticated users
grant execute on function create_account_and_link_user to authenticated;

CREATE OR REPLACE FUNCTION public.get_accounts_for_authenticated_user() 
RETURNS SETOF uuid
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT account_id
  FROM account_users
  WHERE user_id = auth.uid()
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_accounts_for_authenticated_user() TO authenticated;

-- Secure the tables
alter table public.users enable row level security;
alter table public.accounts enable row level security;
alter table public.account_users enable row level security;
alter table public.emails enable row level security;
alter table public.contacts enable row level security;
alter table public.outbound_emails enable row level security;
alter table public.analytics enable row level security;
alter table public.lists enable row level security;
alter table public.list_contacts enable row level security;
alter table public.waitlist enable row level security;


-- RLS Policies for users
create policy "Allow logged-in read access" on public.users
  for select using (auth.role() = 'authenticated');
create policy "Allow individual insert access" on public.users
  for insert with check ((select auth.uid()) = id);
create policy "Allow individual update access" on public.users
  for update using ( (select auth.uid()) = id );

-- RLS Policies for accounts
CREATE POLICY "Users can view their own account" ON public.accounts
  FOR SELECT USING (id IN (SELECT public.get_accounts_for_authenticated_user()));

CREATE POLICY "Account owners can update their account" ON public.accounts
  FOR UPDATE USING (
    id IN (SELECT public.get_accounts_for_authenticated_user()));

-- RLS Policies for emails
CREATE POLICY "Users can view emails in their account" ON public.emails
  FOR SELECT USING (account_id IN (SELECT public.get_accounts_for_authenticated_user()));

CREATE POLICY "Users can insert emails in their account" ON public.emails
  FOR INSERT WITH CHECK (account_id IN (SELECT public.get_accounts_for_authenticated_user()));

CREATE POLICY "Users can update emails in their account" ON public.emails
  FOR UPDATE USING (account_id IN (SELECT public.get_accounts_for_authenticated_user()));

-- RLS Policies for contacts
CREATE POLICY "Users can view contacts in their account" ON public.contacts
  FOR SELECT USING (account_id IN (SELECT public.get_accounts_for_authenticated_user()));

CREATE POLICY "Users can insert contacts in their account" ON public.contacts
  FOR INSERT WITH CHECK (account_id IN (SELECT public.get_accounts_for_authenticated_user()));

CREATE POLICY "Users can update contacts in their account" ON public.contacts
  FOR UPDATE USING (account_id IN (SELECT public.get_accounts_for_authenticated_user()));

-- RLS Policies for lists
CREATE POLICY "Users can view lists in their account" ON public.lists
  FOR SELECT USING (account_id IN (SELECT public.get_accounts_for_authenticated_user()));

CREATE POLICY "Users can insert lists in their account" ON public.lists
  FOR INSERT WITH CHECK (account_id IN (SELECT public.get_accounts_for_authenticated_user()));

CREATE POLICY "Users can update lists in their account" ON public.lists
  FOR UPDATE USING (account_id IN (SELECT public.get_accounts_for_authenticated_user()));

-- RLS Policies for outbound_emails
CREATE POLICY "Users can view outbound_emails in their account" ON public.outbound_emails
  FOR SELECT USING (
    email_id IN (
      SELECT id FROM public.emails 
      WHERE account_id IN (SELECT public.get_accounts_for_authenticated_user())
    )
  );

CREATE POLICY "Users can insert outbound_emails in their account" ON public.outbound_emails
  FOR INSERT WITH CHECK (
    email_id IN (
      SELECT id FROM public.emails 
      WHERE account_id IN (SELECT public.get_accounts_for_authenticated_user())
    )
  );

-- RLS Policies for analytics
CREATE POLICY "Users can view analytics for their emails" ON public.analytics
  FOR SELECT USING (
    email_id IN (
      SELECT id FROM public.emails 
      WHERE account_id IN (SELECT public.get_accounts_for_authenticated_user())
    )
  );

-- RLS Policies for list_contacts
CREATE POLICY "Users can view list_contacts in their account" ON public.list_contacts
  FOR SELECT USING (
    list_id IN (
      SELECT id FROM public.lists 
      WHERE account_id IN (SELECT public.get_accounts_for_authenticated_user())
    )
  );

CREATE POLICY "Users can insert list_contacts in their account" ON public.list_contacts
  FOR INSERT WITH CHECK (
    list_id IN (
      SELECT id FROM public.lists 
      WHERE account_id IN (SELECT public.get_accounts_for_authenticated_user())
    )
  );

-- RLS Policies for waitlist (assuming this is public)
create policy "Anyone can insert into waitlist" on public.waitlist
  for insert with check (true);

create policy "Only admins can view waitlist" on public.waitlist
  for select using (auth.jwt() ->> 'role' = 'admin');


-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user()
returns trigger
as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Storage!
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage#policy-examples for more details.
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');


  -- Set up Storage!
insert into storage.buckets (id, name)
  values ('images', 'images');

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage#policy-examples for more details.
create policy "Email images are publicly accessible." on storage.objects
  for select using (bucket_id = 'images');

create policy "Anyone can upload an image." on storage.objects
  for insert with check (bucket_id = 'images');