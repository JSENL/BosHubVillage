import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🔍 Fetching Mapbox key...');
    
    // Get the Mapbox token from secrets
    const mapboxKey = Deno.env.get('MAP_PUBLIC_KEY');
    
    if (!mapboxKey) {
      console.log('❌ MAP_PUBLIC_KEY not found');
      return new Response(
        JSON.stringify({ error: 'MAP_PUBLIC_KEY not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    console.log('✅ Mapbox key found, length:', mapboxKey.length);

    return new Response(
      JSON.stringify({ mapboxKey: mapboxKey }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('❌ Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})