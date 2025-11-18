import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, CheckCircle, AlertCircle, Info } from 'lucide-react';

export const EventScraperTest = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testScrape = async () => {
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const { data, error: funcError } = await supabase.functions.invoke('scrape-events', {
        body: { url, testMode: true }
      });

      if (funcError) throw funcError;

      if (!data.success) {
        setError(data.error || 'Scraping failed');
        
        if (data.code === 'RATE_LIMIT') {
          toast.error('Rate limit exceeded - too many requests. Try again in a minute.');
        } else if (data.code === 'PAYMENT_REQUIRED') {
          toast.error('AI credits exhausted. Add credits in Settings → Workspace → Usage.');
        } else {
          toast.error(data.error || 'Scraping failed');
        }
        return;
      }

      setResult(data);
      toast.success(`Successfully extracted event using ${data.method} method`);
    } catch (err: any) {
      console.error('Test error:', err);
      setError(err.message);
      toast.error('Failed to test scraper: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const submitToDatabase = async () => {
    if (!url) return;

    setIsLoading(true);
    try {
      const { data, error: funcError } = await supabase.functions.invoke('scrape-events', {
        body: { url, testMode: false }
      });

      if (funcError) throw funcError;

      if (!data.success) {
        throw new Error(data.error || 'Submission failed');
      }

      toast.success('Event submitted for approval!');
      setResult(data);
    } catch (err: any) {
      console.error('Submit error:', err);
      toast.error('Failed to submit: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Event Scraper Test</CardTitle>
        <CardDescription>
          Test the hybrid event scraper (direct parsing + AI fallback)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            The scraper tries simple regex extraction first (free), then falls back to Lovable AI for complex pages.
            Rate limits: 429 = too many requests, 402 = credits exhausted.
          </AlertDescription>
        </Alert>

        <div className="flex gap-2">
          <Input
            placeholder="Enter event page URL (e.g., https://example.com/events/concert)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
          />
          <Button onClick={testScrape} disabled={isLoading || !url}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              'Test'
            )}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && result.success && (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <strong>Extraction Method:</strong> {result.method === 'simple' ? 'Direct Parsing (Free)' : 'AI Extraction (Uses Credits)'}
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Extracted Event Data</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="font-semibold">Title:</dt>
                    <dd>{result.data.title || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Description:</dt>
                    <dd className="whitespace-pre-wrap">{result.data.description || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Date:</dt>
                    <dd>{result.data.date || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Time:</dt>
                    <dd>{result.data.start_time || 'N/A'} {result.data.end_time && `- ${result.data.end_time}`}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Location:</dt>
                    <dd>{result.data.location || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Category:</dt>
                    <dd>{result.data.category || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Price:</dt>
                    <dd>${result.data.price || 0}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {result.message?.includes('Test successful') && (
              <Button onClick={submitToDatabase} disabled={isLoading} className="w-full">
                Submit to Database for Approval
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
