'use client';

import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useMemo, useState } from 'react';

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
  const searchParameters = useSearchParams();
  const t = useTranslations('common');
  const [searchQuery, setSearchQuery] = useState(searchParameters.get(config.searchParam) || '');

  const selectedCategory = searchParameters.get(config.categoryParam);
  const hasActiveSearch = Boolean(searchParameters.get(config.searchParam));

  // Helper funkce pro reset paginace
  const resetPagination = useCallback(
    (parameters: URLSearchParams): URLSearchParams => {
      const newParameters = new URLSearchParams(parameters.toString());
      newParameters.delete(config.pageParam);
      return newParameters;
    },
    [config.pageParam]
  );

  // Helper funkce pro aktualizaci search params
  const updateSearchParameters = useCallback(
    (currentParameters: URLSearchParams, updates: Record<string, string | null>): URLSearchParams => {
      const parameters = new URLSearchParams(currentParameters.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '') {
          parameters.delete(key);
        } else {
          parameters.set(key, value);
        }
      });

      return parameters;
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
      const parameters = resetPagination(searchParameters);
      const updatedParameters = updateSearchParameters(parameters, {
        [config.categoryParam]: categoryId,
        [config.searchParam]: null,
      });

      setSearchQuery('');
      router.push(`?${updatedParameters.toString()}`);
    },
    [router, searchParameters, config.categoryParam, config.searchParam, resetPagination, updateSearchParameters]
  );

  const handleSearchSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const parameters = resetPagination(searchParameters);
      const trimmedQuery = searchQuery.trim();
      const updatedParameters = updateSearchParameters(parameters, {
        [config.searchParam]: trimmedQuery || null,
        [config.categoryParam]: null,
      });

      router.push(`?${updatedParameters.toString()}`);
    },
    [
      router,
      searchParameters,
      searchQuery,
      config.searchParam,
      config.categoryParam,
      resetPagination,
      updateSearchParameters,
    ]
  );

  return (
    <div className='flex flex-wrap items-center gap-1'>
      {/* Vše tlačítko */}
      <button
        onClick={() => handleCategoryClick(null)}
        className={cn(
          'box-border flex max-h-[40px] shrink-0 items-center justify-center gap-[10px] px-3 py-[10px] transition-opacity duration-300 hover:opacity-70',
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
              'box-border flex max-h-[40px] shrink-0 items-center justify-center gap-[10px] px-3 py-[10px] transition-opacity duration-300 hover:opacity-70',
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
        className='relative box-border flex h-[40px] w-full max-w-[120px] shrink-0 items-center gap-1 bg-white pr-4 pl-3'
      >
        <Search className='text-primary size-[19px] shrink-0' />
        <input
          type='text'
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
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
