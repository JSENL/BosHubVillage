import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Supported target languages for the site
const targetLanguages = ['es', 'fr', 'vi', 'pt'] as const;
type TargetLanguage = typeof targetLanguages[number];

const languageNames: Record<string, string> = {
  'es': 'Spanish',
  'fr': 'French', 
  'vi': 'Vietnamese',
  'pt': 'Portuguese',
};

// Field mappings for each table type
const tableFieldMappings: Record<string, string[]> = {
  events: ['title', 'description', 'location', 'category'],
  business: ['title', 'description', 'short_description', 'address'],
  local_resources: ['name', 'description', 'address'],
  news: ['title', 'content', 'location'],
};

interface TranslateRequest {
  table: 'events' | 'business' | 'local_resources' | 'news';
  id: string;
  field?: string;
  targetLanguage?: TargetLanguage;
  mode?: 'single' | 'batch'; // batch translates all fields to all languages
}

async function translateText(text: string, targetLanguage: string): Promise<string> {
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  if (!LOVABLE_API_KEY) {
    throw new Error('LOVABLE_API_KEY is not configured');
  }

  const systemPrompt = `You are a professional translator. Translate the given text to ${languageNames[targetLanguage]} while preserving the original meaning, tone, and context. 

For proper nouns (names of places, people, businesses, events), keep them in their original form unless there's a commonly accepted translation.
For addresses and location names, translate descriptive parts but keep street names and specific location identifiers.

Return ONLY the translated text without any additional commentary or explanation.`;

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      max_tokens: 2000,
      temperature: 0.3
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Lovable AI API error:', errorText);
    
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    if (response.status === 402) {
      throw new Error('AI credits exhausted. Please add funds to your workspace.');
    }
    
    throw new Error(`AI API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const translation = data.choices?.[0]?.message?.content?.trim();

  if (!translation) {
    throw new Error('No translation received from AI');
  }

  return translation;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { table, id, field, targetLanguage, mode = 'single' }: TranslateRequest = await req.json();
    
    console.log(`Translation request: table=${table}, id=${id}, mode=${mode}`);

    // Validate inputs
    if (!table || !id) {
      throw new Error('Missing required parameters: table, id');
    }

    // Get the current record
    const { data: record, error: fetchError } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !record) {
      throw new Error(`Failed to fetch record: ${fetchError?.message}`);
    }

    // Batch mode: translate all fields to all languages
    if (mode === 'batch') {
      const fields = tableFieldMappings[table];
      if (!fields) {
        throw new Error(`Unknown table: ${table}`);
      }

      console.log(`Batch translating ${fields.length} fields to ${targetLanguages.length} languages`);

      const updates: Record<string, Record<string, string>> = {};
      let translationCount = 0;

      for (const fieldName of fields) {
        const sourceText = record[fieldName];
        if (!sourceText || typeof sourceText !== 'string' || sourceText.trim() === '') {
          console.log(`Skipping empty field: ${fieldName}`);
          continue;
        }

        const translationField = `${fieldName}_translations`;
        const existingTranslations = record[translationField] || {};
        const newTranslations = { ...existingTranslations };

        for (const lang of targetLanguages) {
          // Skip if translation already exists
          if (existingTranslations[lang]) {
            console.log(`Translation exists for ${fieldName} in ${lang}`);
            continue;
          }

          try {
            console.log(`Translating ${fieldName} to ${lang}...`);
            const translation = await translateText(sourceText, lang);
            newTranslations[lang] = translation;
            translationCount++;
            console.log(`✓ Translated ${fieldName} to ${lang}`);
            
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 200));
          } catch (error: any) {
            console.error(`Failed to translate ${fieldName} to ${lang}:`, error.message);
            // Continue with other translations even if one fails
          }
        }

        if (Object.keys(newTranslations).length > Object.keys(existingTranslations).length) {
          updates[translationField] = newTranslations;
        }
      }

      // Update all translations at once
      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await supabase
          .from(table)
          .update(updates)
          .eq('id', id);

        if (updateError) {
          console.error('Database update error:', updateError);
          throw new Error(`Failed to save translations: ${updateError.message}`);
        }

        console.log(`Saved ${translationCount} new translations to database`);
      }

      return new Response(
        JSON.stringify({
          success: true,
          mode: 'batch',
          translationsAdded: translationCount,
          fieldsProcessed: Object.keys(updates).length
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Single mode: translate one field to one language
    if (!field || !targetLanguage) {
      throw new Error('Single mode requires field and targetLanguage parameters');
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

    console.log(`Translating ${field} to ${languageNames[targetLanguage]}`);
    const translation = await translateText(sourceText, targetLanguage);
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
