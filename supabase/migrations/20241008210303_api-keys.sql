-- Create API keys table
create table api_keys (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references accounts (id),
  name text not null,
  key text unique not null,
  first_chars text not null,
  created_at timestamp with time zone default now(),
  last_used_at timestamp with time zone
);

-- Enable RLS for api_keys table
alter table public.api_keys enable row level security;

-- RLS Policies for api_keys
CREATE POLICY "Users can view API keys in their account" ON public.api_keys
  FOR SELECT USING (account_id IN (SELECT public.get_accounts_for_authenticated_user()));

CREATE POLICY "Users can insert API keys in their account" ON public.api_keys
  FOR INSERT WITH CHECK (account_id IN (SELECT public.get_accounts_for_authenticated_user()));

CREATE POLICY "Users can delete API keys in their account" ON public.api_keys
  FOR DELETE USING (account_id IN (SELECT public.get_accounts_for_authenticated_user()));

-- Function to hash API key
CREATE OR REPLACE FUNCTION hash_api_key(api_key text)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT crypt(api_key, gen_salt('bf', 8));  -- Using 8 rounds for compatibility
$$;

-- Replace the existing authenticate_api_key function with this updated version
CREATE OR REPLACE FUNCTION authenticate_api_key(api_key text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  account_id uuid;
BEGIN
  SELECT api_keys.account_id INTO account_id
  FROM api_keys
  WHERE api_keys.key = crypt(api_key, api_keys.key);
  
  IF account_id IS NOT NULL THEN
    -- Perform the update in a separate transaction
    PERFORM pg_advisory_xact_lock(hashtext('update_api_key_last_used_at'::text));
    UPDATE api_keys SET last_used_at = now() WHERE key = crypt(api_key, key);
  END IF;
  
  RETURN account_id;
END;
$$;


-- Allow selecting contacts using API key
CREATE POLICY "Allow contact selection with API key" ON public.contacts
  FOR SELECT USING (
    account_id = authenticate_api_key(current_setting('request.headers')::json->>'x-api-key')
  );

-- Allow inserting contacts using API key
CREATE POLICY "Allow contact insertion with API key" ON public.contacts
  FOR INSERT WITH CHECK (
    account_id = authenticate_api_key(current_setting('request.headers')::json->>'x-api-key')
  );
  
-- Create select policy for list_contacts using API key
CREATE POLICY "Allow list_contacts selection with API key" ON public.list_contacts
  FOR SELECT USING (
    list_id IN (
      SELECT lists.id
      FROM lists
      WHERE lists.account_id = (
        SELECT authenticate_api_key(current_setting('request.headers', true)::json->>'x-api-key')
      )
    )
  );
-- Create policy for inserting list_contacts using API key
CREATE POLICY "Allow list_contacts insert with API key" ON public.list_contacts
  FOR INSERT WITH CHECK (
    list_id IN (
      SELECT lists.id
      FROM lists
      WHERE lists.account_id = (
        SELECT authenticate_api_key(current_setting('request.headers', true)::json->>'x-api-key')
      )
    )
  );