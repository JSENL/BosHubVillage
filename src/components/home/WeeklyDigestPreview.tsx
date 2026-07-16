import { CalendarDays, Mail, MapPin, Newspaper, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { WeeklyEmailModal } from '@/components/common/WeeklyEmailModal';

export const WeeklyDigestPreview = () => {
  return (
    <Card className="overflow-hidden border-primary/15 bg-gradient-to-br from-primary/5 via-background to-logo-caribbean-teal/10">
      <CardContent className="p-4 md:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-primary shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Weekly neighborhood digest
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Get the best of Hub Village every week
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                A quick email with upcoming events, new Culture stories, and useful local updates.
              </p>
            </div>
            <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                Weekend picks
              </span>
              <span className="inline-flex items-center gap-2">
                <Newspaper className="h-4 w-4 text-primary" />
                Culture highlights
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Nearby finds
              </span>
            </div>
          </div>

          <WeeklyEmailModal
            trigger={
              <Button className="shrink-0 gap-2">
                <Mail className="h-4 w-4" />
                Send me the digest
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};
