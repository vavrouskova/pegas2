import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { getPageByUri } from '@/api/wordpress-api';
import Breadcrumbs from '@/components/_shared/Breadcrumbs';
import DynamicContentSection from '@/components/_shared/DynamicContentSection';
import FooterClaim from '@/components/_shared/FooterClaim';
import PageHeroSection from '@/components/_shared/PageHeroSection';
import PartnersSection from '@/components/_shared/PartnersSection';
import CookieSettingButton from '@/components/cookie/CookieSettingButton';
import { getSeoDataByUri } from '@/utils/seo';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('routes');

  return getSeoDataByUri('page', t('cookies'));
}

const CookiesPage = async () => {
  const [t, pageData] = await Promise.all([getTranslations(), getPageByUri('informace-o-vyuziti-cookies')]);

  if (!pageData) {
    notFound();
  }

  const { title, components } = pageData;
  const hasComponents = components?.components && components.components.length > 0;

  return (
    <main className='max-w-container mx-auto'>
      <section className='px-4 sm:px-14'>
        <Breadcrumbs
          className='pb-18 lg:pb-43'
          pageTitle={title}
        />
        <PageHeroSection
          title={title}
          description={t('cookies-page.hero.description')}
        />
      </section>

      {hasComponents && (
        <DynamicContentSection
          components={components}
          showBackLink={false}
          wider
        />
      )}

      <section className='flex justify-center px-4 sm:px-14'>
        <CookieSettingButton />
      </section>

      <PartnersSection />

      <FooterClaim />
    </main>
  );
};

export default CookiesPage;
