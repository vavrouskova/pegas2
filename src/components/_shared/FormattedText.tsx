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
/**
 * Helper to extract content from a marker, handling nested markers
 * Returns the content and the end position
 */
function extractMarkerContent(text: string, startIndex: number): { content: string; endIndex: number } | null {
  // Start at depth 1 because we're already inside one level of braces (the opening {{ was skipped)
  let depth = 1;
  let index = startIndex;

  while (index < text.length) {
    if (text[index] === '{' && text[index + 1] === '{') {
      depth++;
      index += 2;
    } else if (text[index] === '}' && text[index + 1] === '}') {
      depth--;
      if (depth === 0) {
        return {
          content: text.slice(startIndex, index),
          endIndex: index + 2,
        };
      }
      index += 2;
    } else {
      index++;
    }
  }

  return null;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function parseText(text: string): ParsedSegment[] {
  const segments: ParsedSegment[] = [];

  let lastIndex = 0;
  let currentIndex = 0;

  while (currentIndex < text.length) {
    // Check for {{ marker start
    if (text[currentIndex] === '{' && text[currentIndex + 1] === '{') {
      // Add text before the marker
      if (currentIndex > lastIndex) {
        segments.push({
          type: 'text',
          content: text.slice(lastIndex, currentIndex),
        });
      }

      const markerStart = currentIndex + 2; // Skip {{
      const extracted = extractMarkerContent(text, markerStart);

      if (extracted) {
        const markerContent = extracted.content;

        // Check marker type
        if (markerContent.startsWith('br')) {
          const className = markerContent.startsWith('br:') ? markerContent.slice(3) : undefined;
          segments.push({
            type: 'br',
            className,
          });
        } else if (markerContent.startsWith('link:')) {
          // Parse link: {{link:url|content}} or {{link:url|content|target}}
          const linkContent = markerContent.slice(5); // Remove 'link:'
          const pipeIndex = linkContent.indexOf('|');
          if (pipeIndex !== -1) {
            const href = linkContent.slice(0, pipeIndex);
            const rest = linkContent.slice(pipeIndex + 1);
            // Check for target (last pipe-separated value that doesn't contain nested markers)
            const lastPipeIndex = rest.lastIndexOf('|');
            let content: string;
            let target: string | undefined;
            if (lastPipeIndex !== -1 && !rest.slice(lastPipeIndex + 1).includes('{{')) {
              content = rest.slice(0, lastPipeIndex);
              target = rest.slice(lastPipeIndex + 1);
            } else {
              content = rest;
              target = undefined;
            }
            const nestedSegments = parseText(content);
            segments.push({
              type: 'link',
              href,
              content,
              target,
              nestedSegments,
            });
          }
        } else if (markerContent.startsWith('bold:')) {
          const boldContent = markerContent.slice(5); // Remove 'bold:'
          const nestedSegments = parseText(boldContent);
          segments.push({
            type: 'bold',
            content: boldContent,
            nestedSegments,
          });
        } else if (markerContent.startsWith('italic:')) {
          const italicContent = markerContent.slice(7); // Remove 'italic:'
          const nestedSegments = parseText(italicContent);
          segments.push({
            type: 'italic',
            content: italicContent,
            nestedSegments,
          });
        } else {
          // Unknown marker, treat as text
          segments.push({
            type: 'text',
            content: `{{${markerContent}}}`,
          });
        }

        currentIndex = extracted.endIndex;
        lastIndex = currentIndex;
        continue;
      }
    }

    currentIndex++;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({
      type: 'text',
      content: text.slice(lastIndex),
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
    // eslint-disable-next-line sonarjs/cognitive-complexity
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
        const hasNestedSegments = segment.nestedSegments && segment.nestedSegments.length > 0;
        const boldContent = hasNestedSegments
          ? renderSegments(segment.nestedSegments!, `${key}-nested`)
          : applyTypography(segment.content);

        return (
          <span
            key={key}
            className='font-heading text-[length:inherit] leading-[inherit]'
          >
            {boldContent}
          </span>
        );
      }

      if (segment.type === 'italic') {
        const hasNestedSegments = segment.nestedSegments && segment.nestedSegments.length > 0;
        const italicContent = hasNestedSegments
          ? renderSegments(segment.nestedSegments!, `${key}-nested`)
          : applyTypography(segment.content);

        return (
          <span
            key={key}
            className='font-italic text-[length:inherit] leading-[inherit]'
          >
            {italicContent}
          </span>
        );
      }

      return <React.Fragment key={key}>{applyTypography(segment.content)}</React.Fragment>;
    });
  };

  return <Component {...(className && { className })}>{renderSegments(segments)}</Component>;
};
