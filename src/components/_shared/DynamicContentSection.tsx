/* eslint-disable sonarjs/no-nested-conditional */
/* eslint-disable unicorn/no-nested-ternary */
/* eslint-disable sonarjs/cognitive-complexity */
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import React from 'react';

import Button from '@/components/_shared/Button';
import { FormattedText } from '@/components/_shared/FormattedText';
import { ImageBoxesSection } from '@/components/_shared/ImageBoxesSection';
import { ImageSliderSection } from '@/components/_shared/ImageSliderSection';
import { GalleryImageWrapper } from '@/components/services/GalleryImageWrapper';
import { cn } from '@/lib/utils';

interface WysiwygComponent {
  fieldGroupName: 'ComponentsComponentsWysiwygLayout';
  editor: string;
}

interface MediaComponent {
  fieldGroupName: 'ComponentsComponentsMediaLayout';
  mediaType: 'image' | 'youtube' | string[] | string;
  youtubeEmbedLink?: string | null;
  image?: {
    node: {
      altText?: string;
      sourceUrl?: string;
    };
  };
}

interface GalleryComponent {
  fieldGroupName: 'ComponentsComponentsGalleryLayout';
  gallery?: {
    nodes: Array<{
      altText?: string;
      sourceUrl?: string;
    }>;
  };
}

interface ImageBoxesComponent {
  fieldGroupName: 'ComponentsComponentsImageBoxesLayout';
  imageBoxes?: Array<{
    boxHeadline?: string;
    boxDescription?: string;
    imageBox?: {
      node: {
        altText?: string;
        sourceUrl?: string;
      };
    };
  }>;
}

interface ImageSliderComponent {
  fieldGroupName: 'ComponentsComponentsImageSliderLayout';
  imageSlider?: {
    nodes: Array<{
      altText?: string;
      sourceUrl?: string;
    }>;
  };
}

interface ButtonComponent {
  fieldGroupName: 'ComponentsComponentsButtonLayout';
  button?: {
    target?: string;
    title?: string;
    url?: string;
  };
}

type ComponentType =
  | WysiwygComponent
  | MediaComponent
  | GalleryComponent
  | ImageBoxesComponent
  | ImageSliderComponent
  | ButtonComponent;

interface DynamicContentSectionProps {
  components?: {
    components?: ComponentType[];
  };
  categorySlug?: string;
  showBackLink?: boolean;
  backLink?: string;
  backLinkText?: string;
  className?: string;
  wider?: boolean;
}

// Helper to transform bold/italic tags to markers
const transformTextFormatting = (text: string) => {
  return text
    .replace(/<(?:strong|b)>([\s\S]*?)<\/(?:strong|b)>/gi, '{{bold:$1}}')
    .replace(/<(?:em|i)>([\s\S]*?)<\/(?:em|i)>/gi, '{{italic:$1}}');
};

// Helper to strip HTML tags and convert to formatted text markers
const stripHtml = (html: string) => {
  return (
    html
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

// Helper to parse list items from HTML
const parseListItems = (listContent: string): string[] => {
  const items: string[] = [];
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let match;
  while ((match = liRegex.exec(listContent)) !== null) {
    const itemText = stripHtml(match[1]);
    if (itemText) {
      items.push(itemText);
    }
  }
  return items;
};

const DynamicContentSection = async ({
  components,
  categorySlug,
  showBackLink = true,
  backLink: customBackLink,
  backLinkText: customBackLinkText,
  className,
  wider = false,
}: DynamicContentSectionProps) => {
  if (!components?.components || components.components.length === 0) {
    return null;
  }

  const t = await getTranslations();

  let backLink = customBackLink;
  let backLinkText = customBackLinkText;

  if (!backLink || !backLinkText) {
    backLink = `/${t('routes.services')}#dalsi-sluzby`;
    backLinkText = t('services.back-to-services.other-services');

    if (categorySlug === t('routes.ceremony-variants')) {
      backLink = `/${t('routes.services')}#smutecni-obrady`;
      backLinkText = t('services.back-to-services.ceremony-variants');
    } else if (categorySlug === t('routes.funeral-essentials')) {
      backLink = `/${t('routes.services')}#nalezitosti-pohrbu`;
      backLinkText = t('services.back-to-services.funeral-essentials');
    }
  }

  const renderWysiwygContent = (content: string, isLastComponent: boolean) => {
    const elements: React.ReactElement[] = [];
    let key = 0;

    interface ElementMatch {
      index: number;
      tag: string;
      content: string;
      isList?: boolean;
      listType?: 'ul' | 'ol';
    }

    const matches: ElementMatch[] = [];

    const ulRegex = /<ul[^>]*>([\s\S]*?)<\/ul>/gi;
    let match;
    while ((match = ulRegex.exec(content)) !== null) {
      matches.push({ index: match.index, tag: 'ul', content: match[1], isList: true, listType: 'ul' });
    }

    const olRegex = /<ol[^>]*>([\s\S]*?)<\/ol>/gi;
    while ((match = olRegex.exec(content)) !== null) {
      matches.push({ index: match.index, tag: 'ol', content: match[1], isList: true, listType: 'ol' });
    }

    const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
    while ((match = h2Regex.exec(content)) !== null) {
      matches.push({ index: match.index, tag: 'h2', content: match[1] });
    }

    const h3Regex = /<h3[^>]*>([\s\S]*?)<\/h3>/gi;
    while ((match = h3Regex.exec(content)) !== null) {
      matches.push({ index: match.index, tag: 'h3', content: match[1] });
    }

    const h4Regex = /<h4[^>]*>([\s\S]*?)<\/h4>/gi;
    while ((match = h4Regex.exec(content)) !== null) {
      matches.push({ index: match.index, tag: 'h4', content: match[1] });
    }

    const h5Regex = /<h5[^>]*>([\s\S]*?)<\/h5>/gi;
    while ((match = h5Regex.exec(content)) !== null) {
      matches.push({ index: match.index, tag: 'h5', content: match[1] });
    }

    const h6Regex = /<h6[^>]*>([\s\S]*?)<\/h6>/gi;
    while ((match = h6Regex.exec(content)) !== null) {
      matches.push({ index: match.index, tag: 'h6', content: match[1] });
    }

    const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    while ((match = pRegex.exec(content)) !== null) {
      matches.push({ index: match.index, tag: 'p', content: match[1] });
    }

    matches.sort((a, b) => a.index - b.index);

    for (let index = 0; index < matches.length; index++) {
      const item = matches[index];
      const isLastElement = index === matches.length - 1;
      const nextItem = matches[index + 1];

      if (item.isList && item.listType) {
        const listItems = parseListItems(item.content);
        if (listItems.length > 0) {
          const ListTag = item.listType === 'ul' ? 'ul' : 'ol';
          const listStyleClass = item.listType === 'ul' ? 'list-none' : 'list-decimal';
          const marginClass = isLastElement && isLastComponent ? '' : 'mb-12.5';
          elements.push(
            <ListTag
              key={`${item.listType}-${key++}`}
              className={`${listStyleClass} ${marginClass}`}
            >
              {listItems.map((listItem, itemIndex) => (
                <li
                  key={itemIndex}
                  className={`ml-4 ${itemIndex > 0 ? 'mt-3.5' : ''} ${item.listType === 'ul' ? "before:bg-primary relative pl-3.5 before:absolute before:top-4 before:left-0 before:block before:size-0.75 before:rounded-full before:content-['']" : ''}`}
                >
                  <FormattedText
                    text={listItem}
                    as='span'
                  />
                </li>
              ))}
            </ListTag>
          );
        }
        continue;
      }

      const text = stripHtml(item.content);

      if (!text) continue;

      switch (item.tag) {
        case 'h2': {
          const isNextTextOrList = nextItem && (nextItem.tag === 'p' || nextItem.tag === 'h3' || nextItem.isList);
          const marginClass = isLastElement && isLastComponent ? '' : isNextTextOrList ? 'mb-2.5' : 'mb-12.5';
          elements.push(
            <FormattedText
              key={`h2-${key++}`}
              text={text}
              as='h2'
              className={marginClass}
            />
          );

          break;
        }
        case 'h3': {
          const isNextTextOrList = nextItem && (nextItem.tag === 'p' || nextItem.isList);
          const marginClass = isLastElement && isLastComponent ? '' : isNextTextOrList ? 'mb-2.5' : 'mb-12.5';
          elements.push(
            <FormattedText
              key={`h3-${key++}`}
              text={text}
              as='h3'
              className={marginClass}
            />
          );

          break;
        }
        case 'h4': {
          const isNextTextOrList = nextItem && (nextItem.tag === 'p' || nextItem.isList);
          const marginClass = isLastElement && isLastComponent ? '' : isNextTextOrList ? 'mb-2.5' : 'mb-12.5';
          elements.push(
            <FormattedText
              key={`h4-${key++}`}
              text={text}
              as='h4'
              className={marginClass}
            />
          );

          break;
        }
        case 'h5': {
          const isNextTextOrList = nextItem && (nextItem.tag === 'p' || nextItem.isList);
          const marginClass = isLastElement && isLastComponent ? '' : isNextTextOrList ? 'mb-2.5' : 'mb-12.5';
          elements.push(
            <FormattedText
              key={`h5-${key++}`}
              text={text}
              as='h5'
              className={marginClass}
            />
          );

          break;
        }
        case 'h6': {
          const isNextTextOrList = nextItem && (nextItem.tag === 'p' || nextItem.isList);
          const marginClass = isLastElement && isLastComponent ? '' : isNextTextOrList ? 'mb-2.5' : 'mb-12.5';
          elements.push(
            <FormattedText
              key={`h6-${key++}`}
              text={text}
              as='h6'
              className={marginClass}
            />
          );

          break;
        }
        case 'p': {
          const marginClass = isLastElement && isLastComponent ? '' : 'mb-12.5';
          elements.push(
            <FormattedText
              key={`p-${key++}`}
              text={text}
              as='p'
              className={marginClass}
            />
          );

          break;
        }
      }
    }

    return elements;
  };

  const renderComponent = (component: ComponentType, index: number, totalComponents: number) => {
    const isLastComponent = index === totalComponents - 1;

    switch (component.fieldGroupName) {
      case 'ComponentsComponentsWysiwygLayout': {
        return (
          <div
            key={index}
            className='flex w-full flex-col'
          >
            {renderWysiwygContent(component.editor, isLastComponent)}
          </div>
        );
      }

      case 'ComponentsComponentsMediaLayout': {
        const mediaTypeValue = Array.isArray(component.mediaType)
          ? component.mediaType[0]?.toLowerCase()
          : component.mediaType?.toLowerCase();

        const isImage = (mediaTypeValue === 'image' || !component.mediaType) && component.image?.node?.sourceUrl;
        const marginClass = isLastComponent ? '' : isImage ? 'mb-12.5' : 'mb-25';

        if (mediaTypeValue === 'youtube' && component.youtubeEmbedLink) {
          return (
            <div
              key={index}
              className={`relative aspect-video w-full ${marginClass}`}
            >
              <iframe
                src={component.youtubeEmbedLink}
                title='YouTube video'
                className='h-full w-full'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
              />
            </div>
          );
        }

        const hasImage = component.image?.node?.sourceUrl;
        if ((mediaTypeValue === 'image' || !component.mediaType) && hasImage) {
          return (
            <GalleryImageWrapper
              key={index}
              src={component.image?.node?.sourceUrl || ''}
              alt={component.image?.node?.altText || ''}
              className={`relative h-[200px] w-full md:h-[300px] lg:h-[381px] ${marginClass}`}
            />
          );
        }

        return null;
      }

      case 'ComponentsComponentsGalleryLayout': {
        if (!component.gallery?.nodes || component.gallery.nodes.length === 0) {
          return null;
        }

        const images = component.gallery.nodes;
        const marginClass = isLastComponent ? '' : 'mb-25';
        if (images.length === 2) {
          return (
            <div
              key={index}
              className={`flex w-full flex-col gap-3 md:gap-4 lg:flex-row ${marginClass}`}
            >
              {images.map((image, imgIndex) => {
                const isSquare = imgIndex % 2 === 0;

                return (
                  <GalleryImageWrapper
                    key={imgIndex}
                    src={image.sourceUrl || ''}
                    alt={image.altText || ''}
                    className={`relative w-full ${isSquare ? 'aspect-square' : 'aspect-video'} lg:aspect-auto ${
                      imgIndex === 0 ? 'lg:h-[239px] lg:w-[239px] lg:flex-none lg:shrink-0' : 'lg:h-[239px] lg:flex-1'
                    }`}
                  />
                );
              })}
            </div>
          );
        }

        if (images.length === 4) {
          return (
            <div
              key={index}
              className={`flex w-full flex-col gap-3 md:gap-4 ${marginClass}`}
            >
              {images.map((image, imgIndex) => {
                const isSquare = imgIndex % 2 === 0;

                return (
                  <GalleryImageWrapper
                    key={imgIndex}
                    src={image.sourceUrl || ''}
                    alt={image.altText || ''}
                    className={`relative w-full ${isSquare ? 'aspect-square' : 'aspect-video'} lg:hidden`}
                  />
                );
              })}

              <div className='hidden lg:flex lg:gap-4'>
                <GalleryImageWrapper
                  src={images[0].sourceUrl || ''}
                  alt={images[0].altText || ''}
                  className='relative aspect-auto h-[239px] w-[239px] shrink-0'
                />
                <GalleryImageWrapper
                  src={images[1].sourceUrl || ''}
                  alt={images[1].altText || ''}
                  className='relative aspect-auto h-[239px] flex-1'
                />
              </div>
              <div className='hidden lg:flex lg:gap-4'>
                <GalleryImageWrapper
                  src={images[2].sourceUrl || ''}
                  alt={images[2].altText || ''}
                  className='relative aspect-auto h-[239px] flex-1'
                />
                <GalleryImageWrapper
                  src={images[3].sourceUrl || ''}
                  alt={images[3].altText || ''}
                  className='relative aspect-auto h-[239px] w-[239px] shrink-0'
                />
              </div>
            </div>
          );
        }

        return (
          <div
            key={index}
            className={`flex w-full flex-col gap-3 md:gap-4 lg:grid lg:grid-cols-2 ${marginClass}`}
          >
            {images.map((image, imgIndex) => {
              const isSquare = imgIndex % 2 === 0;

              return (
                <GalleryImageWrapper
                  key={imgIndex}
                  src={image.sourceUrl || ''}
                  alt={image.altText || ''}
                  className={`relative w-full ${
                    isSquare ? 'aspect-square' : 'aspect-video'
                  } lg:aspect-auto lg:h-[239px]`}
                />
              );
            })}
          </div>
        );
      }

      case 'ComponentsComponentsImageBoxesLayout': {
        if (!component.imageBoxes || component.imageBoxes.length === 0) {
          return null;
        }

        return (
          <div
            key={index}
            className='mb-25 w-full'
          >
            <ImageBoxesSection imageBoxes={component.imageBoxes} />
          </div>
        );
      }

      case 'ComponentsComponentsImageSliderLayout': {
        if (!component.imageSlider?.nodes || component.imageSlider.nodes.length === 0) {
          return null;
        }

        return (
          <div
            key={index}
            className='mb-25 w-full'
          >
            <ImageSliderSection images={component.imageSlider.nodes} />
          </div>
        );
      }

      case 'ComponentsComponentsButtonLayout': {
        if (!component.button?.url || !component.button?.title) {
          return null;
        }

        const marginClass = isLastComponent ? '' : 'mb-25 lg:mb-37.5';
        const isExternal = component.button.target === '_blank';

        return (
          <Link
            key={index}
            href={component.button.url}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className={marginClass}
          >
            <Button buttonText={component.button.title} />
          </Link>
        );
      }

      default: {
        return null;
      }
    }
  };

  const totalComponents = components.components?.length || 0;

  return (
    <section className={cn('section-container relative', className)}>
      <div className={cn('mx-auto flex flex-col items-start', wider ? 'max-w-section' : 'max-w-dynamic-content')}>
        {components.components.map((component, index) => renderComponent(component, index, totalComponents))}
        {showBackLink && (
          <Link
            className='mt-12.5'
            href={backLink}
          >
            <Button
              buttonText={backLinkText}
              variant='white'
              arrowPosition='left'
              reverseArrow
            />
          </Link>
        )}
      </div>
    </section>
  );
};

export default DynamicContentSection;
