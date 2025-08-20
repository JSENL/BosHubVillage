import { useAuth } from '@/hooks/useAuth';
import { useProprietorAuth } from '@/hooks/useProprietorAuth';
import { useProprietorBusinesses } from '@/hooks/useProprietorBusinesses';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/Navigation';
import BusinessCard from '@/components/BusinessCard';
import { 
  Building2, 
  BarChart3, 
  MessageSquare,
  FileText,
  Users,
  TrendingUp,
  Calendar,
  MapPin,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ProprietorDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { isProprietor, loading: proprietorLoading } = useProprietorAuth();
  const { data: businessData, isLoading: businessLoading } = useProprietorBusinesses();

  const loading = authLoading || proprietorLoading;
  const businesses = businessData?.businesses || [];
  const submissions = businessData?.submissions || [];
  const pendingSubmissions = submissions.filter(s => s.status === 'pending');
  const approvedSubmissions = submissions.filter(s => s.status === 'approved');
  const rejectedSubmissions = submissions.filter(s => s.status === 'rejected');

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center">
              <Building2 className="h-8 w-8 animate-spin mx-auto mb-4 text-logo-bright-orange" />
              <p>Loading...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
              <p className="text-gray-600 mb-6">Please sign in to access the business dashboard.</p>
              <Link to="/auth">
                <Button>Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!isProprietor) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
              <p className="text-gray-600 mb-6">You need proprietor privileges to access this dashboard.</p>
              <Link to="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Building2 className="h-8 w-8 mr-3 text-logo-bright-orange" />
                  Business Dashboard
                </h1>
                <p className="text-gray-600 mt-2">Manage your business presence and engagement</p>
              </div>
              <Button asChild className="bg-logo-bright-orange hover:bg-logo-bright-orange/90">
                <Link to="/submit-business">
                  <Building2 className="h-4 w-4 mr-2" />
                  Add Business
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Businesses</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{businesses.length}</div>
                <p className="text-xs text-muted-foreground">Active listings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reviews</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Average rating: N/A</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingSubmissions.length}</div>
                <p className="text-xs text-muted-foreground">Awaiting approval</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="businesses" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="businesses" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                My Businesses
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Reviews
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Events
              </TabsTrigger>
            </TabsList>

            <TabsContent value="businesses" className="space-y-6">
              {/* Active Businesses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Active Business Listings
                    <Badge variant="secondary">{businesses.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {businessLoading ? (
                    <div className="text-center py-8">
                      <Building2 className="h-8 w-8 animate-spin mx-auto mb-4 text-logo-bright-orange" />
                      <p>Loading your businesses...</p>
                    </div>
                  ) : businesses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {businesses.map((business) => (
                        <BusinessCard key={business.id} business={business} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold mb-2">No active businesses yet</h3>
                      <p className="text-gray-600 mb-6">Your approved business listings will appear here.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pending Submissions */}
              {pendingSubmissions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Pending Submissions
                      <Badge variant="outline">{pendingSubmissions.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingSubmissions.map((submission) => (
                        <div key={submission.id} className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold">{submission.title}</h4>
                              <p className="text-sm text-gray-600 mb-2">{submission.business_type}</p>
                              <p className="text-sm text-gray-700 line-clamp-2">{submission.description}</p>
                            </div>
                            <Badge variant="outline" className="ml-4">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Rejected Submissions */}
              {rejectedSubmissions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Rejected Submissions
                      <Badge variant="destructive">{rejectedSubmissions.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {rejectedSubmissions.map((submission) => (
                        <div key={submission.id} className="p-4 border rounded-lg bg-red-50 border-red-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold">{submission.title}</h4>
                              <p className="text-sm text-gray-600 mb-2">{submission.business_type}</p>
                              {submission.admin_notes && (
                                <p className="text-sm text-red-700 mb-2">
                                  <strong>Admin notes:</strong> {submission.admin_notes}
                                </p>
                              )}
                              <p className="text-sm text-gray-700 line-clamp-2">{submission.description}</p>
                            </div>
                            <Badge variant="destructive" className="ml-4">
                              Rejected
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Empty state when no businesses or submissions */}
              {businesses.length === 0 && submissions.length === 0 && !businessLoading && (
                <Card>
                  <CardContent>
                    <div className="text-center py-12">
                      <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold mb-2">No businesses yet</h3>
                      <p className="text-gray-600 mb-6">Start building your business presence by adding your first listing.</p>
                      <Button asChild className="bg-logo-bright-orange hover:bg-logo-bright-orange/90">
                        <Link to="/submit-business">
                          <Building2 className="h-4 w-4 mr-2" />
                          Add Your First Business
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Business Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">Analytics coming soon</h3>
                    <p className="text-gray-600">Track your business performance and engagement metrics.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Customer Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                    <p className="text-gray-600">Customer reviews will appear here once your business is listed.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Business Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">No events scheduled</h3>
                    <p className="text-gray-600 mb-6">Create events to promote your business and engage with customers.</p>
                    <Button asChild variant="outline">
                      <Link to="/submit-event">
                        <Calendar className="h-4 w-4 mr-2" />
                        Create Event
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default ProprietorDashboard;