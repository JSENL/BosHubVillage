/**
 * CSV Data Transformation Utilities
 * Transforms CSV rows to database-ready objects
 */

import { CSVRow } from './csvParser';
import { DataType } from './csvValidation';

interface TransformOptions {
  userId?: string;
  geocodeAddress?: (address: string) => Promise<{ latitude: number; longitude: number } | null>;
}

/**
 * Parse and validate coordinates from CSV row
 */
const parseCoordinates = (row: CSVRow): { latitude: number | null; longitude: number | null } => {
  if (row.longitude && row.latitude) {
    const lng = parseFloat(row.longitude.toString().trim());
    const lat = parseFloat(row.latitude.toString().trim());

    if (!isNaN(lng) && !isNaN(lat)) {
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return { latitude: lat, longitude: lng };
      }
    }
  }
  return { latitude: null, longitude: null };
};

/**
 * Transform a CSV row for database insertion
 */
export const transformRowForDatabase = async (
  row: CSVRow,
  type: DataType,
  options: TransformOptions
): Promise<Record<string, unknown>> => {
  const { userId, geocodeAddress } = options;

  // Start with coordinates
  let { latitude, longitude } = parseCoordinates(row);

  // If no valid coordinates, attempt geocoding
  if ((!latitude || !longitude) && geocodeAddress) {
    const addressField = row.address || row.location;
    if (addressField) {
      let enhancedAddress = addressField;
      if (row.neighborhood) {
        enhancedAddress += `, ${row.neighborhood}`;
      }
      if (type === 'local_resources') {
        enhancedAddress += ', Boston, MA';
      }

      const coords = await geocodeAddress(enhancedAddress);
      if (coords) {
        latitude = Number(coords.latitude);
        longitude = Number(coords.longitude);
      }
    }
  }

  const baseTransform: Record<string, unknown> = { latitude, longitude };

  // Only add created_by for tables that have this column
  if (type !== 'local_resources' && userId) {
    baseTransform.created_by = userId;
  }

  switch (type) {
    case 'events':
      return {
        ...baseTransform,
        title: row.title,
        category: row.category,
        date: row.date,
        start_time: row.start_time || null,
        end_time: row.end_time || null,
        location: row.location,
        address: row.address || null,
        description: row.description || null,
        price: row.price ? parseFloat(row.price) : 0,
        max_attendees: row.max_attendees ? parseInt(row.max_attendees) : null,
        registration_required: row.registration_required === 'true',
        neighborhoods: row.neighborhoods || null,
        villages: row.villages || null,
        website_link: row.website_link || null,
        event_type: 'event',
        is_recurring: false,
      };

    case 'business':
      return {
        ...baseTransform,
        title: row.title,
        business_type: row.business_type,
        address: row.address,
        neighborhood: row.neighborhood,
        description: row.description || 'No description provided',
        short_description: row.short_description || null,
        website_link: row.website_link || null,
        villages: row.villages || null,
      };

    case 'local_resources':
      return {
        ...baseTransform,
        name: row.name,
        category: row.category,
        address: row.address,
        neighborhood: row.neighborhood,
        village: row.village,
        description: row.description,
        website_link: row.website_link,
      };

    default:
      return baseTransform;
  }
};
