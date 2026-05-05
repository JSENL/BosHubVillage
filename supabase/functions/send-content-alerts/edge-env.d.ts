/**
 * IDE shim: Supabase Edge Functions run on Deno; URLs resolve at deploy/runtime.
 * Keeps tsserver happy when the Deno VS Code extension is not enabled.
 */
declare module "https://esm.sh/@supabase/supabase-js@2.49.8" {
  /** Same API as app dependency (see package.json); Deno loads the URL at runtime. */
  export { createClient, type SupabaseClient } from "@supabase/supabase-js";
}

declare module "https://deno.land/std@0.190.0/http/server.ts" {
  export function serve(
    handler: (request: Request) => Response | Promise<Response>,
  ): void;
}

declare module "https://esm.sh/resend@2.0.0" {
  export class Resend {
    constructor(apiKey?: string | null | undefined);
    emails: { send(args: Record<string, unknown>): Promise<unknown> };
  }
}
