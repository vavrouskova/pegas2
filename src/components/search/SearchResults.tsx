'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { SearchResultItem } from '@/components/search/SearchResultItem';
import { POST_TYPE_LABELS } from '@/config/search.config';
import { useSearch } from '@/providers/SearchProvider';
import { SearchResult } from '@/utils/search-types';

interface ResultGroupProps {
  title: string;
  results: SearchResult[];
}

const ResultGroup = ({ title, results }: ResultGroupProps) => {
  if (results.length === 0) return null;

  return (
    <div className='mb-6'>
      <h2 className='text-secondary font-heading mb-3 text-sm tracking-wide uppercase'>
        {title} ({results.length})
      </h2>
      <div className='space-y-2'>
        {results.map((result) => (
          <SearchResultItem
            key={result.item.id}
            result={result}
          />
        ))}
      </div>
    </div>
  );
};

export const SearchResults = () => {
  const t = useTranslations('search');
  const { results, isLoading, query } = useSearch();

  if (isLoading) {
    return (
      <div className='py-12 text-center'>
        <div className='border-grey-cold border-t-primary mx-auto h-8 w-8 animate-spin rounded-full border-2' />
        <p className='text-secondary mt-4'>{t('loading')}</p>
      </div>
    );
  }

  if (!query || query.length < 2) {
    return (
      <div className='py-12 text-center'>
        <p className='text-secondary'>{t('hint')}</p>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  const totalResults =
    results.pages.length +
    results.posts.length +
    results.services.length +
    results.references.length +
    results.branches.length +
    results.procedures.length;

  if (totalResults === 0) {
    return (
      <div className='py-12 text-center'>
        <p className='text-secondary'>{t('no-results')}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='flex-1 overflow-y-auto overscroll-contain pr-4 md:px-4'
      data-lenis-prevent
    >
      <ResultGroup
        title={POST_TYPE_LABELS.sluzbyPost}
        results={results.services}
      />
      <ResultGroup
        title={POST_TYPE_LABELS.postupPost}
        results={results.procedures}
      />
      <ResultGroup
        title={POST_TYPE_LABELS.pobockaPost}
        results={results.branches}
      />
      <ResultGroup
        title={POST_TYPE_LABELS.referencePost}
        results={results.references}
      />
      <ResultGroup
        title={POST_TYPE_LABELS.post}
        results={results.posts}
      />
    </motion.div>
  );
};
