-- Add tracking_id column to outbound_emails table if it doesn't exist
ALTER TABLE outbound_emails
ADD COLUMN IF NOT EXISTS tracking_id UUID unique;

-- Create the email_opens table
CREATE TABLE
  email_opens (
    id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
    tracking_id UUID NOT NULL,
    opened_at TIMESTAMP
    WITH
      TIME ZONE NOT NULL,
      FOREIGN KEY (tracking_id) REFERENCES outbound_emails (tracking_id)
  );

-- Create an index on tracking_id for faster lookups
CREATE INDEX idx_email_opens_tracking_id ON email_opens (tracking_id);

-- Create a unique index on tracking_id in outbound_emails
CREATE UNIQUE INDEX IF NOT EXISTS idx_outbound_emails_tracking_id ON outbound_emails (tracking_id);

-- Create the email_link_clicks table
CREATE TABLE
  email_link_clicks (
    id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
    tracking_id UUID NOT NULL,
    link_url TEXT NOT NULL,
    clicked_at TIMESTAMP
    WITH
      TIME ZONE NOT NULL,
      FOREIGN KEY (tracking_id) REFERENCES outbound_emails (tracking_id)
  );

-- Create an index on tracking_id for faster lookups
CREATE INDEX idx_email_link_clicks_tracking_id ON email_link_clicks (tracking_id);