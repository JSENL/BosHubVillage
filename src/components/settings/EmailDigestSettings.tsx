import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEmailPreferences } from '@/hooks/useEmailPreferences';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail } from 'lucide-react';

export const EmailDigestSettings = () => {
  const { user } = useAuth();
  const { preferences, isLoading, updatePreferences, isUpdating } = useEmailPreferences();

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Digest
          </CardTitle>
          <CardDescription>
            Sign in to manage your email preferences.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Digest
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  const daysOfWeek = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Weekly Digest
        </CardTitle>
        <CardDescription>
          Get a weekly email with trending events, news, and activities in your area.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="weekly-digest" className="font-medium">
              Enable weekly digest
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive a curated email of trending content
            </p>
          </div>
          <Switch
            id="weekly-digest"
            checked={preferences?.weekly_digest ?? false}
            onCheckedChange={(checked) => updatePreferences({ weekly_digest: checked })}
            disabled={isUpdating}
          />
        </div>

        {preferences?.weekly_digest && (
          <div className="space-y-2">
            <Label htmlFor="digest-day">Delivery day</Label>
            <Select
              value={preferences?.digest_day ?? 'monday'}
              onValueChange={(value) => updatePreferences({ digest_day: value })}
              disabled={isUpdating}
            >
              <SelectTrigger id="digest-day" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {daysOfWeek.map((day) => (
                  <SelectItem key={day.value} value={day.value}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {preferences?.last_digest_sent_at && (
          <p className="text-xs text-muted-foreground">
            Last digest sent: {new Date(preferences.last_digest_sent_at).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
