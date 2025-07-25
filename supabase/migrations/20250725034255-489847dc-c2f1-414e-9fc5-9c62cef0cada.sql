-- Update announcements table to allow all users to view sent announcements
CREATE POLICY "Users can view sent announcements" 
ON public.announcements 
FOR SELECT 
USING (status = 'sent');

-- Add realtime functionality for announcements
ALTER TABLE public.announcements REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;