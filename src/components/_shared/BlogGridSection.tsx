import { getTranslations } from 'next-intl/server';

import Button from '@/components/_shared/Button';
import GridCard from '@/components/_shared/GridCard';
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
          <GridCard
            key={post.id}
            href={`/${post.slug}`}
            imageUrl={imageUrl}
            imageAlt={imageAlt}
            title={post.title}
          >
            <FormattedText
              text={excerpt}
              as='p'
              className='font-text line-clamp-3 text-sm'
            />
            <Button
              buttonText={t('post-detail')}
              variant='destructive'
              className='-ml-8 w-fit lg:-ml-16'
            />
          </GridCard>
        );
      })}
    </div>
  );
};

export default BlogGridSection;
