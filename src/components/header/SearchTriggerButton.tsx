'use client';

import { useTranslations } from 'next-intl';
import React from 'react';

import { useSearch } from '@/providers/SearchProvider';

interface SearchTriggerButtonProps {
  children: React.ReactNode;
}

export const SearchTriggerButton = ({ children }: SearchTriggerButtonProps) => {
  const { openSearch } = useSearch();
  const t = useTranslations('search');

  return (
    <button
      onClick={openSearch}
      className='transition-opacity hover:opacity-70'
      aria-label={t('label')}
    >
      {children}
    </button>
  );
};
