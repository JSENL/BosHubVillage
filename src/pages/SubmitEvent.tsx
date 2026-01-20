
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEventSubmissions } from '@/hooks/useEventSubmissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/Navigation';
import EventSubmissionForm from '@/components/EventSubmissionForm';
import AdminEventApproval from '@/components/AdminEventApproval';
import { SubmissionsTable } from '@/components/SubmissionsTable';
import { 
  Send, 
  Clock, 
  Shield
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SubmitEvent = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { submissions, loading } = useEventSubmissions();
  const [activeTab, setActiveTab] = useState('submit');
  const { t } = useTranslation();
  
  // Filter user's own submissions
  const userSubmissions = submissions.filter(s => s.submitted_by === user?.id);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-yelp-red" />
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-yelp-light-gray py-8">
          <div className="max-w-4xl mx-auto px-4">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-yelp-red mb-4">
                  <Send className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-yelp-gray mb-2">{t('pages.authenticationRequired')}</h3>
                <p className="text-gray-600 mb-4">{t('pages.authRequiredEvent')}</p>
                <Button 
                  onClick={() => window.location.href = '/auth'}
                  className="yelp-gradient hover:opacity-90 text-white"
                >
                  {t('navigation.signIn')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  const tabs = [
    { id: 'submit', label: t('pages.submitEvent'), icon: Send },
    { id: 'submissions', label: `${t('pages.mySubmissions')} (${userSubmissions.length})`, icon: Clock },
    ...(isAdmin ? [{ id: 'admin', label: t('pages.adminPanel'), icon: Shield }] : [])
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-yelp-light-gray py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-yelp-gray mb-2">
            {t('pages.eventManagement')}
          </h1>
          <p className="text-gray-600">{t('pages.eventManagementDesc')}</p>
        </div>

        {/* Custom Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white rounded-lg p-1 yelp-shadow">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'yelp-gradient text-white yelp-shadow'
                      : 'text-yelp-gray hover:text-yelp-red hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'submit' && <EventSubmissionForm />}
          
          {activeTab === 'submissions' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-yelp-gray">
                  <Clock className="h-5 w-5 mr-2" />
                  {t('pages.myEventSubmissions')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <Clock className="h-6 w-6 animate-spin mr-2" />
                    {t('pages.loadingSubmissions')}
                  </div>
                ) : userSubmissions.length === 0 ? (
                  <div className="text-center p-8">
                    <Send className="h-16 w-16 mx-auto mb-4 text-yelp-light-gray" />
                    <h3 className="text-lg font-semibold text-yelp-gray mb-2">{t('pages.noSubmissionsYet')}</h3>
                    <p className="text-gray-600">{t('pages.noSubmissionsDesc')}</p>
                  </div>
                ) : (
                  <SubmissionsTable submissions={userSubmissions} />
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'admin' && isAdmin && <AdminEventApproval />}
        </div>
      </div>
      </div>
    </>
  );
};

export default SubmitEvent;