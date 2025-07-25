-- Create categories table for admin-managed categories
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('business', 'event', 'news', 'local_service')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(name, type)
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view categories" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert categories" 
ON public.categories 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update categories" 
ON public.categories 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete categories" 
ON public.categories 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories
INSERT INTO public.categories (name, type) VALUES
-- Business categories
('Restaurant', 'business'),
('Cafe', 'business'),
('Retail Store', 'business'),
('Service Provider', 'business'),
('Healthcare', 'business'),
('Beauty & Wellness', 'business'),
('Technology', 'business'),
('Professional Services', 'business'),
('Education', 'business'),
('Entertainment', 'business'),
('Automotive', 'business'),
('Home & Garden', 'business'),
('Other', 'business'),

-- Event categories
('Music', 'event'),
('Sports', 'event'),
('Food & Drink', 'event'),
('Arts & Culture', 'event'),
('Business', 'event'),
('Education', 'event'),
('Family', 'event'),
('Health & Wellness', 'event'),

-- Local service categories
('Community', 'local_service'),
('Education', 'local_service'),
('Health', 'local_service'),
('Food', 'local_service'),
('Other', 'local_service'),

-- News source categories (treating sources as categories)
('Local Herald', 'news'),
('City Council', 'news'),
('Community Board', 'news'),
('Government', 'news'),
('Local Business', 'news'),
('Resident Report', 'news'),
('Other', 'news');