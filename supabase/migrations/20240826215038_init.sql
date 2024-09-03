create table accounts (
  id bigint primary key generated always as identity,
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
  account_id bigint references accounts (id),
  created_at timestamp with time zone default now(),
  last_login timestamp with time zone
);

create table user_accounts (
  id bigint primary key generated always as identity,
  user_id uuid references users (id),
  account_id bigint references accounts (id),
  role text not null check (role in ('owner', 'member')),
  joined_at timestamp with time zone default now()
);

create table emails (
  id bigint primary key generated always as identity,
  account_id bigint references accounts (id),
  subject text not null,
  content text not null,
  preview text,
  created_at timestamp with time zone default now(),
  sent_at timestamp with time zone
);

create table contacts (
  id bigint primary key generated always as identity,
  account_id bigint references accounts (id),
  first_name text,
  last_name text,
  email text unique not null,
  phone_number text,
  address text,
  city text,
  state text,
  zip_code text,
  country text,
  subscribed_at timestamp with time zone default now(),
  verified_at timestamp with time zone,
  unsubscribed_at timestamp with time zone,
  imported_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

create table outbound_emails (
  id bigint primary key generated always as identity,
  contact_id bigint references contacts (id),
  email_id bigint references emails (id),
  sent_at timestamp with time zone default now()
);

create table analytics (
  id bigint primary key generated always as identity,
  email_id bigint references emails (id),
  views int default 0,
  clicks int default 0,
  created_at timestamp with time zone default now()
);

create table lists (
  id bigint primary key generated always as identity,
  account_id bigint references accounts (id),
  name text not null,
  description text,
  unique_identifier text unique,
  created_at timestamp with time zone default now()
);

create table list_contacts (
  id bigint primary key generated always as identity,
  list_id bigint references lists (id),
  contact_id bigint references contacts (id),
  created_at timestamp with time zone default now(),
  unique (list_id, contact_id)
);

CREATE TABLE waitlist (
  id bigint primary key generated always as identity,
  email text unique not null,
  created_at timestamp with time zone default now()
);

-- Secure the tables
alter table public.users
  enable row level security;

create policy "Allow logged-in read access" on public.users
  for select using (auth.role() = 'authenticated');
create policy "Allow individual insert access" on public.users
  for insert with check ((select auth.uid()) = id);
create policy "Allow individual update access" on public.users
  for update using ( (select auth.uid()) = id );

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

-- alter table accounts enable row level security;

-- alter table users enable row level security;

-- alter table user_accounts enable row level security;

-- alter table emails enable row level security;

-- alter table contacts enable row level security;

-- alter table outbound_emails enable row level security;

-- alter table analytics enable row level security;

-- create policy select_account on accounts for
-- select
--   to public using (
--     exists (
--       select
--         1
--       from
--         user_accounts
--       where
--         user_accounts.account_id = accounts.id
--         and user_accounts.user_id = current_setting('request.jwt.claim.sub')::uuid
--     )
--   );

-- create policy select_user on users for
-- select
--   to public using (
--     id = current_setting('request.jwt.claim.sub')::uuid
--   );

-- create policy select_user_account on user_accounts for
-- select
--   to public using (
--     user_id = current_setting('request.jwt.claim.sub')::uuid
--   );

-- create policy select_email on emails for
-- select
--   to public using (
--     account_id in (
--       select
--         account_id
--       from
--         user_accounts
--       where
--         user_id = current_setting('request.jwt.claim.sub')::uuid
--     )
--   );

-- create policy select_contact on contacts for
-- select
--   to public using (
--     account_id in (
--       select
--         account_id
--       from
--         user_accounts
--       where
--         user_id = current_setting('request.jwt.claim.sub')::uuid
--     )
--   );

-- create policy select_outbound_email on outbound_emails for
-- select
--   to public using (
--     contact_id in (
--       select
--         id
--       from
--         contacts
--       where
--         account_id in (
--           select
--             account_id
--           from
--             user_accounts
--           where
--             user_id = current_setting('request.jwt.claim.sub')::uuid
--         )
--     )
--   );

-- create policy select_analytics on analytics for
-- select
--   to public using (
--     email_id in (
--       select
--         id
--       from
--         emails
--       where
--         account_id in (
--           select
--             account_id
--           from
--             user_accounts
--           where
--             user_id = current_setting('request.jwt.claim.sub')::uuid
--         )
--     )
--   );

-- drop policy if exists select_account on accounts;

-- drop policy if exists select_user on users;

-- drop policy if exists select_user_account on user_accounts;

-- drop policy if exists select_email on emails;

-- drop policy if exists select_contact on contacts;

-- drop policy if exists select_outbound_email on outbound_emails;

-- drop policy if exists select_analytics on analytics;

-- create
-- or replace function has_account_access (account_id bigint) returns boolean as $$
-- BEGIN
--     RETURN EXISTS (
--         SELECT 1 FROM user_accounts
--         WHERE user_accounts.account_id = account_id
--         AND user_accounts.user_id = current_setting('request.jwt.claim.sub')::uuid
--     );
-- END;
-- $$ language plpgsql;

-- create policy select_account on accounts for
-- select
--   to public using (has_account_access (id));

-- create policy select_user on users for
-- select
--   to public using (
--     id = current_setting('request.jwt.claim.sub')::uuid
--   );

-- create policy select_user_account on user_accounts for
-- select
--   to public using (
--     user_id = current_setting('request.jwt.claim.sub')::uuid
--   );

-- create policy select_email on emails for
-- select
--   to public using (has_account_access (account_id));

-- create policy select_contact on contacts for
-- select
--   to public using (has_account_access (account_id));

-- create policy select_outbound_email on outbound_emails for
-- select
--   to public using (
--     contact_id in (
--       select
--         id
--       from
--         contacts
--       where
--         has_account_access (account_id)
--     )
--   );

-- create policy select_analytics on analytics for
-- select
--   to public using (
--     email_id in (
--       select
--         id
--       from
--         emails
--       where
--         has_account_access (account_id)
--     )
--   );

-- create policy insert_account on accounts for insert to public
-- with
--   check (true);

-- create policy update_account on accounts
-- for update
--   to public using (has_account_access (id));

-- create policy delete_account on accounts for delete to public using (has_account_access (id));

-- create policy insert_user on users for insert to public
-- with
--   check (
--     id = current_setting('request.jwt.claim.sub')::uuid
--   );

-- create policy update_user on users
-- for update
--   to public using (
--     id = current_setting('request.jwt.claim.sub')::uuid
--   );

-- create policy delete_user on users for delete to public using (
--   id = current_setting('request.jwt.claim.sub')::uuid
-- );

-- create policy insert_user_account on user_accounts for insert to public
-- with
--   check (
--     user_id = current_setting('request.jwt.claim.sub')::uuid
--   );

-- create policy update_user_account on user_accounts
-- for update
--   to public using (
--     user_id = current_setting('request.jwt.claim.sub')::uuid
--   );

-- create policy delete_user_account on user_accounts for delete to public using (
--   user_id = current_setting('request.jwt.claim.sub')::uuid
-- );

-- create policy insert_email on emails for insert to public
-- with
--   check (has_account_access (account_id));

-- create policy update_email on emails
-- for update
--   to public using (has_account_access (account_id));

-- create policy delete_email on emails for delete to public using (has_account_access (account_id));

-- create policy insert_contact on contacts for insert to public
-- with
--   check (has_account_access (account_id));

-- create policy update_contact on contacts
-- for update
--   to public using (has_account_access (account_id));

-- create policy delete_contact on contacts for delete to public using (has_account_access (account_id));

-- create policy insert_outbound_email on outbound_emails for insert to public
-- with
--   check (
--     contact_id in (
--       select
--         id
--       from
--         contacts
--       where
--         has_account_access (account_id)
--     )
--   );

-- create policy update_outbound_email on outbound_emails
-- for update
--   to public using (
--     contact_id in (
--       select
--         id
--       from
--         contacts
--       where
--         has_account_access (account_id)
--     )
--   );

-- create policy delete_outbound_email on outbound_emails for delete to public using (
--   contact_id in (
--     select
--       id
--     from
--       contacts
--     where
--       has_account_access (account_id)
--   )
-- );

-- create policy insert_analytics on analytics for insert to public
-- with
--   check (
--     email_id in (
--       select
--         id
--       from
--         emails
--       where
--         has_account_access (account_id)
--     )
--   );

-- create policy update_analytics on analytics
-- for update
--   to public using (
--     email_id in (
--       select
--         id
--       from
--         emails
--       where
--         has_account_access (account_id)
--     )
--   );

-- create policy delete_analytics on analytics for delete to public using (
--   email_id in (
--     select
--       id
--     from
--     emails
--     where
--       has_account_access (account_id)
--   )
-- );

-- comment on policy insert_account on accounts is 'Allows all inserts, as account_id is not applicable.';

-- comment on policy update_account on accounts is 'Allows updates if the user has access to the account.';

-- comment on policy delete_account on accounts is 'Allows deletes if the user has access to the account.';

-- comment on policy insert_user on users is 'Allows insert for the user themselves.';

-- comment on policy update_user on users is 'Allows update for the user themselves.';

-- comment on policy delete_user on users is 'Allows delete for the user themselves.';

-- comment on policy insert_user_account on user_accounts is 'Allows insert for the user themselves.';

-- comment on policy update_user_account on user_accounts is 'Allows update for the user themselves.';

-- comment on policy delete_user_account on user_accounts is 'Allows delete for the user themselves.';

-- comment on policy insert_email on emails is 'Allows insert if the user has access to the associated account.';

-- comment on policy update_email on emails is 'Allows update if the user has access to the associated account.';

-- comment on policy delete_email on emails is 'Allows delete if the user has access to the associated account.';

-- comment on policy insert_contact on contacts is 'Allows insert if the user has access to the associated account.';

-- comment on policy update_contact on contacts is 'Allows update if the user has access to the associated account.';

-- comment on policy delete_contact on contacts is 'Allows delete if the user has access to the associated account.';

-- comment on policy insert_outbound_email on outbound_emails is 'Allows insert if the user has access to the associated account.';

-- comment on policy update_outbound_email on outbound_emails is 'Allows update if the user has access to the associated account.';

-- comment on policy delete_outbound_email on outbound_emails is 'Allows delete if the user has access to the associated account.';

-- comment on policy insert_analytics on analytics is 'Allows insert if the user has access to the associated account.';

-- comment on policy update_analytics on analytics is 'Allows update if the user has access to the associated account.';

-- comment on policy delete_analytics on analytics is 'Allows delete if the user has access to the associated account.';

-- create table auth_users (id uuid primary key, email text unique not null);

-- create
-- or replace function create_user_and_account () returns trigger as $$
-- DECLARE
--     new_account_id bigint;
-- BEGIN
--     -- Insert a new account
--     INSERT INTO accounts (name) VALUES ('New Account') RETURNING id INTO new_account_id;

--     -- Insert a new user
--     INSERT INTO users (id, email, created_at)
--     VALUES (NEW.id, NEW.email, now());

--     -- Insert into user_accounts with owner role
--     INSERT INTO user_accounts (user_id, account_id, role, joined_at)
--     VALUES (NEW.id, new_account_id, 'owner', now());

--     RETURN NEW;
-- END;
-- $$ language plpgsql;

-- create trigger after_auth_user_created
-- after insert on auth_users for each row
-- execute function create_user_and_account ();

-- drop trigger if exists after_auth_user_created on auth_users;

-- drop function if exists create_user_and_account;

-- alter table accounts
-- drop name;

-- create
-- or replace function create_user_and_account () returns trigger as $$
-- DECLARE
--     new_account_id bigint;
-- BEGIN
--     -- Insert a new account
--     INSERT INTO accounts DEFAULT VALUES RETURNING id INTO new_account_id;

--     -- Insert a new user
--     INSERT INTO users (id, email, created_at)
--     VALUES (NEW.id, NEW.email, now());

--     -- Insert into user_accounts with owner role
--     INSERT INTO user_accounts (user_id, account_id, role, joined_at)
--     VALUES (NEW.id, new_account_id, 'owner', now());

--     RETURN NEW;
-- END;
-- $$ language plpgsql;

-- create trigger after_auth_user_created
-- after insert on auth_users for each row
-- execute function create_user_and_account ();



-- alter table lists enable row level security;
-- alter table list_contacts enable row level security;

-- create policy select_list on lists for
-- select
--   to public using (has_account_access (account_id));

-- create policy insert_list on lists for insert to public
-- with
--   check (has_account_access (account_id));

-- create policy update_list on lists
-- for update
--   to public using (has_account_access (account_id));

-- create policy delete_list on lists for delete to public using (has_account_access (account_id));

-- create policy select_list_contact on list_contacts for
-- select
--   to public using (
--     list_id in (
--       select id from lists where has_account_access (account_id)
--     )
--   );

-- create policy insert_list_contact on list_contacts for insert to public
-- with
--   check (
--     list_id in (
--       select id from lists where has_account_access (account_id)
--     )
--   );

-- create policy delete_list_contact on list_contacts for delete to public using (
--   list_id in (
--     select id from lists where has_account_access (account_id)
--   )
-- );