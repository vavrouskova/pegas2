import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';

import Button from '@/components/_shared/Button';
import { BlogPost } from '@/utils/wordpress-types';

interface BlogGridSectionProps {
  posts: BlogPost[];
}

function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

const BlogGridSection = async ({ posts }: BlogGridSectionProps) => {
  const t = await getTranslations('common');

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
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
            {/* Obrázek */}
            <div className='relative h-[326px] w-full overflow-hidden'>
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                sizes='(max-width: 1024px) 100vw, 33vw'
                className='object-cover object-center'
              />
            </div>

            {/* Obsah */}
            <div className='text-primary flex flex-col gap-2'>
              {/* Nadpis */}
              <h3 className='text-2xl leading-[1.44] font-black tracking-[1px]'>{post.title}</h3>

              {/* Popis */}
              {excerpt && <p className='line-clamp-2 text-lg leading-[2] font-normal tracking-[0.7px]'>{excerpt}</p>}
            </div>

            {/* Tlačítko */}
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
