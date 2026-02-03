/**
 * CSV Validation Utilities
 * Validates CSV rows for different data types
 */

import { CSVRow } from './csvParser';

export type DataType = 'events' | 'business' | 'local_resources';

/**
 * Validate a CSV row for the given data type
 * Returns error message or null if valid
 */
export const validateRow = (row: CSVRow, type: DataType): string | null => {
  switch (type) {
    case 'events':
      if (!row.title || !row.category || !row.date || !row.location) {
        return 'Missing required fields: title, category, date, or location';
      }
      if (row.date && !Date.parse(row.date)) {
        return 'Invalid date format. Use YYYY-MM-DD';
      }
      break;

    case 'business':
      if (!row.title || !row.business_type || !row.address || !row.neighborhood) {
        return 'Missing required fields: title, business_type, address, or neighborhood';
      }
      break;

    case 'local_resources':
      if (!row.name || !row.category || !row.address || !row.neighborhood) {
        return 'Missing required fields: name, category, address, or neighborhood';
      }
      if (row.latitude || row.longitude) {
        const lat = parseFloat(row.latitude?.toString() || '');
        const lng = parseFloat(row.longitude?.toString() || '');
        if (isNaN(lat) || isNaN(lng)) {
          return 'Invalid latitude or longitude - must be valid numbers';
        }
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          return 'Invalid coordinate ranges - latitude must be -90 to 90, longitude must be -180 to 180';
        }
      }
      break;

    default:
      return 'Invalid data type';
  }
  return null;
};

/**
 * Get required fields for a data type
 */
export const getRequiredFields = (type: DataType): string[] => {
  switch (type) {
    case 'events':
      return ['title', 'category', 'date', 'location'];
    case 'business':
      return ['title', 'business_type', 'address', 'neighborhood'];
    case 'local_resources':
      return ['name', 'category', 'address', 'neighborhood'];
    default:
      return [];
  }
};
