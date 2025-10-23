import { getTranslations } from 'next-intl/server';

import BasicHeroSection from '@/components/_shared/BasicHeroSection';
import ContentSection from '@/components/_shared/ContentSection';
import FooterClaim from '@/components/_shared/FooterClaim';
import { formatTranslation } from '@/lib/utils';

const ServiceDetailPage = async () => {
  const [t] = await Promise.all([getTranslations()]);

  return (
    <main className='max-w-container mx-auto'>
      <BasicHeroSection
        title={t('about-us.basic-hero.title')}
        description={t('about-us.basic-hero.description')}
        image='/images/team-pegas.webp'
        imageAlt='Team Pegas'
        pageTitle={t('about-us.basic-hero.page-title')}
      />

      <ContentSection
        title={t('home.organized-by-us.title')}
        description={formatTranslation(t('home.organized-by-us.description'))}
        buttonText={t('home.organized-by-us.button-text')}
        link={t('home.organized-by-us.link')}
        sectionClassName='pt-[26rem] lg:pt-[15rem] pb-[21rem]'
        withFeathers
      />

      <FooterClaim />
    </main>
  );
};

export default ServiceDetailPage;
