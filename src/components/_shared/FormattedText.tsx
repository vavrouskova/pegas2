import React from 'react';

import { czechTypography } from '@/lib/utils';

interface ParsedSegment {
  type: 'text' | 'br';
  content?: string;
  className?: string;
}

/**
 * Parsuje text se speciálními značkami pro responzivní odřádkování
 *
 * Podporované formáty:
 * - {{br}} - běžné odřádkování (vždy viditelné)
 * - {{br:max-lg:hidden}} - odřádkování skryté na menších obrazovkách než lg
 * - {{br:lg:hidden}} - odřádkování skryté na lg a větších obrazovkách
 *
 * @param text - Text k parsování
 * @returns Pole segmentů s textem a br elementy
 */
function parseText(text: string): ParsedSegment[] {
  const segments: ParsedSegment[] = [];

  // Regexp pro nalezení {{br}} nebo {{br:className}}
  const pattern = /\{\{br(?::([^}]+))?\}\}/g;

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

    // Přidat br element
    segments.push({
      type: 'br',
      className: match[1] || undefined,
    });

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
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
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

        const textContent =
          applyCzechTypography && segment.content ? czechTypography(segment.content) : segment.content;

        return <React.Fragment key={index}>{textContent}</React.Fragment>;
      })}
    </Component>
  );
};
