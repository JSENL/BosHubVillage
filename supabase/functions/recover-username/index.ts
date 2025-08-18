import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RecoverUsernameRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const { email }: RecoverUsernameRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Initialize Resend
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

    // Check if user exists with this email
    const { data: authUser, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching users:', authError);
      throw new Error('Failed to process request');
    }

    const user = authUser.users.find(u => u.email === email);

    if (!user) {
      // Don't reveal whether email exists for security
      return new Response(
        JSON.stringify({ message: 'If an account exists with this email, we have sent the username.' }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    // Get user profile for full name
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();

    const fullName = profile?.full_name || 'User';

    // Send username recovery email
    const emailResponse = await resend.emails.send({
      from: 'HubVillage <noreply@resend.dev>',
      to: [email],
      subject: 'Your HubVillage Username',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">HubVillage Username Recovery</h1>
          
          <p>Hi ${fullName},</p>
          
          <p>You requested your username for HubVillage. Here are your account details:</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Account Name:</strong> ${fullName}</p>
          </div>
          
          <p>You can use your email address (${email}) to sign in to your account.</p>
          
          <p>If you didn't request this information, please ignore this email.</p>
          
          <p>Best regards,<br>The HubVillage Team</p>
        </div>
      `,
    });

    if (emailResponse.error) {
      console.error('Error sending email:', emailResponse.error);
      throw new Error('Failed to send email');
    }

    console.log('Username recovery email sent successfully to:', email);

    return new Response(
      JSON.stringify({ message: 'Username recovery email sent successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );

  } catch (error: any) {
    console.error('Error in recover-username function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process username recovery request' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }
};

serve(handler);