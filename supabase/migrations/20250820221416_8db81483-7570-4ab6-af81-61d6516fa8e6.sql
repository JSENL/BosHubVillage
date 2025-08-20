-- Create business_messages table for user-business owner communication
CREATE TABLE public.business_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL,
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  message TEXT NOT NULL,
  subject TEXT,
  is_from_owner BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.business_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for business messages
CREATE POLICY "Users can view their own messages" 
ON public.business_messages 
FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages" 
ON public.business_messages 
FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Business owners can reply to their business messages" 
ON public.business_messages 
FOR INSERT 
WITH CHECK (
  auth.uid() = sender_id AND 
  is_from_owner = true AND
  EXISTS (
    SELECT 1 FROM public.business_owner 
    WHERE owner_id = auth.uid() AND business_id = business_messages.business_id
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_business_messages_updated_at
BEFORE UPDATE ON public.business_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();