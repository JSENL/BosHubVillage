import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PasswordChangeNotificationRequest {
  user_id: string;
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
    const { user_id, email }: PasswordChangeNotificationRequest = await req.json();

    if (!user_id || !email) {
      return new Response(
        JSON.stringify({ error: 'User ID and email are required' }),
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

    // Get user profile for full name
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user_id)
      .single();

    const fullName = profile?.full_name || 'User';

    // Send password change notification email
    const emailResponse = await resend.emails.send({
      from: 'HubVillage Security <security@resend.dev>',
      to: [email],
      subject: 'Password Changed - HubVillage',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
            <h1 style="color: #333; text-align: center;">Password Successfully Changed</h1>
          </div>
          
          <p>Hi ${fullName},</p>
          
          <p>Your password for HubVillage has been successfully changed on ${new Date().toLocaleString()}.</p>
          
          <div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>✓ Password Change Confirmed</strong></p>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">
              Account: ${email}
            </p>
          </div>
          
          <p><strong>What this means:</strong></p>
          <ul>
            <li>Your account is now secured with your new password</li>
            <li>You can sign in using your new password immediately</li>
            <li>Any saved passwords in browsers or apps will need to be updated</li>
          </ul>
          
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
            <p style="margin: 0;"><strong>⚠️ Didn't change your password?</strong></p>
            <p style="margin: 5px 0 0 0; color: #856404;">
              If you didn't make this change, please contact our support team immediately or reset your password again.
            </p>
          </div>
          
          <p>For your security, we recommend:</p>
          <ul>
            <li>Using a unique password for your HubVillage account</li>
            <li>Enabling two-factor authentication if available</li>
            <li>Keeping your password confidential</li>
          </ul>
          
          <p>Best regards,<br>The HubVillage Security Team</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #666; text-align: center;">
            This is an automated security notification. Please do not reply to this email.
          </p>
        </div>
      `,
    });

    if (emailResponse.error) {
      console.error('Error sending password change notification:', emailResponse.error);
      throw new Error('Failed to send notification email');
    }

    console.log('Password change notification sent successfully to:', email);

    return new Response(
      JSON.stringify({ message: 'Password change notification sent successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );

  } catch (error: any) {
    console.error('Error in password-change-notification function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send password change notification' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }
};

serve(handler);