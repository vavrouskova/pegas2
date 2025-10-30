'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

import { BlogCategory } from '@/utils/wordpress-types';

const BlogFilter = dynamic(() => import('@/components/_shared/BlogFilter'), {
  ssr: false,
  loading: () => <div className='h-[40px]' />,
});

interface BlogFilterClientProps {
  categories: BlogCategory[];
}

const BlogFilterClient = ({ categories }: BlogFilterClientProps) => {
  return (
    <Suspense fallback={<div className='h-[40px]' />}>
      <BlogFilter categories={categories} />
    </Suspense>
  );
};

export default BlogFilterClient;
