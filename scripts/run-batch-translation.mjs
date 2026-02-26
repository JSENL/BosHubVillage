/**
 * Runs the Batch Translation Tool from the command line.
 * Populates *_translations for events, business, local_resources, and news.
 */
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY. Run with: node --env-file=.env scripts/run-batch-translation.mjs');
  process.exit(1);
}

const supabase = createClient(url, key);

const tables = [
  { key: 'events', label: 'Events', translationFields: ['title_translations', 'description_translations', 'location_translations', 'category_translations'] },
  { key: 'business', label: 'Businesses', translationFields: ['title_translations', 'description_translations', 'address_translations', 'short_description_translations'] },
  { key: 'local_resources', label: 'Local Resources', translationFields: ['name_translations', 'description_translations', 'address_translations'] },
  { key: 'news', label: 'News', translationFields: ['title_translations', 'content_translations', 'location_translations'] },
];

const targetLanguages = ['es', 'fr', 'vi', 'pt'];

function needsTranslation(record, translationFields) {
  for (const field of translationFields) {
    const translations = record[field];
    if (!translations || typeof translations !== 'object') return true;
    for (const lang of targetLanguages) {
      if (!translations[lang] || String(translations[lang]).trim() === '') return true;
    }
  }
  return false;
}

async function translateTable(tableConfig) {
  const { key: table, label } = tableConfig;

  const { data: records, error } = await supabase.from(table).select('*');
  if (error) {
    console.error(`Failed to fetch ${table}:`, error.message);
    return { translated: 0, failed: 0, skipped: records?.length ?? 0 };
  }

  const needsWork = records.filter((r) => needsTranslation(r, tableConfig.translationFields));
  const skipped = records.length - needsWork.length;

  if (needsWork.length === 0) {
    console.log(`  ${label}: All ${records.length} items already have translations.`);
    return { translated: 0, failed: 0, skipped: records.length };
  }

  console.log(`  ${label}: Translating ${needsWork.length} items...`);

  let translated = 0;
  let failed = 0;

  for (let i = 0; i < needsWork.length; i++) {
    const record = needsWork[i];
    const pct = Math.round(((i + 1) / needsWork.length) * 100);

    try {
      const { data, error: invokeErr } = await supabase.functions.invoke('translate-content', {
        body: { table, id: record.id, mode: 'batch' },
      });

      if (invokeErr || !data?.success) {
        console.error(`    [${pct}%] Failed ${table}/${record.id}:`, invokeErr?.message || data?.error);
        failed++;
      } else {
        translated++;
        process.stdout.write(`\r    [${pct}%] Translated ${translated}/${needsWork.length}    `);
      }
    } catch (err) {
      console.error(`\n    [${pct}%] Error ${table}/${record.id}:`, err.message);
      failed++;
    }

    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`\n  ${label}: Done. Translated: ${translated}, Failed: ${failed}, Skipped: ${skipped}`);
  return { translated, failed, skipped };
}

async function main() {
  console.log('Batch Translation Tool - Starting\n');

  for (const tableConfig of tables) {
    await translateTable(tableConfig);
  }

  console.log('\nBatch translation complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
