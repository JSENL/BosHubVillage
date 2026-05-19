import { useState } from 'react';
import { Mail, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { FunctionsHttpError } from '@supabase/supabase-js';

type TestNotificationResult = {
  success?: boolean;
  emailed?: number;
  failed?: number;
  sentTo?: string[];
  error?: string;
  resendErrors?: string[];
  fromAddress?: string;
  pendingCounts?: { total: number };
};

async function parseInvokeError(error: unknown): Promise<string> {
  if (error instanceof FunctionsHttpError) {
    try {
      const body = (await error.context.json()) as { error?: string; resendErrors?: string[] };
      if (body.resendErrors?.length) {
        return `${body.error ?? 'Request failed'}: ${body.resendErrors.join('; ')}`;
      }
      if (body.error) return body.error;
    } catch {
      /* use default message */
    }
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return 'Failed to send test notification';
}

export const AdminNotificationTest = () => {
  const { user, isAdmin } = useAuth();
  const [sending, setSending] = useState(false);
  const [sendToAllAdmins, setSendToAllAdmins] = useState(false);
  const [lastSentTo, setLastSentTo] = useState<string | null>(null);

  if (!isAdmin) return null;

  const handleSendTest = async () => {
    if (!user) {
      toast.error('You must be signed in.');
      return;
    }

    setSending(true);
    setLastSentTo(null);

    try {
      const { data, error } = await supabase.functions.invoke('test-admin-notification', {
        body: { sendToAllAdmins },
      });

      if (error) {
        throw new Error(await parseInvokeError(error));
      }

      const result = (data ?? {}) as TestNotificationResult;

      if (result.error) {
        const detail = result.resendErrors?.length
          ? `${result.error}: ${result.resendErrors.join('; ')}`
          : result.error;
        throw new Error(detail);
      }

      if (!result.success || (result.emailed ?? 0) < 1) {
        throw new Error(
          result.resendErrors?.join('; ') ||
            'No email was delivered. Check Resend domain settings and spam folder.',
        );
      }

      const sentList = result.sentTo?.join(', ') ?? 'your admin email';
      setLastSentTo(sentList);

      const pending = result.pendingCounts?.total ?? 0;
      toast.success(
        `Test email sent to ${sentList}. Check that inbox (and spam). ${pending} item${pending === 1 ? '' : 's'} pending approval.`,
        { duration: 8000 },
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send test notification';
      toast.error(message, { duration: 10000 });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="border-dashed border-amber-200 bg-amber-50/40">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Mail className="h-4 w-4 text-amber-700" />
          Test admin notifications
        </CardTitle>
        <CardDescription>
          Sends a labeled <strong>test email</strong> (not an in-app message). Does not create a
          submission. By default it goes to the email on your profile — check spam if you do not
          see it within a few minutes.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {user.email && (
          <p className="text-xs text-muted-foreground">
            Signed in as <span className="font-medium text-foreground">{user.email}</span>
            {lastSentTo ? (
              <>
                {' '}
                · Last test sent to <span className="font-medium text-foreground">{lastSentTo}</span>
              </>
            ) : null}
          </p>
        )}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="send-to-all-admins"
              checked={sendToAllAdmins}
              onCheckedChange={(checked) => setSendToAllAdmins(checked === true)}
            />
            <Label htmlFor="send-to-all-admins" className="text-sm font-normal cursor-pointer">
              Email all admins (otherwise only you)
            </Label>
          </div>
          <Button
            type="button"
            variant="outline"
            className="shrink-0 border-amber-300 bg-white hover:bg-amber-50"
            disabled={sending}
            onClick={() => void handleSendTest()}
          >
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Send test email
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
