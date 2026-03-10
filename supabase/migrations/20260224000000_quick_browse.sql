-- Quick Browse: Admin-selected items (max 10) shown in Quick Browse on home
CREATE TABLE IF NOT EXISTS public.quick_browse (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type text NOT NULL CHECK (item_type IN ('event', 'news', 'business', 'local-service')),
  item_id uuid NOT NULL,
  position int NOT NULL CHECK (position >= 0 AND position < 10),
  created_at timestamptz DEFAULT now(),
  UNIQUE (position)
);

-- Index for fast fetch by position order
CREATE INDEX IF NOT EXISTS idx_quick_browse_position ON public.quick_browse (position);

-- Enable RLS
ALTER TABLE public.quick_browse ENABLE ROW LEVEL SECURITY;

-- Allow read for all authenticated and anon (needed for home page)
CREATE POLICY "quick_browse_select" ON public.quick_browse
  FOR SELECT USING (true);

-- Only admins can insert/update/delete (admin = role in user_roles table)
CREATE POLICY "quick_browse_admin_all" ON public.quick_browse
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
    )
  );
