import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Send, X, Upload, FileImage, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadBusinessMessageMedia, saveMediaRecord } from '@/services/businessMessageMediaService';

interface BusinessMessageProps {
  businessId: string;
}

const BusinessMessage = ({ businessId }: BusinessMessageProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validFiles = Array.from(files).filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/') || file.type === 'application/pdf';
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: "Only images, videos, and PDFs are allowed",
          variant: "destructive",
        });
        return false;
      }
      
      if (!isValidSize) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 10MB`,
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    });

    setMediaFiles(prev => [...prev, ...validFiles]);
  };

  const removeMediaFile = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSendMessage = async () => {
    if (!user || !message.trim()) return;

    setSending(true);
    setUploading(true);
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
      const { data: messageData, error } = await supabase
        .from('business_messages')
        .insert({
          business_id: businessId,
          sender_id: user.id,
          recipient_id: recipientId,
          message: message.trim(),
          is_from_owner: false,
          status: 'unread'
        })
        .select('id')
        .single();

      if (error) throw error;

      // Upload and save media files if any
      if (mediaFiles.length > 0 && messageData?.id) {
        for (const file of mediaFiles) {
          try {
            const mediaResult = await uploadBusinessMessageMedia(file, user.id);
            await saveMediaRecord(messageData.id, mediaResult);
          } catch (mediaError) {
            console.error('Error uploading media:', mediaError);
            toast({
              title: "Media upload warning",
              description: "Message sent but some media files failed to upload",
              variant: "destructive",
            });
          }
        }
      }

      toast({
        title: "Message sent!",
        description: "Your message has been sent to the business owner.",
      });

      setMessage('');
      setMediaFiles([]);
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
      setUploading(false);
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
        
        {/* Media Upload Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*,video/*,application/pdf"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="media-upload"
            />
            <label htmlFor="media-upload">
              <Button type="button" variant="outline" size="sm" asChild>
                <div className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Add Media
                </div>
              </Button>
            </label>
          </div>
          
          {/* Media Previews */}
          {mediaFiles.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {mediaFiles.map((file, index) => (
                <div key={index} className="relative border rounded-lg p-2">
                  <div className="flex items-center gap-2">
                    <FileImage className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMediaFile(index)}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  {file.type.startsWith('image/') && (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="w-full h-20 object-cover rounded mt-2"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowMessageForm(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSendMessage}
            disabled={!message.trim() || sending || uploading}
          >
            {sending || uploading ? (
              <>{uploading ? 'Uploading...' : 'Sending...'}</>
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