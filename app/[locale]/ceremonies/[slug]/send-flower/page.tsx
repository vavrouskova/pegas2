import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { BasePageProps } from '@/app/[locale]/layout';
import Breadcrumbs from '@/components/_shared/Breadcrumbs';
import FooterClaim from '@/components/_shared/FooterClaim';
import FlowerForm from '@/components/ceremonies/flower-form/FlowerForm';
import { CEREMONIES, getCeremonyBySlug } from '@/data/ceremonies';

interface SendFlowerParams {
  locale: string;
  slug: string;
}

interface SendFlowerPageProps {
  params: Promise<SendFlowerParams>;
}

export const generateStaticParams = async () =>
  CEREMONIES.map((ceremony) => ({ slug: ceremony.slug }));

export const metadata: Metadata = {
  title: 'Poslat květinu | Pegas',
  robots: { index: false, follow: false },
};

const SendFlowerPage = async ({ params }: SendFlowerPageProps) => {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const ceremony = getCeremonyBySlug(slug);
  if (!ceremony || !ceremony.allowFlowers) notFound();

  const [t, tRoutes] = await Promise.all([
    getTranslations('ceremonies'),
    getTranslations('routes'),
  ]);

  return (
    <main className='max-w-container relative mx-auto'>
      <Breadcrumbs
        className='px-4 pb-12 md:px-14'
        pageTitle={t('flower-form.page-title')}
        items={[{ label: t('page-title'), href: `/${tRoutes('ceremonies')}` }]}
      />

      <FlowerForm ceremony={ceremony} />

      <FooterClaim />
    </main>
  );
};

export default SendFlowerPage;
