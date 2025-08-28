
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
    // Use the provided public Mapbox token directly
    const mapboxApiKey = 'REPLACED_USE_MAPBOX_PUBLIC_KEY_FROM_ENV'
    
    console.log('✅ Using provided Mapbox public token')

    return new Response(
      JSON.stringify({ mapboxKey: mapboxApiKey }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
