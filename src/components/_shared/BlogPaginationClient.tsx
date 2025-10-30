'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const BlogPagination = dynamic(() => import('@/components/_shared/BlogPagination'), {
  ssr: false,
  loading: () => null,
});

interface BlogPaginationClientProps {
  totalPages: number;
  currentPage: number;
}

const BlogPaginationClient = ({ totalPages, currentPage }: BlogPaginationClientProps) => {
  return (
    <Suspense fallback={null}>
      <BlogPagination
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </Suspense>
  );
};

export default BlogPaginationClient;

