/**
 * CSV Parsing Utilities
 * Handles delimiter detection, line parsing, and CSV text processing
 */

import { normalizeEventCSV } from './csvPackedEvents';

export interface CSVRow {
  [key: string]: string;
}

/**
 * Detect the delimiter used in the CSV (comma, semicolon, or tab)
 */
export const detectDelimiter = (line: string): string => {
  const commas = (line.match(/,/g) || []).length;
  const semicolons = (line.match(/;/g) || []).length;
  const tabs = (line.match(/\t/g) || []).length;

  if (tabs >= commas && tabs >= semicolons && tabs > 0) {
    return '\t';
  }
  if (semicolons > commas && semicolons > 0) {
    return ';';
  }
  return ',';
};

/**
 * Parse a single CSV line handling quoted fields
 */
export const parseCSVLine = (line: string, delimiter: string = ','): string[] => {
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
      } else {
        inQuotes = !inQuotes;
      }
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

/** Strip BOM if present (e.g. from Excel exports) */
const stripBOM = (text: string): string =>
  text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;

/**
 * Parse full CSV text into array of row objects
 */
export const parseCSV = (text: string): CSVRow[] => {
  const cleaned = stripBOM(normalizeEventCSV(text).trim());
  const lines = cleaned.split(/\r?\n/).filter(line => line.trim());

  if (lines.length === 0) {
    throw new Error('CSV file is empty');
  }

  const delimiter = detectDelimiter(lines[0]);
  const headers = parseCSVLine(lines[0], delimiter).map(h =>
    h.replace(/"/g, '').trim().toLowerCase().replace(/^\ufeff/, '')
  );

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line, delimiter).map(v => v.replace(/"/g, '').trim());
    const row: CSVRow = {};
    headers.forEach((header, headerIndex) => {
      row[header] = values[headerIndex] || '';
    });
    return row;
  });
};

/**
 * Parse CSV for preview (first N rows with original headers)
 */
export const parseCSVPreview = (text: string, maxRows: number = 5): CSVRow[] => {
  const cleaned = stripBOM(normalizeEventCSV(text).trim());
  const lines = cleaned.split(/\r?\n/).filter(line => line.trim());

  if (lines.length === 0) {
    return [];
  }

  const delimiter = detectDelimiter(lines[0]);
  const headers = parseCSVLine(lines[0], delimiter).map(h =>
    h.replace(/"/g, '').trim().replace(/^\ufeff/, '')
  );

  return lines.slice(1, maxRows + 1).map((line) => {
    const values = parseCSVLine(line, delimiter).map(v => v.replace(/"/g, '').trim());
    const row: CSVRow = {};
    headers.forEach((header, headerIndex) => {
      row[header] = values[headerIndex] || '';
    });
    return row;
  });
};

/**
 * Filter out unwanted fields from CSV data
 */
export const filterCSVData = (row: CSVRow): CSVRow => {
  const filteredRow = { ...row };
  const fieldsToRemove = [
    'state', 'zipcode', 'zip_code', 'zip',
    'State', 'Zipcode', 'ZIP', 'ZIP_CODE'
  ];
  fieldsToRemove.forEach(field => delete filteredRow[field]);
  return filteredRow;
};
