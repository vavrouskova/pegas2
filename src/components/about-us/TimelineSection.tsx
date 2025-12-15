'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useRef, useState, useEffect } from 'react';

import { FormattedText } from '@/components/_shared/FormattedText';
import ChevronDown from '@/components/icons/ChevronDown';
import { cn } from '@/lib/utils';
import type { TimelineItem } from '@/utils/wordpress-types';

interface TimelineSectionProps {
  timeline: TimelineItem[];
}

// Constants
const IMAGE_ASPECT_RATIO = 120 / 67;
const MAX_VISIBLE_ITEMS = 6;

// Subcomponents
interface TimelineImageProps {
  src: string;
  alt: string;
  className?: string;
}

const TimelineImage = ({ src, alt, className = '' }: Readonly<TimelineImageProps>) => {
  return (
    <div
      className={`relative max-w-60 overflow-hidden ${className}`}
      style={{ aspectRatio: IMAGE_ASPECT_RATIO }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className='object-cover'
        sizes='(max-width: 768px) 100vw, 240px'
      />
    </div>
  );
};

interface TimelineYearProps {
  year: number | undefined;
  className?: string;
}

const TimelineYear = ({ year, className = '' }: Readonly<TimelineYearProps>) => {
  if (!year) return null;
  return <span className={`font-heading text-primary text-lg font-bold ${className}`}>{year}</span>;
};

interface TimelineContentProps {
  title?: string;
  description?: string;
  image?: TimelineItem['image'];
  className?: string;
}

const TimelineContent = ({ title, description, image, className = '' }: Readonly<TimelineContentProps>) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {image?.node && (
        <TimelineImage
          src={image.node.sourceUrl}
          alt={image.node.altText || title || 'Timeline image'}
        />
      )}
      {title && (
        <FormattedText
          text={title}
          as='h3'
          className='font-heading text-2xl'
        />
      )}
      {description && (
        <FormattedText
          text={description}
          as='p'
        />
      )}
    </div>
  );
};

interface TimelineItemComponentProps {
  item: TimelineItem;
  isEven: boolean;
}

const TimelineItemComponent = ({ item, isEven }: Readonly<TimelineItemComponentProps>) => {
  return (
    <article className='relative'>
      {/* Mobile layout */}
      <div className='flex flex-col gap-4 md:hidden'>
        <TimelineYear year={item.year} />
        {item.image?.node && (
          <TimelineImage
            src={item.image.node.sourceUrl}
            alt={item.image.node.altText || item.titulek || 'Timeline image'}
            className='w-full'
          />
        )}
        {item.titulek && <h3 className='font-heading text-2xl'>{item.titulek}</h3>}
        {item.description && <p>{item.description}</p>}
      </div>

      {/* Desktop layout - alternating */}
      <div className='hidden md:block'>
        {/* Timeline dot */}
        <div
          className='bg-primary absolute top-1/2 left-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full'
          aria-hidden='true'
        />

        <div className='grid grid-cols-2 gap-12 lg:gap-24'>
          {isEven ? (
            <>
              <div className='flex items-center justify-end'>
                <TimelineYear year={item.year} />
              </div>
              <TimelineContent
                title={item.titulek}
                description={item.description}
                image={item.image}
              />
            </>
          ) : (
            <>
              <TimelineContent
                title={item.titulek}
                description={item.description}
                image={item.image}
                className='text-right [&>div]:ml-auto'
              />
              <div className='flex items-center justify-start'>
                <TimelineYear year={item.year} />
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
};

const TimelineSection = ({ timeline }: Readonly<TimelineSectionProps>) => {
  const t = useTranslations('about-us.timeline');
  const [showAll, setShowAll] = useState(false);
  const itemsContainerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const hasMoreItems = timeline.length > MAX_VISIBLE_ITEMS;
  const visibleItems = showAll ? timeline : timeline.slice(0, MAX_VISIBLE_ITEMS);

  useEffect(() => {
    if (!itemsContainerRef.current || !lineRef.current) return;

    const updateLineHeight = () => {
      const items = itemsContainerRef.current?.children;
      if (!items || items.length === 0) return;

      const lastItem = items.at(-1) as HTMLElement;
      const firstItem = items[0] as HTMLElement;

      if (firstItem && lastItem && lineRef.current && itemsContainerRef.current) {
        const containerRect = itemsContainerRef.current.getBoundingClientRect();
        const firstItemRect = firstItem.getBoundingClientRect();
        const lastItemRect = lastItem.getBoundingClientRect();

        // Pozice středu prvního itemu relativně k containeru
        const lineTop = firstItemRect.top - containerRect.top + firstItemRect.height / 2;
        // Pozice středu posledního itemu relativně k containeru
        const lineBottom = lastItemRect.top - containerRect.top + lastItemRect.height / 2;
        // Výška linky od středu prvního do středu posledního itemu
        const lineHeight = lineBottom - lineTop;

        lineRef.current.style.top = `${lineTop}px`;
        lineRef.current.style.height = `${lineHeight}px`;
      }
    };

    // Použijeme setTimeout, aby se DOM aktualizoval před výpočtem
    const timeoutId = setTimeout(updateLineHeight, 0);
    window.addEventListener('resize', updateLineHeight);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateLineHeight);
    };
  }, [visibleItems, showAll]);

  if (!timeline?.length) {
    return null;
  }

  return (
    <section
      className='section-container px-4 py-12 sm:px-14 lg:px-44 lg:py-16'
      aria-label='Company timeline'
    >
      <div className='relative'>
        {/* Central vertical line */}
        <div
          ref={lineRef}
          className='bg-tertiary absolute left-1/2 hidden -translate-x-1/2 md:block'
          style={{ width: '1px' }}
          aria-hidden='true'
        />

        <div
          ref={itemsContainerRef}
          className='space-y-12'
        >
          {visibleItems.map((item, index) => (
            <TimelineItemComponent
              key={item.year || index}
              item={item}
              isEven={index % 2 === 0}
            />
          ))}
        </div>

        {hasMoreItems && !showAll && (
          <div className='mt-12 flex justify-center'>
            <button
              onClick={() => setShowAll(true)}
              className={cn('font-cta text-primary inline-flex items-center gap-2 transition-opacity hover:opacity-70')}
            >
              <span>{t('show-more')}</span>
              <ChevronDown className='h-5 w-5' />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TimelineSection;
