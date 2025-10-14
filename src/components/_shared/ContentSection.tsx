import Image from 'next/image';
import React from 'react';

import ContentBox from '@/components/_shared/ContentBox';
import FeatherAnimation from '@/components/_shared/FeatherAnimation';
import FeatherStatic from '@/components/_shared/FeatherStatic';
import { cn } from '@/lib/utils';

interface ContentSectionProps {
  title: string;
  description: string;
  buttonText: string;
  link: string;
  className?: string;
  sectionClassName?: string;
  contentBoxClassName?: string;
  image?: { src: string; alt: string };
  imagePosition?: 'left' | 'right';
  withFeathers?: boolean;
}

const ContentSection = ({
  title,
  description,
  buttonText,
  link,
  className,
  sectionClassName,
  contentBoxClassName,
  image,
  imagePosition = 'right',
  withFeathers = false,
}: ContentSectionProps) => {
  const hasImage = Boolean(image);
  const isImageLeft = imagePosition === 'left';

  if (!hasImage) {
    // ContentBox pouze (původní ContentBoxSection)
    return (
      <section className={cn('section-container', withFeathers ? 'relative' : '', sectionClassName)}>
        <ContentBox
          title={title}
          description={description}
          buttonText={buttonText}
          link={link}
          className={cn('relative z-20 max-w-[42.6875rem] lg:mx-auto', contentBoxClassName)}
        />
        {withFeathers && (
          <>
            <FeatherAnimation />
            <FeatherStatic />
          </>
        )}
      </section>
    );
  }

  // ContentBox s obrázkem (původní ContentWithImages)
  if (!image) return null;

  const { src: imageSource, alt: imageAlt } = image;

  return (
    <section
      className={cn(
        'section-container flex flex-col-reverse justify-between gap-12 py-20 lg:gap-10',
        isImageLeft ? 'lg:flex-row-reverse lg:items-center' : 'lg:flex-row lg:items-center',
        sectionClassName,
        className
      )}
    >
      <ContentBox
        title={title}
        description={description}
        buttonText={buttonText}
        link={link}
        className={cn('max-w-[28.375rem] lg:mx-auto lg:flex-shrink-0', contentBoxClassName)}
      />
      <div className='min-w-0 lg:max-w-[43.25rem] lg:flex-1'>
        <Image
          src={imageSource}
          alt={imageAlt}
          width={1400}
          height={1400}
          sizes='(min-width: 1024px) 50vw, 100vw'
          className='h-auto w-full'
        />
      </div>
    </section>
  );
};

export default ContentSection;
