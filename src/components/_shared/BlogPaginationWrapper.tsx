import { Suspense } from 'react';

import BlogPagination from '@/components/_shared/BlogPagination';

interface BlogPaginationWrapperProps {
  totalPages: number;
  currentPage: number;
}

const BlogPaginationWrapper = ({ totalPages, currentPage }: BlogPaginationWrapperProps) => {
  return (
    <Suspense fallback={null}>
      <BlogPagination
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </Suspense>
  );
};

export default BlogPaginationWrapper;

