import { sanitizeRichText } from '@/lib/richText';
import { cn } from '@/lib/utils';

interface RichTextContentProps {
  html: string | null | undefined;
  className?: string;
  /** When true, render nothing if content is empty after sanitizing. */
  hideIfEmpty?: boolean;
}

/**
 * Renders stored rich text (HTML) safely for detail pages and cards.
 */
export function RichTextContent({ html, className, hideIfEmpty = false }: RichTextContentProps) {
  const safe = sanitizeRichText(html);
  if (hideIfEmpty && !safe.replace(/<[^>]*>/g, '').trim()) {
    return null;
  }
  if (!safe) {
    return null;
  }

  return (
    <div
      className={cn(
        'prose prose-sm max-w-none text-gray-700',
        'prose-headings:text-gray-900 prose-a:text-primary prose-a:underline',
        '[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5',
        className
      )}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
