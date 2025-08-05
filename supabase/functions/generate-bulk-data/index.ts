import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { dataType, count = 10, neighborhoods } = await req.json();
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    const bostonNeighborhoods = neighborhoods || [
      'Allston–Brighton', 'Back Bay', 'Bay Village', 'Beacon Hill', 'Charlestown',
      'Chinatown / Leather District', 'Dorchester', 'Downtown', 'East Boston',
      'Fenway–Kenmore', 'Hyde Park', 'Jamaica Plain', 'Mattapan', 'Mission Hill',
      'North End', 'Roslindale', 'Roxbury', 'South Boston (a.k.a. "Southie")',
      'South End', 'West End', 'West Roxbury', 'Harbor Islands', 'Longwood Medical Area'
    ];

    let prompt = '';
    
    if (dataType === 'events') {
      prompt = `Generate ${count} realistic events for Boston neighborhoods. Return ONLY a JSON array with this exact structure:
      [
        {
          "title": "Event Name",
          "description": "Detailed description (2-3 sentences)",
          "category": "one of: Community, Arts & Culture, Sports & Recreation, Education, Health & Wellness, Business & Networking, Food & Dining, Entertainment, Family, Technology",
          "event_type": "event",
          "date": "YYYY-MM-DD (future dates within next 3 months)",
          "start_time": "HH:MM:SS",
          "end_time": "HH:MM:SS",
          "location": "Specific venue name and address in Boston",
          "address": "Full street address",
          "neighborhood": "one from: ${bostonNeighborhoods.join(', ')}",
          "price": 0-100,
          "max_attendees": 10-500,
          "is_recurring": false,
          "website_link": "https://example.com"
        }
      ]`;
    } else if (dataType === 'businesses') {
      prompt = `Generate ${count} realistic businesses for Boston neighborhoods. Return ONLY a JSON array with this exact structure:
      [
        {
          "title": "Business Name",
          "description": "Detailed business description (2-3 sentences)",
          "short_description": "Brief one-line description",
          "business_type": "one of: Restaurant, Retail, Service, Healthcare, Technology, Education, Entertainment, Nonprofit, Real Estate, Professional Services",
          "address": "Full street address in Boston",
          "neighborhood": "one from: ${bostonNeighborhoods.join(', ')}",
          "website_link": "https://example.com"
        }
      ]`;
    } else if (dataType === 'local_resources') {
      prompt = `Generate ${count} realistic local resources for Boston neighborhoods. Return ONLY a JSON array with this exact structure:
      [
        {
          "name": "Resource Name",
          "description": "Detailed description of the resource (2-3 sentences)",
          "category": "one of: Healthcare, Education, Government, Community Services, Transportation, Parks & Recreation, Libraries, Emergency Services, Social Services, Housing",
          "address": "Full street address in Boston",
          "neighborhood": "one from: ${bostonNeighborhoods.join(', ')}",
          "website_link": "https://example.com"
        }
      ]`;
    } else {
      throw new Error('Invalid dataType. Must be: events, businesses, or local_resources');
    }

    console.log('Generating data with ChatGPT...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are a data generator for Boston area listings. Generate realistic, diverse data that reflects the actual character of Boston neighborhoods. Return ONLY valid JSON arrays with no additional text or formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 4000
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', JSON.stringify(data, null, 2));
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid OpenAI response structure:', data);
      throw new Error('No content generated from OpenAI');
    }

    let generatedData;
    try {
      generatedData = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse JSON:', data.choices[0].message.content);
      throw new Error('Invalid JSON generated by ChatGPT');
    }

    if (!Array.isArray(generatedData)) {
      throw new Error('Generated data is not an array');
    }

    console.log(`Generated ${generatedData.length} ${dataType} records`);

    // Get admin user ID for created_by field
    const { data: adminUsers, error: adminError } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin')
      .limit(1);

    const adminUserId = adminUsers?.[0]?.user_id;

    // Prepare data for insertion
    const insertData = generatedData.map((item: any) => {
      const baseData = {
        ...item,
        created_by: adminUserId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Add village field for resources (can be same as neighborhood for simplicity)
      if (dataType === 'local_resources') {
        baseData.village = item.neighborhood;
      }

      return baseData;
    });

    // Insert into appropriate table
    const tableName = dataType === 'local_resources' ? 'local_resources' : dataType;
    const { data: insertedData, error: insertError } = await supabase
      .from(tableName)
      .insert(insertData)
      .select();

    if (insertError) {
      console.error('Insert error:', insertError);
      throw new Error(`Failed to insert data: ${insertError.message}`);
    }

    console.log(`Successfully inserted ${insertedData.length} records into ${tableName}`);

    return new Response(JSON.stringify({
      success: true,
      message: `Successfully generated and inserted ${insertedData.length} ${dataType} records`,
      count: insertedData.length,
      data: insertedData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in generate-bulk-data function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});