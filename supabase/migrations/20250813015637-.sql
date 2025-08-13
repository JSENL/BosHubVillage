-- Simplify events table policies to fix infinite recursion
-- Remove all existing problematic policies
DROP POLICY IF EXISTS "Users can view events they have access to" ON events;
DROP POLICY IF EXISTS "Admins can insert approved events" ON events;
DROP POLICY IF EXISTS "Only admins can create events" ON events;
DROP POLICY IF EXISTS "Only admins can delete events" ON events;
DROP POLICY IF EXISTS "Only admins can update events" ON events;
DROP POLICY IF EXISTS "Anyone can view published events" ON events;
DROP POLICY IF EXISTS "Authenticated users can create events" ON events;
DROP POLICY IF EXISTS "Users can update their own events" ON events;
DROP POLICY IF EXISTS "Users can delete their own events" ON events;

-- Create simple, non-recursive policies
CREATE POLICY "Anyone can view public events" 
ON events FOR SELECT 
USING (NOT is_private OR auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create events" 
ON events FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = created_by);

CREATE POLICY "Event creators and admins can update events" 
ON events FOR UPDATE 
USING (auth.uid() = created_by OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Event creators and admins can delete events" 
ON events FOR DELETE 
USING (auth.uid() = created_by OR has_role(auth.uid(), 'admin'::app_role));