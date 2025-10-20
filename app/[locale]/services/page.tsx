import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import ContentSection from '@/components/_shared/ContentSection';
import FooterClaim from '@/components/_shared/FooterClaim';
import PartnersSection from '@/components/_shared/PartnersSection';
import { formatTranslation } from '@/lib/utils';
import { getSeoDataByUri } from '@/utils/seo';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('routes');

  return getSeoDataByUri('page', t('services'));
}

const AboutUsPage = async () => {
  const [t] = await Promise.all([getTranslations('home')]);

  return (
    <main className='max-w-container mx-auto'>
      <ContentSection
        title={t('organized-by-us.title')}
        description={formatTranslation(t('organized-by-us.description'))}
        buttonText={t('organized-by-us.button-text')}
        link={t('organized-by-us.link')}
        sectionClassName='pt-[26rem] lg:pt-[15rem] pb-[21rem]'
        withFeathers
      />

      <ContentSection
        title={t('about-us.title')}
        description={t('about-us.description')}
        buttonText={t('about-us.button-text')}
        link={t('about-us.link')}
        imagePosition='left'
        className='pb-40 lg:py-80'
        image={{ src: '/images/about-us.webp', alt: t('about-us.alt') }}
      />

      <PartnersSection />

      <FooterClaim />
    </main>
  );
};

export default AboutUsPage;
