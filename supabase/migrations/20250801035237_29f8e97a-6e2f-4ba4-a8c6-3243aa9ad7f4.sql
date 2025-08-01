-- Add registration column to events table
ALTER TABLE public.events 
ADD COLUMN registration_required boolean DEFAULT false;

-- Add registration column to event_submissions table
ALTER TABLE public.event_submissions 
ADD COLUMN registration_required boolean DEFAULT false;

-- Create event_registrations table for storing registration submissions
CREATE TABLE public.event_registrations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid NOT NULL,
  user_id uuid NOT NULL,
  user_name text NOT NULL,
  user_email text NOT NULL,
  user_phone text,
  additional_info text,
  status text NOT NULL DEFAULT 'pending',
  reviewed_by uuid,
  reviewed_at timestamp with time zone,
  admin_notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on event_registrations
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for event_registrations
CREATE POLICY "Users can create their own registrations" 
ON public.event_registrations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own registrations" 
ON public.event_registrations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending registrations" 
ON public.event_registrations 
FOR UPDATE 
USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can view all registrations" 
ON public.event_registrations 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update registrations" 
ON public.event_registrations 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete registrations" 
ON public.event_registrations 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updating updated_at timestamp
CREATE TRIGGER update_event_registrations_updated_at
BEFORE UPDATE ON public.event_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();