-- Add tracking_id column to outbound_emails table if it doesn't exist
ALTER TABLE outbound_emails ADD COLUMN IF NOT EXISTS tracking_id UUID unique;


-- Create the email_opens table
CREATE TABLE email_opens (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tracking_id UUID NOT NULL,
  opened_at TIMESTAMP WITH TIME ZONE NOT NULL,
  FOREIGN KEY (tracking_id) REFERENCES outbound_emails(tracking_id)
);

-- Create an index on tracking_id for faster lookups
CREATE INDEX idx_email_opens_tracking_id ON email_opens(tracking_id);

-- Create a unique index on tracking_id in outbound_emails
CREATE UNIQUE INDEX IF NOT EXISTS idx_outbound_emails_tracking_id ON outbound_emails(tracking_id);

-- Add a trigger to automatically generate a UUID for tracking_id if not provided
CREATE OR REPLACE FUNCTION generate_tracking_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tracking_id IS NULL THEN
    NEW.tracking_id := uuid_generate_v4();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_tracking_id
BEFORE INSERT ON outbound_emails
FOR EACH ROW
EXECUTE FUNCTION generate_tracking_id();
