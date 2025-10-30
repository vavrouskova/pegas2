'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

import Search from '@/components/icons/Search';
import { BlogCategory } from '@/utils/wordpress-types';
import { cn } from '@/lib/utils';

interface BlogFilterProps {
  categories: BlogCategory[];
}

const BlogFilter = ({ categories }: BlogFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const selectedCategory = searchParams.get('category');

  const handleCategoryClick = useCallback(
    (categoryId: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (categoryId) {
        params.set('category', categoryId);
      } else {
        params.delete('category');
      }

      // Smazat search a page při změně kategorie
      params.delete('search');
      params.delete('page');
      setSearchQuery('');

      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const params = new URLSearchParams(searchParams.toString());

      if (searchQuery.trim()) {
        params.set('search', searchQuery.trim());
      } else {
        params.delete('search');
      }

      // Smazat category a page při vyhledávání
      params.delete('category');
      params.delete('page');

      router.push(`?${params.toString()}`);
    },
    [router, searchParams, searchQuery]
  );

  // Filtrovat kategorie - odstranit "Nezařazené" podle databaseId
  const filteredCategories = categories.filter((category) => category.databaseId !== 1);

  return (
    <div className='flex flex-wrap items-center gap-1'>
      {/* Vše tlačítko */}
      <button
        onClick={() => handleCategoryClick(null)}
        className={cn(
          'box-border flex max-h-[40px] shrink-0 items-center justify-center gap-[10px] px-4 py-[10px]',
          !selectedCategory && !searchParams.get('search') ? 'bg-primary' : 'bg-white'
        )}
      >
        <span
          className={cn(
            'text-base leading-[1.44] font-black tracking-[1px] whitespace-pre',
            !selectedCategory && !searchParams.get('search') ? 'text-white-smoke' : 'text-primary'
          )}
        >
          Vše
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
          placeholder='Vyhledat'
          className='text-primary min-w-0 flex-1 border-none bg-transparent text-base leading-[1.44] font-black tracking-[1px] outline-none'
        />
        <button
          type='submit'
          className='sr-only'
          aria-label='Vyhledat'
        >
          Vyhledat
        </button>
      </form>
    </div>
  );
};

export default BlogFilter;
