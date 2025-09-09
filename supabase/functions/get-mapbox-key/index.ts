
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
    console.log('🔍 Checking for Mapbox secrets...');
    
    // Try multiple possible secret names
    const mapboxApiKey = Deno.env.get('MAPBOX_PUBLIC_KEY') || 
                        Deno.env.get('MAPBOX_PUBLIC_TOKEN') || 
                        Deno.env.get('MAPBOX_API_KEY');
    
    console.log('🔍 Available env vars:', {
      MAPBOX_PUBLIC_KEY: !!Deno.env.get('MAPBOX_PUBLIC_KEY'),
      MAPBOX_PUBLIC_TOKEN: !!Deno.env.get('MAPBOX_PUBLIC_TOKEN'), 
      MAPBOX_API_KEY: !!Deno.env.get('MAPBOX_API_KEY'),
      MAPBOX_SECRET: !!Deno.env.get('MAPBOX_SECRET'),
      selectedKey: mapboxApiKey ? mapboxApiKey.substring(0, 10) + '...' : 'None'
    });
    
    if (!mapboxApiKey) {
      console.log('❌ No Mapbox key found in any expected secret name')
      return new Response(
        JSON.stringify({ 
          error: 'No Mapbox key configured',
          availableSecrets: Object.keys(Deno.env.toObject()).filter(key => key.includes('MAPBOX'))
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    console.log('✅ Using Mapbox key, length:', mapboxApiKey.length, 'starts with:', mapboxApiKey.substring(0, 10))

    return new Response(
      JSON.stringify({ mapboxKey: mapboxApiKey }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('❌ Edge function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
