import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

export interface AdminProfile {
  id: string;
  email: string | null;
  full_name?: string | null;
}

export async function fetchAdminProfiles(
  supabaseAdmin: SupabaseClient,
): Promise<AdminProfile[]> {
  const { data: adminRoles, error: rolesError } = await supabaseAdmin
    .from("user_roles")
    .select("user_id")
    .eq("role", "admin");

  if (rolesError) {
    throw new Error(`Failed to load admin roles: ${rolesError.message}`);
  }

  const adminIds = Array.from(
    new Set((adminRoles ?? []).map((row) => row.user_id).filter(Boolean)),
  );

  if (adminIds.length === 0) {
    return [];
  }

  const { data: adminProfiles, error: profilesError } = await supabaseAdmin
    .from("profiles")
    .select("id, email, full_name")
    .in("id", adminIds);

  if (profilesError) {
    throw new Error(`Failed to load admin profiles: ${profilesError.message}`);
  }

  return (adminProfiles ?? []) as AdminProfile[];
}
