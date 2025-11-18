import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EventData {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  price?: number;
  start_time?: string;
  end_time?: string;
}

// Simple regex-based extraction for common patterns
function simpleExtract(html: string): Partial<EventData> | null {
  console.log('Attempting simple extraction...');
  
  const result: Partial<EventData> = {};
  
  // Try to extract title from meta tags or h1
  const titleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"/) ||
                     html.match(/<title>([^<]*)<\/title>/) ||
                     html.match(/<h1[^>]*>([^<]*)<\/h1>/);
  if (titleMatch) result.title = titleMatch[1].trim();
  
  // Try to extract description
  const descMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"/) ||
                    html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/);
  if (descMatch) result.description = descMatch[1].trim();
  
  // Try to find dates (simple patterns)
  const dateMatch = html.match(/\b(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})\b/) ||
                    html.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/i);
  if (dateMatch) result.date = dateMatch[0];
  
  // Try to find prices
  const priceMatch = html.match(/\$(\d+(?:\.\d{2})?)/);
  if (priceMatch) result.price = parseFloat(priceMatch[1]);
  
  console.log('Simple extraction result:', result);
  
  // Only return if we got at least title and one other field
  if (result.title && (result.description || result.date)) {
    return result;
  }
  
  return null;
}

// Use Lovable AI for complex extraction with tool calling
async function aiExtract(html: string, url: string): Promise<EventData | null> {
  console.log('Using AI extraction for:', url);
  
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  if (!LOVABLE_API_KEY) {
    throw new Error('LOVABLE_API_KEY not configured');
  }
  
  // Truncate HTML to reasonable size (AI context limits)
  const truncatedHtml = html.substring(0, 8000);
  
  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at extracting event information from HTML content. Extract structured event data accurately.'
        },
        {
          role: 'user',
          content: `Extract event information from this HTML:\n\n${truncatedHtml}\n\nSource URL: ${url}`
        }
      ],
      tools: [
        {
          type: 'function',
          function: {
            name: 'extract_event',
            description: 'Extract structured event data from HTML',
            parameters: {
              type: 'object',
              properties: {
                title: { type: 'string', description: 'Event title' },
                description: { type: 'string', description: 'Event description' },
                date: { type: 'string', description: 'Event date in YYYY-MM-DD format' },
                start_time: { type: 'string', description: 'Start time in HH:MM format' },
                end_time: { type: 'string', description: 'End time in HH:MM format' },
                location: { type: 'string', description: 'Event location/address' },
                category: { type: 'string', description: 'Event category' },
                price: { type: 'number', description: 'Event price (0 if free)' }
              },
              required: ['title', 'description', 'date', 'location', 'category'],
              additionalProperties: false
            }
          }
        }
      ],
      tool_choice: { type: 'function', function: { name: 'extract_event' } }
    }),
  });
  
  if (response.status === 429) {
    throw new Error('RATE_LIMIT: Too many requests. Try again later.');
  }
  
  if (response.status === 402) {
    throw new Error('PAYMENT_REQUIRED: AI credits exhausted. Add credits in Settings → Workspace → Usage.');
  }
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('AI API error:', response.status, errorText);
    throw new Error(`AI extraction failed: ${response.status}`);
  }
  
  const data = await response.json();
  console.log('AI response:', JSON.stringify(data, null, 2));
  
  // Extract tool call result
  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
  if (toolCall?.function?.arguments) {
    const extracted = JSON.parse(toolCall.function.arguments);
    console.log('Extracted event data:', extracted);
    return extracted;
  }
  
  return null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, testMode = true } = await req.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Scraping: ${url}`);
    
    // Fetch the page
    const pageResponse = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EventBot/1.0)'
      }
    });
    
    if (!pageResponse.ok) {
      throw new Error(`Failed to fetch page: ${pageResponse.status}`);
    }
    
    const html = await pageResponse.text();
    console.log(`Fetched ${html.length} bytes of HTML`);
    
    // Try simple extraction first
    let eventData = simpleExtract(html);
    let method = 'simple';
    
    // If simple extraction failed or incomplete, use AI
    if (!eventData || !eventData.location || !eventData.category) {
      console.log('Simple extraction incomplete, using AI...');
      eventData = await aiExtract(html, url);
      method = 'ai';
    }
    
    if (!eventData) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Could not extract event data from page' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // In test mode, just return the data
    if (testMode) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: eventData,
          method,
          message: 'Test successful - data not submitted to database'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Create Supabase client for submission
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get admin user (for submitted_by field)
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Submit to event_submissions table
    const { data: submission, error: submissionError } = await supabase
      .from('event_submissions')
      .insert({
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        start_time: eventData.start_time || null,
        end_time: eventData.end_time || null,
        location: eventData.location,
        category: eventData.category,
        price: eventData.price || 0,
        submitted_by: user.id,
        status: 'pending'
      })
      .select()
      .single();
    
    if (submissionError) {
      console.error('Submission error:', submissionError);
      throw submissionError;
    }
    
    console.log('Event submitted:', submission.id);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: submission,
        method,
        message: 'Event submitted for approval'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error: any) {
    console.error('Scraping error:', error);
    
    let errorMessage = error.message;
    let errorCode = 'UNKNOWN';
    
    if (errorMessage.startsWith('RATE_LIMIT:')) {
      errorCode = 'RATE_LIMIT';
    } else if (errorMessage.startsWith('PAYMENT_REQUIRED:')) {
      errorCode = 'PAYMENT_REQUIRED';
    }
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: errorMessage,
        code: errorCode
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
