'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';

import ArrowRight from '@/components/icons/ArrowRight';
import { BLOG_QUERY_PARAMS } from '@/constants/blog';
import { cn } from '@/lib/utils';
import { updateSearchParams } from '@/utils/blog-helpers';

interface BlogPaginationProps {
  totalPages: number;
  currentPage: number;
}

const BlogPagination = ({ totalPages, currentPage }: BlogPaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('common');

  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages || page === currentPage) {
        return;
      }

      const updatedParams = updateSearchParams(searchParams, {
        [BLOG_QUERY_PARAMS.PAGE]: page === 1 ? null : page.toString(),
      });

      router.push(`?${updatedParams.toString()}`);
    },
    [router, searchParams, totalPages, currentPage]
  );

  const handlePrevious = useCallback(() => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  }, [currentPage, handlePageChange]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, handlePageChange]);

  if (totalPages <= 1) {
    return null;
  }

  const canScrollPrev = currentPage > 1;
  const canScrollNext = currentPage < totalPages;

  return (
    <div className='relative mt-34'>
      <div className='flex items-center justify-center gap-10'>
        {/* Previous button */}
        <button
          onClick={handlePrevious}
          disabled={!canScrollPrev}
          className={cn(
            'flex h-8 w-8 items-center justify-center',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-opacity hover:opacity-80'
          )}
          aria-label={t('previous-page')}
        >
          <ArrowRight className='h-6 w-6 rotate-180' />
        </button>

        {/* Page numbers */}
        <div className='flex items-center space-x-2.5'>
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNumber = index + 1;
            const isActive = currentPage === pageNumber;

            return (
              <button
                key={`page-${pageNumber}`}
                onClick={() => handlePageChange(pageNumber)}
                className={cn(
                  'flex cursor-pointer items-center justify-center transition-all duration-500 hover:opacity-80',
                  'min-w-[24px] px-2 py-1',
                  isActive && 'bg-primary'
                )}
                aria-label={`${t('go-to-page')} ${pageNumber}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className={cn('text-base leading-[1.5]', isActive ? 'text-white' : 'text-primary')}>
                  {pageNumber}
                </span>
              </button>
            );
          })}
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={!canScrollNext}
          className={cn(
            'flex h-8 w-8 items-center justify-center',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-opacity hover:opacity-80'
          )}
          aria-label={t('next-page')}
        >
          <ArrowRight className='h-6 w-6' />
        </button>
      </div>
    </div>
  );
};

export default BlogPagination;
