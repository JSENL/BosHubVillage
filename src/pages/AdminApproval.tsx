
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/Navigation';
import AdminSubmissionsPanel from '@/components/AdminSubmissionsPanel';
import { 
  Shield, 
  ArrowLeft,
  CheckSquare
} from 'lucide-react';

const AdminApproval = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center">
              <Shield className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
              <p>Loading...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!user || !isAdmin) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <Card>
              <CardContent className="p-8 text-center">
                <Shield className="h-16 w-16 mx-auto mb-4 text-red-500" />
                <h3 className="text-xl font-semibold mb-2">Access Denied</h3>
                <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
                <Button onClick={() => window.location.href = '/'}>
                  Go Home
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => window.location.href = '/'}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              <CheckSquare className="h-8 w-8 inline-block mr-3 text-purple-600" />
              Submit Approvals
            </h1>
            <p className="text-gray-600">Review and approve pending submissions from users</p>
          </div>

          <AdminSubmissionsPanel />
        </div>
      </div>
    </>
  );
};

export default AdminApproval;
