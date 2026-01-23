'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { SearchInput } from '@/components/search/SearchInput';
import { SearchResults } from '@/components/search/SearchResults';
import { useSearch } from '@/providers/SearchProvider';

export const SearchOverlay = () => {
  const t = useTranslations('search');
  const { isOpen, closeSearch } = useSearch();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className='bg-overlay fixed inset-0 z-9999 backdrop-blur-md'
          role='dialog'
          aria-modal='true'
          aria-label={t('label')}
        >
          <div className='mx-auto flex h-full max-w-4xl flex-col px-4 py-8'>
            <div className='mb-8 flex justify-end'>
              <button
                onClick={closeSearch}
                className='text-secondary hover:bg-grey-warm hover:text-primary p-2 transition-colors'
                aria-label={t('close')}
              >
                <X className='h-6 w-6' />
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <SearchInput />
            </motion.div>

            <div className='mt-8 flex min-h-0 flex-1 flex-col overflow-hidden'>
              <SearchResults />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
