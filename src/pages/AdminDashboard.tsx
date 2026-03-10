
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navigation } from '@/components/Navigation';
import AdminEventApproval from '@/components/AdminEventApproval';
import AdminNewsApproval from '@/components/AdminNewsApproval';
import AdminLocalResourceApprovalWithGeocoding from '@/components/AdminLocalServiceApprovalWithGeocoding';
import AdminBusinessApproval from '@/components/AdminBusinessApproval';
import AdminSubmissionsPanel from '@/components/AdminSubmissionsPanel';
import ContactAdminMessages from '@/components/admin/ContactAdminMessages';
import AdminUserManagement from '@/components/admin/AdminUserManagement';
import { CSVImportTool } from '@/components/admin/CSVImportTool';
import GNEAnnouncements from '@/components/admin/GNEAnnouncements';
import { CategoriesManagement } from '@/components/admin/CategoriesManagement';
import { CSVBoard } from '@/components/admin/CSVBoard';
import { 
  Shield, 
  Calendar, 
  Building, 
  Newspaper,
  FileText,
  ArrowLeft,
  Heart,
  MessageCircle,
  Users,
  Tag,
  Megaphone,
  UserCheck,
  Upload,
  BarChart3,
  UserCircle,
  Table,
  Languages,
  Layers
} from 'lucide-react';
import { AdminEventRegistrations } from '@/components/admin/AdminEventRegistrations';
import { BatchTranslationTool } from '@/components/admin/BatchTranslationTool';
import { AnalyticsOverview } from '@/components/admin/AnalyticsOverview';
import SocialFeaturesOverview from '@/components/admin/SocialFeaturesOverview';
import UserActivityMonitor from '@/components/admin/UserActivityMonitor';
import BookmarksManagement from '@/components/admin/BookmarksManagement';
import SocialNetworkAnalytics from '@/components/admin/SocialNetworkAnalytics';
import WeeklyDigestManagement from '@/components/admin/WeeklyDigestManagement';
import { QuickBrowseManagement } from '@/components/admin/QuickBrowseManagement';


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
          <div className="max-w-2xl mx-auto px-4">
            <Card>
              <CardContent className="p-8 text-center">
                <Shield className="h-16 w-16 mx-auto mb-4 text-red-500" />
                <h3 className="text-xl font-semibold mb-2">Access Denied</h3>
                <p className="text-gray-600 mb-4">
                  You need admin privileges to access this page.
                </p>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Manage submissions and content approval</p>
          </div>

          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8 h-auto">
              <TabsTrigger value="content" className="flex flex-col items-center p-4 h-auto">
                <Calendar className="h-5 w-5 mb-1" />
                <span className="text-sm">Content Management</span>
              </TabsTrigger>
              <TabsTrigger value="submissions" className="flex flex-col items-center p-4 h-auto">
                <FileText className="h-5 w-5 mb-1" />
                <span className="text-sm">Submissions</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex flex-col items-center p-4 h-auto">
                <Users className="h-5 w-5 mb-1" />
                <span className="text-sm">User Management</span>
              </TabsTrigger>
              <TabsTrigger value="tools" className="flex flex-col items-center p-4 h-auto">
                <BarChart3 className="h-5 w-5 mb-1" />
                <span className="text-sm">Tools & Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="social" className="flex flex-col items-center p-4 h-auto">
                <UserCircle className="h-5 w-5 mb-1" />
                <span className="text-sm">Social Features</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Content Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="events" className="w-full">
                      <TabsList className="grid w-full grid-cols-4 mb-6">
                        <TabsTrigger value="events" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Events
                        </TabsTrigger>
                        <TabsTrigger value="local-services" className="flex items-center gap-2">
                          <Heart className="h-4 w-4" />
                          Local Resources
                        </TabsTrigger>
                        <TabsTrigger value="business" className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Business
                        </TabsTrigger>
                        <TabsTrigger value="news" className="flex items-center gap-2">
                          <Newspaper className="h-4 w-4" />
                          News
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="events">
                        <AdminEventApproval />
                      </TabsContent>
                      
                      <TabsContent value="local-services">
                        <AdminLocalResourceApprovalWithGeocoding />
                      </TabsContent>
                      
                      <TabsContent value="business">
                        <AdminBusinessApproval />
                      </TabsContent>
                      
                      <TabsContent value="news">
                        <AdminNewsApproval />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="submissions" className="space-y-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Submissions & Approvals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="all-submissions" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger value="all-submissions" className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          All Submissions
                        </TabsTrigger>
                        <TabsTrigger value="event-registrations" className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4" />
                          Event Registrations
                        </TabsTrigger>
                        <TabsTrigger value="csv-import" className="flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          CSV Import
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="all-submissions">
                        <AdminSubmissionsPanel />
                      </TabsContent>
                      
                      <TabsContent value="event-registrations">
                        <AdminEventRegistrations />
                      </TabsContent>
                      
                      <TabsContent value="csv-import">
                        <CSVImportTool />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="users" className="space-y-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      User Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="all-users" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="all-users" className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          All Users
                        </TabsTrigger>
                        <TabsTrigger value="reported-to-admin" className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4" />
                          Admin Messages
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="all-users">
                        <AdminUserManagement />
                      </TabsContent>
                      
                      <TabsContent value="reported-to-admin">
                        <ContactAdminMessages />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="tools" className="space-y-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Tools & Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="analytics" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mb-6">
                        <TabsTrigger value="analytics" className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          Analytics
                        </TabsTrigger>
                        <TabsTrigger value="quick-browse" className="flex items-center gap-2">
                          <Layers className="h-4 w-4" />
                          Quick Browse
                        </TabsTrigger>
                        <TabsTrigger value="translations" className="flex items-center gap-2">
                          <Languages className="h-4 w-4" />
                          Translations
                        </TabsTrigger>
                        <TabsTrigger value="announcements" className="flex items-center gap-2">
                          <Megaphone className="h-4 w-4" />
                          Announcements
                        </TabsTrigger>
                        <TabsTrigger value="categories" className="flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          Categories
                        </TabsTrigger>
                        <TabsTrigger value="csv-board" className="flex items-center gap-2">
                          <Table className="h-4 w-4" />
                          CSV Board
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="analytics">
                        <AnalyticsOverview />
                      </TabsContent>
                      
                      <TabsContent value="quick-browse">
                        <QuickBrowseManagement />
                      </TabsContent>
                      
                      <TabsContent value="translations">
                        <BatchTranslationTool />
                      </TabsContent>
                      
                      <TabsContent value="announcements">
                        <GNEAnnouncements />
                      </TabsContent>
                      
                      <TabsContent value="categories">
                        <CategoriesManagement />
                      </TabsContent>
                      
                      <TabsContent value="csv-board">
                        <CSVBoard />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="social" className="space-y-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCircle className="h-5 w-5" />
                      Social Features Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-5 mb-6">
                        <TabsTrigger value="overview" className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          Overview
                        </TabsTrigger>
                        <TabsTrigger value="bookmarks" className="flex items-center gap-2">
                          <Heart className="h-4 w-4" />
                          Bookmarks
                        </TabsTrigger>
                        <TabsTrigger value="network" className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Social Network
                        </TabsTrigger>
                        <TabsTrigger value="activity" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          User Activity
                        </TabsTrigger>
                        <TabsTrigger value="weekly-digest" className="flex items-center gap-2">
                          <Newspaper className="h-4 w-4" />
                          Weekly Digest
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="overview">
                        <SocialFeaturesOverview />
                      </TabsContent>
                      
                      <TabsContent value="bookmarks">
                        <BookmarksManagement />
                      </TabsContent>
                      
                      <TabsContent value="network">
                        <SocialNetworkAnalytics />
                      </TabsContent>
                      
                      <TabsContent value="activity">
                        <UserActivityMonitor />
                      </TabsContent>
                      
                      <TabsContent value="weekly-digest">
                        <WeeklyDigestManagement />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
