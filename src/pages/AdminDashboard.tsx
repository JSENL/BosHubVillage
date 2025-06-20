
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navigation } from '@/components/Navigation';
import AdminEventApproval from '@/components/AdminEventApproval';
import AdminNewsApproval from '@/components/AdminNewsApproval';
import AdminBusinessApproval from '@/components/AdminBusinessApproval';
import AdminSubmissionsPanel from '@/components/AdminSubmissionsPanel';
import { 
  Shield, 
  Calendar, 
  Building, 
  Newspaper,
  FileText,
  ArrowLeft
} from 'lucide-react';

const AdminDashboard = () => {
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
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Manage submissions and content approval</p>
          </div>

          <Tabs defaultValue="events" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="events" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Events
              </TabsTrigger>
              <TabsTrigger value="businesses" className="flex items-center">
                <Building className="h-4 w-4 mr-2" />
                Businesses
              </TabsTrigger>
              <TabsTrigger value="news" className="flex items-center">
                <Newspaper className="h-4 w-4 mr-2" />
                News
              </TabsTrigger>
              <TabsTrigger value="submissions" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                All Submissions
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="events">
              <AdminEventApproval />
            </TabsContent>
            
            <TabsContent value="businesses">
              <AdminBusinessApproval />
            </TabsContent>
            
            <TabsContent value="news">
              <AdminNewsApproval />
            </TabsContent>
            
            <TabsContent value="submissions">
              <AdminSubmissionsPanel />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
