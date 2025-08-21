import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Reply, Paperclip, X, Image, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BusinessMessageMedia } from '@/components/business/BusinessMessageMedia';
import { uploadBusinessMessageMedia, saveMediaRecord } from '@/services/businessMessageMediaService';

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
  media?: Array<{
    id: string;
    file_name: string;
    file_path: string;
    file_type: string;
    file_size: number;
  }>;
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user && businessId) {
      fetchMessages();
    }
  }, [user, businessId]);

  const fetchMessages = async () => {
    console.log('🔍 Fetching messages for business ID:', businessId, 'User ID:', user?.id);
    try {
      // Simple query to get all messages for this business with media
      const { data, error } = await supabase
        .from('business_messages')
        .select(`
          *,
          business_message_media (
            id,
            file_name,
            file_path,
            file_type,
            file_size
          )
        `)
        .eq('business_id', businessId)
        .order('created_at', { ascending: true });

      console.log('📬 Messages query result:', { 
        data, 
        error, 
        count: data?.length,
        businessId,
        messages: data?.map(m => ({ id: m.id, message: m.message, sender: m.sender_id }))
      });

      if (error) {
        console.error('❌ Error fetching messages:', error);
        throw error;
      }
      
      // Get unique user IDs (both senders and recipients)
      const allUserIds = [...new Set([
        ...(data || []).map(msg => msg.sender_id),
        ...(data || []).map(msg => msg.recipient_id)
      ])].filter(Boolean);
      
      console.log('👥 Fetching profiles for user IDs:', allUserIds);
      
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', allUserIds);

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
        sender_profile: profiles?.find(p => p.id === message.sender_id) || null,
        recipient_profile: profiles?.find(p => p.id === message.recipient_id) || null,
        business: business || null,
        media: message.business_message_media || []
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
    setUploading(selectedFiles.length > 0);
    
    try {
      // Insert the message first
      const { data: messageData, error: messageError } = await supabase
        .from('business_messages')
        .insert({
          business_id: businessId,
          sender_id: user.id,
          recipient_id: replyTo,
          message: replyMessage.trim(),
          is_from_owner: true,
          status: 'unread'
        })
        .select('id')
        .single();

      if (messageError) throw messageError;

      // Upload and save media files if any
      if (selectedFiles.length > 0 && messageData) {
        for (const file of selectedFiles) {
          try {
            const mediaData = await uploadBusinessMessageMedia(file, user.id);
            await saveMediaRecord(messageData.id, mediaData);
          } catch (mediaError) {
            console.error('Error uploading media:', mediaError);
            toast({
              title: "Media upload failed",
              description: `Failed to upload ${file.name}`,
              variant: "destructive",
            });
          }
        }
      }

      toast({
        title: "Reply sent!",
        description: "Your reply has been sent.",
      });

      setReplyMessage('');
      setReplyTo(null);
      setSelectedFiles([]);
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
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || 
                         file.type.startsWith('video/') || 
                         file.type === 'application/pdf';
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported file type.`,
          variant: "destructive",
        });
      }
      
      if (!isValidSize) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 10MB.`,
          variant: "destructive",
        });
      }
      
      return isValidType && isValidSize;
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
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
        <p className="text-muted-foreground">No messages for this business yet.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Messages from customers will appear here when they use the "Message" button on your business page.
        </p>
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
                {(message as any).sender_profile && (
                  <p className="text-sm text-muted-foreground">
                    From: {(message as any).sender_profile.full_name || (message as any).sender_profile.email}
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
            {message.media && message.media.length > 0 && (
              <BusinessMessageMedia media={message.media} />
            )}
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
              
              {/* File attachments */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Attachments:</p>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        {file.type.startsWith('image/') && <Image className="h-4 w-4" />}
                        {file.type.startsWith('video/') && <Video className="h-4 w-4" />}
                        <span className="text-sm truncate">{file.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={sending || uploading}
                  >
                    <Paperclip className="h-4 w-4 mr-1" />
                    Attach
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*,.pdf"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setReplyTo(null);
                      setReplyMessage('');
                      setSelectedFiles([]);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleReply}
                    disabled={!replyMessage.trim() || sending || uploading}
                  >
                    {uploading ? (
                      <>Uploading...</>
                    ) : sending ? (
                      <>Sending...</>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Reply
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default BusinessMessages;