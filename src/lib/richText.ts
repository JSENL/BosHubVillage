import DOMPurify from 'dompurify';

const ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'strike',
  'ul',
  'ol',
  'li',
  'a',
  'h2',
  'h3',
  'blockquote',
];

const ALLOWED_ATTR = ['href', 'target', 'rel', 'class'];

/** Strip tags for validation, previews, and meta descriptions. */
export function richTextPlainText(html: string | null | undefined): string {
  if (!html) return '';
  if (typeof document !== 'undefined') {
    const div = document.createElement('div');
    div.innerHTML = html;
    return (div.textContent || '').replace(/\s+/g, ' ').trim();
  }
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function richTextPlainLength(html: string | null | undefined): number {
  return richTextPlainText(html).length;
}

export function isRichTextEmpty(html: string | null | undefined): boolean {
  return richTextPlainLength(html) === 0;
}

/** Sanitize editor HTML before save or render. */
export function sanitizeRichText(html: string | null | undefined): string {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  }).trim();
}

/** Normalize for DB: empty editor state becomes empty string. */
export function normalizeRichTextForStorage(html: string | null | undefined): string {
  const clean = sanitizeRichText(html);
  return isRichTextEmpty(clean) ? '' : clean;
}
