'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';

import { REFERENCES_QUERY_PARAMS } from '@/constants/references';
import { cn } from '@/lib/utils';
import { resetPagination, updateSearchParams } from '@/utils/references-helpers';
import { ReferenceCategory } from '@/utils/wordpress-types';

interface ReferencesFilterProps {
  categories: ReferenceCategory[];
}

const ReferencesFilter = ({ categories }: ReferencesFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('common');

  const selectedCategory = searchParams.get(REFERENCES_QUERY_PARAMS.CATEGORY);

  const isAllActive = !selectedCategory;

  const handleCategoryClick = useCallback(
    (categoryId: string | null) => {
      const params = resetPagination(searchParams);
      const updatedParams = updateSearchParams(params, {
        [REFERENCES_QUERY_PARAMS.CATEGORY]: categoryId,
      });

      router.push(`?${updatedParams.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className='flex flex-wrap items-center gap-1'>
      {/* Vše tlačítko */}
      <button
        onClick={() => handleCategoryClick(null)}
        className={cn(
          'box-border flex max-h-[40px] shrink-0 items-center justify-center gap-[10px] px-4 py-[10px] transition-opacity duration-300 hover:opacity-70',
          isAllActive ? 'bg-primary' : 'bg-white'
        )}
      >
        <span className={cn('text-base whitespace-pre', isAllActive ? 'text-white-smoke' : 'text-primary')}>
          {t('all')}
        </span>
      </button>

      {/* Kategorie */}
      {categories.map((category) => {
        const isActive = selectedCategory === category.databaseId.toString();
        return (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.databaseId.toString())}
            className={cn(
              'box-border flex max-h-[40px] shrink-0 items-center justify-center gap-[10px] px-4 py-[10px] transition-opacity duration-300 hover:opacity-70',
              isActive ? 'bg-primary' : 'bg-white'
            )}
          >
            <span className={cn('text-base whitespace-pre', isActive ? 'text-white-smoke' : 'text-primary')}>
              {category.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ReferencesFilter;
