CREATE OR REPLACE FUNCTION public.accept_invitation(invite_code UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_invite RECORD;
  v_account_id UUID;
  v_role TEXT;
  v_user_data JSONB;
BEGIN
  -- Get the current user's ID
  v_user_id := auth.uid();

  -- Check if the user is authenticated
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'You must be logged in to accept an invite';
  END IF;

  -- Fetch the invitation
  SELECT * INTO v_invite
  FROM invitations
  WHERE id = invite_code AND email = (SELECT email FROM auth.users WHERE id = v_user_id);

  -- Check if the invitation exists
  IF v_invite IS NULL THEN
    RAISE EXCEPTION 'Invite not found';
  END IF;

  -- Check if the invitation has already been accepted
  IF v_invite.accepted_at IS NOT NULL THEN
    RAISE EXCEPTION 'Invite already accepted';
  END IF;

  -- Store the account_id and role
  v_account_id := v_invite.account_id;
  v_role := v_invite.role;

  -- Check if the user is already a member of the account
  IF EXISTS (SELECT 1 FROM account_users WHERE account_id = v_account_id AND user_id = v_user_id) THEN
    RAISE EXCEPTION 'You are already a member of this workspace';
  END IF;

  -- Add user to account
  INSERT INTO account_users (user_id, account_id, role)
  VALUES (v_user_id, v_account_id, v_role);

  -- Set current account for the user in the users table
  UPDATE users
  SET account_id = v_account_id
  WHERE id = v_user_id
  RETURNING jsonb_build_object(
    'id', id,
    'account_id', account_id
  ) INTO v_user_data;

  -- Set invite to accepted
  UPDATE invitations
  SET accepted_at = NOW()
  WHERE id = invite_code;

  -- Return success message and user data
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Invitation accepted successfully',
    'user_data', v_user_data
  );
END;
$$;
