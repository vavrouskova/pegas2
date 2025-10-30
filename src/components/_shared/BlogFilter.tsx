'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';

import Search from '@/components/icons/Search';
import { BLOG_QUERY_PARAMS, UNCATEGORIZED_CATEGORY_ID } from '@/constants/blog';
import { cn } from '@/lib/utils';
import { resetPagination, updateSearchParams } from '@/utils/blog-helpers';
import { BlogCategory } from '@/utils/wordpress-types';

interface BlogFilterProps {
  categories: BlogCategory[];
}

const BlogFilter = ({ categories }: BlogFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('common');
  const [searchQuery, setSearchQuery] = useState(searchParams.get(BLOG_QUERY_PARAMS.SEARCH) || '');

  const selectedCategory = searchParams.get(BLOG_QUERY_PARAMS.CATEGORY);
  const hasActiveSearch = Boolean(searchParams.get(BLOG_QUERY_PARAMS.SEARCH));

  // Filtrovat kategorie - odstranit "Nezařazené" podle databaseId
  const filteredCategories = useMemo(
    () => categories.filter((category) => category.databaseId !== UNCATEGORIZED_CATEGORY_ID),
    [categories]
  );

  const isAllActive = !selectedCategory && !hasActiveSearch;

  const handleCategoryClick = useCallback(
    (categoryId: string | null) => {
      const params = resetPagination(searchParams);
      const updatedParams = updateSearchParams(params, {
        [BLOG_QUERY_PARAMS.CATEGORY]: categoryId,
        [BLOG_QUERY_PARAMS.SEARCH]: null,
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
        [BLOG_QUERY_PARAMS.SEARCH]: trimmedQuery || null,
        [BLOG_QUERY_PARAMS.CATEGORY]: null,
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
          'box-border flex max-h-[40px] shrink-0 items-center justify-center gap-[10px] px-4 py-[10px]',
          isAllActive ? 'bg-primary' : 'bg-white'
        )}
      >
        <span
          className={cn(
            'text-base leading-[1.44] font-black tracking-[1px] whitespace-pre',
            isAllActive ? 'text-white-smoke' : 'text-primary'
          )}
        >
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
              'box-border flex max-h-[40px] shrink-0 items-center justify-center gap-[10px] px-4 py-[10px]',
              isActive ? 'bg-primary' : 'bg-white'
            )}
          >
            <span
              className={cn(
                'text-base leading-[1.44] font-black tracking-[1px] whitespace-pre',
                isActive ? 'text-white-smoke' : 'text-primary'
              )}
            >
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
        <Search className='text-primary h-[19px] w-[19px] shrink-0' />
        <input
          type='text'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('search')}
          className='text-primary min-w-0 flex-1 border-none bg-transparent text-base leading-[1.44] font-black tracking-[1px] outline-none'
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

export default BlogFilter;
