import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";
import { Resend } from "npm:resend@2.0.0";
import { corsHeaders } from "../_shared/cors.ts";
import { fetchAdminProfiles } from "../_shared/fetchAdminProfiles.ts";
import { sendResendEmail } from "../_shared/resendSend.ts";

interface TestAdminNotificationRequest {
  sendToAllAdmins?: boolean;
}

const resendApiKey =
  Deno.env.get("RESEND_API_KEYI") || Deno.env.get("RESEND_API_KEY") || "";
const resend = new Resend(resendApiKey);

const defaultFromEmail = "onboarding@resend.dev";
const emailFromAddress =
  Deno.env.get("ADMIN_MESSAGE_FROM_EMAIL")?.trim() || defaultFromEmail;
const emailFromName =
  Deno.env.get("ADMIN_MESSAGE_FROM_NAME")?.trim() || "HubVillage Admin";
const emailFrom = `${emailFromName} <${emailFromAddress}>`;

const siteUrl = (Deno.env.get("PUBLIC_SITE_URL") || Deno.env.get("SITE_URL") || "")
  .replace(/\/$/, "");
const adminDashboardUrl = siteUrl ? `${siteUrl}/admin` : "/admin";

async function countPending(
  supabaseAdmin: ReturnType<typeof createClient>,
  table: string,
): Promise<number> {
  const { count, error } = await supabaseAdmin
    .from(table)
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");
  if (error) throw new Error(`${table}: ${error.message}`);
  return count ?? 0;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: "RESEND_API_KEY not configured" }), {
        status: 500,
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
    const { data: userData, error: userError } = await supabaseAuth.auth.getUser(token);
    if (userError || !userData?.user?.id) {
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const userId = userData.user.id;
    const sessionEmail = userData.user.email?.trim() || null;

    const { data: adminRole, error: roleError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError || !adminRole) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    let body: TestAdminNotificationRequest = {};
    try {
      const raw = await req.text();
      if (raw.trim()) body = JSON.parse(raw) as TestAdminNotificationRequest;
    } catch {
      body = {};
    }

    const sendToAllAdmins = body.sendToAllAdmins === true;

    const admins = await fetchAdminProfiles(supabaseAdmin);
    let recipients = sendToAllAdmins
      ? admins
          .map((a) => a.email?.trim())
          .filter((email): email is string => Boolean(email))
      : admins
          .filter((a) => a.id === userId)
          .map((a) => a.email?.trim())
          .filter((email): email is string => Boolean(email));

    if (recipients.length === 0 && sessionEmail) {
      recipients = [sessionEmail];
    }

    if (recipients.length === 0) {
      return new Response(
        JSON.stringify({
          error: sendToAllAdmins
            ? "No admin emails found in profiles"
            : "No email on your admin profile or sign-in account",
        }),
        { status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    const [events, news, businesses, localResources] = await Promise.all([
      countPending(supabaseAdmin, "event_submissions"),
      countPending(supabaseAdmin, "news_submissions"),
      countPending(supabaseAdmin, "business_submissions"),
      countPending(supabaseAdmin, "local_resources_submissions"),
    ]);
    const total = events + news + businesses + localResources;

    const requester = admins.find((a) => a.id === userId);
    const requesterName = requester?.full_name?.trim() || "Admin";

    const subject = "[TEST] HubVillage admin submission alerts";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 20px;">
        <h2 style="margin: 0 0 12px; color: #111827;">Test notification</h2>
        <p style="margin: 0 0 12px; color: #374151;">
          This is a <strong>test only</strong>. No submission was created in the database.
        </p>
        <p style="margin: 0 0 12px; color: #374151;">
          Triggered by <strong>${requesterName}</strong> from the admin dashboard.
        </p>
        <p style="margin: 0 0 8px; color: #374151;"><strong>Current pending queue:</strong></p>
        <ul style="margin: 0 0 16px; color: #374151; padding-left: 20px;">
          <li>Events: ${events}</li>
          <li>Culture / News: ${news}</li>
          <li>Businesses: ${businesses}</li>
          <li>Local resources: ${localResources}</li>
          <li><strong>Total: ${total}</strong></li>
        </ul>
        <p style="margin: 0 0 16px; color: #6b7280; font-size: 14px;">
          Real alerts are sent automatically when someone submits new content for approval.
        </p>
        <a href="${adminDashboardUrl}" style="display: inline-block; background: #7c3aed; color: #fff; text-decoration: none; padding: 10px 16px; border-radius: 8px; font-weight: 600;">
          Open Admin Dashboard
        </a>
      </div>
    `;

    let emailed = 0;
    let failed = 0;
    const sentTo: string[] = [];
    const errors: string[] = [];

    for (const to of recipients) {
      const result = await sendResendEmail(resend, {
        from: emailFrom,
        to: [to],
        subject,
        html,
      });

      if (result.ok) {
        emailed += 1;
        sentTo.push(to);
      } else {
        failed += 1;
        console.error(`test-admin-notification Resend error for ${to}:`, result.message);
        errors.push(`${to}: ${result.message}`);
      }
    }

    if (emailed === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Email could not be sent",
          emailed: 0,
          failed,
          sentTo,
          resendErrors: errors,
          fromAddress: emailFromAddress,
        }),
        { status: 502,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        emailed,
        failed,
        sentTo,
        recipients: recipients.length,
        sendToAllAdmins,
        fromAddress: emailFromAddress,
        pendingCounts: { events, news, businesses, localResources, total },
        resendErrors: errors.length > 0 ? errors : undefined,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("test-admin-notification error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
