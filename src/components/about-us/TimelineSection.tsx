import Image from 'next/image';
import React from 'react';

import { czechTypography } from '@/lib/utils';
import type { TimelineItem } from '@/utils/wordpress-types';

interface TimelineSectionProps {
  timeline: TimelineItem[];
}

// Constants
const IMAGE_ASPECT_RATIO = 120 / 67;

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
      {title && <h3 className='font-heading text-2xl'>{czechTypography(title)}</h3>}
      {description && <p>{czechTypography(description)}</p>}
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
          className='bg-tertiary absolute top-0 left-1/2 hidden h-full -translate-x-1/2 md:block'
          style={{ width: '1px' }}
          aria-hidden='true'
        />

        <div className='space-y-12'>
          {timeline.map((item, index) => (
            <TimelineItemComponent
              key={item.year || index}
              item={item}
              isEven={index % 2 === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
