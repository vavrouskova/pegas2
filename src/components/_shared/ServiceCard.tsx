import Image from 'next/image';
import Link from 'next/link';

import { FormattedText } from '@/components/_shared/FormattedText';

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
}

const ServiceCard = ({ title, slug, featuredImage, className }: ServiceCardProps) => {
  const imageUrl = featuredImage?.node?.sourceUrl || '/images/placeholder.webp';
  const imageAlt = featuredImage?.node?.altText || title;

  return (
    <Link
      href={`/${slug}`}
      className={`group flex flex-col gap-8 transition-opacity duration-300 hover:opacity-80 ${className}`}
    >
      <div className='bg-grey-warm p-[2.375rem]'>
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
        className='text-2xl leading-tight font-black tracking-wide'
      />
    </Link>
  );
};

export default ServiceCard;
