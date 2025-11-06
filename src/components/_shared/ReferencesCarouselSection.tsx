'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import Button from '@/components/_shared/Button';
import { FormattedText } from '@/components/_shared/FormattedText';
import GenericCarouselSection from '@/components/_shared/GenericCarouselSection';
import { czechTypography } from '@/lib/utils';
import { formatFarewellDateTime } from '@/utils/helper';
import { ReferencePost } from '@/utils/wordpress-types';

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

function convertToCarouselData(referencePosts: ReferencePost[]): ReferencesCarouselItemData[] {
  return referencePosts.map((post) => ({
    id: post.databaseId,
    title: post.title,
    where: post.referenceACF?.farewellPlace,
    when: formatFarewellDateTime(post.referenceACF?.farewellDate),
    image: post.featuredImage?.node.sourceUrl || '/images/car.webp',
    link: post.slug,
  }));
}

const ReferencesCarouselSection = ({ referencePosts }: ReferencesCarouselSectionProps) => {
  if (!referencePosts || referencePosts.length === 0) {
    return null;
  }

  const data = convertToCarouselData(referencePosts);

  return (
    <GenericCarouselSection
      data={data}
      carouselMaxWidth='max-w-88 md:max-w-[48.1875rem]'
      articleClassName='flex min-h-[10rem] items-stretch max-md:flex-col md:min-h-[14.375rem]'
      imageFirst
      renderImage={(item) => (
        <picture className='relative aspect-square h-auto flex-shrink-0 basis-[10rem] md:basis-[16rem]'>
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes='(max-width: 768px) 160px, 256px'
            className='object-cover'
          />
        </picture>
      )}
      renderContent={(item, t) => (
        <div className='flex flex-1 flex-col space-y-2 px-4 py-5 max-md:h-full max-md:justify-between md:px-17.5 md:py-7.5'>
          <div className='flex flex-col'>
            <FormattedText
              text={item.title}
              as='h3'
              className='text-white-smoke mb-2.5 text-xl'
            />
            {item.where && (
              <FormattedText
                text={item.where}
                as='span'
                className='text-lg text-white'
              />
            )}
            {item.when && (
              <FormattedText
                text={item.when}
                as='span'
                className='text-lg text-white'
              />
            )}
          </div>
          <Link href={item.link}>
            <Button
              buttonText={t('find-out-more')}
              className='-ml-16'
            />
          </Link>
        </div>
      )}
    />
  );
};

export default ReferencesCarouselSection;
