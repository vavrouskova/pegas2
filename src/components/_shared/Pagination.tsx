'use client';

import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import ArrowRight from '@/components/icons/ArrowRight';
import { cn } from '@/lib/utils';
import { updateSearchParameters } from '@/utils/pagination-helpers';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  pageParam: string;
}

const Pagination = ({ totalPages, currentPage, pageParam }: PaginationProps) => {
  const router = useRouter();
  const searchParameters = useSearchParams();
  const t = useTranslations('common');

  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages || page === currentPage) {
        return;
      }

      const updatedParameters = updateSearchParameters(searchParameters, {
        [pageParam]: page === 1 ? null : page.toString(),
      });

      router.push(`?${updatedParameters.toString()}`);
    },
    [router, searchParameters, totalPages, currentPage, pageParam]
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

  const canScrollPrevious = currentPage > 1;
  const canScrollNext = currentPage < totalPages;

  const getVisiblePages = (): number[] => {
    const maxVisible = 7;
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages: number[] = [];
    const sidePages = Math.floor((maxVisible - 3) / 2);

    let start = Math.max(1, currentPage - sidePages);
    let end = Math.min(totalPages, currentPage + sidePages);

    if (end - start < maxVisible - 2) {
      if (start === 1) {
        end = Math.min(totalPages, start + maxVisible - 2);
      } else if (end === totalPages) {
        start = Math.max(1, end - maxVisible + 2);
      }
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push(-1);
      }
    }

    for (let index = start; index <= end; index++) {
      pages.push(index);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push(-1);
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className='relative mt-34'>
      <div className='flex items-center justify-center gap-4 md:gap-10'>
        <button
          onClick={handlePrevious}
          disabled={!canScrollPrevious}
          className={cn(
            'flex h-8 w-8 items-center justify-center',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-opacity hover:opacity-80'
          )}
          aria-label={t('previous-page')}
        >
          <ArrowRight className='h-6 w-6 rotate-180' />
        </button>

        <div className='flex items-center gap-2 md:hidden'>
          <span className='text-base'>
            {currentPage} / {totalPages}
          </span>
        </div>

        <div className='hidden items-center space-x-2.5 md:flex'>
          {visiblePages.map((pageNumber, index) => {
            if (pageNumber === -1) {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className='flex min-w-[24px] items-center justify-center px-2 py-1 text-base'
                >
                  ...
                </span>
              );
            }

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
                <span className={cn('text-base leading-normal', isActive ? 'text-white' : '')}>{pageNumber}</span>
              </button>
            );
          })}
        </div>

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

export default Pagination;
