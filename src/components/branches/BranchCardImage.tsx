'use client';

import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { pushBranchSelectItem } from '@/utils/datalayer';

interface BranchCardImageProps {
  imageUrl?: string;
  imageAlt: string;
  layout: 'vertical' | 'horizontal';
  slug?: string;
  linkToDetail?: boolean;
  // Tracking props
  branchId?: string;
  branchTitle?: string;
  index?: number;
}

const BranchCardImage = ({
  imageUrl,
  imageAlt,
  layout,
  slug,
  linkToDetail = false,
  branchId,
  branchTitle,
  index,
}: BranchCardImageProps) => {
  const containerClasses = cn(
    'relative overflow-hidden block',
    layout === 'vertical' && 'aspect-square w-full',
    layout === 'horizontal' && 'max-lg:hidden size-[13.25rem]'
  );

  const sizes = layout === 'vertical' ? '(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw' : '120px';

  const handleClick = () => {
    if (branchId && branchTitle) {
      pushBranchSelectItem({
        item_id: branchId,
        item_name: branchTitle,
        item_category: 'Pobocky',
        item_list_name: 'Pobocky',
        index,
      });
    }
  };

  const content = (
    <>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          sizes={sizes}
          className='object-cover'
        />
      ) : (
        <Image
          src='/images/placeholder.webp'
          alt={imageAlt}
          fill
          sizes={sizes}
          className='object-cover'
        />
      )}
    </>
  );

  if (linkToDetail && slug) {
    return (
      <Link
        href={`/${slug}`}
        className={containerClasses}
        onClick={handleClick}
      >
        {content}
      </Link>
    );
  }

  return <div className={containerClasses}>{content}</div>;
};

export default BranchCardImage;
