import Image from 'next/image';

import { cn } from '@/lib/utils';

interface BranchCardImageProps {
  imageUrl?: string;
  imageAlt: string;
  noImageText: string;
  layout: 'vertical' | 'horizontal';
}

const BranchCardImage = ({ imageUrl, imageAlt, noImageText, layout }: BranchCardImageProps) => {
  const containerClasses = cn(
    'relative overflow-hidden',
    layout === 'vertical' && 'aspect-square w-full',
    layout === 'horizontal' && 'max-lg:hidden size-[13.25rem]'
  );

  const sizes = layout === 'vertical'
    ? '(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
    : '120px';

  return (
    <div className={containerClasses}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          sizes={sizes}
          className='object-cover'
        />
      ) : (
        <div className='flex h-full w-full items-center justify-center bg-gray-200'>
          <span className={cn('text-gray-400', layout === 'vertical' ? 'text-base' : 'text-xs')}>
            {noImageText}
          </span>
        </div>
      )}
    </div>
  );
};

export default BranchCardImage;
