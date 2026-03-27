import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Mail, 
  Users, 
  Send, 
  Eye, 
  Calendar, 
  RefreshCw,
  CheckCircle,
  Clock,
  Edit3,
  Save,
  TestTube,
  Building2,
  MapPin,
  Sparkles
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EmailPreference {
  id: string;
  user_id: string;
  weekly_digest: boolean;
  digest_day: string;
  last_digest_sent_at: string | null;
  created_at: string;
  profiles?: {
    email: string;
    full_name: string | null;
  };
}

interface EmailTemplate {
  subject: string;
  headerText: string;
  eventsHeading: string;
  newsHeading: string;
  footerText: string;
}

interface Business {
  id: string;
  title: string;
  business_type: string;
  short_description: string | null;
  description: string;
  neighborhood: string;
}

interface LocalResource {
  id: string;
  name: string;
  category: string;
  description: string | null;
  address: string;
  neighborhood: string;
}

const defaultTemplate: EmailTemplate = {
  subject: 'Your Weekly Community Digest',
  headerText: "Here's what's happening in your community this week:",
  eventsHeading: '📅 Upcoming Events',
  newsHeading: '🎭 Latest Culture',
  footerText: "You're receiving this because you subscribed to weekly digests. To unsubscribe, update your email preferences in your account settings.",
};

const WeeklyDigestManagement = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [template, setTemplate] = useState<EmailTemplate>(defaultTemplate);
  const [showPreview, setShowPreview] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  
  // Featured content selections
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('');
  const [businessInterviewQ1, setBusinessInterviewQ1] = useState('What inspired you to start your business?');
  const [businessInterviewA1, setBusinessInterviewA1] = useState('');
  const [businessInterviewQ2, setBusinessInterviewQ2] = useState('What do you love most about serving this community?');
  const [businessInterviewA2, setBusinessInterviewA2] = useState('');
  const [selectedLocalResourceId, setSelectedLocalResourceId] = useState<string>('');
  const [localResourceHighlight, setLocalResourceHighlight] = useState('');

  // Fetch subscribers
  const { data: subscribers, isLoading: loadingSubscribers, refetch } = useQuery({
    queryKey: ['weekly-digest-subscribers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_preferences')
        .select(`
          id,
          user_id,
          weekly_digest,
          digest_day,
          last_digest_sent_at,
          created_at,
          profiles:user_id (
            email,
            full_name
          )
        `)
        .eq('weekly_digest', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as EmailPreference[];
    },
  });

  // Fetch businesses for selection
  const { data: businesses } = useQuery({
    queryKey: ['businesses-for-digest'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business')
        .select('id, title, business_type, short_description, description, neighborhood')
        .order('title', { ascending: true });

      if (error) throw error;
      return data as Business[];
    },
  });

  // Fetch local resources for selection
  const { data: localResources } = useQuery({
    queryKey: ['local-resources-for-digest'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('local_resources')
        .select('id, name, category, description, address, neighborhood')
        .eq('permanently_closed', false)
        .order('name', { ascending: true });

      if (error) throw error;
      return data as LocalResource[];
    },
  });

  // Fetch upcoming events for preview
  const { data: upcomingEvents } = useQuery({
    queryKey: ['upcoming-events-preview'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('id, title, date, location, category')
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  // Fetch recent news for preview
  const { data: recentNews } = useQuery({
    queryKey: ['recent-news-preview'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news')
        .select('id, title, date_posted, location')
        .order('date_posted', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  const selectedBusiness = businesses?.find(b => b.id === selectedBusinessId);
  const selectedLocalResource = localResources?.find(r => r.id === selectedLocalResourceId);

  const handleSaveTemplate = () => {
    localStorage.setItem('weekly-digest-template', JSON.stringify(template));
    setIsEditing(false);
    toast.success('Email template saved');
  };

  const handleTriggerDigest = async () => {
    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('weekly-digest', {
        body: {
          featuredBusiness: selectedBusiness ? {
            id: selectedBusiness.id,
            title: selectedBusiness.title,
            businessType: selectedBusiness.business_type,
            description: selectedBusiness.short_description || selectedBusiness.description,
            neighborhood: selectedBusiness.neighborhood,
            interviewQ1: businessInterviewQ1,
            interviewA1: businessInterviewA1,
            interviewQ2: businessInterviewQ2,
            interviewA2: businessInterviewA2,
          } : null,
          featuredLocalResource: selectedLocalResource ? {
            id: selectedLocalResource.id,
            name: selectedLocalResource.name,
            category: selectedLocalResource.category,
            description: selectedLocalResource.description,
            address: selectedLocalResource.address,
            neighborhood: selectedLocalResource.neighborhood,
            highlight: localResourceHighlight,
          } : null,
        },
      });

      if (error) throw error;
      toast.success('Weekly digest triggered successfully');
    } catch (error: any) {
      toast.error(`Failed to send: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendTestToMe = async () => {
    if (!user?.email) {
      toast.error('Unable to determine your email address');
      return;
    }

    setIsSendingTest(true);
    try {
      const { data, error } = await supabase.functions.invoke('weekly-digest', {
        body: { 
          testEmail: user.email,
          featuredBusiness: selectedBusiness ? {
            id: selectedBusiness.id,
            title: selectedBusiness.title,
            businessType: selectedBusiness.business_type,
            description: selectedBusiness.short_description || selectedBusiness.description,
            neighborhood: selectedBusiness.neighborhood,
            interviewQ1: businessInterviewQ1,
            interviewA1: businessInterviewA1,
            interviewQ2: businessInterviewQ2,
            interviewA2: businessInterviewA2,
          } : null,
          featuredLocalResource: selectedLocalResource ? {
            id: selectedLocalResource.id,
            name: selectedLocalResource.name,
            category: selectedLocalResource.category,
            description: selectedLocalResource.description,
            address: selectedLocalResource.address,
            neighborhood: selectedLocalResource.neighborhood,
            highlight: localResourceHighlight,
          } : null,
        },
      });

      if (error) throw error;
      toast.success(`Test email sent to ${user.email}`);
    } catch (error: any) {
      toast.error(`Failed to send test email: ${error.message}`);
    } finally {
      setIsSendingTest(false);
    }
  };

  const getDayLabel = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Group subscribers by day
  const subscribersByDay = subscribers?.reduce((acc, sub) => {
    const day = sub.digest_day || 'monday';
    if (!acc[day]) acc[day] = [];
    acc[day].push(sub);
    return acc;
  }, {} as Record<string, EmailPreference[]>) || {};

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{subscribers?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Total Subscribers</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {subscribers?.filter(s => s.last_digest_sent_at).length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Received Last Week</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{upcomingEvents?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Events in Digest</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Mail className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{recentNews?.length || 0}</p>
              <p className="text-sm text-muted-foreground">News in Digest</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Business Interview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Featured Business Interview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Select a Business to Feature</Label>
            <Select value={selectedBusinessId || 'none'} onValueChange={(value) => setSelectedBusinessId(value === 'none' ? '' : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a business..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {businesses?.map(business => (
                  <SelectItem key={business.id} value={business.id}>
                    {business.title} ({business.business_type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedBusiness && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                <span>Quick Interview Questions</span>
              </div>
              
              <div className="space-y-2">
                <Label>Question 1</Label>
                <Input 
                  value={businessInterviewQ1} 
                  onChange={(e) => setBusinessInterviewQ1(e.target.value)}
                  placeholder="Enter interview question..."
                />
                <Textarea 
                  value={businessInterviewA1} 
                  onChange={(e) => setBusinessInterviewA1(e.target.value)}
                  placeholder="Enter their answer..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Question 2</Label>
                <Input 
                  value={businessInterviewQ2} 
                  onChange={(e) => setBusinessInterviewQ2(e.target.value)}
                  placeholder="Enter interview question..."
                />
                <Textarea 
                  value={businessInterviewA2} 
                  onChange={(e) => setBusinessInterviewA2(e.target.value)}
                  placeholder="Enter their answer..."
                  rows={2}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Featured Local Resource */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Local Resource Spotlight
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Select a Local Resource to Highlight</Label>
            <Select value={selectedLocalResourceId || 'none'} onValueChange={(value) => setSelectedLocalResourceId(value === 'none' ? '' : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a local resource..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {localResources?.map(resource => (
                  <SelectItem key={resource.id} value={resource.id}>
                    {resource.name} ({resource.category})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedLocalResource && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="text-sm">
                <p><strong>Category:</strong> {selectedLocalResource.category}</p>
                <p><strong>Location:</strong> {selectedLocalResource.address}</p>
                {selectedLocalResource.description && (
                  <p><strong>Description:</strong> {selectedLocalResource.description}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Why is this interesting? (Highlight text)</Label>
                <Textarea 
                  value={localResourceHighlight} 
                  onChange={(e) => setLocalResourceHighlight(e.target.value)}
                  placeholder="Share what makes this resource special or why readers should know about it..."
                  rows={3}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Template Editor */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Email Template
          </CardTitle>
          <div className="flex gap-2">
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Email Preview</DialogTitle>
                </DialogHeader>
                <div className="border rounded-lg p-6 bg-white">
                  <h1 className="text-2xl font-bold mb-4">Your Weekly Community Digest</h1>
                  <p className="mb-4">Hi [User Name],</p>
                  <p className="mb-6 text-muted-foreground">{template.headerText}</p>
                  
                  {selectedBusiness && (
                    <>
                      <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        🎤 Business Spotlight: {selectedBusiness.title}
                      </h2>
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
                        <p className="text-sm text-muted-foreground mb-2">{selectedBusiness.business_type} • {selectedBusiness.neighborhood}</p>
                        <p className="mb-4">{selectedBusiness.short_description || selectedBusiness.description?.slice(0, 150)}</p>
                        {businessInterviewA1 && (
                          <div className="mb-3">
                            <p className="font-medium text-sm">Q: {businessInterviewQ1}</p>
                            <p className="text-muted-foreground italic">"{businessInterviewA1}"</p>
                          </div>
                        )}
                        {businessInterviewA2 && (
                          <div>
                            <p className="font-medium text-sm">Q: {businessInterviewQ2}</p>
                            <p className="text-muted-foreground italic">"{businessInterviewA2}"</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {selectedLocalResource && (
                    <>
                      <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        📍 Local Resource Spotlight
                      </h2>
                      <div className="bg-secondary/30 border border-secondary rounded-lg p-4 mb-6">
                        <h3 className="font-bold">{selectedLocalResource.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedLocalResource.category} • {selectedLocalResource.neighborhood}</p>
                        {localResourceHighlight && (
                          <p className="mt-2">{localResourceHighlight}</p>
                        )}
                      </div>
                    </>
                  )}
                  
                  <h2 className="text-xl font-semibold mb-3">{template.eventsHeading}</h2>
                  <ul className="space-y-2 mb-6">
                    {upcomingEvents?.length ? upcomingEvents.map(event => (
                      <li key={event.id} className="border-l-2 border-primary pl-3">
                        <strong>{event.title}</strong>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString()} • {event.location}
                        </p>
                      </li>
                    )) : (
                      <li className="text-muted-foreground">No upcoming events this week</li>
                    )}
                  </ul>

                  <h2 className="text-xl font-semibold mb-3">{template.newsHeading}</h2>
                  <ul className="space-y-2 mb-6">
                    {recentNews?.length ? recentNews.map(news => (
                      <li key={news.id} className="border-l-2 border-secondary pl-3">
                        <strong>{news.title}</strong>
                        <p className="text-sm text-muted-foreground">{news.location}</p>
                      </li>
                    )) : (
                      <li className="text-muted-foreground">No recent news</li>
                    )}
                  </ul>

                  <Separator className="my-6" />
                  <p className="text-xs text-muted-foreground">{template.footerText}</p>
                </div>
              </DialogContent>
            </Dialog>

            {isEditing ? (
              <Button size="sm" onClick={handleSaveTemplate}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email Subject</Label>
              <Input
                value={template.subject}
                onChange={(e) => setTemplate({ ...template, subject: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Events Section Heading</Label>
              <Input
                value={template.eventsHeading}
                onChange={(e) => setTemplate({ ...template, eventsHeading: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>News Section Heading</Label>
              <Input
                value={template.newsHeading}
                onChange={(e) => setTemplate({ ...template, newsHeading: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Header Text</Label>
              <Textarea
                value={template.headerText}
                onChange={(e) => setTemplate({ ...template, headerText: e.target.value })}
                disabled={!isEditing}
                rows={2}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Footer Text</Label>
            <Textarea
              value={template.footerText}
              onChange={(e) => setTemplate({ ...template, footerText: e.target.value })}
              disabled={!isEditing}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Manual Send */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Digest
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Send Test to Me */}
          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <div>
              <p className="font-medium flex items-center gap-2">
                <TestTube className="h-4 w-4 text-blue-600" />
                Send Test Email to Me
              </p>
              <p className="text-sm text-muted-foreground">
                Send a preview digest to your email: <strong>{user?.email || 'Not available'}</strong>
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleSendTestToMe} 
              disabled={isSendingTest || !user?.email}
            >
              {isSendingTest ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <TestTube className="h-4 w-4 mr-2" />
                  Send Test
                </>
              )}
            </Button>
          </div>

          {/* Trigger for all subscribers */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium">Trigger Weekly Digest Now</p>
              <p className="text-sm text-muted-foreground">
                This will send the digest to all subscribers whose preferred day is today ({getDayLabel(days[new Date().getDay()])}).
              </p>
            </div>
            <Button onClick={handleTriggerDigest} disabled={isSending}>
              {isSending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Now
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subscribers by Day */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Subscribers ({subscribers?.length || 0})
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {loadingSubscribers ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : subscribers?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No subscribers yet</p>
              <p className="text-sm">Users can subscribe in their email preferences settings</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Day distribution */}
              <div className="flex flex-wrap gap-2">
                {days.map(day => (
                  <Badge 
                    key={day} 
                    variant={subscribersByDay[day]?.length ? "default" : "outline"}
                    className="capitalize"
                  >
                    {day}: {subscribersByDay[day]?.length || 0}
                  </Badge>
                ))}
              </div>

              <Separator />

              {/* Subscribers Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Preferred Day</TableHead>
                    <TableHead>Last Sent</TableHead>
                    <TableHead>Subscribed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers?.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">
                        {sub.profiles?.full_name || 'Unknown User'}
                      </TableCell>
                      <TableCell>{sub.profiles?.email || 'No email'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {sub.digest_day}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {sub.last_digest_sent_at ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              {formatDate(sub.last_digest_sent_at)}
                            </>
                          ) : (
                            <>
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              Never
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(sub.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyDigestManagement;
