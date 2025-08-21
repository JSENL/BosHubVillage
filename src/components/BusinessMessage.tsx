import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Send, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BusinessMessageProps {
  businessId: string;
}

const BusinessMessage = ({ businessId }: BusinessMessageProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendMessage = async () => {
    if (!user || !message.trim()) return;

    setSending(true);
    try {
      // Get business owner info
      const { data: businessOwner, error: ownerError } = await supabase
        .from('business_owner')
        .select('owner_id')
        .eq('business_id', businessId)
        .maybeSingle();

      if (ownerError) throw ownerError;
      
      let recipientId: string;
      
      if (!businessOwner) {
        // Check if this business has a created_by field we can use
        const { data: businessData } = await supabase
          .from('business')
          .select('created_by, title')
          .eq('id', businessId)
          .single();
        
        if (businessData?.created_by) {
          // Fallback to the business creator as the owner (no client-side ownership creation)
          recipientId = businessData.created_by;
        } else {
          toast({
            title: "Unable to send message",
            description: "This business doesn't have an owner on record yet.",
            variant: "destructive",
          });
          return;
        }
      } else {
        recipientId = businessOwner.owner_id;
      }

      // Send message
      const { error } = await supabase
        .from('business_messages')
        .insert({
          business_id: businessId,
          sender_id: user.id,
          recipient_id: recipientId,
          message: message.trim(),
          is_from_owner: false,
          status: 'unread'
        });

      if (error) throw error;

      toast({
        title: "Message sent!",
        description: "Your message has been sent to the business owner.",
      });

      setMessage('');
      setShowMessageForm(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  if (!user) {
    return null;
  }

  if (!showMessageForm) {
    return (
      <Button 
        onClick={() => setShowMessageForm(true)}
        className="flex items-center gap-2"
      >
        <MessageSquare className="h-4 w-4" />
        Message
      </Button>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Send Message to Business Owner</CardTitle>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setShowMessageForm(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
        />
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowMessageForm(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSendMessage}
            disabled={!message.trim() || sending}
          >
            {sending ? (
              <>Sending...</>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessMessage;