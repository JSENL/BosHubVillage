import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Function to parse event data from extracted text using regex patterns
function parseEventDataFromText(text: string) {
  const eventData = {
    title: '',
    description: '',
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

  // Extract title (look for common title patterns)
  const titlePatterns = [
    /(?:event|title|name):\s*(.+)/i,
    /^(.+)(?:\n|\r\n)/,
    /(?:^|\n)([A-Z][A-Za-z\s]{10,50})(?:\n|\r\n)/
  ];
  
  for (const pattern of titlePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      eventData.title = match[1].trim();
      break;
    }
  }

  // Extract date (various date formats)
  const datePatterns = [
    /(?:date|when):\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
    /(\d{4}-\d{2}-\d{2})/,
    /(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},?\s+\d{4}/i
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      // Convert to YYYY-MM-DD format if needed
      const dateStr = match[1];
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        eventData.date = date.toISOString().split('T')[0];
        break;
      }
    }
  }

  // Extract time (start and end times)
  const timePatterns = [
    /(?:time|when):\s*(\d{1,2}:\d{2}(?:\s*[ap]m)?)\s*(?:to|-)?\s*(\d{1,2}:\d{2}(?:\s*[ap]m)?)?/i,
    /(\d{1,2}:\d{2}(?:\s*[ap]m)?)\s*(?:to|-)?\s*(\d{1,2}:\d{2}(?:\s*[ap]m)?)/i
  ];

  for (const pattern of timePatterns) {
    const match = text.match(pattern);
    if (match) {
      if (match[1]) {
        eventData.startTime = normalizeTime(match[1]);
      }
      if (match[2]) {
        eventData.endTime = normalizeTime(match[2]);
      }
      break;
    }
  }

  // Extract location
  const locationPatterns = [
    /(?:location|venue|where|address):\s*(.+?)(?:\n|$)/i,
    /(?:at|@)\s+([A-Za-z\s,]+(?:street|avenue|road|boulevard|center|hall|park|building))/i
  ];

  for (const pattern of locationPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      eventData.location = match[1].trim();
      break;
    }
  }

  // Extract price
  const pricePatterns = [
    /(?:price|cost|fee):\s*\$?(\d+(?:\.\d{2})?)/i,
    /\$(\d+(?:\.\d{2})?)/,
    /free/i
  ];

  for (const pattern of pricePatterns) {
    const match = text.match(pattern);
    if (match) {
      if (pattern.toString().includes('free')) {
        eventData.price = 0;
      } else if (match[1]) {
        eventData.price = parseFloat(match[1]);
      }
      break;
    }
  }

  // Extract website/URL
  const urlPattern = /https?:\/\/[^\s]+/i;
  const urlMatch = text.match(urlPattern);
  if (urlMatch) {
    eventData.website = urlMatch[0];
  }

  // Extract capacity/max attendees
  const capacityPatterns = [
    /(?:capacity|max|maximum|limit):\s*(\d+)/i,
    /(\d+)\s*(?:people|attendees|guests|seats)/i
  ];

  for (const pattern of capacityPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      eventData.maxAttendees = parseInt(match[1]);
      break;
    }
  }

  // Check for registration requirement
  const registrationPattern = /(?:registration|rsvp|sign\s*up|register)\s*(?:required|needed)/i;
  eventData.registrationRequired = registrationPattern.test(text);

  // Set description to first few sentences if no specific description found
  if (!eventData.description) {
    const sentences = text.split(/[.!?]+/).slice(0, 3);
    eventData.description = sentences.join('. ').trim().substring(0, 500);
  }

  // Try to determine category based on keywords
  const categoryKeywords = {
    'conference': ['conference', 'summit', 'symposium', 'seminar'],
    'workshop': ['workshop', 'training', 'course', 'class'],
    'social': ['party', 'celebration', 'gathering', 'meetup'],
    'sports': ['game', 'match', 'tournament', 'sports'],
    'music': ['concert', 'music', 'performance', 'show'],
    'food': ['dinner', 'lunch', 'food', 'restaurant', 'culinary'],
    'education': ['lecture', 'presentation', 'educational', 'learning']
  };

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => text.toLowerCase().includes(keyword))) {
      eventData.category = category;
      break;
    }
  }

  return eventData;
}

// Helper function to normalize time format
function normalizeTime(timeStr: string): string {
  const time = timeStr.toLowerCase().trim();
  
  // If already in 24-hour format, return as is
  if (/^\d{2}:\d{2}$/.test(time)) {
    return time;
  }
  
  // Convert 12-hour format to 24-hour format
  const match = time.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/);
  if (match) {
    let hours = parseInt(match[1]);
    const minutes = match[2];
    const period = match[3];
    
    if (period === 'pm' && hours !== 12) {
      hours += 12;
    } else if (period === 'am' && hours === 12) {
      hours = 0;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }
  
  return timeStr;
}

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
    
    // Extract text from PDF using pure JavaScript
    const arrayBuffer = await pdfFile.arrayBuffer();
    let extractedText = '';
    
    try {
      // Import pdf-parse for Deno
      const { default: pdfParse } = await import('https://esm.sh/pdf-parse@1.1.1');
      
      // Parse PDF and extract text
      const data = await pdfParse(new Uint8Array(arrayBuffer));
      extractedText = data.text;
      
      console.log('Extracted text length:', extractedText.length);
      console.log('Number of pages:', data.numpages);
    } catch (error) {
      console.error('PDF parsing error:', error);
      extractedText = 'Unable to extract text from PDF. Please fill the form manually.';
    }

    // Parse the extracted text using regex patterns to find event information
    const eventData = parseEventDataFromText(extractedText);

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