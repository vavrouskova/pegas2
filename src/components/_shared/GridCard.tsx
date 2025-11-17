import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

import { FormattedText } from '@/components/_shared/FormattedText';

interface GridCardProps {
  href: string;
  imageUrl: string;
  imageAlt: string;
  title: string;
  children?: ReactNode;
}

const GridCard = ({ href, imageUrl, imageAlt, title, children }: GridCardProps) => {
  return (
    <Link
      href={href}
      className='group flex flex-col gap-2 transition-opacity duration-300 hover:opacity-80'
    >
      <div className='bg-grey-warm p-[9.4%]'>
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
          text={title}
          as='h3'
          className='text-lg'
        />
        {children}
      </div>
    </Link>
  );
};

export default GridCard;
