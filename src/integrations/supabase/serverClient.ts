import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? 'https://mecotkulcgdbilaksddu.supabase.co';
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lY290a3VsY2dkYmlsYWtzZGR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NDE3MzAsImV4cCI6MjA2NDExNzczMH0.GO1Q8_3qngQHqiNE__pdXu57qBMDzOmYNjrpsIgNBY8';

/** Supabase client for SSR / prerender (no persisted auth session). */
export function createServerSupabase() {
  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
