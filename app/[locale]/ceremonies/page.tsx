import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { BasePageProps } from '@/app/[locale]/layout';
import Breadcrumbs from '@/components/_shared/Breadcrumbs';
import FooterClaim from '@/components/_shared/FooterClaim';
import PageHeroSection from '@/components/_shared/PageHeroSection';
import CeremoniesListSection from '@/components/ceremonies/CeremoniesListSection';
import { CEREMONIES } from '@/data/ceremonies';

export const metadata: Metadata = {
  title: 'Kalendář obřadů | Pegas',
  description:
    'Přehled plánovaných smutečních obřadů. Zjistěte, kdy a kde se koná rozloučení, a pošlete květinu na poslední sbohem.',
};

const CeremoniesListPage = async ({ params }: BasePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('ceremonies');

  return (
    <main className='max-w-container relative mx-auto'>
      <Breadcrumbs
        className='px-4 pb-12 md:px-14 lg:pb-20'
        pageTitle={t('page-title')}
      />

      <PageHeroSection
        title={t('hero.title')}
        description={t('hero.description')}
        classNameSection='px-4 md:px-14 pb-24 lg:px-14 lg:pb-32'
        classNameContent='max-w-dynamic-content mx-auto'
      />

      <CeremoniesListSection ceremonies={CEREMONIES} />

      <FooterClaim />
    </main>
  );
};

export default CeremoniesListPage;
