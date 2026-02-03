/**
 * CSV Template Definitions
 */

import { DataType } from './csvValidation';

export const csvTemplates: Record<DataType, string> = {
  events: `title,category,date,start_time,end_time,location,address,description,price,max_attendees,registration_required,neighborhoods,villages,website_link,longitude,latitude
Sample Community Event,Community,2024-12-25,10:00,12:00,Community Center,123 Main St Boston MA,A wonderful community gathering,0,50,false,Downtown,Back Bay,https://example.com,-71.0589,42.3601`,

  business: `title,business_type,address,neighborhood,description,short_description,website_link,villages,longitude,latitude
Sample Business,Restaurant,456 Main St Boston MA,Downtown,A great local restaurant,Great food and service,https://restaurant.com,Back Bay,-71.0589,42.3601`,

  local_resources: `name,category,address,neighborhood,village,description,latitude,longitude,website_link
Sample Resource,Healthcare / Community Clinic,789 Main St Boston MA,Downtown,Back Bay,A helpful community resource,42.3601,-71.0589,https://resource.com
Another Resource,Urban Agriculture / Community Space,456 Oak St Boston MA,South End,Dudley/Nubian Square,Educational urban farming,42.3301,-71.0829,https://education.com`,
};

/**
 * Download a CSV template file
 */
export const downloadTemplate = (type: DataType): void => {
  const csvContent = csvTemplates[type];
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${type}_template.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
};
