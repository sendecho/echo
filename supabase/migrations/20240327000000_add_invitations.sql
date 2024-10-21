-- Create invitations table
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'member')),
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE
);

-- RLS policies for invitations
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Policy to allow account owners to create invitations
CREATE POLICY "Account owners can create invitations" ON invitations
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = invitations.account_id
        AND account_users.user_id = auth.uid()
        AND account_users.role = 'owner'
    )
  );

-- Policy to allow account owners and members to read invitations
CREATE POLICY "Account owners and members can read invitations" ON invitations
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = invitations.account_id
        AND account_users.user_id = auth.uid()
    )
  );

-- Policy to allow users to view their own invitations
CREATE POLICY "Users can view their own invitations" ON invitations
  FOR SELECT TO authenticated
  USING (email = auth.jwt()->>'email');

-- Policy to allow account owners to delete invitations
CREATE POLICY "Account owners can delete invitations" ON invitations
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = invitations.account_id
        AND account_users.user_id = auth.uid()
        AND account_users.role = 'owner'
    )
  );

-- Function to handle invitation acceptance
CREATE OR REPLACE FUNCTION accept_invitation(invite_id UUID, user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_account_id UUID;
  v_role TEXT;
BEGIN
  -- Get the account_id and role from the invitation
  SELECT account_id, role INTO v_account_id, v_role
  FROM invitations
  WHERE id = invite_id AND accepted_at IS NULL;

  -- If invitation exists and hasn't been accepted
  IF FOUND THEN
    -- Add the user to the account
    INSERT INTO account_users (account_id, user_id, role)
    VALUES (v_account_id, user_id, v_role);

    -- Mark the invitation as accepted
    UPDATE invitations
    SET accepted_at = NOW()
    WHERE id = invite_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
