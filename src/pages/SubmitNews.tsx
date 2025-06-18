
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Navigation } from '@/components/Navigation';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Newspaper, ArrowLeft } from 'lucide-react';

const SubmitNews = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    location: '',
    source: '',
    date_posted: new Date().toISOString().split('T')[0] // Today's date
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be signed in to submit news');
      return;
    }

    if (!formData.title || !formData.content || !formData.location || !formData.source) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('news_submissions')
        .insert({
          ...formData,
          submitted_by: user.id,
          status: 'pending'
        });

      if (error) throw error;

      toast.success('News submitted successfully! It will be reviewed by our admin team.');
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        location: '',
        source: '',
        date_posted: new Date().toISOString().split('T')[0]
      });
    } catch (error: any) {
      console.error('Error submitting news:', error);
      toast.error('Failed to submit news. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
          <div className="max-w-2xl mx-auto px-4">
            <Card>
              <CardContent className="p-8 text-center">
                <Newspaper className="h-16 w-16 mx-auto mb-4 text-purple-600" />
                <h3 className="text-xl font-semibold mb-2">Authentication Required</h3>
                <p className="text-gray-600 mb-4">You need to sign in to submit news for approval.</p>
                <Button onClick={() => window.location.href = '/auth'}>
                  Sign In
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => window.location.href = '/'}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit News</h1>
            <p className="text-gray-600">Share local news with the community</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Newspaper className="h-5 w-5 mr-2" />
                News Article Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">Article Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter the news article title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Where did this news happen?"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="source">Source *</Label>
                  <Input
                    id="source"
                    value={formData.source}
                    onChange={(e) => handleInputChange('source', e.target.value)}
                    placeholder="News source (e.g., Local Herald, City Council, etc.)"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="date_posted">Date Posted *</Label>
                  <Input
                    id="date_posted"
                    type="date"
                    value={formData.date_posted}
                    onChange={(e) => handleInputChange('date_posted', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="content">Article Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Write the full news article content here..."
                    rows={8}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit News Article'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default SubmitNews;
