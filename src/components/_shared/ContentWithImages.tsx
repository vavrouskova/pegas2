import Image from 'next/image';
import React from 'react';

import ContentBox from '@/components/_shared/ContentBox';
import { cn } from '@/lib/utils';

interface ContentWithImagesProps {
  title: string;
  description: string;
  buttonText: string;
  link: string;
  className?: string;
  image?: { src: string; alt: string };
}

const ContentWithImages = ({ title, description, buttonText, link, className, image }: ContentWithImagesProps) => {
  const fallbackSource = '/images/rose.webp';
  const fallbackAlt = 'How to navigate';
  const displayImage = image || { src: fallbackSource, alt: fallbackAlt };
  return (
    <section
      className={cn('flex flex-col-reverse justify-between gap-12 lg:flex-row lg:items-center lg:gap-10', className)}
    >
      <ContentBox
        title={title}
        description={description}
        buttonText={buttonText}
        link={link}
        className='max-w-[28.375rem] min-w-[28.375rem] lg:mx-auto'
      />
      <Image
        src={displayImage.src}
        alt={displayImage.alt}
        width={1400}
        height={1400}
        className='w-full max-w-[43.25rem]'
      />
    </section>
  );
};

export default ContentWithImages;
