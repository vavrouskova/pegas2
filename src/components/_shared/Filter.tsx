'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';

import Search from '@/components/icons/Search';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  databaseId: number;
  name: string;
}

interface FilterConfig {
  categoryParam: string;
  searchParam: string;
  pageParam: string;
  excludeCategoryIds?: number[];
}

interface FilterProps {
  categories: Category[];
  config: FilterConfig;
}

const Filter = ({ categories, config }: FilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('common');
  const [searchQuery, setSearchQuery] = useState(searchParams.get(config.searchParam) || '');

  const selectedCategory = searchParams.get(config.categoryParam);
  const hasActiveSearch = Boolean(searchParams.get(config.searchParam));

  // Helper funkce pro reset paginace
  const resetPagination = useCallback(
    (params: URLSearchParams): URLSearchParams => {
      const newParams = new URLSearchParams(params.toString());
      newParams.delete(config.pageParam);
      return newParams;
    },
    [config.pageParam]
  );

  // Helper funkce pro aktualizaci search params
  const updateSearchParams = useCallback(
    (currentParams: URLSearchParams, updates: Record<string, string | null>): URLSearchParams => {
      const params = new URLSearchParams(currentParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      return params;
    },
    []
  );

  // Filtrovat kategorie podle excludeCategoryIds
  const filteredCategories = useMemo(() => {
    if (!config.excludeCategoryIds || config.excludeCategoryIds.length === 0) {
      return categories;
    }
    return categories.filter((category) => !config.excludeCategoryIds?.includes(category.databaseId));
  }, [categories, config.excludeCategoryIds]);

  const isAllActive = !selectedCategory && !hasActiveSearch;

  const handleCategoryClick = useCallback(
    (categoryId: string | null) => {
      const params = resetPagination(searchParams);
      const updatedParams = updateSearchParams(params, {
        [config.categoryParam]: categoryId,
        [config.searchParam]: null,
      });

      setSearchQuery('');
      router.push(`?${updatedParams.toString()}`);
    },
    [router, searchParams, config.categoryParam, config.searchParam, resetPagination, updateSearchParams]
  );

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const params = resetPagination(searchParams);
      const trimmedQuery = searchQuery.trim();
      const updatedParams = updateSearchParams(params, {
        [config.searchParam]: trimmedQuery || null,
        [config.categoryParam]: null,
      });

      router.push(`?${updatedParams.toString()}`);
    },
    [router, searchParams, searchQuery, config.searchParam, config.categoryParam, resetPagination, updateSearchParams]
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
        <span className={cn('text-sm whitespace-pre', isAllActive ? 'text-white-smoke' : 'text-primary')}>
          {t('all')}
        </span>
      </button>

      {/* Kategorie */}
      {filteredCategories.map((category) => {
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
            <span className={cn('text-sm whitespace-pre', isActive ? 'text-white-smoke' : 'text-primary')}>
              {category.name}
            </span>
          </button>
        );
      })}

      {/* Vyhledávání */}
      <form
        onSubmit={handleSearchSubmit}
        className='relative box-border flex h-[40px] w-full max-w-[200px] shrink-0 items-center gap-1 bg-white px-4'
      >
        <Search className='text-primary size-[19px] shrink-0' />
        <input
          type='text'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('search')}
          className='text-primary min-w-0 flex-1 border-none bg-transparent text-sm outline-none'
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

export default Filter;

