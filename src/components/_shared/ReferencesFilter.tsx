'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';

import Search from '@/components/icons/Search';
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
  const [searchQuery, setSearchQuery] = useState(searchParams.get(REFERENCES_QUERY_PARAMS.SEARCH) || '');

  const selectedCategory = searchParams.get(REFERENCES_QUERY_PARAMS.CATEGORY);
  const hasActiveSearch = Boolean(searchParams.get(REFERENCES_QUERY_PARAMS.SEARCH));

  const isAllActive = !selectedCategory && !hasActiveSearch;

  const handleCategoryClick = useCallback(
    (categoryId: string | null) => {
      const params = resetPagination(searchParams);
      const updatedParams = updateSearchParams(params, {
        [REFERENCES_QUERY_PARAMS.CATEGORY]: categoryId,
        [REFERENCES_QUERY_PARAMS.SEARCH]: null,
      });

      setSearchQuery('');
      router.push(`?${updatedParams.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const params = resetPagination(searchParams);
      const trimmedQuery = searchQuery.trim();
      const updatedParams = updateSearchParams(params, {
        [REFERENCES_QUERY_PARAMS.SEARCH]: trimmedQuery || null,
        [REFERENCES_QUERY_PARAMS.CATEGORY]: null,
      });

      router.push(`?${updatedParams.toString()}`);
    },
    [router, searchParams, searchQuery]
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

      {/* Vyhledávání */}
      <form
        onSubmit={handleSearchSubmit}
        className='relative box-border flex h-[40px] shrink-0 items-center gap-1 bg-white px-4'
      >
        <Search className='text-primary size-[19px] shrink-0' />
        <input
          type='text'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('search')}
          className='text-primary min-w-0 flex-1 border-none bg-transparent text-base outline-none'
        />
        <button
          type='submit'
          className='sr-only'
          aria-label={t('search')}
        >
          {t('search')}
        </button>
      </form>
    </div>
  );
};

export default ReferencesFilter;
