-- Create admin_user_messages table for admin to user communication
CREATE TABLE public.admin_user_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL,
  user_id UUID NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_user_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can send messages to users"
ON public.admin_user_messages
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) AND
  auth.uid() = admin_id
);

CREATE POLICY "Admins can view all admin messages"
ON public.admin_user_messages
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their received admin messages"
ON public.admin_user_messages
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update status of their received admin messages"
ON public.admin_user_messages
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_admin_user_messages_updated_at
  BEFORE UPDATE ON public.admin_user_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();