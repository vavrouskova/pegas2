'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

import { FormattedText } from '@/components/_shared/FormattedText';
import { POST_TYPE_LABELS } from '@/config/search.config';
import { useSearch } from '@/providers/SearchProvider';
import { SearchResult } from '@/utils/search-types';

interface SearchResultItemProps {
  result: SearchResult;
}

export const SearchResultItem = ({ result }: SearchResultItemProps) => {
  const { closeSearch } = useSearch();
  const { item } = result;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ x: 4 }}
      transition={{ duration: 0.15 }}
    >
      <Link
        href={item.url}
        onClick={closeSearch}
        className='hover:border-grey-cold block border border-transparent p-4 transition-all hover:bg-white hover:shadow-sm'
      >
        <div className='flex items-start justify-between gap-4'>
          <div className='min-w-0 flex-1'>
            <FormattedText
              text={item.title}
              as='h3'
              className='truncate text-base font-medium'
            />
            {item.content && (
              <FormattedText
                text={item.content}
                as='p'
                className='text-secondary mt-1 line-clamp-2 text-sm'
              />
            )}
          </div>
          <span className='bg-grey-warm text-secondary shrink-0 px-2 py-1 text-xs max-md:hidden'>
            {POST_TYPE_LABELS[item.postType]}
          </span>
        </div>
      </Link>
    </motion.div>
  );
};
