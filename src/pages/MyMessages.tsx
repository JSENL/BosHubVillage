import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navigation } from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';
import { useUserAnnouncements } from '@/hooks/useUserAnnouncements';
import { Loader2, Megaphone, MessageSquare, Clock, Users, Building } from 'lucide-react';

interface ContactAdminMessage {
  id: string;
  subject: string;
  message: string;
  priority: string;
  status: string;
  created_at: string;
  user_name: string | null;
  user_email: string;
  admin_response: string | null;
}

interface BusinessMessage {
  id: string;
  business_id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  is_from_owner: boolean;
  status: string;
  created_at: string;
  business?: {
    title: string;
  } | null;
  sender_profile?: {
    full_name: string | null;
    email: string;
  } | null;
  recipient_profile?: {
    full_name: string | null;
    email: string;
  } | null;
}

const MyMessages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactAdminMessage[]>([]);
  const [businessMessages, setBusinessMessages] = useState<BusinessMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { announcements, loading: announcementsLoading } = useUserAnnouncements();

  useEffect(() => {
    if (!user) return;
    fetchMyMessages();
    fetchBusinessMessages();
  }, [user]);

  const fetchMyMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_admin')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinessMessages = async () => {
    try {
      // Fetch all business messages where user is involved (both sent and received)
      const { data, error } = await supabase
        .from('business_messages')
        .select('*')
        .or(`recipient_id.eq.${user?.id},sender_id.eq.${user?.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Get business info for each message
      const businessIds = [...new Set((data || []).map(msg => msg.business_id))];
      const { data: businesses } = await supabase
        .from('business')
        .select('id, title')
        .in('id', businessIds);

      // Get unique user IDs (both senders and recipients) for profiles
      const allUserIds = [...new Set([
        ...(data || []).map(msg => msg.sender_id),
        ...(data || []).map(msg => msg.recipient_id)
      ])].filter(Boolean);
      
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', allUserIds);

      // Combine the data
      const messagesWithDetails = (data || []).map(message => ({
        ...message,
        business: businesses?.find(b => b.id === message.business_id) || null,
        sender_profile: profiles?.find(p => p.id === message.sender_id) || null,
        recipient_profile: profiles?.find(p => p.id === message.recipient_id) || null
      }));

      setBusinessMessages(messagesWithDetails as unknown as BusinessMessage[]);
    } catch (error) {
      console.error('Error fetching business messages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch business messages",
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-8">
              <p>Please sign in to view your messages.</p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (loading || announcementsLoading) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>My Messages</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading messages...</span>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>My Messages</CardTitle>
          <p className="text-sm text-muted-foreground">
            View announcements and your messages sent to admin
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="announcements" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="announcements" className="flex items-center">
                <Megaphone className="h-4 w-4 mr-2" />
                Announcements ({announcements.length})
              </TabsTrigger>
              <TabsTrigger value="my-messages" className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Admin Messages ({messages.length})
              </TabsTrigger>
              <TabsTrigger value="business-messages" className="flex items-center">
                <Building className="h-4 w-4 mr-2" />
                Business Replies ({businessMessages.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="announcements" className="mt-6">
              {announcements.length === 0 ? (
                <div className="text-center py-8">
                  <Megaphone className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Announcements</h3>
                  <p className="text-gray-600">You'll see announcements from admins here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="border rounded-lg p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-full">
                            <Megaphone className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{announcement.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                <Users className="h-3 w-3 mr-1" />
                                Sent to {announcement.recipients_count} users
                              </Badge>
                              <Badge variant="outline" className="text-blue-600 border-blue-600">
                                <Clock className="h-3 w-3 mr-1" />
                                {new Date(announcement.sent_at!).toLocaleDateString()}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg border border-purple-100">
                        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                          {announcement.message}
                        </div>
                      </div>

                      <div className="mt-4 text-sm text-gray-500">
                        Sent on {new Date(announcement.sent_at!).toLocaleDateString()} at{' '}
                        {new Date(announcement.sent_at!).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="my-messages" className="mt-6">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Messages</h3>
                  <p className="text-gray-600">You haven't sent any messages to admin yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{message.subject}</h3>
                            <Badge variant={getPriorityColor(message.priority)}>
                              {message.priority}
                            </Badge>
                            <Badge className={getStatusColor(message.status)}>
                              {message.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Sent on {new Date(message.created_at).toLocaleDateString()} at{' '}
                            {new Date(message.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-medium mb-1">Your Message:</p>
                        <p className="text-sm">{message.message}</p>
                      </div>
                      {message.admin_response && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-md">
                          <p className="text-sm font-medium text-blue-900">Admin Response:</p>
                          <p className="text-sm text-blue-800">{message.admin_response}</p>
                        </div>
                      )}
                      {!message.admin_response && message.status === 'pending' && (
                        <div className="mt-3 p-3 bg-yellow-50 rounded-md">
                          <p className="text-sm text-yellow-800">
                            Your message is pending review. You'll see the admin response here once available.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="business-messages" className="mt-6">
              {businessMessages.length === 0 ? (
                <div className="text-center py-8">
                  <Building className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Business Messages</h3>
                  <p className="text-gray-600">Your conversations with businesses will appear here.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Group messages by business */}
                  {Object.entries(
                    businessMessages.reduce((acc, message) => {
                      const businessId = message.business_id;
                      if (!acc[businessId]) {
                        acc[businessId] = [];
                      }
                      acc[businessId].push(message);
                      return acc;
                    }, {} as Record<string, BusinessMessage[]>)
                  ).map(([businessId, messages]) => (
                    <div key={businessId} className="border rounded-lg p-4 space-y-4">
                      <div className="border-b pb-2 mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Conversation with {messages[0].business?.title || 'Unknown Business'}
                        </h3>
                      </div>
                      
                      <div className="space-y-3">
                        {messages
                          .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                          .map((message) => (
                          <div 
                            key={message.id} 
                            className={`p-3 rounded-lg max-w-[80%] ${
                              message.sender_id === user?.id 
                                ? 'ml-auto bg-blue-50 border border-blue-200' 
                                : 'mr-auto bg-gray-50 border border-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={message.sender_id === user?.id ? "default" : "secondary"}>
                                {message.sender_id === user?.id ? "You" : 
                                 message.is_from_owner ? "Business Owner" : "Customer"}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(message.created_at).toLocaleDateString()} at{' '}
                                {new Date(message.created_at).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{message.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default MyMessages;