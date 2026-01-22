'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

import Button from '@/components/_shared/Button';
import { FormattedText } from '@/components/_shared/FormattedText';
import GenericCarouselSection from '@/components/_shared/GenericCarouselSection';
import { formatFarewellDateTime } from '@/utils/helper';
import type { ReferencePost } from '@/utils/wordpress-types';

interface ReferencesCarouselItemData {
  id: number;
  title: string;
  where?: string;
  when?: string;
  image: string;
  link: string;
}

interface ReferencesCarouselSectionProps {
  referencePosts?: ReferencePost[];
}

const ReferencesCarouselSection = ({ referencePosts = [] }: ReferencesCarouselSectionProps) => {
  const carouselData: ReferencesCarouselItemData[] = useMemo(() => {
    return referencePosts.map((post) => ({
      id: post.databaseId,
      title: post.title,
      where: post.referenceACF?.farewellPlace,
      when: formatFarewellDateTime(post.referenceACF?.farewellDate),
      image: post.featuredImage?.node?.sourceUrl || '/images/placeholder.webp',
      link: `/${post.slug}`,
    }));
  }, [referencePosts]);

  if (carouselData.length === 0) {
    return null;
  }

  return (
    <GenericCarouselSection
      data={carouselData}
      carouselMaxWidth='max-w-[23.125rem] lg:max-w-[59rem]'
      articleClassName='flex flex-col-reverse items-center lg:flex-row'
      renderImage={(item) => (
        <picture className='relative aspect-square h-auto max-h-[23.125rem] w-full max-w-[23.125rem] lg:col-span-2'>
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes='(max-width: 1024px) 100vw, 40vw'
            className='object-cover'
          />
        </picture>
      )}
      renderContent={(item, t) => (
        <div className='mx-auto flex flex-1 flex-col space-y-2 px-4 py-8 max-md:h-full max-md:justify-between lg:col-span-3 lg:px-25'>
          <div className='flex flex-col space-y-2'>
            <FormattedText
              text={item.title}
              as='h3'
              className='text-white-smoke mb-6 text-xl'
            />
            {item.where && (
              <FormattedText
                text={item.where}
                as='span'
                className='text-tertiary text-base'
              />
            )}
            {item.when && (
              <FormattedText
                text={item.when}
                as='span'
                className='text-tertiary text-base'
              />
            )}
          </div>
          <Link href={item.link}>
            <Button
              buttonText={t('find-out-more')}
              className='-ml-8 lg:-ml-16'
            />
          </Link>
        </div>
      )}
    />
  );
};

export default ReferencesCarouselSection;
