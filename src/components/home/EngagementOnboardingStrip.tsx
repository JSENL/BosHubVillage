import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Bookmark, PenLine, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { WeeklyEmailModal } from '@/components/common/WeeklyEmailModal';
import { useAuth } from '@/hooks/useAuth';

const STORAGE_KEY = 'hub-village-engagement-strip-dismissed';

export const EngagementOnboardingStrip = () => {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(localStorage.getItem(STORAGE_KEY) === 'true');
  }, []);

  if (!user || dismissed) return null;

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setDismissed(true);
  };

  return (
    <Card className="border-logo-caribbean-teal/20 bg-logo-caribbean-teal/5">
      <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">Make Hub Village yours</p>
          <p className="text-sm text-muted-foreground">
            Save places, get the weekly digest, or share something your neighborhood should know.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild size="sm" variant="outline" className="gap-2 bg-white">
            <Link to="/search">
              <Bookmark className="h-4 w-4" />
              Find something to save
            </Link>
          </Button>
          <WeeklyEmailModal
            trigger={
              <Button size="sm" variant="outline" className="gap-2 bg-white">
                <Bell className="h-4 w-4" />
                Get digest
              </Button>
            }
          />
          <Button asChild size="sm" className="gap-2">
            <Link to="/submit-news">
              <PenLine className="h-4 w-4" />
              Submit Culture
            </Link>
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={dismiss}
            aria-label="Dismiss suggestions"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
