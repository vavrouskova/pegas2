import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';

import Button from '@/components/_shared/Button';
import { stripHtmlTags } from '@/utils/helper';
import { BlogPost } from '@/utils/wordpress-types';
import { FormattedText } from './FormattedText';

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
            <picture className='bg-grey-warm w-full overflow-hidden p-8'>
              <div className='relative min-h-[12.75rem] w-full'>
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  fill
                  className='object-cover object-center'
                />
              </div>
            </picture>

            <div className='text-primary flex flex-col gap-2'>
              <FormattedText
                text={post.title}
                as='h3'
              />
              <FormattedText
                text={excerpt}
                as='p'
                className='font-text line-clamp-3 text-lg'
              />
            </div>

            <Button
              buttonText={t('post-detail')}
              variant='destructive'
              className='-ml-16 w-fit'
            />
          </Link>
        );
      })}
    </div>
  );
};

export default BlogGridSection;
