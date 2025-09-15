import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting PDF processing...');
    
    const formData = await req.formData();
    const pdfFile = formData.get('pdf') as File;
    
    if (!pdfFile) {
      throw new Error('No PDF file provided');
    }

    console.log('Processing PDF file:', pdfFile.name);
    
    // Convert PDF to base64 for processing
    const arrayBuffer = await pdfFile.arrayBuffer();
    const base64Pdf = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    
    // Use a simple text extraction approach for PDFs
    // In a real implementation, you'd use a proper PDF parsing library
    let extractedText = '';
    
    try {
      // Simple text extraction - in production you'd use pdf-parse or similar
      const decoder = new TextDecoder();
      const uint8Array = new Uint8Array(arrayBuffer);
      extractedText = decoder.decode(uint8Array);
      
      // Clean up the text to get readable content
      extractedText = extractedText.replace(/[^\x20-\x7E\n]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
        
      console.log('Extracted text length:', extractedText.length);
    } catch (error) {
      console.error('Text extraction error:', error);
      extractedText = 'Unable to extract text from PDF. Please fill the form manually.';
    }

    // Use OpenAI to parse the extracted text and structure it as event data
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Extract event information from the following text and return a JSON object with these fields:
            {
              "title": "event title",
              "description": "event description",
              "date": "YYYY-MM-DD format",
              "startTime": "HH:MM format",
              "endTime": "HH:MM format",
              "location": "event location/venue",
              "category": "event category",
              "price": "numeric value or 0 for free",
              "maxAttendees": "numeric value or null",
              "website": "website URL if mentioned",
              "registrationRequired": boolean
            }
            
            If any field cannot be determined from the text, set it to null or appropriate default value.`
          },
          {
            role: 'user',
            content: `Please extract event information from this text: ${extractedText.substring(0, 3000)}`
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      }),
    });

    const openAIResult = await openAIResponse.json();
    console.log('OpenAI response:', openAIResult);
    
    let eventData = {};
    try {
      const content = openAIResult.choices?.[0]?.message?.content;
      if (content) {
        eventData = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      eventData = {
        title: '',
        description: extractedText.substring(0, 500),
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        category: '',
        price: 0,
        maxAttendees: null,
        website: '',
        registrationRequired: false
      };
    }

    console.log('Extracted event data:', eventData);

    return new Response(
      JSON.stringify({
        success: true,
        extractedText: extractedText.substring(0, 1000), // Limit text for display
        eventData
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in extract-event-data function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        extractedText: '',
        eventData: {}
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});