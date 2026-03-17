-- Add Contact fields to events: type (message | phone | email | website) and value (phone number, email, or URL)
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS contact_type text CHECK (contact_type IS NULL OR contact_type IN ('message', 'phone', 'email', 'website')),
  ADD COLUMN IF NOT EXISTS contact_value text;

COMMENT ON COLUMN public.events.contact_type IS 'How to contact: message (through system), phone, email, or website';
COMMENT ON COLUMN public.events.contact_value IS 'Phone number, email address, or URL; empty for message (use system)';
