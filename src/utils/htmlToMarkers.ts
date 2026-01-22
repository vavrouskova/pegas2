/**
 * Utility to convert HTML from WYSIWYG editors to FormattedText marker format
 *
 * Supported conversions:
 * - <br> → {{br}}
 * - <strong>/<b> → {{bold:...}}
 * - <em>/<i> → {{italic:...}}
 * - <a href="..." target="..."> → {{link:...|...|...}}
 * - HTML entities are decoded
 */

// Helper to transform bold/italic tags to markers
const transformTextFormatting = (text: string) => {
  return text
    .replace(/<(?:strong|b)>([\s\S]*?)<\/(?:strong|b)>/gi, '{{bold:$1}}')
    .replace(/<(?:em|i)>([\s\S]*?)<\/(?:em|i)>/gi, '{{italic:$1}}');
};

/**
 * Converts HTML content to FormattedText marker format
 *
 * @param html - HTML string from WYSIWYG editor
 * @returns String with FormattedText markers
 */
export const htmlToMarkers = (html: string): string => {
  return (
    html
      // Handle paragraph breaks (</p><p> or </p>\n<p> patterns)
      .replace(/<\/p>\s*<p[^>]*>/gi, '{{br}}')
      // Remove opening <p> tags (first paragraph)
      .replace(/<p[^>]*>/gi, '')
      // Remove closing </p> tags (last paragraph)
      .replace(/<\/p>/gi, '')
      .replace(/<br\s*\/?>/gi, '{{br}}')
      .replace(
        // eslint-disable-next-line sonarjs/slow-regex
        /<a\s+([^>]*)>([\s\S]*?)<\/a>/gi,
        (_, attributes, text) => {
          // Extract href and target from attributes (order-independent)
          const hrefMatch = /href=["']([^"']*)["']/i.exec(attributes);
          const targetMatch = /target=["']([^"']*)["']/i.exec(attributes);
          const href = hrefMatch ? hrefMatch[1] : '';
          const target = targetMatch ? targetMatch[1] : undefined;
          // Process bold/italic inside link text first
          const processedText = transformTextFormatting(text);
          return target ? `{{link:${href}|${processedText}|${target}}}` : `{{link:${href}|${processedText}}}`;
        }
      )
      // Preserve bold/strong tags (for text outside links)
      .replace(/<(?:strong|b)>([\s\S]*?)<\/(?:strong|b)>/gi, '{{bold:$1}}')
      // Preserve italic/em tags (for text outside links)
      .replace(/<(?:em|i)>([\s\S]*?)<\/(?:em|i)>/gi, '{{italic:$1}}')
      // eslint-disable-next-line sonarjs/slow-regex
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, '\u00A0')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
      .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
      .trim()
  );
};
