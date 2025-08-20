-- Create business_owner table to link owners with their businesses
CREATE TABLE public.business_owner (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.business(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(business_id, owner_id)
);

-- Enable Row Level Security
ALTER TABLE public.business_owner ENABLE ROW LEVEL SECURITY;

-- Create policies for business owners
CREATE POLICY "Users can view their own business ownership" 
ON public.business_owner 
FOR SELECT 
USING (auth.uid() = owner_id);

CREATE POLICY "Users can create their own business ownership" 
ON public.business_owner 
FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own business ownership" 
ON public.business_owner 
FOR UPDATE 
USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own business ownership" 
ON public.business_owner 
FOR DELETE 
USING (auth.uid() = owner_id);

CREATE POLICY "Admins can manage all business ownership" 
ON public.business_owner 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_business_owner_updated_at
BEFORE UPDATE ON public.business_owner
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();