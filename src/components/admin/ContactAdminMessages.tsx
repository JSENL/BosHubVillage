import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

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

const ContactAdminMessages = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactAdminMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingMessages, setUpdatingMessages] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isAdmin) return;
    fetchMessages();
  }, [isAdmin]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_admin')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching contact admin messages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch contact admin messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (messageId: string, completed: boolean) => {
    setUpdatingMessages(prev => new Set(prev).add(messageId));
    
    try {
      const { error } = await supabase
        .from('contact_admin')
        .update({ 
          status: completed ? 'completed' : 'pending',
          updated_at: new Date().toISOString()
        })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => 
        prev.map(message => 
          message.id === messageId 
            ? { ...message, status: completed ? 'completed' : 'pending' }
            : message
        )
      );

      toast({
        title: "Success",
        description: `Message marked as ${completed ? 'completed' : 'pending'}`,
      });
    } catch (error) {
      console.error('Error updating message status:', error);
      toast({
        title: "Error",
        description: "Failed to update message status",
        variant: "destructive",
      });
    } finally {
      setUpdatingMessages(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
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

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reported to Admin</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading messages...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reported to Admin</CardTitle>
        <p className="text-sm text-muted-foreground">
          Manage contact admin messages and mark them as completed
        </p>
      </CardHeader>
      <CardContent>
        {messages.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No contact admin messages found
          </p>
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
                      <strong>From:</strong> {message.user_name || 'Anonymous'} ({message.user_email})
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(message.created_at).toLocaleDateString()} at{' '}
                      {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`completed-${message.id}`}
                      checked={message.status === 'completed'}
                      onCheckedChange={(checked) => 
                        handleStatusChange(message.id, checked as boolean)
                      }
                      disabled={updatingMessages.has(message.id)}
                    />
                    <label 
                      htmlFor={`completed-${message.id}`} 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {updatingMessages.has(message.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Completed'
                      )}
                    </label>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm">{message.message}</p>
                </div>
                {message.admin_response && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm font-medium text-blue-900">Admin Response:</p>
                    <p className="text-sm text-blue-800">{message.admin_response}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactAdminMessages;