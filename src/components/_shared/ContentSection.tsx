import Image from 'next/image';
import React from 'react';

import ContentBox from '@/components/_shared/ContentBox';
import FeatherAnimation from '@/components/_shared/FeatherAnimation';
import FeatherStatic from '@/components/_shared/FeatherStatic';
import { cn } from '@/lib/utils';

type FeatherPosition = 'left' | 'right';

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
  featherPosition?: FeatherPosition;
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
  featherPosition = 'left',
}: ContentSectionProps) => {
  const hasImage = Boolean(image);
  const isImageLeft = imagePosition === 'left';

  if (!hasImage) {
    // ContentBox pouze (původní ContentBoxSection)
    return (
      <section
        className={cn(
          'section-container relative',
          withFeathers && featherPosition === 'right' ? '!pt-[26rem] lg:!pt-[15rem]' : '',
          sectionClassName
        )}
      >
        <ContentBox
          title={title}
          description={description}
          buttonText={buttonText}
          link={link}
          className={cn('max-w-content relative z-20 lg:mx-auto', contentBoxClassName)}
        />
        {withFeathers && (
          <>
            <FeatherAnimation featherPosition={featherPosition} />
            <FeatherStatic featherPosition={featherPosition} />
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
        'section-container flex flex-col-reverse justify-between gap-7.5 lg:gap-28',
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
        className={cn('max-w-content lg:flex-shrink-0', contentBoxClassName)}
      />
      <div className='lg:max-w-content min-w-0 lg:flex-1'>
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
