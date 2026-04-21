import { describe, expect, it } from "vitest";
import { buildAdminEmailJobs } from "../../supabase/functions/contact-admin-notify/helpers";

describe("admin message email routing", () => {
  it("routes admin_user_messages to admin emails from profiles", () => {
    const jobs = buildAdminEmailJobs(
      [
        { id: "admin-1", email: "admin1@example.com", full_name: "Admin One" },
        { id: "admin-2", email: "admin2@example.com", full_name: "Admin Two" },
        { id: "admin-3", email: null, full_name: "No Email Admin" },
      ],
      [
        {
          id: "msg-1",
          admin_id: "admin-1",
          user_id: "user-1",
          subject: "Subject line",
          message: "User asks for help",
          created_at: "2026-04-20T00:00:00.000Z",
        },
        {
          id: "msg-2",
          admin_id: "admin-2",
          user_id: "user-1",
          subject: "Subject line",
          message: "User asks for help",
          created_at: "2026-04-20T00:00:00.000Z",
        },
        {
          id: "msg-3",
          admin_id: "admin-3",
          user_id: "user-1",
          subject: "Subject line",
          message: "User asks for help",
          created_at: "2026-04-20T00:00:00.000Z",
        },
      ],
      { email: "user@example.com", name: "Test User" },
    );

    expect(jobs).toHaveLength(2);
    expect(jobs.map((job) => job.to).sort()).toEqual([
      "admin1@example.com",
      "admin2@example.com",
    ]);
    expect(jobs[0].subject).toContain("Subject line");
    expect(jobs[0].html).toContain("User asks for help");
    expect(jobs[0].html).toContain("user@example.com");
  });
});

