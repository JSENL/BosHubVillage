/**
 * Test event CSV import with the real CSV format (Free/$ price, N/A max_attendees, Yes/No registration).
 * Verifies parsing, validation, and transform produce DB-ready event rows.
 */
import { readFileSync } from 'fs';
import { describe, it, expect } from 'vitest';
import {
  parseCSV,
  filterCSVData,
  validateRow,
  transformRowForDatabase,
  isPackedEventCSV,
} from '@/utils/csv';
import type { DataType } from '@/utils/csv';

const OPTION_1_CSV = `title,category,location,address,description,price,max_attendees,registration_required,neighborhoods,villages,website_link,date,start_time,end_time
"Family Story Time,Family,Hyde Park Branch Library,35 Harvard Ave Boston MA 02136,Weekly inclusive reading group and interactive songs for kids.,Free,30,No,Hyde Park,,https://www.bpl.org,2026-06-01,10:30,11:15",,,,,,,,,,,,,
"Juneteenth Community Celebration,Festival,Nightingale Community Garden,512 Park St Dorchester MA 02124,An evening honoring Black freedom and history with music food and local garden activities.,Free,150,No,Dorchester,,https://thetrustees.org,2026-06-04,17:30,19:30",,,,,,,,,,,,,`;

const OPTION_2_PATH =
  '/Users/jasenlambright/Downloads/Boston Neighborhood Events June-July 2026 (Single Column Option 2) - Boston Neighborhood Events June-July 2026 (Single Column Option 2).csv';

const SAMPLE_CSV = `title,category,location,address,description,price,max_attendees,registration_required,neighborhoods,villages,website_link,date,start_time,end_time
"50th Annual Gardeners' Gathering",Conference,Northeastern University Curry Student Center,360 Huntington Ave Boston MA,A free gardening conference bringing together growers for workshops and community building.,Free,500,No,Roxbury;Fenway,Mission Hill,https://thetrustees.org/event_roundup/boston-events/,2026-03-21,10:00,17:00
"Wake Up the Earth Festival",Festival,South-West Corridor Park,Lamartine St & Centre St Jamaica Plain MA,48th annual celebration of community activism and spring with music parades and food.,Free,7500,No,Jamaica Plain;Roxbury,Jackson Square,https://www.spontaneouscelebrations.org/,2026-05-02,11:00,18:00
"Boston Comics in Color Festival",Festival,Reggie Lewis Track and Athletic Center,1350 Tremont St Roxbury MA,A family-friendly event highlighting stories by and about people of color in the comic industry.,Free,1000,No,Roxbury,Crossing,https://www.eventbrite.com/d/ma--boston--dorchester/community--festivals/,2026-04-04,10:00,17:00
"Roxbury Ramble: Public Art Tour",Guided Tour,First Church Roxbury,10 Putnam St Roxbury MA,An expanded walking tour exploring public art and historical places in Sugar Hill and Fort Hill.,$10.00,30,Yes,Roxbury;Jamaica Plain;Dorchester,Fort Hill,https://www.uuum.org/,2026-06-13,10:00,14:30
"St. Patrick's Day Craft",Arts & Crafts,Hyde Park Branch Library,35 Harvard Ave Hyde Park MA,Create your own St. Patrick's Day paper crafts with provided materials.,Free,25,No,Hyde Park,Cleary Square,https://bpl.bibliocommons.com/events/search,2026-03-14,09:30,11:30
"Annual Seed Swap",Community,Dudley Greenhouse,11 Brook Ave Roxbury MA,Exchange native vegetable and herbal seeds with local gardeners.,Free,100,No,Roxbury,Dudley Square,https://thetrustees.org/event_roundup/boston-events/,2026-03-11,16:00,19:00
"Corina Simian: A Step into the Wilderness",Exhibition,Jamaica Plain Branch Library,30 South St Jamaica Plain MA,Rotating art series featuring wilderness-inspired visual arts.,Free,N/A,No,Jamaica Plain,Central JP,https://bpl.bibliocommons.com/events/search,2026-03-05,09:00,20:00
"Hyde Park Emergency Food Pantry",Volunteer,Hyde Park Food Pantry,1179 River St Hyde Park MA,Volunteer opportunity to assist in organizing and distributing food to neighbors.,Free,10,Yes,Hyde Park,Readville,https://www.bostoncares.org/calendar,2026-03-03,08:45,13:00
"Children's Chess Club",Games,Lower Mills Branch Library,27 Richmond St Dorchester MA,Weekly chess gathering for children to learn and play.,Free,20,No,Dorchester,Lower Mills,https://www.bpl.org/kids/,2026-03-16,18:00,19:30
"Fresh Truck Mobile Market Support",Volunteer,Neponset Health Center,398 Neponset Ave Dorchester MA,Helping residents access fresh produce at the mobile market.,Free,5,Yes,Dorchester,Neponset,https://www.bostoncares.org/calendar,2026-03-03,09:20,11:30
"Grafting Workshop",Workshop,City Natives Greenhouse,30 Edgewater Dr Mattapan MA,Hands-on workshop on fruit tree grafting techniques.,$20.00,15,Yes,Mattapan,Edgewater,https://thetrustees.org/event_roundup/boston-events/,2026-04-18,10:00,12:00`;

const DATA_TYPE: DataType = 'events';

describe('Event CSV import', () => {
  it('parses CSV and produces correct number of rows', () => {
    const rows = parseCSV(SAMPLE_CSV).map(filterCSVData);
    expect(rows).toHaveLength(11);
    expect(rows[0].title).toBe("50th Annual Gardeners' Gathering");
    expect(rows[0].price).toBe('Free');
    expect(rows[0].max_attendees).toBe('500');
    expect(rows[0].registration_required).toBe('No');
  });

  it('validates all rows (required fields: title, category, date, location)', () => {
    const rows = parseCSV(SAMPLE_CSV).map(filterCSVData);
    for (let i = 0; i < rows.length; i++) {
      const err = validateRow(rows[i], DATA_TYPE);
      expect(err).toBeNull();
    }
  });

  it('transforms each row to DB-ready event with correct price, max_attendees, registration_required', async () => {
    const rows = parseCSV(SAMPLE_CSV).map(filterCSVData);
    const noGeocode = async () => null;

    // Row 0: Free, 500, No
    const row0 = await transformRowForDatabase(rows[0], DATA_TYPE, {
      userId: 'test-user-id',
      geocodeAddress: noGeocode,
    });
    expect(row0.price).toBe(0);
    expect(row0.max_attendees).toBe(500);
    expect(row0.registration_required).toBe(false);
    expect(row0.title).toBe("50th Annual Gardeners' Gathering");
    expect(row0.date).toBe('2026-03-21');
    expect(row0.start_time).toBe('10:00');
    expect(row0.end_time).toBe('17:00');

    // Row 3: $10.00, 30, Yes (Roxbury Ramble)
    const row3 = await transformRowForDatabase(rows[3], DATA_TYPE, {
      userId: 'test-user-id',
      geocodeAddress: noGeocode,
    });
    expect(row3.price).toBe(10);
    expect(row3.max_attendees).toBe(30);
    expect(row3.registration_required).toBe(true);

    // Row 6: Free, N/A, No (Corina Simian - has N/A max_attendees)
    const row6 = await transformRowForDatabase(rows[6], DATA_TYPE, {
      userId: 'test-user-id',
      geocodeAddress: noGeocode,
    });
    expect(row6.price).toBe(0);
    expect(row6.max_attendees).toBeNull();
    expect(row6.registration_required).toBe(false);

    // Row 10: $20.00, 15, Yes (Grafting Workshop)
    const row10 = await transformRowForDatabase(rows[10], DATA_TYPE, {
      userId: 'test-user-id',
      geocodeAddress: noGeocode,
    });
    expect(row10.price).toBe(20);
    expect(row10.max_attendees).toBe(15);
    expect(row10.registration_required).toBe(true);
  });

  it('detects and parses Single Column Option 1 (one blob per row)', () => {
    expect(isPackedEventCSV(OPTION_1_CSV)).toBe(true);
    const rows = parseCSV(OPTION_1_CSV).map(filterCSVData);
    expect(rows).toHaveLength(2);
    expect(rows[0].title).toBe('Family Story Time');
    expect(rows[0].category).toBe('Family');
    expect(rows[0].date).toBe('2026-06-01');
    expect(rows[1].title).toBe('Juneteenth Community Celebration');
    for (const row of rows) {
      expect(validateRow(row, DATA_TYPE)).toBeNull();
    }
  });

  it('detects and parses Single Column Option 2 (entire file on one line)', () => {
    const option2 = readFileSync(OPTION_2_PATH, 'utf8');
    expect(isPackedEventCSV(option2)).toBe(true);
    const rows = parseCSV(option2).map(filterCSVData);
    expect(rows.length).toBeGreaterThanOrEqual(8);
    expect(rows[0].title).toBe('Family Story Time');
    expect(rows.find((r) => r.title === 'Puerto Rican Festival Parade')?.date).toBe('2026-07-26');
    for (const row of rows) {
      expect(validateRow(row, DATA_TYPE)).toBeNull();
    }
  });

  it('transforms all 11 rows without throwing', async () => {
    const rows = parseCSV(SAMPLE_CSV).map(filterCSVData);
    const noGeocode = async () => null;
    const transformed: Record<string, unknown>[] = [];
    for (const row of rows) {
      const t = await transformRowForDatabase(row, DATA_TYPE, {
        userId: 'test-user-id',
        geocodeAddress: noGeocode,
      });
      transformed.push(t);
    }
    expect(transformed).toHaveLength(11);
    transformed.forEach((t, i) => {
      expect(t.title).toBeDefined();
      expect(typeof t.price).toBe('number');
      expect(t.max_attendees === null || typeof t.max_attendees === 'number').toBe(true);
      expect(typeof t.registration_required).toBe('boolean');
    });
  });
});
