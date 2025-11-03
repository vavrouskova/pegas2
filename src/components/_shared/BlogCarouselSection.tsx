'use client';

import Link from 'next/link';
import Image from 'next/image';

import Button from '@/components/_shared/Button';
import { FormattedText } from '@/components/_shared/FormattedText';
import GenericCarouselSection from '@/components/_shared/GenericCarouselSection';

interface BlogCarouselItemData {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
}

interface BlogCarouselSectionProps {
  posts: BlogCarouselItemData[];
}

const BlogCarouselSection = ({ posts }: BlogCarouselSectionProps) => {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <GenericCarouselSection
      data={posts}
      sectionClassName='pb-14'
      carouselMaxWidth='lg:max-w-[60.625rem] max-w-[28.375rem] lg:pr-0'
      articleClassName='flex flex-col-reverse items-center lg:grid lg:grid-cols-[1fr_auto] lg:overflow-hidden'
      renderContent={(item, t) => (
        <div className='mx-auto flex flex-1 flex-col space-y-2 px-4 py-8 max-md:h-full max-md:justify-between lg:max-w-[28.375rem] lg:px-10'>
          <div className='flex flex-col space-y-2.5'>
            <FormattedText
              text={item.title}
              as='h3'
              className='text-white-smoke'
            />
            <FormattedText
              text={item.description}
              as='p'
              className='text-tertiary mb-6 line-clamp-3 text-base'
            />
          </div>
          <Link href={item.link}>
            <Button
              buttonText={t('find-out-more')}
              className='-ml-8'
            />
          </Link>
        </div>
      )}
      renderImage={(item) => (
        <picture className='relative aspect-square w-full flex-shrink-0 lg:w-[23.125rem] lg:flex-shrink-0'>
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes='(max-width: 1024px) 100vw, 370px'
            className='object-cover'
          />
        </picture>
      )}
    />
  );
};

export default BlogCarouselSection;
