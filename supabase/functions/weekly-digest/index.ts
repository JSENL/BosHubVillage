import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if this is a test email request
    const body = await req.json().catch(() => ({}));
    const testEmail = body.testEmail as string | undefined;

    console.log("Starting weekly digest processing...");
    if (testEmail) {
      console.log(`Test mode: sending to ${testEmail}`);
    }

    // Get current day of week
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[new Date().getDay()];
    console.log(`Today is ${today}`);

    // If test email mode, skip subscriber lookup
    let preferences: { user_id: string; digest_day: string }[] = [];
    
    if (!testEmail) {
      // Get users who want digest on this day
      const { data: prefs, error: prefError } = await supabase
        .from('email_preferences')
        .select('user_id, digest_day')
        .eq('weekly_digest', true)
        .eq('digest_day', today);

      if (prefError) {
        console.error("Error fetching preferences:", prefError);
        throw prefError;
      }

      preferences = prefs || [];
      console.log(`Found ${preferences.length} users for digest today`);

      if (preferences.length === 0) {
        return new Response(
          JSON.stringify({ message: "No users to send digest to" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Get trending content from the last week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { data: trendingContent, error: trendingError } = await supabase
      .from('trending_content')
      .select('*')
      .order('score', { ascending: false })
      .limit(10);

    if (trendingError) {
      console.error("Error fetching trending content:", trendingError);
    }

    // Get upcoming events
    const { data: upcomingEvents, error: eventsError } = await supabase
      .from('events')
      .select('id, title, date, location, category')
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })
      .limit(5);

    if (eventsError) {
      console.error("Error fetching events:", eventsError);
    }

    // Get recent news
    const { data: recentNews, error: newsError } = await supabase
      .from('news')
      .select('id, title, date_posted, location')
      .order('date_posted', { ascending: false })
      .limit(5);

    if (newsError) {
      console.error("Error fetching news:", newsError);
    }

    // Build email content
    const eventsHtml = upcomingEvents?.length 
      ? upcomingEvents.map(e => `
        <li style="margin-bottom: 10px;">
          <strong>${e.title}</strong><br>
          <span style="color: #666;">${new Date(e.date).toLocaleDateString()} • ${e.location}</span>
        </li>
      `).join('')
      : '<li>No upcoming events this week</li>';

    const newsHtml = recentNews?.length
      ? recentNews.map(n => `
        <li style="margin-bottom: 10px;">
          <strong>${n.title}</strong><br>
          <span style="color: #666;">${n.location}</span>
        </li>
      `).join('')
      : '<li>No recent news</li>';

    const buildEmailHtml = (name: string, isTest: boolean = false) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          h1 { color: #1a1a1a; }
          h2 { color: #333; margin-top: 30px; }
          ul { padding-left: 20px; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
          .test-banner { background: #fef3cd; border: 1px solid #ffc107; padding: 10px; border-radius: 4px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          ${isTest ? '<div class="test-banner"><strong>🧪 TEST EMAIL</strong> - This is a preview of the weekly digest</div>' : ''}
          <h1>Your Weekly Community Digest</h1>
          <p>Hi ${name},</p>
          <p>Here's what's happening in your community this week:</p>
          
          <h2>📅 Upcoming Events</h2>
          <ul>${eventsHtml}</ul>
          
          <h2>📰 Latest News</h2>
          <ul>${newsHtml}</ul>
          
          <div class="footer">
            <p>You're receiving this because you subscribed to weekly digests.</p>
            <p>To unsubscribe, update your email preferences in your account settings.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // If test email mode, send only to the specified email
    if (testEmail) {
      try {
        const emailResponse = await resend.emails.send({
          from: "Community Digest <onboarding@resend.dev>",
          to: [testEmail],
          subject: "[TEST] Your Weekly Community Digest",
          html: buildEmailHtml("Admin", true),
        });

        console.log(`Test email sent to ${testEmail}:`, emailResponse);

        return new Response(
          JSON.stringify({ 
            message: "Test email sent successfully",
            email: testEmail,
            result: emailResponse
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (emailError: any) {
        console.error(`Failed to send test email to ${testEmail}:`, emailError);
        return new Response(
          JSON.stringify({ error: emailError.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Process each subscriber
    const results = [];
    for (const pref of preferences) {
      // Get user email
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', pref.user_id)
        .single();

      if (profileError || !profile?.email) {
        console.log(`Skipping user ${pref.user_id}: no email found`);
        continue;
      }

      try {
        const emailResponse = await resend.emails.send({
          from: "Community Digest <onboarding@resend.dev>",
          to: [profile.email],
          subject: "Your Weekly Community Digest",
          html: buildEmailHtml(profile.full_name || 'there'),
        });

        console.log(`Email sent to ${profile.email}:`, emailResponse);

        // Update last_digest_sent_at
        await supabase
          .from('email_preferences')
          .update({ last_digest_sent_at: new Date().toISOString() })
          .eq('user_id', pref.user_id);

        results.push({ email: profile.email, status: 'sent' });
      } catch (emailError: any) {
        console.error(`Failed to send to ${profile.email}:`, emailError);
        results.push({ email: profile.email, status: 'failed', error: emailError.message });
      }
    }

    return new Response(
      JSON.stringify({ 
        message: "Digest processing complete",
        processed: results.length,
        results 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in weekly-digest function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
