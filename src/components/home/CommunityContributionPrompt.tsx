import { Link } from 'react-router-dom';
import { CalendarPlus, Newspaper, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const CommunityContributionPrompt = () => {
  return (
    <Card className="border-dashed bg-muted/30">
      <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-primary/10 p-2 text-primary">
            <PenLine className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">Know something the neighborhood should see?</p>
            <p className="text-sm text-muted-foreground">
              Share an event or Culture story so more neighbors can discover it.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm" className="gap-2 bg-background">
            <Link to="/submit-event">
              <CalendarPlus className="h-4 w-4" />
              Submit event
            </Link>
          </Button>
          <Button asChild size="sm" className="gap-2">
            <Link to="/submit-news">
              <Newspaper className="h-4 w-4" />
              Submit Culture
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
