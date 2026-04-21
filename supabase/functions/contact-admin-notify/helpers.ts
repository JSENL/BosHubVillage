export interface AdminProfile {
  id: string;
  email: string | null;
  full_name?: string | null;
}

export interface UserMessageRecord {
  id: string;
  admin_id: string;
  user_id: string;
  subject: string | null;
  message: string;
  created_at: string;
}

export interface EmailJob {
  to: string;
  adminId: string;
  subject: string;
  html: string;
}

export function buildAdminEmailJobs(
  admins: AdminProfile[],
  messages: UserMessageRecord[],
  sender: { email: string; name: string | null },
): EmailJob[] {
  const byAdminId = new Map(admins.map((a) => [a.id, a]));

  return messages
    .map((msg) => {
      const admin = byAdminId.get(msg.admin_id);
      const to = admin?.email?.trim() || "";
      if (!to) return null;

      const subjectLine = msg.subject?.trim()
        ? `[User Message] ${msg.subject.trim()}`
        : "[User Message] New message for admin";

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 20px;">
          <h2 style="margin: 0 0 12px; color: #111827;">New user message</h2>
          <p style="margin: 0 0 10px; color: #374151;"><strong>From:</strong> ${sender.name || "User"} (${sender.email})</p>
          <p style="margin: 0 0 10px; color: #374151;"><strong>Subject:</strong> ${msg.subject || "No subject"}</p>
          <p style="margin: 0 0 16px; color: #374151;"><strong>Message ID:</strong> ${msg.id}</p>
          <div style="white-space: pre-wrap; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; color: #111827;">
${msg.message}
          </div>
        </div>
      `;

      return {
        to,
        adminId: msg.admin_id,
        subject: subjectLine,
        html,
      } satisfies EmailJob;
    })
    .filter((job): job is EmailJob => job !== null);
}

