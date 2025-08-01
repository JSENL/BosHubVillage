import React from 'react';
import { Share2, Facebook, Linkedin, Mail, MessageCircle, Instagram, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SocialShareProps {
  title: string;
  description: string;
  url: string;
  hashtags?: string[];
}

export const SocialShare: React.FC<SocialShareProps> = ({ 
  title, 
  description, 
  url, 
  hashtags = [] 
}) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const hashtagString = hashtags.map(tag => `#${tag}`).join(' ');
  const encodedHashtags = encodeURIComponent(hashtagString);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&t=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
    instagram: `https://www.instagram.com/`, // Instagram doesn't support direct URL sharing
    snapchat: `https://www.snapchat.com/scan?attachmentUrl=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
    sms: `sms:?body=${encodedTitle}%0A${encodedDescription}%0A${encodedUrl}`
  };

  const handleShare = (platform: string) => {
    const link = shareLinks[platform as keyof typeof shareLinks];
    
    if (platform === 'instagram') {
      // For Instagram, we'll copy the link to clipboard and show a message
      navigator.clipboard.writeText(`${title}\n${description}\n${url}\n${hashtagString}`);
      alert("Event details copied to clipboard! You can now paste this in your Instagram story or post.");
      return;
    }
    
    if (platform === 'sms' || platform === 'email') {
      window.location.href = link;
    } else {
      window.open(link, '_blank', 'width=600,height=400');
    }
  };

  // Web Share API fallback for modern browsers
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="lg" className="border-purple-200 text-purple-600 hover:bg-purple-50">
          <Share2 className="h-4 w-4 mr-2" />
          Share Event
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem onClick={() => handleShare('facebook')}>
          <Facebook className="h-4 w-4 mr-2 text-blue-600" />
          Share on Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('linkedin')}>
          <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
          Share on LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('instagram')}>
          <Instagram className="h-4 w-4 mr-2 text-pink-600" />
          Share on Instagram
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('snapchat')}>
          <Camera className="h-4 w-4 mr-2 text-yellow-500" />
          Share on Snapchat
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('email')}>
          <Mail className="h-4 w-4 mr-2 text-gray-600" />
          Share via Email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('sms')}>
          <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
          Share via Text
        </DropdownMenuItem>
        {navigator.share && (
          <DropdownMenuItem onClick={handleNativeShare}>
            <Share2 className="h-4 w-4 mr-2 text-purple-600" />
            More Options
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};