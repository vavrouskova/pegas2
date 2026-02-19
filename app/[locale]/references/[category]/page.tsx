import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import {
  getReferenceCategoryBySlug,
  getReferencePostsByCategorySlug,
  getReferenceTaxonomies,
} from '@/api/wordpress-api';
import Breadcrumbs from '@/components/_shared/Breadcrumbs';
import ContentSection from '@/components/_shared/ContentSection';
import FooterClaim from '@/components/_shared/FooterClaim';
import PageHeroSection from '@/components/_shared/PageHeroSection';
import ReferencesFilter from '@/components/_shared/ReferencesFilter';
import ReferencesGridSection from '@/components/_shared/ReferencesGridSection';
import ReferencesPagination from '@/components/_shared/ReferencesPagination';
import { REFERENCES_PER_PAGE } from '@/constants/references';
import { htmlToFormattedMarkers } from '@/utils/helper';
import { parsePageNumber } from '@/utils/pagination-helpers';
import { getReferenceCategorySeoBySlug } from '@/utils/seo';

export const dynamic = 'force-dynamic';

interface ReferencesCategoryPageProps {
  params: Promise<{
    locale: string;
    category: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata({ params }: ReferencesCategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;

  return getReferenceCategorySeoBySlug(categorySlug);
}

const ReferencesCategoryPage = async ({ params, searchParams }: ReferencesCategoryPageProps) => {
  const { category: categorySlug } = await params;
  const parameters = await searchParams;
  const page = parsePageNumber(parameters.page);

  const [t, categoryData, referencesData, categories] = await Promise.all([
    getTranslations(),
    getReferenceCategoryBySlug(categorySlug),
    getReferencePostsByCategorySlug(REFERENCES_PER_PAGE, page, categorySlug),
    getReferenceTaxonomies(),
  ]);

  if (!categoryData) {
    notFound();
  }

  return (
    <main className='max-w-container relative mx-auto'>
      <section className='px-4 sm:px-14'>
        <Breadcrumbs
          className='pb-18 lg:pb-43'
          pageTitle={t('references.page-title')}
        />
        <PageHeroSection
          title={categoryData.taxonomie?.taxonomyH1 || t('references.hero.title')}
          description={
            categoryData.description
              ? htmlToFormattedMarkers(categoryData.description)
              : t('references.hero.description')
          }
          noMaxDescriptionWidth={!!categoryData.description}
        />
      </section>

      <section className='section-container relative'>
        <div className='mb-8 lg:mb-16'>
          <Suspense fallback={<div className='h-[40px]' />}>
            <ReferencesFilter
              categories={categories}
              activeCategorySlug={categorySlug}
            />
          </Suspense>
        </div>
        <ReferencesGridSection referencePosts={referencesData.nodes} />
        <Suspense fallback={null}>
          <ReferencesPagination
            totalPages={referencesData.totalPages}
            currentPage={referencesData.currentPage}
          />
        </Suspense>
      </section>

      <ContentSection
        title={t('home.about-us.title')}
        description={t('home.about-us.description')}
        buttonText={t('home.about-us.button-text')}
        link={t('home.about-us.link')}
        imagePosition='left'
        image={{ src: '/images/about-us.webp', alt: t('home.about-us.alt') }}
      />

      <FooterClaim />
    </main>
  );
};

export default ReferencesCategoryPage;
