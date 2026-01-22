import { getTranslations } from 'next-intl/server';

import { FormattedText } from '@/components/_shared/FormattedText';
import GridCard from '@/components/_shared/GridCard';
import ArrowRight from '@/components/icons/ArrowRight';
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
            <div className='flex items-center gap-3 text-lg'>
              {t('post-detail')}
              <ArrowRight className='size-5 shrink-0' />
            </div>
          </GridCard>
        );
      })}
    </div>
  );
};

export default BlogGridSection;
