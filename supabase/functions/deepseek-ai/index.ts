import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DeepSeekRequest {
  query: string;
  type: 'event_search' | 'categorize' | 'enhance_description' | 'location_suggest';
  context?: {
    location?: string;
    neighborhood?: string;
    category?: string;
    existing_content?: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authorization header exists
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create client with user's token to verify authentication
    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify the user's token
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);

    if (claimsError || !claimsData?.claims) {
      console.error('Failed to verify token:', claimsError);
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log('Authenticated user:', userId);

    const { query, type, context }: DeepSeekRequest = await req.json();
    console.log('DeepSeek AI request:', { query, type, context });

    if (!query) {
      throw new Error('Query is required');
    }

    const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY');
    if (!deepseekApiKey) {
      throw new Error('DEEPSEEK_API_KEY is not configured');
    }

    // Build system prompt based on request type
    let systemPrompt = '';
    let userPrompt = query;

    switch (type) {
      case 'event_search':
        systemPrompt = `You are an AI assistant that helps users find relevant events in Boston. 
        Given a user's search query, provide intelligent suggestions for events they might be interested in.
        Consider location, timing, categories, and user preferences.
        Return your response as a JSON object with suggestions and explanations.`;
        
        if (context?.location) {
          userPrompt += ` Location preference: ${context.location}`;
        }
        if (context?.neighborhood) {
          userPrompt += ` Neighborhood: ${context.neighborhood}`;
        }
        break;

      case 'categorize':
        systemPrompt = `You are an AI assistant that categorizes events, businesses, and local resources.
        Given content, determine the most appropriate category and provide reasoning.
        Available categories for events: Arts & Culture, Sports & Recreation, Education, Community, Food & Dining, Entertainment, Family, Health & Wellness
        Available categories for businesses: Restaurant, Retail, Service, Healthcare, Technology, Education, Entertainment, Nonprofit, Professional Services, Food & Dining, Beauty & Wellness, Auto Services, Home Services
        Available categories for local resources: Healthcare, Education, Government, Libraries, Community Services, Parks & Recreation, Social Services, Emergency Services, Housing, Transportation
        Return a JSON object with the suggested category and confidence score.`;
        break;

      case 'enhance_description':
        systemPrompt = `You are an AI assistant that enhances content descriptions for events, businesses, and local resources in Boston.
        Given basic content, create an engaging, informative, and well-written description that would attract visitors and provide useful information.
        Keep the tone professional but welcoming, and include relevant details about Boston context when appropriate.`;
        
        if (context?.existing_content) {
          userPrompt = `Please enhance this content: ${context.existing_content}\n\nUser query: ${query}`;
        }
        break;

      case 'location_suggest':
        systemPrompt = `You are an AI assistant that suggests locations and neighborhoods in Boston.
        Given a query about events, businesses, or activities, suggest appropriate Boston neighborhoods and specific locations.
        Consider factors like accessibility, popularity, and relevance to the user's needs.
        Return suggestions as a JSON object with neighborhoods and reasoning.`;
        break;

      default:
        throw new Error('Invalid request type');
    }

    console.log('Calling DeepSeek API with:', { type, systemPrompt: systemPrompt.substring(0, 100) + '...' });

    // Call DeepSeek API
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deepseekApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        stream: false
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('DeepSeek API error:', error);
      throw new Error(`DeepSeek API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    console.log('DeepSeek API response received');

    const aiResponse = data.choices?.[0]?.message?.content;
    if (!aiResponse) {
      throw new Error('No response from DeepSeek API');
    }

    // Try to parse as JSON if the response type expects structured data
    let parsedResponse;
    if (type === 'event_search' || type === 'categorize' || type === 'location_suggest') {
      try {
        parsedResponse = JSON.parse(aiResponse);
      } catch (e) {
        // If parsing fails, return the raw response
        parsedResponse = { response: aiResponse, raw: true };
      }
    } else {
      parsedResponse = { response: aiResponse };
    }

    console.log('Successfully processed DeepSeek response');

    return new Response(
      JSON.stringify({
        success: true,
        type,
        data: parsedResponse,
        query,
        context
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in deepseek-ai function:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        details: 'Check the edge function logs for more information'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});