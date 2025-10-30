import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';

import Button from '@/components/_shared/Button';
import { stripHtmlTags } from '@/utils/helper';
import { BlogPost } from '@/utils/wordpress-types';

interface BlogGridSectionProps {
  posts: BlogPost[];
}

const BlogGridSection = async ({ posts }: BlogGridSectionProps) => {
  const t = await getTranslations('common');

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className='grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3'>
      {posts.map((post) => {
        const imageUrl = post.featuredImage?.node?.sourceUrl || '/images/placeholder.webp';
        const imageAlt = post.featuredImage?.node?.altText || post.title;
        const excerpt = post.excerpt ? stripHtmlTags(post.excerpt) : '';

        return (
          <Link
            href={`/${post.slug}`}
            key={post.id}
            className='flex flex-col gap-8'
          >
            <div className='relative h-[326px] w-full overflow-hidden'>
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                sizes='(max-width: 1024px) 100vw, 33vw'
                className='object-cover object-center'
              />
            </div>

            <div className='text-primary flex flex-col gap-2'>
              <h3 className='text-2xl'>{post.title}</h3>
              {excerpt && <p className='font-text line-clamp-3 text-lg'>{excerpt}</p>}
            </div>

            <Button
              buttonText={t('post-detail')}
              variant='white'
              className='w-fit'
            />
          </Link>
        );
      })}
    </div>
  );
};

export default BlogGridSection;
