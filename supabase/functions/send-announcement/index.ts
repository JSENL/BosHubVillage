import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SendAnnouncementRequest {
  announcementId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authorization header exists
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("Missing or invalid authorization header");
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Initialize Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Create client with user's token to verify authentication
    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Verify the user's token and get claims
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);

    if (claimsError || !claimsData?.claims) {
      console.error("Failed to verify token:", claimsError);
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const userId = claimsData.claims.sub;

    // Verify user is an admin
    const { data: adminRole, error: roleError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .single();

    if (roleError || !adminRole) {
      console.error("User is not an admin:", userId);
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Admin verified:", userId);

    const { announcementId }: SendAnnouncementRequest = await req.json();

    console.log("Processing announcement:", announcementId);

    // Get the announcement details
    const { data: announcement, error: announcementError } = await supabaseAdmin
      .from("announcements")
      .select("*")
      .eq("id", announcementId)
      .single();

    if (announcementError) {
      throw new Error(`Failed to fetch announcement: ${announcementError.message}`);
    }

    // Get all user profiles with emails
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from("profiles")
      .select("email, full_name");

    if (profilesError) {
      throw new Error(`Failed to fetch user profiles: ${profilesError.message}`);
    }

    console.log(`Found ${profiles?.length || 0} users to send announcement to`);

    if (!profiles || profiles.length === 0) {
      return new Response(
        JSON.stringify({ error: "No users found to send announcement to" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Send emails to all users
    const emailPromises = profiles.map(async (profile) => {
      try {
        const emailResponse = await resend.emails.send({
          from: "GNE! Announcements <onboarding@resend.dev>",
          to: [profile.email],
          subject: `🎯 GNE! Announcement: ${announcement.title}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🎯 GNE! Announcement</h1>
              </div>
              
              <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #333; margin-top: 0; font-size: 24px;">${announcement.title}</h2>
                
                <div style="color: #555; line-height: 1.6; font-size: 16px; white-space: pre-wrap;">${announcement.message}</div>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                
                <p style="color: #888; font-size: 14px; margin: 0;">
                  This announcement was sent to all registered users.<br>
                  Thank you for being part of our community!
                </p>
              </div>
            </div>
          `,
        });

        console.log(`Email sent to ${profile.email}`);
        return { success: true, email: profile.email };
      } catch (error) {
        console.error(`Failed to send email to ${profile.email}:`, error);
        return { success: false, email: profile.email, error: error.message };
      }
    });

    const results = await Promise.all(emailPromises);
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    console.log(`Email sending completed: ${successCount} success, ${failureCount} failures`);

    // Update announcement status
    const { error: updateError } = await supabaseAdmin
      .from("announcements")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        recipients_count: successCount,
      })
      .eq("id", announcementId);

    if (updateError) {
      console.error("Failed to update announcement status:", updateError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Announcement sent successfully",
        recipients_count: successCount,
        failures: failureCount,
        results: results.filter(r => !r.success), // Only return failures for debugging
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
    console.error("Error in send-announcement function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);