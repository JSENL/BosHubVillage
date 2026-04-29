import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type ItemType = "event" | "news" | "local-resource";

interface AlertRequest {
  itemType: ItemType;
  itemId: string;
}

interface ItemDetails {
  id: string;
  title: string;
  description: string;
  neighborhood: string | null;
  link: string;
  creatorId: string | null;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEYI") || Deno.env.get("RESEND_API_KEY"));
const fromEmail = Deno.env.get("ADMIN_MESSAGE_FROM_EMAIL") || "onboarding@resend.dev";
const fromName = Deno.env.get("ADMIN_MESSAGE_FROM_NAME") || "HubVillage Alerts";
const maxDailyAlerts = Number(Deno.env.get("MAX_DAILY_ALERTS_PER_USER") || "5");

const normalize = (v: string | null | undefined) => (v || "").trim().toLowerCase();

const titleForType = (itemType: ItemType) =>
  itemType === "event" ? "Event" : itemType === "news" ? "Culture" : "Local Resource";

function matchesSavedSearch(searchCriteria: Record<string, unknown> | null, item: ItemDetails, itemType: ItemType) {
  if (!searchCriteria) return false;
  const selectedType = normalize(String(searchCriteria.selectedType || searchCriteria.selected_type || ""));
  if (selectedType && selectedType !== itemType && !(selectedType === "local-service" && itemType === "local-resource")) {
    return false;
  }

  const selectedNeighborhood = normalize(
    String(searchCriteria.selectedNeighborhood || searchCriteria.selected_neighborhood || ""),
  );
  if (selectedNeighborhood && normalize(item.neighborhood) !== selectedNeighborhood) {
    return false;
  }

  const searchTerm = normalize(String(searchCriteria.searchTerm || searchCriteria.search_term || ""));
  if (searchTerm) {
    const haystack = `${item.title} ${item.description}`.toLowerCase();
    if (!haystack.includes(searchTerm)) return false;
  }

  return true;
}

async function getItemDetails(
  supabase: ReturnType<typeof createClient>,
  itemType: ItemType,
  itemId: string,
): Promise<ItemDetails | null> {
  if (itemType === "event") {
    const { data } = await supabase
      .from("events")
      .select("id, slug, title, description, neighborhoods, created_by")
      .eq("id", itemId)
      .maybeSingle();
    if (!data) return null;
    const slug = (data as { slug?: string | null }).slug?.trim();
    return {
      id: data.id,
      title: data.title || "New Event",
      description: data.description || "",
      neighborhood: (data as { neighborhoods?: string | null }).neighborhoods || null,
      link: slug ? `/event/${slug}` : `/event/${data.id}`,
      creatorId: (data as { created_by?: string | null }).created_by || null,
    };
  }

  if (itemType === "news") {
    const { data } = await supabase
      .from("news")
      .select("id, title, content, location, created_by")
      .eq("id", itemId)
      .maybeSingle();
    if (!data) return null;
    return {
      id: data.id,
      title: data.title || "New Culture Article",
      description: (data as { content?: string | null }).content || "",
      neighborhood: (data as { location?: string | null }).location || null,
      link: `/news/${data.id}`,
      creatorId: (data as { created_by?: string | null }).created_by || null,
    };
  }

  const { data } = await supabase
    .from("local_resources")
    .select("id, name, description, neighborhood")
    .eq("id", itemId)
    .maybeSingle();
  if (!data) return null;
  return {
    id: data.id,
    title: (data as { name?: string | null }).name || "New Local Resource",
    description: data.description || "",
    neighborhood: (data as { neighborhood?: string | null }).neighborhood || null,
    link: `/local-resource/${data.id}`,
    creatorId: null,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
    );

    const body = (await req.json()) as AlertRequest;
    if (!body?.itemId || !body?.itemType) {
      return new Response(JSON.stringify({ error: "itemType and itemId are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const item = await getItemDetails(supabase, body.itemType, body.itemId);
    if (!item) {
      return new Response(JSON.stringify({ error: "Item not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const [prefRes, searchesRes, activityRes] = await Promise.all([
      supabase
        .from("notification_preferences")
        .select("user_id, instant_email, instant_in_app, recommendations_enabled, subscribed_item_types, neighborhoods, keywords"),
      supabase
        .from("saved_searches")
        .select("user_id, notify_email, notify_in_app, search_criteria"),
      supabase
        .from("user_activities")
        .select("user_id, item_type, activity_type")
        .eq("item_type", body.itemType === "local-resource" ? "local-service" : body.itemType)
        .in("activity_type", ["bookmark", "view", "comment"])
        .order("created_at", { ascending: false })
        .limit(500),
    ]);

    const prefRows = prefRes.data || [];
    const searchRows = searchesRes.data || [];
    const recommendationUserIds = new Set((activityRes.data || []).map((r) => r.user_id).filter(Boolean));

    const candidate = new Map<
      string,
      { email: boolean; inApp: boolean; reasons: string[]; recommendations: boolean }
    >();

    for (const p of prefRows) {
      const subscribed = (p.subscribed_item_types || []).map(normalize);
      const typeMatch =
        subscribed.length === 0 ||
        subscribed.includes(normalize(body.itemType)) ||
        (body.itemType === "local-resource" && subscribed.includes("local-service"));
      if (!typeMatch) continue;

      const hoods = (p.neighborhoods || []).map(normalize).filter(Boolean);
      const neighborhoodMatch = hoods.length === 0 || hoods.includes(normalize(item.neighborhood));
      if (!neighborhoodMatch) continue;

      const keywords = (p.keywords || []).map(normalize).filter(Boolean);
      const haystack = `${item.title} ${item.description}`.toLowerCase();
      const keywordMatch = keywords.length === 0 || keywords.some((k) => haystack.includes(k));
      if (!keywordMatch) continue;

      candidate.set(p.user_id, {
        email: !!p.instant_email,
        inApp: !!p.instant_in_app,
        reasons: ["preferences"],
        recommendations: !!p.recommendations_enabled,
      });
    }

    for (const s of searchRows) {
      const criteria = (s.search_criteria || null) as Record<string, unknown> | null;
      if (!matchesSavedSearch(criteria, item, body.itemType)) continue;
      const current = candidate.get(s.user_id) || {
        email: false,
        inApp: false,
        reasons: [],
        recommendations: false,
      };
      current.email = current.email || !!s.notify_email;
      current.inApp = current.inApp || !!s.notify_in_app;
      current.reasons.push("saved_search");
      candidate.set(s.user_id, current);
    }

    for (const userId of recommendationUserIds) {
      const current = candidate.get(userId) || {
        email: false,
        inApp: true,
        reasons: [],
        recommendations: true,
      };
      if (current.recommendations || current.reasons.length === 0) {
        current.inApp = true;
        current.reasons.push("recommendation");
        candidate.set(userId, current);
      }
    }

    if (item.creatorId) candidate.delete(item.creatorId);

    const userIds = Array.from(candidate.keys());
    if (userIds.length === 0) {
      return new Response(JSON.stringify({ message: "No matching users", sent: 0 }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const [profilesRes, dailyCountsRes] = await Promise.all([
      supabase.from("profiles").select("id, email, full_name").in("id", userIds),
      supabase
        .from("in_app_notifications")
        .select("user_id, id, created_at")
        .in("user_id", userIds)
        .eq("type", "content_alert")
        .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
    ]);

    const profileByUser = new Map((profilesRes.data || []).map((p) => [p.id, p]));
    const counts = new Map<string, number>();
    for (const n of dailyCountsRes.data || []) {
      counts.set(n.user_id, (counts.get(n.user_id) || 0) + 1);
    }

    const notificationRows: Array<{
      user_id: string;
      type: string;
      title: string;
      message: string;
      link: string;
    }> = [];

    let emailed = 0;
    let inAppCreated = 0;

    for (const userId of userIds) {
      const channel = candidate.get(userId)!;
      const used = counts.get(userId) || 0;
      if (used >= maxDailyAlerts) continue;

      const profile = profileByUser.get(userId);
      if (!profile) continue;

      const reasonPrefix = channel.reasons.includes("recommendation")
        ? "Because you explored similar content"
        : "Just added";

      const title = `${reasonPrefix}: ${titleForType(body.itemType)} in your community`;
      const message = `${item.title} is live${item.neighborhood ? ` in ${item.neighborhood}` : ""}. Tap to learn more.`;

      if (channel.inApp) {
        notificationRows.push({
          user_id: userId,
          type: "content_alert",
          title,
          message,
          link: item.link,
        });
      }

      if (channel.email && profile.email) {
        try {
          await resend.emails.send({
            from: `${fromName} <${fromEmail}>`,
            to: [profile.email],
            subject: `${titleForType(body.itemType)} just dropped near you`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 20px;">
                <h2 style="margin-bottom: 8px;">${title}</h2>
                <p style="color: #4b5563;">${message}</p>
                <div style="padding: 12px 14px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
                  <p style="margin: 0; font-weight: 600;">${item.title}</p>
                  ${item.neighborhood ? `<p style="margin: 4px 0 0; color:#6b7280;">${item.neighborhood}</p>` : ""}
                </div>
                <p style="margin-top: 16px;">
                  <a href="${(Deno.env.get("PUBLIC_APP_URL") || "https://bos-hub-village.vercel.app") + item.link}" style="display:inline-block;background:#2563eb;color:#fff;padding:10px 14px;border-radius:8px;text-decoration:none;">Learn more</a>
                </p>
                <p style="margin-top: 18px; color:#6b7280; font-size: 12px;">You can tune alert frequency in your profile settings.</p>
              </div>
            `,
          });
          emailed += 1;
        } catch (error) {
          console.error("Email send failed for user", userId, error);
        }
      }
    }

    if (notificationRows.length > 0) {
      const { data, error } = await supabase.from("in_app_notifications").insert(notificationRows).select("id");
      if (error) throw error;
      inAppCreated = data?.length || 0;
    }

    return new Response(
      JSON.stringify({
        message: "Alert dispatch complete",
        total_candidates: userIds.length,
        in_app_created: inAppCreated,
        emailed,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("send-content-alerts failed:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

