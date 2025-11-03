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
      carouselMaxWidth='max-w-88 section-container md:max-w-[52.125rem]'
      articleClassName='flex min-h-[10rem] items-stretch max-md:flex-col md:min-h-[16rem]'
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
        <div className='flex flex-1 flex-col space-y-2 px-4 py-5 max-md:h-full max-md:justify-between md:px-10 md:py-9'>
          <div className='flex flex-col space-y-2'>
            <FormattedText
              text={item.title}
              as='h3'
              className='text-white-smoke mb-6 text-xl'
            />
            {item.where && (
              <p className='text-tertiary text-lg'>
                <FormattedText
                  text={`${t('where')}:`}
                  as='span'
                  className='font-heading text-white-smoke'
                />{' '}
                <FormattedText
                  text={item.where}
                  as='span'
                />
              </p>
            )}
            {item.when && (
              <p className='text-tertiary text-lg'>
                <FormattedText
                  text={`${t('when')}:`}
                  as='span'
                  className='font-heading text-white-smoke'
                />{' '}
                <FormattedText
                  text={item.when}
                  as='span'
                />
              </p>
            )}
          </div>
          <Link href={item.link}>
            <Button
              buttonText={t('find-out-more')}
              className='-ml-8'
            />
          </Link>
        </div>
      )}
    />
  );
};

export default ReferencesCarouselSection;
