import Link from 'next/link';
import React from 'react';

import { czechTypography } from '@/lib/utils';

interface ParsedSegment {
  type: 'text' | 'br' | 'link';
  content?: string;
  className?: string;
  href?: string;
  target?: string;
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
 *
 * @param text - Text k parsování
 * @returns Pole segmentů s textem, br elementy a odkazy
 */
function parseText(text: string): ParsedSegment[] {
  const segments: ParsedSegment[] = [];

  // Combined pattern for {{br}}, {{br:className}}, and {{link:url|text}} or {{link:url|text|target}}
  // eslint-disable-next-line security/detect-unsafe-regex -- bounded character classes cannot cause catastrophic backtracking
  const pattern = /\{\{(?:br(?::([^}]+))?|link:([^|]+)\|([^|}]+)(?:\|([^}]+))?)\}\}/g;

  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    // Přidat text před značkou
    if (match.index > lastIndex) {
      const textContent = text.slice(lastIndex, match.index);
      segments.push({
        type: 'text',
        content: textContent,
      });
    }

    // Check if it's a link or br
    if (match[2] !== undefined && match[3] !== undefined) {
      // It's a link: {{link:url|text}} or {{link:url|text|target}}
      segments.push({
        type: 'link',
        href: match[2],
        content: match[3],
        target: match[4] || undefined,
      });
    } else {
      // It's a br: {{br}} or {{br:className}}
      segments.push({
        type: 'br',
        className: match[1] || undefined,
      });
    }

    lastIndex = pattern.lastIndex;
  }

  // Přidat zbývající text
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

  return (
    <Component className={className}>
      {segments.map((segment, index) => {
        if (segment.type === 'br') {
          return (
            <br
              key={index}
              className={segment.className}
            />
          );
        }

        if (segment.type === 'link' && segment.href) {
          const linkText = applyCzechTypography && segment.content ? czechTypography(segment.content) : segment.content;
          const target = segment.target || '_self';
          const isNewWindow = target === '_blank';

          return (
            <Link
              key={index}
              href={segment.href}
              target={target}
              rel={isNewWindow ? 'noopener noreferrer' : undefined}
              className='text-primary underline hover:no-underline'
            >
              {linkText}
            </Link>
          );
        }

        const textContent =
          applyCzechTypography && segment.content ? czechTypography(segment.content) : segment.content;

        return <React.Fragment key={index}>{textContent}</React.Fragment>;
      })}
    </Component>
  );
};
