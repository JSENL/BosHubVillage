import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building,
  Newspaper,
  Calendar,
  Heart
} from 'lucide-react';
import { NewsSubmission } from '@/types/submissions';
import { EventSubmission } from '@/hooks/useEventSubmissions';
import { LocalResourceSubmission } from '@/types/localresources';
import { BusinessSubmission } from '@/types/submissions';
import { NewsSubmissionCard } from '@/components/NewsSubmissionCard';
import { EventSubmissionCard } from '@/components/EventSubmissionCard';
import localresourcesubmissionCard from '@/components/localresourcesubmissionCard';
import { BusinessSubmissionCard } from '@/components/BusinessSubmissionCard';

interface SubmissionsTabsProps {
  newsSubmissions: NewsSubmission[];
  eventSubmissions: EventSubmission[];
  localResourceSubmissions: LocalResourceSubmission[];
  businessSubmissions: BusinessSubmission[];
  onUpdate: () => void;
}

export const SubmissionsTabs = ({
  newsSubmissions,
  eventSubmissions,
  localResourceSubmissions,
  businessSubmissions,
  onUpdate
}: SubmissionsTabsProps) => {
  const { t } = useTranslation();
  return (
    <Tabs defaultValue="news" className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6">
        <TabsTrigger value="news" className="flex items-center">
          <Newspaper className="h-4 w-4 mr-2" />
          {t('navigation.news')} ({newsSubmissions.length})
        </TabsTrigger>
        <TabsTrigger value="events" className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          Events ({eventSubmissions.length})
        </TabsTrigger>
        <TabsTrigger value="local-resources" className="flex items-center">
          <Heart className="h-4 w-4 mr-2" />
          Local Resources ({localResourceSubmissions.length})
        </TabsTrigger>
        <TabsTrigger value="business" className="flex items-center">
          <Building className="h-4 w-4 mr-2" />
          {t('navigation.businesses', 'Business')} ({businessSubmissions.length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="news">
        <div className="space-y-4">
          {newsSubmissions.length === 0 ? (
            <div className="text-center p-8">
              <Newspaper className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600">{t('admin.submissions.noPendingCulture', 'No pending culture submissions.')}</p>
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
              <localresourcesubmissionCard
                key={submission.id}
                submission={submission}
                onUpdate={onUpdate}
              />
            ))
          )}
        </div>
      </TabsContent>

      <TabsContent value="business">
        <div className="space-y-4">
          {businessSubmissions.length === 0 ? (
            <div className="text-center p-8">
              <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600">No pending business submissions.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {businessSubmissions.map((submission) => (
                <BusinessSubmissionCard
                  key={submission.id}
                  submission={submission}
                  onUpdate={onUpdate}
                />
              ))}
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};
