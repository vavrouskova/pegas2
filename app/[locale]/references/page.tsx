import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { getReferencePosts, getReferenceTaxonomies } from '@/api/wordpress-api';
import Breadcrumbs from '@/components/_shared/Breadcrumbs';
import ContentSection from '@/components/_shared/ContentSection';
import FooterClaim from '@/components/_shared/FooterClaim';
import PageHeroSection from '@/components/_shared/PageHeroSection';
import ReferencesFilter from '@/components/_shared/ReferencesFilter';
import ReferencesGridSection from '@/components/_shared/ReferencesGridSection';
import ReferencesPagination from '@/components/_shared/ReferencesPagination';
import { REFERENCES_PER_PAGE } from '@/constants/references';
import { parsePageNumber } from '@/utils/pagination-helpers';
import { getSeoDataByUri } from '@/utils/seo';

// References page needs to be dynamic because it uses searchParams for filtering
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('routes');

  return getSeoDataByUri('page', t('references'));
}

interface ReferencesPageProps {
  searchParams: Promise<{
    category?: string;
    page?: string;
    search?: string;
  }>;
}

const ReferencesPage = async ({ searchParams }: ReferencesPageProps) => {
  const parameters = await searchParams;
  const categoryId = parameters.category;
  const page = parsePageNumber(parameters.page);
  const search = parameters.search;

  const [t, referencesData, categories] = await Promise.all([
    getTranslations(),
    getReferencePosts(REFERENCES_PER_PAGE, page, categoryId, search),
    getReferenceTaxonomies(),
  ]);

  return (
    <main className='max-w-container relative mx-auto'>
      <section className='px-4 sm:px-14'>
        <Breadcrumbs
          className='pb-18 lg:pb-43'
          pageTitle={t('references.page-title')}
        />
        <PageHeroSection
          title={t('references.hero.title')}
          description={t('references.hero.description')}
        />
      </section>

      <section className='section-container relative'>
        <div className='mb-8 lg:mb-16'>
          <Suspense fallback={<div className='h-[40px]' />}>
            <ReferencesFilter categories={categories} />
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

export default ReferencesPage;
