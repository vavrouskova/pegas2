'use client';

import { LayoutGrid, List } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import CeremonyCard from '@/components/ceremonies/CeremonyCard';
import CeremonyListRow from '@/components/ceremonies/CeremonyListRow';
import { cn } from '@/lib/utils';
import { Ceremony } from '@/types/ceremony';

type ViewMode = 'grid' | 'list';

interface HomepageCeremoniesGridProps {
  ceremonies: Ceremony[];
}

const HomepageCeremoniesGrid = ({ ceremonies }: HomepageCeremoniesGridProps) => {
  const t = useTranslations('ceremonies');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  return (
    <>
      <div className='mb-6 flex items-center justify-end gap-1'>
        <button
          type='button'
          onClick={() => setViewMode('grid')}
          aria-label={t('view.grid')}
          aria-pressed={viewMode === 'grid'}
          className={cn(
            'flex h-[36px] w-[36px] items-center justify-center transition-opacity duration-300 hover:opacity-70',
            viewMode === 'grid' ? 'bg-primary text-white-smoke' : 'text-primary bg-white'
          )}
        >
          <LayoutGrid className='size-4' />
        </button>
        <button
          type='button'
          onClick={() => setViewMode('list')}
          aria-label={t('view.list')}
          aria-pressed={viewMode === 'list'}
          className={cn(
            'flex h-[36px] w-[36px] items-center justify-center transition-opacity duration-300 hover:opacity-70',
            viewMode === 'list' ? 'bg-primary text-white-smoke' : 'text-primary bg-white'
          )}
        >
          <List className='size-4' />
        </button>
      </div>

      {viewMode === 'grid' ? (
        <div className='grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-5 lg:gap-x-8 lg:gap-y-14'>
          {ceremonies.map((ceremony) => (
            <CeremonyCard
              key={ceremony.slug}
              ceremony={ceremony}
            />
          ))}
        </div>
      ) : (
        <ul className='border-primary/10 flex flex-col border-t'>
          {ceremonies.map((ceremony) => (
            <li
              key={ceremony.slug}
              className='border-primary/10 border-b'
            >
              <CeremonyListRow ceremony={ceremony} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default HomepageCeremoniesGrid;
