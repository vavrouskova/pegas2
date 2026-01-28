import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { getBlogCategories, getBlogCategoryBySlug, getBlogPostsByCategorySlug } from '@/api/wordpress-api';
import BlogFilter from '@/components/_shared/BlogFilter';
import BlogGridSection from '@/components/_shared/BlogGridSection';
import BlogPagination from '@/components/_shared/BlogPagination';
import Breadcrumbs from '@/components/_shared/Breadcrumbs';
import ContentSection from '@/components/_shared/ContentSection';
import FooterClaim from '@/components/_shared/FooterClaim';
import PageHeroSection from '@/components/_shared/PageHeroSection';
import { POSTS_PER_PAGE } from '@/constants/blog';
import { htmlToFormattedMarkers } from '@/utils/helper';
import { parsePageNumber } from '@/utils/pagination-helpers';
import { getBlogCategorySeoBySlug } from '@/utils/seo';

interface BlogCategoryPageProps {
  params: Promise<{
    locale: string;
    category: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata({ params }: BlogCategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;

  return getBlogCategorySeoBySlug(categorySlug);
}

const BlogCategoryPage = async ({ params, searchParams }: BlogCategoryPageProps) => {
  const { category: categorySlug } = await params;
  const parameters = await searchParams;
  const page = parsePageNumber(parameters.page);

  const [t, categoryData, blogData, categories] = await Promise.all([
    getTranslations(),
    getBlogCategoryBySlug(categorySlug),
    getBlogPostsByCategorySlug(POSTS_PER_PAGE, page, categorySlug),
    getBlogCategories(),
  ]);

  if (!categoryData) {
    notFound();
  }

  return (
    <main className='max-w-container relative mx-auto'>
      <section className='px-4 sm:px-14'>
        <Breadcrumbs
          className='pb-18 lg:pb-43'
          pageTitle={t('blog.page-title')}
        />
        <PageHeroSection
          title={categoryData.taxonomie?.taxonomyH1 || t('blog.hero.title')}
          description={
            categoryData.description ? htmlToFormattedMarkers(categoryData.description) : t('blog.hero.description')
          }
          noMaxDescriptionWidth={!!categoryData.description}
        />
      </section>

      <section className='section-container relative'>
        <div className='mb-8 lg:mb-16'>
          <Suspense fallback={<div className='h-[40px]' />}>
            <BlogFilter
              categories={categories}
              activeCategorySlug={categorySlug}
            />
          </Suspense>
        </div>
        <BlogGridSection posts={blogData.nodes} />
        <Suspense fallback={null}>
          <BlogPagination
            totalPages={blogData.totalPages}
            currentPage={blogData.currentPage}
          />
        </Suspense>
      </section>

      <ContentSection
        title={t('home.faq.title')}
        description={t('home.faq.description')}
        buttonText={t('home.faq.button-text')}
        link={t('home.faq.link')}
        image={{ src: '/images/ceremonies.webp', alt: t('home.faq.alt') }}
      />

      <ContentSection
        title={t('about-us.branches.title')}
        description={t('about-us.branches.description')}
        buttonText={t('about-us.branches.button-text')}
        link={t('about-us.branches.link')}
        image={{ src: '/images/room.webp', alt: t('about-us.branches.alt') }}
      />

      <ContentSection
        title={t('home.organized-by-us.title')}
        description={t('home.organized-by-us.description')}
        buttonText={t('home.organized-by-us.button-text')}
        link={t('home.organized-by-us.link')}
        image={{ src: '/images/detail-service.webp', alt: t('home.about-us.alt') }}
        imagePosition='left'
      />

      <FooterClaim />
    </main>
  );
};

export default BlogCategoryPage;
