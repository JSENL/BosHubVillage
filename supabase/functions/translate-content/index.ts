import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

interface TranslateRequest {
  table: 'events' | 'business' | 'local_resources' | 'news';
  id: string;
  field: string;
  targetLanguage: 'fr' | 'es' | 'vi' | 'zh' | 'ar' | 'it' | 'pt' | 'kea';
}

const languageNames = {
  'fr': 'French',
  'es': 'Spanish', 
  'vi': 'Vietnamese',
  'zh': 'Chinese',
  'ar': 'Arabic',
  'it': 'Italian',
  'pt': 'Portuguese',
  'kea': 'Cape Verdean Creole (Kriolu)'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { table, id, field, targetLanguage }: TranslateRequest = await req.json();
    
    console.log(`Translating ${table}.${field} for ID ${id} to ${targetLanguage}`);

    // Validate inputs
    if (!table || !id || !field || !targetLanguage) {
      throw new Error('Missing required parameters: table, id, field, targetLanguage');
    }

    // Get the current record to check if translation exists and get source text
    const { data: record, error: fetchError } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !record) {
      throw new Error(`Failed to fetch record: ${fetchError?.message}`);
    }

    const translationField = `${field}_translations`;
    const existingTranslations = record[translationField] || {};

    // Check if translation already exists
    if (existingTranslations[targetLanguage]) {
      console.log(`Translation already exists for ${targetLanguage}`);
      return new Response(
        JSON.stringify({
          success: true,
          cached: true,
          translation: existingTranslations[targetLanguage],
          language: targetLanguage
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get source text
    const sourceText = record[field];
    if (!sourceText) {
      throw new Error(`Source field ${field} is empty or null`);
    }

    // Check for OpenAI API key
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    // Translate using OpenAI
    const systemPrompt = `You are a professional translator. Translate the given text to ${languageNames[targetLanguage]} while preserving the original meaning, tone, and context. 
    
    For proper nouns (names of places, people, businesses, events), keep them in their original form unless there's a commonly accepted translation.
    For addresses and location names, translate descriptive parts but keep street names and specific location identifiers.
    
    Return ONLY the translated text without any additional commentary or explanation.`;

    console.log(`Calling OpenAI API to translate to ${languageNames[targetLanguage]}`);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: sourceText }
        ],
        max_tokens: 1000,
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const translation = data.choices?.[0]?.message?.content?.trim();

    if (!translation) {
      throw new Error('No translation received from OpenAI');
    }

    console.log(`Translation completed: ${translation.substring(0, 100)}...`);

    // Update the translations in the database
    const updatedTranslations = {
      ...existingTranslations,
      [targetLanguage]: translation
    };

    const { error: updateError } = await supabase
      .from(table)
      .update({ [translationField]: updatedTranslations })
      .eq('id', id);

    if (updateError) {
      console.error('Database update error:', updateError);
      throw new Error(`Failed to save translation: ${updateError.message}`);
    }

    console.log(`Translation saved successfully to database`);

    return new Response(
      JSON.stringify({
        success: true,
        cached: false,
        translation,
        language: targetLanguage,
        sourceText
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in translate-content function:', error);
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