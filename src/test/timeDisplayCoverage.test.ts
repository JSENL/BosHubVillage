import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();

const TIME_RENDER_FILES = [
  'src/pages/EventDetails.tsx',
  'src/components/EventsList.tsx',
  'src/components/EventsCalendar.tsx',
  'src/components/EventCard.tsx',
  'src/components/UnifiedItemCard.tsx',
];

describe('12-hour time rendering coverage', () => {
  it('avoids raw 24-hour start/end time interpolation in UI components', () => {
    const forbiddenPatterns = [
      /\{event\.start_time\}/,
      /\$\{startTime\}\s*-\s*\$\{endTime\}/,
      /new Date\([^)]+\)\.toLocaleTimeString\(/,
    ];

    for (const relativePath of TIME_RENDER_FILES) {
      const source = readFileSync(path.join(projectRoot, relativePath), 'utf8');
      for (const pattern of forbiddenPatterns) {
        expect(source, `${relativePath} matched ${pattern}`).not.toMatch(pattern);
      }
    }
  });

  it('uses the shared 12-hour formatter in event time UI paths', () => {
    for (const relativePath of [
      'src/pages/EventDetails.tsx',
      'src/components/EventsList.tsx',
      'src/components/EventsCalendar.tsx',
    ]) {
      const source = readFileSync(path.join(projectRoot, relativePath), 'utf8');
      expect(source).toMatch(/formatTimeRange\(/);
    }
  });

  it('keeps AM/PM formatting logic in card-level time formatters', () => {
    for (const relativePath of [
      'src/components/EventCard.tsx',
      'src/components/UnifiedItemCard.tsx',
    ]) {
      const source = readFileSync(path.join(projectRoot, relativePath), 'utf8');
      expect(source).toMatch(/AM/);
      expect(source).toMatch(/PM/);
      expect(source).toMatch(/hour\s*%\s*12\s*\|\|\s*12/);
    }
  });
});

