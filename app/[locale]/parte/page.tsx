import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { BasePageProps } from '@/app/[locale]/layout';
import ParteHero from '@/components/parte/ParteHero';
import TemplateGallery from '@/components/parte/TemplateGallery';

export const metadata: Metadata = {
  title: 'Generátor parte | Pegas',
  description:
    'Vytvořte si důstojné parte online. Vyberte šablonu, upravte texty a fotografii. Stáhněte PDF, pošlete e-mailem nebo sdílejte odkazem.',
  robots: { index: false, follow: false },
};

const PartePage = async ({ params }: BasePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className='max-w-container mx-auto'>
      <ParteHero />
      <TemplateGallery />
    </main>
  );
};

export default PartePage;
