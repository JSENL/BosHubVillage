import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AllowReregisterRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const { email }: AllowReregisterRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Find auth user by email by scanning pages (small user base assumed)
    let targetUser: any = null;
    let page = 1;
    const perPage = 200;

    while (true) {
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
      if (error) {
        console.error('Error listing users:', error);
        break;
      }

      const found = data.users.find((u: any) => (u.email || '').toLowerCase() === email.toLowerCase());
      if (found) {
        targetUser = found;
        break;
      }

      if (data.users.length < perPage) break; // last page
      page += 1;
      if (page > 50) break; // safety cap
    }

    if (!targetUser) {
      return new Response(
        JSON.stringify({ ok: true, action: 'noop', reason: 'no_auth_user_found' }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const userId = targetUser.id as string;

    // Check for presence in profiles and user_roles
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    const { data: roles } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', userId);

    const hasProfile = !!profile;
    const hasRoles = Array.isArray(roles) && roles.length > 0;

    if (!hasProfile && !hasRoles) {
      // Considered orphaned in app tables; delete auth user to free email
      const { error: delError } = await supabase.auth.admin.deleteUser(userId);
      if (delError) {
        console.error('Failed to delete orphaned auth user:', delError);
        return new Response(
          JSON.stringify({ ok: false, error: 'failed_to_delete_user' }),
          { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
      return new Response(
        JSON.stringify({ ok: true, action: 'deleted', user_id: userId }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, action: 'noop', reason: 'has_profile_or_roles' }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (err) {
    console.error('allow-reregister error:', err);
    return new Response(
      JSON.stringify({ ok: false, error: 'internal_error' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
};

serve(handler);
