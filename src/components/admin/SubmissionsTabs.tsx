
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building,
  Newspaper,
  Calendar,
  Heart
} from 'lucide-react';
import { NewsSubmission } from '@/types/submissions';
import { EventSubmission } from '@/hooks/useEventSubmissions';
import { LocalResourceSubmission } from '@/types/localServices';
import { NewsSubmissionCard } from '@/components/NewsSubmissionCard';
import { EventSubmissionCard } from '@/components/EventSubmissionCard';
import LocalServiceSubmissionCard from '@/components/LocalServiceSubmissionCard';

interface SubmissionsTabsProps {
  newsSubmissions: NewsSubmission[];
  eventSubmissions: EventSubmission[];
  localResourceSubmissions: LocalResourceSubmission[];
  onUpdate: () => void;
}

export const SubmissionsTabs = ({
  newsSubmissions,
  eventSubmissions,
  localResourceSubmissions,
  onUpdate
}: SubmissionsTabsProps) => {
  return (
    <Tabs defaultValue="news" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="news" className="flex items-center">
          <Newspaper className="h-4 w-4 mr-2" />
          News ({newsSubmissions.length})
        </TabsTrigger>
        <TabsTrigger value="events" className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          Events ({eventSubmissions.length})
        </TabsTrigger>
        <TabsTrigger value="local-resources" className="flex items-center">
          <Heart className="h-4 w-4 mr-2" />
          Local Resources ({localResourceSubmissions.length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="news">
        <div className="space-y-4">
          {newsSubmissions.length === 0 ? (
            <div className="text-center p-8">
              <Newspaper className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600">No pending news submissions.</p>
            </div>
          ) : (
            newsSubmissions.map((submission) => (
              <NewsSubmissionCard
                key={submission.id}
                submission={submission}
                onUpdate={onUpdate}
              />
            ))
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="events">
        <div className="space-y-4">
          {eventSubmissions.length === 0 ? (
            <div className="text-center p-8">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600">No pending event submissions.</p>
            </div>
          ) : (
            eventSubmissions.map((submission) => (
              <EventSubmissionCard
                key={submission.id}
                submission={submission}
                onUpdate={onUpdate}
              />
            ))
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="local-resources">
        <div className="space-y-4">
          {localResourceSubmissions.length === 0 ? (
            <div className="text-center p-8">
              <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600">No pending local resource submissions.</p>
            </div>
          ) : (
            localResourceSubmissions.map((submission) => (
              <LocalServiceSubmissionCard
                key={submission.id}
                submission={submission}
                onUpdate={onUpdate}
              />
            ))
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};
