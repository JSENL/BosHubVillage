-- Add foreign key relationship between user_reports and profiles
ALTER TABLE public.user_reports 
ADD CONSTRAINT user_reports_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;