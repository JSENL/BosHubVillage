import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";
import { Resend } from "npm:resend@2.0.0";
import { corsHeaders } from "../_shared/cors.ts";
import { fetchAdminProfiles } from "../_shared/fetchAdminProfiles.ts";
import { sendResendEmail } from "../_shared/resendSend.ts";

type SubmissionType = "event" | "news" | "business" | "local_resource";

interface NotifyAdminSubmissionRequest {
  submissionType: SubmissionType;
  triggerOp?: string;
  record: Record<string, unknown>;
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

const SUBMISSION_LABELS: Record<SubmissionType, string> = {
  event: "Event",
  news: "Culture / News",
  business: "Business",
  local_resource: "Local Resource",
};

function getRecordTitle(
  submissionType: SubmissionType,
  record: Record<string, unknown>,
): string {
  if (submissionType === "local_resource") {
    const name = record.name;
    return typeof name === "string" && name.trim() ? name.trim() : "Untitled";
  }
  const title = record.title;
  return typeof title === "string" && title.trim() ? title.trim() : "Untitled";
}

function buildEmailHtml(
  submissionType: SubmissionType,
  title: string,
  recordId: string,
): string {
  const label = SUBMISSION_LABELS[submissionType];
  return `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 20px;">
      <h2 style="margin: 0 0 12px; color: #111827;">New ${label} submission</h2>
      <p style="margin: 0 0 10px; color: #374151;"><strong>Title:</strong> ${title}</p>
      <p style="margin: 0 0 16px; color: #374151;"><strong>Submission ID:</strong> ${recordId}</p>
      <p style="margin: 0 0 16px; color: #374151;">
        Review and approve it in Content Management on the admin dashboard.
      </p>
      <a href="${adminDashboardUrl}" style="display: inline-block; background: #7c3aed; color: #fff; text-decoration: none; padding: 10px 16px; border-radius: 8px; font-weight: 600;">
        Open Admin Dashboard
      </a>
    </div>
  `;
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
    const webhookSecret = Deno.env.get("ADMIN_SUBMISSION_WEBHOOK_SECRET")?.trim();
    const incomingSecret = req.headers.get("x-webhook-secret")?.trim();

    if (!webhookSecret || incomingSecret !== webhookSecret) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
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

    const body = (await req.json()) as NotifyAdminSubmissionRequest;
    const submissionType = body.submissionType;
    const triggerOp = body.triggerOp ?? "INSERT";
    const record = body.record ?? {};

    if (!submissionType || !SUBMISSION_LABELS[submissionType]) {
      return new Response(JSON.stringify({ error: "Invalid submissionType" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (triggerOp !== "INSERT") {
      return new Response(
        JSON.stringify({ success: true, skipped: true, reason: "not_insert" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    const status = typeof record.status === "string" ? record.status : "pending";
    if (status !== "pending") {
      return new Response(
        JSON.stringify({ success: true, skipped: true, reason: "not_pending" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    const recordId = typeof record.id === "string" ? record.id : "";
    if (!recordId) {
      return new Response(JSON.stringify({ error: "Missing record id" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const admins = await fetchAdminProfiles(supabaseAdmin);
    const recipients = admins
      .map((admin) => admin.email?.trim())
      .filter((email): email is string => Boolean(email));

    if (recipients.length === 0) {
      return new Response(
        JSON.stringify({ success: true, warning: "No admin emails found", emailed: 0 }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    const title = getRecordTitle(submissionType, record);
    const label = SUBMISSION_LABELS[submissionType];
    const subject = `[HubVillage] New ${label} submission: ${title}`;
    const html = buildEmailHtml(submissionType, title, recordId);

    let emailed = 0;
    let failed = 0;

    for (const to of recipients) {
      const result = await sendResendEmail(resend, {
        from: emailFrom,
        to: [to],
        subject,
        html,
      });
      if (result.ok) {
        emailed += 1;
      } else {
        console.error("Failed to send admin submission email:", result.message);
        failed += 1;
      }
    }

    return new Response(
      JSON.stringify({ success: true, emailed, failed, recipients: recipients.length }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("notify-admin-submission error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
