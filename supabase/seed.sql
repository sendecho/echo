-- Clear auth.users first (this will cascade to public.users due to the trigger)
TRUNCATE auth.users CASCADE;

-- Then clear all other tables
TRUNCATE TABLE waitlist,
email_link_clicks,
email_opens,
outbound_emails,
analytics,
list_contacts,
lists,
contacts,
emails,
api_keys,
account_users,
users,
accounts,
invitations CASCADE;

-- Insert auth users (passwords are 'password123' - only for development!)
INSERT INTO
  auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data
  )
VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'admin@acme.com',
    crypt ('password123', gen_salt ('bf')),
    NOW (),
    jsonb_build_object ('full_name', 'Admin User', 'avatar_url', null)
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'member@acme.com',
    crypt ('password123', gen_salt ('bf')),
    NOW (),
    jsonb_build_object ('full_name', 'Member User', 'avatar_url', null)
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'owner@startup.io',
    crypt ('password123', gen_salt ('bf')),
    NOW (),
    jsonb_build_object ('full_name', 'Startup Owner', 'avatar_url', null)
  );

-- Insert test accounts
INSERT INTO
  accounts (
    id,
    name,
    domain,
    domain_verified,
    from_name,
    plan_name,
    subscription_status
  )
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Acme Corp',
    'acme.com',
    true,
    'Acme Team',
    'pro',
    'active'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Startup Inc',
    'startup.io',
    false,
    'Startup Team',
    'basic',
    'active'
  );

-- Insert test users
INSERT INTO
  users (id, email, full_name, account_id)
VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'admin@acme.com',
    'Admin User',
    '11111111-1111-1111-1111-111111111111'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'member@acme.com',
    'Member User',
    '11111111-1111-1111-1111-111111111111'
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'owner@startup.io',
    'Startup Owner',
    '22222222-2222-2222-2222-222222222222'
  );

-- Insert account_users relationships
INSERT INTO
  account_users (user_id, account_id, role)
VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    'owner'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '11111111-1111-1111-1111-111111111111',
    'member'
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '22222222-2222-2222-2222-222222222222',
    'owner'
  );

-- Insert API keys
INSERT INTO
  api_keys (account_id, name, key, first_chars)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Production API Key',
    crypt ('sk_test_acme123', gen_salt ('bf')),
    'sk_test_acme'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Development API Key',
    crypt ('sk_test_startup456', gen_salt ('bf')),
    'sk_test_star'
  );

-- Insert lists
INSERT INTO
  lists (
    id,
    account_id,
    name,
    description,
    unique_identifier
  )
VALUES
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    '11111111-1111-1111-1111-111111111111',
    'Newsletter',
    'Main newsletter list',
    'newsletter'
  ),
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    '11111111-1111-1111-1111-111111111111',
    'Customers',
    'Active customers',
    'customers'
  ),
  (
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    '22222222-2222-2222-2222-222222222222',
    'Beta Users',
    'Beta testing group',
    'beta-users'
  );

-- Insert contacts
INSERT INTO
  contacts (
    id,
    account_id,
    first_name,
    last_name,
    email,
    subscribed_at
  )
VALUES
  (
    '99999999-9999-9999-9999-999999999999',
    '11111111-1111-1111-1111-111111111111',
    'John',
    'Doe',
    'john@example.com',
    NOW ()
  ),
  (
    '88888888-8888-8888-8888-888888888888',
    '11111111-1111-1111-1111-111111111111',
    'Jane',
    'Smith',
    'jane@example.com',
    NOW ()
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    '22222222-2222-2222-2222-222222222222',
    'Bob',
    'Wilson',
    'bob@example.com',
    NOW ()
  );

-- Insert list_contacts relationships
INSERT INTO
  list_contacts (list_id, contact_id)
VALUES
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    '99999999-9999-9999-9999-999999999999'
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    '88888888-8888-8888-8888-888888888888'
  ),
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    '99999999-9999-9999-9999-999999999999'
  ),
  (
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    '77777777-7777-7777-7777-777777777777'
  );

-- Insert emails
INSERT INTO
  emails (
    id,
    account_id,
    subject,
    content,
    preview,
    from_name,
    from_email,
    sent_at
  )
VALUES
  (
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'Welcome to Acme',
    'Welcome to our newsletter!',
    'Welcome preview',
    'Acme Team',
    'news@acme.com',
    NOW () - INTERVAL '2 hours'
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    '22222222-2222-2222-2222-222222222222',
    'Beta Launch',
    'Join our beta program',
    'Beta preview',
    'Startup Team',
    'beta@startup.io',
    NULL
  );

-- Insert outbound_emails with tracking
INSERT INTO
  outbound_emails (id, contact_id, email_id, tracking_id, resend_id)
VALUES
  (
    '66666666-6666-6666-6666-666666666666',
    '99999999-9999-9999-9999-999999999999',
    '44444444-4444-4444-4444-444444444444',
    'aabbccdd-1111-2222-3333-444444444444',
    'resend_123'
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    '88888888-8888-8888-8888-888888888888',
    '44444444-4444-4444-4444-444444444444',
    'aabbccdd-5555-6666-7777-888888888888',
    'resend_456'
  );

-- Insert email tracking data
INSERT INTO
  email_opens (tracking_id, opened_at)
VALUES
  (
    'aabbccdd-1111-2222-3333-444444444444',
    NOW () - INTERVAL '1 hour'
  ),
  (
    'aabbccdd-5555-6666-7777-888888888888',
    NOW () - INTERVAL '30 minutes'
  );

INSERT INTO
  email_link_clicks (tracking_id, link_url, clicked_at)
VALUES
  (
    'aabbccdd-1111-2222-3333-444444444444',
    'https://example.com/offer',
    NOW () - INTERVAL '45 minutes'
  ),
  (
    'aabbccdd-5555-6666-7777-888888888888',
    'https://example.com/product',
    NOW () - INTERVAL '15 minutes'
  );

-- Insert analytics
INSERT INTO
  analytics (email_id, views, clicks)
VALUES
  ('44444444-4444-4444-4444-444444444444', 25, 10),
  ('55555555-5555-5555-5555-555555555555', 15, 5);

-- Insert waitlist entries
INSERT INTO
  waitlist (email)
VALUES
  ('waitlist1@example.com'),
  ('waitlist2@example.com');

-- Insert invitation examples
INSERT INTO
  invitations (account_id, email, role, invited_by)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'newuser@example.com',
    'member',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'newowner@example.com',
    'owner',
    'cccccccc-cccc-cccc-cccc-cccccccccccc'
  );