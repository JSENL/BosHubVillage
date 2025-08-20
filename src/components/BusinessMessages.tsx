import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Reply } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BusinessMessage {
  id: string;
  business_id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  is_from_owner: boolean;
  status: string;
  created_at: string;
  profiles?: {
    full_name: string | null;
    email: string;
  } | null;
  business?: {
    title: string;
  } | null;
}

interface BusinessMessagesProps {
  businessId: string;
}

const BusinessMessages = ({ businessId }: BusinessMessagesProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<BusinessMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (user && businessId) {
      fetchMessages();
    }
  }, [user, businessId]);

  const fetchMessages = async () => {
    console.log('🔍 Fetching messages for business:', businessId, 'current user:', user?.id);
    try {
      const { data, error } = await supabase
        .from('business_messages')
        .select('*')
        .eq('business_id', businessId)
        .or(`sender_id.eq.${user?.id},recipient_id.eq.${user?.id}`)
        .order('created_at', { ascending: true });

      console.log('📬 Messages query result:', { data, error, businessId, userId: user?.id });

      if (error) throw error;
      
      // Get sender profiles separately
      const senderIds = [...new Set((data || []).map(msg => msg.sender_id))];
      console.log('👤 Sender IDs to fetch:', senderIds);
      
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', senderIds);

      console.log('👤 Profiles fetched:', profiles);

      // Get business info
      const { data: business } = await supabase
        .from('business')
        .select('title')
        .eq('id', businessId)
        .single();

      console.log('🏢 Business info:', business);

      // Combine the data
      const messagesWithProfiles = (data || []).map(message => ({
        ...message,
        profiles: profiles?.find(p => p.id === message.sender_id) || null,
        business: business || null
      }));

      console.log('📧 Final messages with profiles:', messagesWithProfiles);
      setMessages(messagesWithProfiles as unknown as BusinessMessage[]);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!user || !replyMessage.trim() || !replyTo) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('business_messages')
        .insert({
          business_id: businessId,
          sender_id: user.id,
          recipient_id: replyTo,
          message: replyMessage.trim(),
          is_from_owner: true,
          status: 'unread'
        });

      if (error) throw error;

      toast({
        title: "Reply sent!",
        description: "Your reply has been sent.",
      });

      setReplyMessage('');
      setReplyTo(null);
      fetchMessages();
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: "Error",
        description: "Failed to send reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Loading messages...</p>
        </CardContent>
      </Card>
    );
  }

  if (messages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Business Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No messages yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Business Messages ({messages.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="border rounded-lg p-4 space-y-2">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={message.is_from_owner ? "default" : "secondary"}>
                    {message.is_from_owner ? "You" : "Customer"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(message.created_at).toLocaleDateString()} at{' '}
                    {new Date(message.created_at).toLocaleTimeString()}
                  </span>
                </div>
                {message.profiles && (
                  <p className="text-sm text-muted-foreground">
                    From: {message.profiles.full_name || message.profiles.email}
                  </p>
                )}
              </div>
              {!message.is_from_owner && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setReplyTo(message.sender_id)}
                >
                  <Reply className="h-4 w-4 mr-1" />
                  Reply
                </Button>
              )}
            </div>
            <p className="text-sm">{message.message}</p>
          </div>
        ))}

        {replyTo && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Reply to Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Type your reply..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setReplyTo(null);
                    setReplyMessage('');
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleReply}
                  disabled={!replyMessage.trim() || sending}
                >
                  {sending ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Reply
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default BusinessMessages;