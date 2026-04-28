
-- Create local_services_nonprofits table
CREATE TABLE public.local_services_nonprofits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  address TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  village TEXT,
  description TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add trigger to automatically update the updated_at column
CREATE TRIGGER update_local_services_nonprofits_updated_at
  BEFORE UPDATE ON public.local_services_nonprofits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.local_services_nonprofits ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (since this is likely public information)
CREATE POLICY "Allow public read access to local resources and nonprofits"
  ON public.local_services_nonprofits
  FOR SELECT
  TO public
  USING (true);

-- Create policy to allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert local resources and nonprofits"
  ON public.local_services_nonprofits
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy to allow authenticated users to update
CREATE POLICY "Allow authenticated users to update local resources and nonprofits"
  ON public.local_services_nonprofits
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to delete
CREATE POLICY "Allow authenticated users to delete local resources and nonprofits"
  ON public.local_services_nonprofits
  FOR DELETE
  TO authenticated
  USING (true);
