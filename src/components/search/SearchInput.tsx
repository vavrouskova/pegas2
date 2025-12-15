'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

import SearchIcon from '@/components/icons/Search';
import { useSearch } from '@/providers/SearchProvider';

export const SearchInput = () => {
  const t = useTranslations('search');
  const { query, setQuery, isOpen } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className='relative mx-auto w-full'>
      <SearchIcon className='text-secondary absolute top-1/2 left-4 h-6 w-6 -translate-y-1/2' />
      <input
        ref={inputRef}
        type='text'
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t('label')}
        className='border-grey-cold text-primary focus:border-primary focus:ring-primary/20 w-full border bg-white py-4 pr-12 pl-14 text-lg transition-all outline-none focus:ring-2'
        aria-label={t('label')}
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className='text-secondary hover:bg-grey-warm hover:text-primary absolute top-1/2 right-4 -translate-y-1/2 p-1 transition-colors'
          aria-label={t('clear')}
        >
          <X className='h-5 w-5' />
        </button>
      )}
    </div>
  );
};
