import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: PasswordResetRequest = await req.json();

    if (!email) {
      throw new Error('Email is required');
    }

    // Initialize Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if user exists
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (userError) {
      console.error('Error fetching users:', userError);
      throw new Error('Failed to verify user');
    }

    const userExists = userData.users.find(user => user.email === email);
    
    if (!userExists) {
      // Don't reveal if user doesn't exist for security
      return new Response(
        JSON.stringify({ message: "If an account with this email exists, we've sent a password reset link." }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Generate password reset link using Supabase Admin API
    const { data: resetData, error: resetError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: `${req.headers.get('origin') || 'http://localhost:5173'}/auth?tab=reset-password`
      }
    });

    if (resetError) {
      console.error('Error generating reset link:', resetError);
      throw new Error('Failed to generate reset link');
    }

    const resetLink = resetData.properties?.action_link;

    if (!resetLink) {
      throw new Error('Failed to generate reset link');
    }

    // Send password reset email
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "HubVillage <onboarding@resend.dev>",
      to: [email],
      subject: "Reset Your HubVillage Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #D1472C; margin: 0;">HubVillage</h1>
            <p style="color: #666; margin: 5px 0;">Password Reset Request</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>
            <p style="color: #666; line-height: 1.5;">
              We received a request to reset your password for your HubVillage account. 
              Click the button below to reset your password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background: linear-gradient(135deg, #D1472C, #FF6B3D); 
                        color: white; 
                        padding: 12px 30px; 
                        text-decoration: none; 
                        border-radius: 6px; 
                        font-weight: bold;
                        display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.5;">
              If the button doesn't work, you can copy and paste this link into your browser:
            </p>
            <p style="background: #eee; padding: 10px; border-radius: 4px; font-size: 12px; word-break: break-all;">
              ${resetLink}
            </p>
          </div>
          
          <div style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
            <p>This link will expire in 1 hour for security purposes.</p>
            <p>If you didn't request this password reset, you can safely ignore this email.</p>
            <p>© 2024 HubVillage - Community Events & Local Resources</p>
          </div>
        </div>
      `,
    });

    if (emailError || !emailData?.id) {
      console.error('Resend email send failed:', emailError || emailData);
      throw new Error('Email delivery failed. Please verify sender domain or try again later.');
    }

    console.log("Password reset email queued:", emailData?.id);

    return new Response(
      JSON.stringify({ 
        message: "If an account with this email exists, we've sent a password reset link.",
        success: true,
        messageId: emailData?.id 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-password-reset function:", error);
    return new Response(
      JSON.stringify({ 
        error: "An error occurred while processing your request. Please try again.",
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);