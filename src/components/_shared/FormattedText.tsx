import Link from 'next/link';
import React from 'react';

import { czechTypography } from '@/lib/utils';

interface ParsedSegment {
  type: 'text' | 'br' | 'link' | 'bold' | 'italic';
  content?: string;
  className?: string;
  href?: string;
  target?: string;
  // For nested content (e.g., bold inside link)
  nestedSegments?: ParsedSegment[];
}

/**
 * Parsuje text se speciálními značkami pro responzivní odřádkování a odkazy
 *
 * Podporované formáty:
 * - {{br}} - běžné odřádkování (vždy viditelné)
 * - {{br:max-lg:hidden}} - odřádkování skryté na menších obrazovkách než lg
 * - {{br:lg:hidden}} - odřádkování skryté na lg a větších obrazovkách
 * - {{link:url|text}} - odkaz s URL a textem
 * - {{link:url|text|target}} - odkaz s URL, textem a target atributem
 * - {{bold:text}} - tučný text (může být i uvnitř odkazu)
 * - {{italic:text}} - kurzíva (může být i uvnitř odkazu)
 *
 * @param text - Text k parsování
 * @returns Pole segmentů s textem, br elementy, odkazy a formátováním
 */
function parseText(text: string): ParsedSegment[] {
  const segments: ParsedSegment[] = [];

  // Pattern for links - allows nested {{...}} in link text by using a more permissive capture
  // Matches {{link:url|content}} or {{link:url|content|target}}
  // The content can contain nested {{bold:...}} or {{italic:...}}
  // eslint-disable-next-line security/detect-unsafe-regex, sonarjs/slow-regex
  const linkPattern = /\{\{link:([^|]+)\|((?:[^{}]|\{\{[^}]+\}\})+?)(?:\|([^}]+))?\}\}/g;

  // First pass: replace links with placeholders and extract them
  const linkPlaceholders: Map<string, { href: string; content: string; target?: string }> = new Map();
  let linkIndex = 0;
  const textWithPlaceholders = text.replace(linkPattern, (_, href, content, target) => {
    const placeholder = `__LINK_PLACEHOLDER_${linkIndex}__`;
    linkPlaceholders.set(placeholder, { href, content, target });
    linkIndex++;
    return placeholder;
  });

  // Second pass: parse the text with placeholders
  // eslint-disable-next-line security/detect-unsafe-regex, sonarjs/regex-complexity
  const combinedPattern = /\{\{(?:br(?::([^}]+))?|bold:([^}]+)|italic:([^}]+))\}\}|__LINK_PLACEHOLDER_(\d+)__/g;

  let lastIndex = 0;
  let match;

  while ((match = combinedPattern.exec(textWithPlaceholders)) !== null) {
    // Přidat text před značkou
    if (match.index > lastIndex) {
      const textContent = textWithPlaceholders.slice(lastIndex, match.index);
      segments.push({
        type: 'text',
        content: textContent,
      });
    }

    // Check what type of tag it is
    if (match[4] !== undefined) {
      // It's a link placeholder
      const placeholder = `__LINK_PLACEHOLDER_${match[4]}__`;
      const linkData = linkPlaceholders.get(placeholder);
      if (linkData) {
        // Recursively parse the link content for nested bold/italic
        const nestedSegments = parseText(linkData.content);
        segments.push({
          type: 'link',
          href: linkData.href,
          content: linkData.content,
          target: linkData.target || undefined,
          nestedSegments,
        });
      }
    } else if (match[2]) {
      // It's bold: {{bold:text}}
      segments.push({
        type: 'bold',
        content: match[2],
      });
    } else if (match[3]) {
      // It's italic: {{italic:text}}
      segments.push({
        type: 'italic',
        content: match[3],
      });
    } else {
      // It's a br: {{br}} or {{br:className}}
      segments.push({
        type: 'br',
        className: match[1] || undefined,
      });
    }

    lastIndex = combinedPattern.lastIndex;
  }

  // Přidat zbývající text
  if (lastIndex < textWithPlaceholders.length) {
    segments.push({
      type: 'text',
      content: textWithPlaceholders.slice(lastIndex),
    });
  }

  return segments;
}

interface FormattedTextProps {
  text: string;
  /**
   * Pokud je true, aplikuje českou typografii (nezlomitelné mezery)
   * @default true
   */
  applyCzechTypography?: boolean;
  /**
   * HTML tag použitý pro obalení textu
   * @default 'span'
   */
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote';
  /**
   * CSS třídy pro obalující element
   */
  className?: string;
}

/**
 * Komponenta pro formátování textu s podporou responzivního odřádkování
 *
 * @example
 * ```tsx
 * // V messages/cs.json:
 * {
 *   "title": "Text před{{br:max-lg:hidden}}text po{{br}}další řádek"
 * }
 *
 * // Použití:
 * <FormattedText text={t('title')} />
 * ```
 */
export const FormattedText = ({
  text,
  applyCzechTypography = true,
  as: Component = 'span',
  className,
}: FormattedTextProps) => {
  const segments = parseText(text);

  // Helper to apply typography to text content
  const applyTypography = (content: string | undefined) => {
    if (!content) return content;
    return applyCzechTypography ? czechTypography(content) : content;
  };

  // Helper function to render segments (used for both top-level and nested content)
  const renderSegments = (segmentsToRender: ParsedSegment[], keyPrefix = ''): React.ReactNode[] => {
    return segmentsToRender.map((segment, index) => {
      const key = keyPrefix ? `${keyPrefix}-${index}` : index;

      if (segment.type === 'br') {
        return (
          <br
            key={key}
            className={segment.className}
          />
        );
      }

      if (segment.type === 'link' && segment.href) {
        const target = segment.target || '_self';
        const isNewWindow = target === '_blank';

        // If there are nested segments (e.g., bold inside link), render them
        // Otherwise, render the plain content
        const hasNestedSegments = segment.nestedSegments && segment.nestedSegments.length > 0;
        const linkContent = hasNestedSegments
          ? renderSegments(segment.nestedSegments!, `${key}-nested`)
          : applyTypography(segment.content);

        return (
          <Link
            key={key}
            href={segment.href}
            target={target}
            rel={isNewWindow ? 'noopener noreferrer' : undefined}
            className='text-primary underline hover:no-underline'
          >
            {linkContent}
          </Link>
        );
      }

      if (segment.type === 'bold') {
        return (
          <span
            key={key}
            className='font-bold-text'
          >
            {applyTypography(segment.content)}
          </span>
        );
      }

      if (segment.type === 'italic') {
        return (
          <span
            key={key}
            className='font-italic'
          >
            {applyTypography(segment.content)}
          </span>
        );
      }

      return <React.Fragment key={key}>{applyTypography(segment.content)}</React.Fragment>;
    });
  };

  return <Component className={className}>{renderSegments(segments)}</Component>;
};
