-- Allow authenticated users to select invitations that match their email
CREATE POLICY "Users can view their own invitations" ON invitations FOR
SELECT
  TO authenticated USING (email = auth.jwt () - > > 'email');