import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";
import { Resend } from "npm:resend@2.0.0";
import { corsHeaders } from "../_shared/cors.ts";
import { buildAdminEmailJobs } from "./helpers.ts";

interface ContactAdminNotifyRequest {
  subject: string;
  message: string;
  priority: "low" | "medium" | "high";
  user_name?: string;
  user_email?: string;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    const supabaseAuth = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
    if (claimsError || !claimsData?.claims?.sub) {
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const userId = claimsData.claims.sub as string;
    const body = (await req.json()) as ContactAdminNotifyRequest;
    const subject = body.subject?.trim();
    const message = body.message?.trim();
    const priority = body.priority ?? "medium";
    const userName = body.user_name?.trim() || null;
    const fallbackEmail = body.user_email?.trim() || "";

    if (!subject || !message) {
      return new Response(JSON.stringify({ error: "Subject and message are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Resolve sender profile (source of truth email from profiles table).
    const { data: senderProfile } = await supabaseAdmin
      .from("profiles")
      .select("id, email, full_name")
      .eq("id", userId)
      .maybeSingle();

    const senderEmail = senderProfile?.email || fallbackEmail;
    if (!senderEmail) {
      return new Response(JSON.stringify({ error: "No sender email found in profiles" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Keep existing support workflow table.
    const { error: contactError } = await supabaseAdmin
      .from("contact_admin")
      .insert({
        user_id: userId,
        subject,
        message,
        user_email: senderEmail,
        user_name: userName ?? senderProfile?.full_name ?? null,
        priority,
        status: "pending",
      });

    if (contactError) {
      throw new Error(`Failed to save contact_admin message: ${contactError.message}`);
    }

    // Fetch all admin IDs.
    const { data: adminRoles, error: rolesError } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");
    if (rolesError) {
      throw new Error(`Failed to load admin roles: ${rolesError.message}`);
    }
    const adminIds = Array.from(new Set((adminRoles ?? []).map((r) => r.user_id).filter(Boolean)));
    if (adminIds.length === 0) {
      return new Response(JSON.stringify({ success: true, warning: "No admins found", emailed: 0 }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Insert into admin_user_messages (table requested by user).
    const insertRows = adminIds.map((adminId) => ({
      admin_id: adminId,
      user_id: userId,
      subject,
      message,
      status: "unread",
    }));
    const { data: insertedMessages, error: insertMsgError } = await supabaseAdmin
      .from("admin_user_messages")
      .insert(insertRows)
      .select("id, admin_id, user_id, subject, message, created_at");

    if (insertMsgError) {
      throw new Error(`Failed to save admin_user_messages: ${insertMsgError.message}`);
    }

    // Resolve admin profiles (emails come from profiles table).
    const { data: adminProfiles, error: profilesError } = await supabaseAdmin
      .from("profiles")
      .select("id, email, full_name")
      .in("id", adminIds);
    if (profilesError) {
      throw new Error(`Failed to load admin profiles: ${profilesError.message}`);
    }

    const jobs = buildAdminEmailJobs(
      (adminProfiles ?? []).map((p) => ({ id: p.id, email: p.email, full_name: p.full_name })),
      (insertedMessages ?? []).map((m) => ({
        id: m.id,
        admin_id: m.admin_id,
        user_id: m.user_id,
        subject: m.subject,
        message: m.message,
        created_at: m.created_at,
      })),
      { email: senderEmail, name: userName ?? senderProfile?.full_name ?? null },
    );

    let emailed = 0;
    let failed = 0;
    for (const job of jobs) {
      try {
        await resend.emails.send({
          from: "HubVillage Messages <onboarding@resend.dev>",
          to: [job.to],
          subject: job.subject,
          html: job.html,
        });
        emailed += 1;
      } catch (err) {
        console.error("Failed to send admin email:", err);
        failed += 1;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        admin_messages_created: insertedMessages?.length ?? 0,
        emailed,
        failed,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("contact-admin-notify error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});

