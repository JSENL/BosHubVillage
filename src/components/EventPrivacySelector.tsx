import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { UserSearch } from './UserSearch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Lock } from 'lucide-react';

interface EventPrivacySelectorProps {
  isPrivate: boolean;
  onPrivacyChange: (isPrivate: boolean) => void;
  invitedUsers: string[];
  onInvitedUsersChange: (users: string[]) => void;
}

export const EventPrivacySelector = ({
  isPrivate,
  onPrivacyChange,
  invitedUsers,
  onInvitedUsersChange
}: EventPrivacySelectorProps) => {
  const [showUserSearch, setShowUserSearch] = useState(false);

  const handlePrivacyToggle = (checked: boolean) => {
    onPrivacyChange(checked);
    if (!checked) {
      onInvitedUsersChange([]);
      setShowUserSearch(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Event Privacy
        </CardTitle>
        <CardDescription>
          Control who can see this event
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="privacy-toggle" className="text-base">
              Private Event
            </Label>
            <div className="text-sm text-muted-foreground">
              Only invited users and admins can see this event
            </div>
          </div>
          <Switch
            id="privacy-toggle"
            checked={isPrivate}
            onCheckedChange={handlePrivacyToggle}
          />
        </div>

        {isPrivate && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Invited Users</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowUserSearch(!showUserSearch)}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Add Users
              </Button>
            </div>

            {showUserSearch && (
              <UserSearch
                selectedUsers={invitedUsers}
                onUsersChange={onInvitedUsersChange}
                onClose={() => setShowUserSearch(false)}
              />
            )}

            {invitedUsers.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {invitedUsers.length} user(s) invited
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};