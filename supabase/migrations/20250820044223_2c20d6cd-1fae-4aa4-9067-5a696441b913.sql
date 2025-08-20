-- Simply remove all proprietor role entries
-- This effectively disables the proprietor functionality without breaking the enum
DELETE FROM public.user_roles WHERE role = 'proprietor';