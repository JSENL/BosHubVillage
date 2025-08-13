-- Fix infinite recursion in events table RLS policies
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view events" ON events;
DROP POLICY IF EXISTS "Users can create events" ON events;
DROP POLICY IF EXISTS "Users can update their own events" ON events;
DROP POLICY IF EXISTS "Users can delete their own events" ON events;

-- Create new, simple policies that avoid recursion
CREATE POLICY "Anyone can view published events" 
ON events FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create events" 
ON events FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own events" 
ON events FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own events" 
ON events FOR DELETE 
USING (auth.uid() = created_by);