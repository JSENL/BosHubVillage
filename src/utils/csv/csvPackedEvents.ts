/**
 * Normalizes "packed" event CSV exports (e.g. Google Sheets single-column options)
 * into standard multi-column CSV for the importer.
 */

import type { CSVRow } from './csvParser';

const detectDelimiter = (line: string): string => {
  const commas = (line.match(/,/g) || []).length;
  const semicolons = (line.match(/;/g) || []).length;
  const tabs = (line.match(/\t/g) || []).length;
  if (tabs >= commas && tabs >= semicolons && tabs > 0) return '\t';
  if (semicolons > commas && semicolons > 0) return ';';
  return ',';
};

const parseCSVLine = (line: string, delimiter: string = ','): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];
    const nextChar = line[i + 1];
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i += 2;
        continue;
      }
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
    i++;
  }
  result.push(current.trim());
  return result;
};

export const EVENT_CSV_HEADERS = [
  'title',
  'category',
  'location',
  'address',
  'description',
  'price',
  'max_attendees',
  'registration_required',
  'neighborhoods',
  'villages',
  'website_link',
  'date',
  'start_time',
  'end_time',
] as const;

const HEADER_LINE = EVENT_CSV_HEADERS.join(',');
const EVENT_FIELD_COUNT = EVENT_CSV_HEADERS.length;

const stripBOM = (text: string): string =>
  text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;

const unwrapOuterQuotes = (text: string): string => {
  let t = text.trim();
  if (t.startsWith('"') && t.endsWith('"')) {
    t = t.slice(1, -1);
  }
  return t;
};

const escapeCsvField = (value: string): string => {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

const rowsToCsvText = (rows: Record<string, string>[]): string => {
  const lines = [HEADER_LINE];
  for (const row of rows) {
    lines.push(EVENT_CSV_HEADERS.map((h) => escapeCsvField(row[h] ?? '')).join(','));
  }
  return lines.join('\n');
};

/**
 * Split packed event records (space-separated after each end_time).
 */
export const splitPackedEventRecords = (dataPart: string): string[] =>
  dataPart
    .trim()
    .split(/(?<=\d{1,2}:\d{2})\s+(?=[A-Za-z0-9"'])/)
    .map((s) => s.trim())
    .filter(Boolean);

/**
 * Parse one comma-separated event blob (14 fields; extra commas fold into description).
 */
export const parseEventBlob = (blob: string): Record<string, string> => {
  const parts = blob.split(',');
  if (parts.length < EVENT_FIELD_COUNT) {
    throw new Error(
      `Invalid event row (${parts.length} fields, expected ${EVENT_FIELD_COUNT}): ${blob.slice(0, 80)}…`
    );
  }

  const extra = parts.length - EVENT_FIELD_COUNT;
  const tail = parts.slice(5 + extra);

  if (tail.length !== 9) {
    throw new Error(`Invalid event row tail (${tail.length} fields after description)`);
  }

  const [
    price,
    max_attendees,
    registration_required,
    neighborhoods,
    villages,
    website_link,
    date,
    start_time,
    end_time,
  ] = tail.map((p) => p.trim());

  return {
    title: parts[0].trim(),
    category: parts[1].trim(),
    location: parts[2].trim(),
    address: parts[3].trim(),
    description: parts.slice(4, 5 + extra).join(',').trim(),
    price,
    max_attendees,
    registration_required,
    neighborhoods,
    villages,
    website_link,
    date,
    start_time,
    end_time,
  };
};

/** Option 2: entire file is one line — header + all rows space-separated in one cell. */
const isPackedSingleLineFormat = (text: string): boolean => {
  const inner = unwrapOuterQuotes(text);
  const lines = inner.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length !== 1) return false;

  const single = lines[0];
  if (!single.includes(HEADER_LINE)) return false;

  const afterHeader = single.slice(single.indexOf(HEADER_LINE) + HEADER_LINE.length).trim();
  return afterHeader.length > 10;
};

/** Option 1: each row stores the full event in the first column only. */
const isSingleColumnRowFormat = (lines: string[]): boolean => {
  if (lines.length < 2) return false;

  const headerLine = lines[0].replace(/"/g, '').trim().toLowerCase();
  if (!headerLine.startsWith('title,category,')) return false;

  let packedRows = 0;
  let normalRows = 0;

  for (const line of lines.slice(1, Math.min(lines.length, 6))) {
    const values = parseCSVLine(line, detectDelimiter(lines[0]));
    const first = (values[0] || '').replace(/"/g, '').trim();
    const second = (values[1] || '').trim();
    if (first.includes(',') && first.length > 40 && !second) {
      packedRows++;
    } else if (values[1]) {
      normalRows++;
    }
  }

  return packedRows > 0 && normalRows === 0;
};

const normalizePackedSingleLine = (text: string): string => {
  const inner = unwrapOuterQuotes(text.trim());
  const idx = inner.indexOf(HEADER_LINE);
  if (idx === -1) {
    throw new Error('Packed CSV is missing the expected event header row');
  }

  const dataPart = inner.slice(idx + HEADER_LINE.length).trim();
  const chunks = splitPackedEventRecords(dataPart);
  if (chunks.length === 0) {
    throw new Error('Packed CSV contains a header but no event rows');
  }

  const rows = chunks.map(parseEventBlob);
  return rowsToCsvText(rows);
};

const normalizeSingleColumnRows = (lines: string[]): string => {
  const delimiter = detectDelimiter(lines[0]);
  const rows = lines.slice(1).map((line) => {
    const values = parseCSVLine(line, delimiter);
    const blob = (values[0] || '').replace(/"/g, '').trim();
    return parseEventBlob(blob);
  });
  return rowsToCsvText(rows);
};

/**
 * If the text uses a packed Google Sheets export, convert to standard CSV; otherwise return as-is.
 */
export const normalizeEventCSV = (text: string): string => {
  const cleaned = stripBOM(text.trim());
  if (!cleaned) return cleaned;

  if (isPackedSingleLineFormat(cleaned)) {
    return normalizePackedSingleLine(cleaned);
  }

  const lines = cleaned.split(/\r?\n/).filter((line) => line.trim());
  if (isSingleColumnRowFormat(lines)) {
    return normalizeSingleColumnRows(lines);
  }

  return cleaned;
};

/** True when packed normalization would change the file. */
export const isPackedEventCSV = (text: string): boolean => {
  const cleaned = stripBOM(text.trim());
  if (!cleaned) return false;
  if (isPackedSingleLineFormat(cleaned)) return true;
  const lines = cleaned.split(/\r?\n/).filter((line) => line.trim());
  return isSingleColumnRowFormat(lines);
};

export const packedRowsToCSVRows = (text: string): CSVRow[] => {
  const normalized = normalizeEventCSV(text);
  const lines = normalized.split(/\r?\n/).filter((l) => l.trim());
  const headers = parseCSVLine(lines[0]).map((h) => h.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line).map((v) => v.replace(/"/g, '').trim());
    const row: CSVRow = {};
    headers.forEach((header, i) => {
      row[header] = values[i] || '';
    });
    return row;
  });
};
