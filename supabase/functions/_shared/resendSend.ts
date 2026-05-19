import { Resend } from "npm:resend@2.0.0";

export type ResendSendResult =
  | { ok: true; id: string }
  | { ok: false; message: string };

export async function sendResendEmail(
  resend: Resend,
  params: {
    from: string;
    to: string[];
    subject: string;
    html: string;
  },
): Promise<ResendSendResult> {
  const { data, error } = await resend.emails.send(params);

  if (error) {
    const message =
      typeof error === "object" && error !== null && "message" in error
        ? String((error as { message: unknown }).message)
        : JSON.stringify(error);
    return { ok: false, message };
  }

  return { ok: true, id: data?.id ?? "" };
}
