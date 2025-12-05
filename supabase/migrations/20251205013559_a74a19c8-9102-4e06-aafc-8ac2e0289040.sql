-- Create table for CSV board data
CREATE TABLE public.csv_board_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT,
  neighborhood_focus TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id)
);

-- Enable RLS
ALTER TABLE public.csv_board_data ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage csv board data"
ON public.csv_board_data
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can view csv board data
CREATE POLICY "Anyone can view csv board data"
ON public.csv_board_data
FOR SELECT
USING (true);