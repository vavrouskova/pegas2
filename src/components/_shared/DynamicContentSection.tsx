import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import React from 'react';

import Button from '@/components/_shared/Button';
import { FormattedText } from '@/components/_shared/FormattedText';
import Socials from '@/components/_shared/Socials';
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

type ComponentType = WysiwygComponent | MediaComponent | GalleryComponent;

interface DynamicContentSectionProps {
  components?: {
    components?: ComponentType[];
  };
  categorySlug?: string;
  backLink?: string;
  backLinkText?: string;
  socials?: boolean;
  className?: string;
}

const DynamicContentSection = async ({
  components,
  categorySlug,
  backLink: customBackLink,
  backLinkText: customBackLinkText,
  socials = true,
  className,
}: DynamicContentSectionProps) => {
  if (!components?.components || components.components.length === 0) {
    return null;
  }

  const t = await getTranslations();

  // Pokud jsou poskytnuty vlastní linky pro blog, použijeme je
  // Jinak určíme správný link a text podle kategorie služeb
  let backLink = customBackLink;
  let backLinkText = customBackLinkText;

  if (!backLink || !backLinkText) {
    backLink = `/${t('routes.services')}#dalsi-sluzby`;
    backLinkText = t('services.back-to-services.other-services');

    if (categorySlug === 'smutecni-obrady') {
      backLink = `/${t('routes.services')}#smutecni-obrady`;
      backLinkText = t('services.back-to-services.ceremony-variants');
    } else if (categorySlug === 'nalezitosti-pohrbu') {
      backLink = `/${t('routes.services')}#nalezitosti-pohrbu`;
      backLinkText = t('services.back-to-services.funeral-essentials');
    }
  }

  const renderWysiwygContent = (content: string) => {
    // Parsování HTML obsahu v pořadí výskytu (server-safe)
    const elements: React.ReactElement[] = [];
    let key = 0;

    // Odstranění HTML tagů a získání čistého textu, ale zachování <br>
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const stripHtml = (html: string) => {
      return (
        html
          .replace(/<br\s*\/?>/gi, '\n') // Zachování line breaks
          // eslint-disable-next-line sonarjs/slow-regex
          .replace(/<[^>]*>/g, '') // Odstranění všech ostatních tagů
          .trim()
      );
    };

    // Parsování seznamu - extrahuje všechny <li> položky
    // eslint-disable-next-line unicorn/consistent-function-scoping
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

    // Najdeme všechny HTML elementy s jejich pozicemi
    interface ElementMatch {
      index: number;
      tag: string;
      content: string;
      isList?: boolean;
      listType?: 'ul' | 'ol';
    }

    const matches: ElementMatch[] = [];

    // Hledáme UL (unordered lists)
    const ulRegex = /<ul[^>]*>([\s\S]*?)<\/ul>/gi;
    let match;
    while ((match = ulRegex.exec(content)) !== null) {
      matches.push({ index: match.index, tag: 'ul', content: match[1], isList: true, listType: 'ul' });
    }

    // Hledáme OL (ordered lists)
    const olRegex = /<ol[^>]*>([\s\S]*?)<\/ol>/gi;
    while ((match = olRegex.exec(content)) !== null) {
      matches.push({ index: match.index, tag: 'ol', content: match[1], isList: true, listType: 'ol' });
    }

    // Hledáme H2
    const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
    while ((match = h2Regex.exec(content)) !== null) {
      matches.push({ index: match.index, tag: 'h2', content: match[1] });
    }

    // Hledáme H3
    const h3Regex = /<h3[^>]*>([\s\S]*?)<\/h3>/gi;
    while ((match = h3Regex.exec(content)) !== null) {
      matches.push({ index: match.index, tag: 'h3', content: match[1] });
    }

    // Hledáme P
    const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    while ((match = pRegex.exec(content)) !== null) {
      matches.push({ index: match.index, tag: 'p', content: match[1] });
    }

    // Seřadíme podle pozice v HTML
    matches.sort((a, b) => a.index - b.index);

    // Renderujeme v pořadí
    for (const item of matches) {
      if (item.isList && item.listType) {
        const listItems = parseListItems(item.content);
        if (listItems.length > 0) {
          const ListTag = item.listType === 'ul' ? 'ul' : 'ol';
          const listStyleClass = item.listType === 'ul' ? 'list-disc' : 'list-decimal';
          elements.push(
            <ListTag
              key={`${item.listType}-${key++}`}
              className={`font-regular text-deep ml-6 ${listStyleClass} space-y-2 text-base lg:text-lg`}
            >
              {listItems.map((listItem, itemIndex) => (
                <li
                  key={itemIndex}
                  className='ml-4'
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

      if (!text) continue; // Skip prázdné elementy

      switch (item.tag) {
        case 'h2': {
          elements.push(
            <FormattedText
              key={`h2-${key++}`}
              text={text}
              as='h2'
              className='text-deep text-2xl lg:text-3xl'
            />
          );

          break;
        }
        case 'h3': {
          elements.push(
            <FormattedText
              key={`h3-${key++}`}
              text={text}
              as='h3'
              className='text-deep text-xl lg:text-2xl'
            />
          );

          break;
        }
        case 'p': {
          elements.push(
            <FormattedText
              key={`p-${key++}`}
              text={text}
              as='p'
              className='font-regular text-deep text-base lg:text-lg'
            />
          );

          break;
        }
        // No default
      }
    }

    return elements;
  };

  const renderComponent = (component: ComponentType, index: number) => {
    switch (component.fieldGroupName) {
      case 'ComponentsComponentsWysiwygLayout': {
        return (
          <div
            key={index}
            className='flex w-full flex-col gap-10'
          >
            {renderWysiwygContent(component.editor)}
          </div>
        );
      }

      case 'ComponentsComponentsMediaLayout': {
        // Handle mediaType as both string and array
        const mediaTypeValue = Array.isArray(component.mediaType)
          ? component.mediaType[0]?.toLowerCase()
          : component.mediaType?.toLowerCase();

        // Check for video (backend can send 'video' or 'youtube')
        if (mediaTypeValue === 'youtube' && component.youtubeEmbedLink) {
          return (
            <div
              key={index}
              className='relative aspect-video w-full'
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

        // Check for image
        const hasImage = component.image?.node?.sourceUrl;
        if ((mediaTypeValue === 'image' || !component.mediaType) && hasImage) {
          return (
            <GalleryImageWrapper
              key={index}
              src={component.image?.node?.sourceUrl || ''}
              alt={component.image?.node?.altText || ''}
              className='relative h-[200px] w-full md:h-[300px] lg:h-[381px]'
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

        // Mobile: obrázky pod sebou, lichý čtvercový, sudý podlouhlý
        // Desktop: původní layouty podle počtu obrázků

        // Layout pro 2 obrázky
        if (images.length === 2) {
          return (
            <div
              key={index}
              className='flex w-full flex-col gap-3 md:gap-4 lg:flex-row'
            >
              {images.map((image, imgIndex) => {
                const isSquare = imgIndex % 2 === 0;

                return (
                  <GalleryImageWrapper
                    key={imgIndex}
                    src={image.sourceUrl || ''}
                    alt={image.altText || ''}
                    className={`relative w-full ${isSquare ? 'aspect-square' : 'aspect-[16/9]'} lg:aspect-auto ${
                      imgIndex === 0 ? 'lg:h-[239px] lg:w-[239px] lg:flex-none lg:shrink-0' : 'lg:h-[239px] lg:flex-1'
                    }`}
                  />
                );
              })}
            </div>
          );
        }

        // Layout pro 4 obrázky
        if (images.length === 4) {
          return (
            <div
              key={index}
              className='flex w-full flex-col gap-3 md:gap-4'
            >
              {images.map((image, imgIndex) => {
                const isSquare = imgIndex % 2 === 0;

                return (
                  <GalleryImageWrapper
                    key={imgIndex}
                    src={image.sourceUrl || ''}
                    alt={image.altText || ''}
                    className={`relative w-full ${isSquare ? 'aspect-square' : 'aspect-[16/9]'} lg:hidden`}
                  />
                );
              })}

              {/* Desktop layout pro 4 obrázky */}
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

        // Ostatní počty obrázků
        return (
          <div
            key={index}
            className='flex w-full flex-col gap-3 md:gap-4 lg:grid lg:grid-cols-2'
          >
            {images.map((image, imgIndex) => {
              const isSquare = imgIndex % 2 === 0;

              return (
                <GalleryImageWrapper
                  key={imgIndex}
                  src={image.sourceUrl || ''}
                  alt={image.altText || ''}
                  className={`relative w-full ${
                    isSquare ? 'aspect-square' : 'aspect-[16/9]'
                  } lg:aspect-auto lg:h-[239px]`}
                />
              );
            })}
          </div>
        );
      }

      default: {
        return null;
      }
    }
  };

  return (
    <section className={cn('section-container 2lg:py-16 relative pt-32 lg:pb-16', className)}>
      {socials && <Socials />}
      <div className='mx-auto flex max-w-[684px] flex-col items-start gap-10'>
        {components.components.map((component, index) => renderComponent(component, index))}
        <Link
          href={backLink}
          className='text-primary'
        >
          <Button
            buttonText={backLinkText}
            variant='white'
            arrowPosition='left'
            reverseArrow
          />
        </Link>
      </div>
    </section>
  );
};

export default DynamicContentSection;
