import Image from 'next/image';
import Link from 'next/link';

import { FormattedText } from '@/components/_shared/FormattedText';
import { formatFarewellDate } from '@/utils/helper';
import { ReferencePost } from '@/utils/wordpress-types';

interface ReferencesGridSectionProps {
  referencePosts: ReferencePost[];
}

const ReferencesGridSection = ({ referencePosts }: ReferencesGridSectionProps) => {
  if (!referencePosts || referencePosts.length === 0) {
    return null;
  }

  return (
    <div className='grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3'>
      {referencePosts.map((reference) => {
        const imageUrl = reference.referenceACF?.introImage?.node?.sourceUrl || '/images/placeholder.webp';
        const imageAlt = reference.referenceACF?.introImage?.node?.altText || reference.title;
        const farewellDate = formatFarewellDate(reference.referenceACF?.farewellDate);

        return (
          <Link
            href={`/reference/${reference.slug}`}
            key={reference.id}
            className='group flex flex-col gap-2 transition-opacity duration-300 hover:opacity-80'
          >
            <div className='bg-grey-warm p-[2.375rem]'>
              <div className='relative aspect-[4/3] w-full overflow-hidden'>
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  fill
                  sizes='(max-width: 1024px) 100vw, 33vw'
                  className='object-cover'
                />
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <FormattedText
                text={reference.title}
                as='h3'
                className='text-lg'
              />
              {farewellDate && <p className='font-text text-primary text-sm'>{farewellDate}</p>}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ReferencesGridSection;
