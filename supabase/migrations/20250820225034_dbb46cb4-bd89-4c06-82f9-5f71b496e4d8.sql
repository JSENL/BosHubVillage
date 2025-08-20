-- Update RLS policies for business_messages to allow business owners to see all messages for their businesses

-- First, drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Business owners can reply to their business messages" ON public.business_messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.business_messages;
DROP POLICY IF EXISTS "Users can view their own messages" ON public.business_messages;

-- Create new comprehensive policies
CREATE POLICY "Users can send messages to businesses" 
ON public.business_messages 
FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Business owners can view all messages for their businesses" 
ON public.business_messages 
FOR SELECT 
USING (
  -- Allow if user is the business owner
  EXISTS (
    SELECT 1 FROM public.business_owner bo
    WHERE bo.business_id = business_messages.business_id 
    AND bo.owner_id = auth.uid()
  )
  OR
  -- Allow if user is directly involved in the conversation
  auth.uid() = sender_id OR auth.uid() = recipient_id
);

CREATE POLICY "Business owners can reply to messages" 
ON public.business_messages 
FOR INSERT 
WITH CHECK (
  -- Allow if user owns the business they're replying to
  EXISTS (
    SELECT 1 FROM public.business_owner bo
    WHERE bo.business_id = business_messages.business_id 
    AND bo.owner_id = auth.uid()
    AND auth.uid() = sender_id
  )
  OR
  -- Allow regular message sending
  (auth.uid() = sender_id AND is_from_owner = false)
);

CREATE POLICY "Business owners can update message status" 
ON public.business_messages 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.business_owner bo
    WHERE bo.business_id = business_messages.business_id 
    AND bo.owner_id = auth.uid()
  )
);