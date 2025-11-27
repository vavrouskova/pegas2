'use client';

import dynamic from 'next/dynamic';

import type { PobockaPost } from '@/utils/wordpress-types';
import { FormattedText } from '@/components/_shared/FormattedText';

const BranchesMap = dynamic(() => import('@/components/branches/BranchesMap'), {
  ssr: false,
  loading: () => (
    <div className='bg-muted flex h-full w-full items-center justify-center'>
      <p>Loading map...</p>
    </div>
  ),
});

interface BranchesMapSectionProps {
  branches: PobockaPost[];
  title?: string;
}

const BranchesMapSection = ({ branches, title }: BranchesMapSectionProps) => {
  return (
    <section className='flex flex-col gap-12.5 px-4 lg:flex-row lg:gap-25 lg:px-14'>
      {title && (
        <FormattedText
          text={title}
          as='h2'
          className='text-3xl whitespace-nowrap lg:mt-45'
        />
      )}
      <div className='h-[33.5625rem] w-full overflow-hidden lg:h-[37.5rem]'>
        <BranchesMap
          branches={branches}
          className='h-full w-full'
        />
      </div>
    </section>
  );
};

export default BranchesMapSection;
