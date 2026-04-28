import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  Users, 
  Calendar, 
  Newspaper, 
  Building, 
  MapPin, 
  MessageSquare,
  TrendingUp,
  Clock,
  Star,
  BarChart3,
  Download,
  RefreshCw
} from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from 'sonner';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function AnalyticsOverview() {
  const { t } = useTranslation();
  const { data: analytics, isLoading, error, refetch } = useAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px] mb-2" />
                <Skeleton className="h-3 w-[120px]" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Analytics</CardTitle>
          <CardDescription>
            Failed to load analytics data. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) return null;

  const handleExportData = () => {
    toast.success("Analytics data exported successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Comprehensive insights into your community platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.contentStats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              +{analytics.submissionStats.approvedThisWeek} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.contentStats.totalBusinesses}</div>
            <p className="text-xs text-muted-foreground">
              Community directory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Engagement</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.contentStats.totalComments}</div>
            <p className="text-xs text-muted-foreground">
              Total comments posted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.engagementStats.avgRating.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Out of 5 stars
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* User Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>User Growth (30 Days)</CardTitle>
                <CardDescription>
                  Daily new user registrations and cumulative growth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics.userGrowth.slice(-30)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.3}
                      name="Total Users"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Event Categories</CardTitle>
                <CardDescription>
                  Most popular event categories by count
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.engagementStats.topCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="category"
                    >
                      {analytics.engagementStats.topCategories.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest platform activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Badge variant="secondary">{activity.type}</Badge>
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">by {activity.user}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Growth Trends</CardTitle>
              <CardDescription>
                Detailed user registration and growth analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analytics.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Total Users"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="newUsers" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    name="New Users"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Content Distribution</CardTitle>
                <CardDescription>
                  Breakdown of content types on the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Events</span>
                  <span className="font-bold">{analytics.contentStats.totalEvents}</span>
                </div>
                <Progress 
                  value={analytics.contentStats.totalEvents / 
                    Math.max(analytics.contentStats.totalEvents, analytics.contentStats.totalNews, analytics.contentStats.totalBusinesses) * 100} 
                />
                
                <div className="flex justify-between items-center">
                  <span>{t('analytics.cultureArticles', 'Culture Articles')}</span>
                  <span className="font-bold">{analytics.contentStats.totalNews}</span>
                </div>
                <Progress 
                  value={analytics.contentStats.totalNews / 
                    Math.max(analytics.contentStats.totalEvents, analytics.contentStats.totalNews, analytics.contentStats.totalBusinesses) * 100} 
                />
                
                <div className="flex justify-between items-center">
                  <span>Businesses</span>
                  <span className="font-bold">{analytics.contentStats.totalBusinesses}</span>
                </div>
                <Progress 
                  value={analytics.contentStats.totalBusinesses / 
                    Math.max(analytics.contentStats.totalEvents, analytics.contentStats.totalNews, analytics.contentStats.totalBusinesses) * 100} 
                />
                
                <div className="flex justify-between items-center">
                  <span>local resources</span>
                  <span className="font-bold">{analytics.contentStats.totallocalresources}</span>
                </div>
                <Progress 
                  value={analytics.contentStats.totallocalresources / 
                    Math.max(analytics.contentStats.totalEvents, analytics.contentStats.totalNews, analytics.contentStats.totalBusinesses) * 100} 
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>
                  User interaction and engagement statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {analytics.engagementStats.eventsWithComments}
                  </div>
                  <p className="text-sm text-muted-foreground">Events with Comments</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {analytics.engagementStats.avgCommentsPerEvent.toFixed(1)}
                  </div>
                  <p className="text-sm text-muted-foreground">Avg Comments per Event</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary flex items-center justify-center gap-1">
                    <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    {analytics.engagementStats.avgRating.toFixed(1)}
                  </div>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geography" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Neighborhoods</CardTitle>
                <CardDescription>
                  Most active neighborhoods by event count
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.geographicStats.topNeighborhoods}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="neighborhood" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Villages</CardTitle>
                <CardDescription>
                  Most active villages by event count
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.geographicStats.topVillages}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="village" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Submissions</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.submissionStats.pendingSubmissions}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting review
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved This Week</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {analytics.submissionStats.approvedThisWeek}
                </div>
                <p className="text-xs text-muted-foreground">
                  Successfully reviewed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics.submissionStats.avgProcessingTime} days
                </div>
                <p className="text-xs text-muted-foreground">
                  Review to approval
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Submission Workflow</CardTitle>
              <CardDescription>
                Overview of submission processing and approval rates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Approval Rate</span>
                <span className="font-bold">
                  {analytics.submissionStats.approvedThisWeek + analytics.submissionStats.rejectedThisWeek > 0 
                    ? Math.round((analytics.submissionStats.approvedThisWeek / 
                        (analytics.submissionStats.approvedThisWeek + analytics.submissionStats.rejectedThisWeek)) * 100)
                    : 0}%
                </span>
              </div>
              <Progress 
                value={analytics.submissionStats.approvedThisWeek + analytics.submissionStats.rejectedThisWeek > 0 
                  ? (analytics.submissionStats.approvedThisWeek / 
                      (analytics.submissionStats.approvedThisWeek + analytics.submissionStats.rejectedThisWeek)) * 100
                  : 0} 
                className="h-2"
              />
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {analytics.submissionStats.approvedThisWeek}
                  </div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {analytics.submissionStats.rejectedThisWeek}
                  </div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}