import { Navigation } from '@/components/Navigation';
import UserReportForm from '@/components/UserReportForm';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ContactAdmin = () => {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Contact Admin
            </h1>
            <p className="text-gray-600">
              Report issues, request help, or communicate with the admin team
            </p>
          </div>
          
          <UserReportForm />
        </div>
      </div>
    </>
  );
};

export default ContactAdmin;