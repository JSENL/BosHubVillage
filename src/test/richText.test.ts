import { describe, it, expect } from 'vitest';
import {
  sanitizeRichText,
  richTextPlainText,
  richTextPlainLength,
  isRichTextEmpty,
  normalizeRichTextForStorage,
} from '@/lib/richText';

describe('richText helpers', () => {
  it('strips tags for plain text', () => {
    expect(richTextPlainText('<p>Hello <strong>world</strong></p>')).toBe('Hello world');
  });

  it('treats empty editor markup as empty', () => {
    expect(isRichTextEmpty('<p></p>')).toBe(true);
    expect(isRichTextEmpty('<p><br></p>')).toBe(true);
    expect(isRichTextEmpty('')).toBe(true);
  });

  it('counts plain length for validation', () => {
    expect(richTextPlainLength('<p>abc</p>')).toBe(3);
  });

  it('sanitizes disallowed tags and scripts', () => {
    const clean = sanitizeRichText(
      '<p>Safe</p><script>alert(1)</script><img src=x onerror=alert(1) /><iframe></iframe>'
    );
    expect(clean).toContain('Safe');
    expect(clean).not.toContain('script');
    expect(clean).not.toContain('iframe');
    expect(clean).not.toContain('img');
  });

  it('allows basic formatting tags', () => {
    const html = '<p><strong>Bold</strong> <u>underline</u></p><ul><li>one</li></ul>';
    expect(sanitizeRichText(html)).toContain('<strong>');
    expect(sanitizeRichText(html)).toContain('<u>');
    expect(sanitizeRichText(html)).toContain('<ul>');
  });

  it('normalizes empty content to empty string', () => {
    expect(normalizeRichTextForStorage('<p></p>')).toBe('');
    expect(normalizeRichTextForStorage('<p>Hi</p>')).toContain('Hi');
  });
});
