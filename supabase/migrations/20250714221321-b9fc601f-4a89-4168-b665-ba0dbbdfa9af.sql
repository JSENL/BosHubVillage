-- Create contact_admin table for storing contact admin messages
CREATE TABLE public.contact_admin (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'medium',
  admin_response TEXT,
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_admin ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Admins can view all contact admin messages"
  ON public.contact_admin
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update contact admin messages"
  ON public.contact_admin
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can create contact admin messages"
  ON public.contact_admin
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their own contact admin messages"
  ON public.contact_admin
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_contact_admin_updated_at
  BEFORE UPDATE ON public.contact_admin
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();