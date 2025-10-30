import { Suspense } from 'react';

import BlogFilter from '@/components/_shared/BlogFilter';
import { BlogCategory } from '@/utils/wordpress-types';

interface BlogFilterWrapperProps {
  categories: BlogCategory[];
}

const BlogFilterWrapper = ({ categories }: BlogFilterWrapperProps) => {
  return (
    <Suspense fallback={<div className='h-[40px]' />}>
      <BlogFilter categories={categories} />
    </Suspense>
  );
};

export default BlogFilterWrapper;

