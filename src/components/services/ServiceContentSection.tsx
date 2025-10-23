import Image from 'next/image';
import React from 'react';

import { FormattedText } from '@/components/_shared/FormattedText';

interface WysiwygComponent {
  fieldGroupName: 'ComponentsComponentsWysiwygLayout';
  editor: string;
}

interface MediaComponent {
  fieldGroupName: 'ComponentsComponentsMediaLayout';
  mediaType: 'image' | 'video';
  youtubeEmbedLink?: string;
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

interface ServiceContentSectionProps {
  components?: {
    components?: ComponentType[];
  };
}

const ServiceContentSection = ({ components }: ServiceContentSectionProps) => {
  if (!components?.components || components.components.length === 0) {
    return null;
  }

  const renderWysiwygContent = (content: string) => {
    // Parsování HTML obsahu v pořadí výskytu (server-safe)
    const elements: React.ReactElement[] = [];
    let key = 0;

    // Odstranění HTML tagů a získání čistého textu, ale zachování <br>
    // eslint-disable-next-line sonarjs/slow-regex, unicorn/consistent-function-scoping
    const stripHtml = (html: string) => {
      return html
        .replace(/<br\s*\/?>/gi, '\n') // Zachování line breaks
        .replace(/<[^>]*>/g, '') // Odstranění všech ostatních tagů
        .trim();
    };

    // Najdeme všechny HTML elementy s jejich pozicemi
    interface ElementMatch {
      index: number;
      tag: string;
      content: string;
    }

    const matches: ElementMatch[] = [];

    // Hledáme H2
    const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
    let match;
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
      const text = stripHtml(item.content);

      if (!text) continue; // Skip prázdné elementy

      if (item.tag === 'h2') {
        elements.push(
          <FormattedText
            key={`h2-${key++}`}
            text={text}
            as='h2'
            className='text-deep mb-6 text-2xl leading-[1.44] font-black tracking-[1px] lg:mb-7 lg:text-3xl'
          />
        );
      } else if (item.tag === 'h3') {
        elements.push(
          <FormattedText
            key={`h3-${key++}`}
            text={text}
            as='h3'
            className='text-deep text-xl leading-[1.44] font-black tracking-[1px] lg:text-2xl'
          />
        );
      } else if (item.tag === 'p') {
        elements.push(
          <FormattedText
            key={`p-${key++}`}
            text={text}
            as='p'
            className='font-regular text-deep text-base leading-[2] tracking-[0.7px] lg:text-lg'
          />
        );
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
            className='flex w-full flex-col gap-6'
          >
            {renderWysiwygContent(component.editor)}
          </div>
        );
      }

      case 'ComponentsComponentsMediaLayout': {
        if (component.mediaType === 'video' && component.youtubeEmbedLink) {
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

        if (component.mediaType === 'image' && component.image?.node?.sourceUrl) {
          return (
            <div
              key={index}
              className='relative h-[200px] w-full md:h-[300px] lg:h-[381px]'
            >
              <Image
                src={component.image.node.sourceUrl}
                alt={component.image.node.altText || ''}
                fill
                className='object-cover'
                unoptimized
              />
            </div>
          );
        }
        return null;
      }

      case 'ComponentsComponentsGalleryLayout': {
        if (!component.gallery?.nodes || component.gallery.nodes.length === 0) {
          return null;
        }

        const images = component.gallery.nodes;

        // Layout podle počtu obrázků
        if (images.length === 2) {
          return (
            <div
              key={index}
              className='flex w-full flex-col gap-3 md:flex-row md:gap-4'
            >
              <div className='relative h-[180px] w-full md:h-[239px] md:w-[239px] md:shrink-0'>
                <Image
                  src={images[0].sourceUrl || ''}
                  alt={images[0].altText || ''}
                  fill
                  className='object-cover'
                  unoptimized
                />
              </div>
              <div className='relative h-[180px] flex-1 md:h-[239px]'>
                <Image
                  src={images[1].sourceUrl || ''}
                  alt={images[1].altText || ''}
                  fill
                  className='object-cover'
                  unoptimized
                />
              </div>
            </div>
          );
        }

        if (images.length === 4) {
          return (
            <div
              key={index}
              className='flex w-full flex-col gap-3 md:gap-4'
            >
              <div className='flex gap-3 md:gap-4'>
                <div className='relative h-[180px] w-full md:h-[239px] md:w-[239px] md:shrink-0'>
                  <Image
                    src={images[0].sourceUrl || ''}
                    alt={images[0].altText || ''}
                    fill
                    className='object-cover'
                    unoptimized
                  />
                </div>
                <div className='relative h-[180px] flex-1 md:h-[239px]'>
                  <Image
                    src={images[1].sourceUrl || ''}
                    alt={images[1].altText || ''}
                    fill
                    className='object-cover'
                    unoptimized
                  />
                </div>
              </div>
              <div className='flex gap-3 md:gap-4'>
                <div className='relative h-[180px] flex-1 md:h-[239px]'>
                  <Image
                    src={images[2].sourceUrl || ''}
                    alt={images[2].altText || ''}
                    fill
                    className='object-cover'
                    unoptimized
                  />
                </div>
                <div className='relative h-[180px] w-full md:h-[239px] md:w-[239px] md:shrink-0'>
                  <Image
                    src={images[3].sourceUrl || ''}
                    alt={images[3].altText || ''}
                    fill
                    className='object-cover'
                    unoptimized
                  />
                </div>
              </div>
            </div>
          );
        }

        // Fallback pro jiný počet obrázků - simple grid
        return (
          <div
            key={index}
            className='grid w-full grid-cols-1 gap-3 md:grid-cols-2 md:gap-4'
          >
            {images.map((image, imgIndex) => (
              <div
                key={imgIndex}
                className='relative h-[180px] md:h-[239px]'
              >
                <Image
                  src={image.sourceUrl || ''}
                  alt={image.altText || ''}
                  fill
                  className='object-cover'
                  unoptimized
                />
              </div>
            ))}
          </div>
        );
      }

      default: {
        return null;
      }
    }
  };

  return (
    <section className='section-container relative py-12 md:py-16 lg:py-20'>
      <div className='mx-auto flex max-w-[683px] flex-col items-start gap-8 px-4 md:gap-10 md:px-6 lg:px-0'>
        {components.components.map((component, index) => renderComponent(component, index))}
      </div>
    </section>
  );
};

export default ServiceContentSection;
