import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type DeepSeekRequestType = 'event_search' | 'categorize' | 'enhance_description' | 'location_suggest';

interface DeepSeekContext {
  location?: string;
  neighborhood?: string;
  category?: string;
  existing_content?: string;
}

interface DeepSeekRequest {
  query: string;
  type: DeepSeekRequestType;
  context?: DeepSeekContext;
}

interface DeepSeekResponse {
  success: boolean;
  type: DeepSeekRequestType;
  data: any;
  query: string;
  context?: DeepSeekContext;
  error?: string;
}

export const useDeepSeekAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callDeepSeek = async (request: DeepSeekRequest): Promise<DeepSeekResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Calling DeepSeek AI:', request);

      const { data, error: invokeError } = await supabase.functions.invoke('deepseek-ai', {
        body: request
      });

      if (invokeError) {
        console.error('Supabase function invoke error:', invokeError);
        throw new Error(invokeError.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'DeepSeek AI request failed');
      }

      console.log('DeepSeek AI response:', data);
      return data;

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to process AI request';
      console.error('DeepSeek AI error:', err);
      setError(errorMessage);
      toast.error(`AI Error: ${errorMessage}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Specific helper methods for different use cases
  const searchEvents = async (query: string, context?: { location?: string; neighborhood?: string }) => {
    return await callDeepSeek({
      query,
      type: 'event_search',
      context
    });
  };

  const categorizeContent = async (content: string) => {
    return await callDeepSeek({
      query: content,
      type: 'categorize'
    });
  };

  const enhanceDescription = async (content: string, existingContent?: string) => {
    return await callDeepSeek({
      query: content,
      type: 'enhance_description',
      context: existingContent ? { existing_content: existingContent } : undefined
    });
  };

  const suggestLocations = async (query: string) => {
    return await callDeepSeek({
      query,
      type: 'location_suggest'
    });
  };

  return {
    isLoading,
    error,
    callDeepSeek,
    searchEvents,
    categorizeContent,
    enhanceDescription,
    suggestLocations
  };
};