-- Create past_events table with same structure as events
CREATE TABLE public.past_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  address TEXT,
  date DATE NOT NULL,
  start_time TIME WITHOUT TIME ZONE,
  end_time TIME WITHOUT TIME ZONE,
  price NUMERIC DEFAULT 0,
  max_attendees INTEGER,
  is_recurring BOOLEAN DEFAULT false,
  recurring_pattern TEXT,
  event_type TEXT DEFAULT 'event'::text,
  neighborhoods TEXT,
  villages TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.past_events ENABLE ROW LEVEL SECURITY;

-- Create policies for past_events (similar to events table)
CREATE POLICY "Anyone can view past events" 
ON public.past_events 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert past events" 
ON public.past_events 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update past events" 
ON public.past_events 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete past events" 
ON public.past_events 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_past_events_updated_at
BEFORE UPDATE ON public.past_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Move events before current date to past_events table
INSERT INTO public.past_events (
  id, title, description, category, location, address, date, 
  start_time, end_time, price, max_attendees, is_recurring, 
  recurring_pattern, event_type, neighborhoods, villages, 
  latitude, longitude, created_by, created_at, updated_at
)
SELECT 
  id, title, description, category, location, address, date, 
  start_time, end_time, price, max_attendees, is_recurring, 
  recurring_pattern, event_type, neighborhoods, villages, 
  latitude, longitude, created_by, created_at, updated_at
FROM public.events 
WHERE date < CURRENT_DATE;

-- Delete past events from events table
DELETE FROM public.events WHERE date < CURRENT_DATE;