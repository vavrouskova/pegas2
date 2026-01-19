'use client';

import Image from 'next/image';
import Link from 'next/link';

import { FormattedText } from '@/components/_shared/FormattedText';
import { cn } from '@/lib/utils';
import { pushSelectItem } from '@/utils/datalayer';

interface ServiceCardProps {
  id: string;
  title: string;
  slug: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
      mediaDetails?: {
        width: number;
        height: number;
      };
    };
  };
  className?: string;
  sectionTitle?: string;
  type?: 'product' | 'service';
  itemCategory2?: string;
  index?: number;
}

const ServiceCard = ({
  id,
  title,
  slug,
  featuredImage,
  className,
  sectionTitle,
  type = 'service',
  itemCategory2,
  index,
}: ServiceCardProps) => {
  const imageUrl = featuredImage?.node?.sourceUrl || '/images/placeholder.webp';
  const imageAlt = featuredImage?.node?.altText || title;

  const handleClick = () => {
    if (sectionTitle) {
      const category2 = itemCategory2 ?? (type === 'product' ? 'Produkty' : 'Služby');
      pushSelectItem({
        item_id: id,
        item_name: title,
        item_category: sectionTitle,
        item_category2: category2,
        index,
      });
    }
  };

  return (
    <Link
      href={`/${slug}`}
      onClick={handleClick}
      className={cn('group flex flex-col gap-2.5 transition-opacity duration-300 hover:opacity-80', className)}
    >
      <div className='bg-grey-warm p-[13%]'>
        <div className='relative aspect-square w-full overflow-hidden'>
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
            className='object-cover'
          />
        </div>
      </div>

      {/* Nadpis */}
      <FormattedText
        text={title}
        as='h3'
        className='text-lg leading-tight font-black tracking-wide'
      />
    </Link>
  );
};

export default ServiceCard;
