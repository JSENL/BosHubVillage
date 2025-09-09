
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
    // Get Mapbox key from Supabase secrets
    const mapboxApiKey = Deno.env.get('MAPBOX_PUBLIC_KEY')
    
    if (!mapboxApiKey) {
      console.log('❌ MAPBOX_PUBLIC_KEY not found in secrets')
      return new Response(
        JSON.stringify({ error: 'MAPBOX_PUBLIC_KEY not configured in secrets' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    console.log('✅ Using Mapbox public key from secrets, length:', mapboxApiKey.length)

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
