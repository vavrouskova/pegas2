import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { BasePageProps } from '@/app/[locale]/layout';
import ParteWizard from '@/components/parte/wizard/ParteWizard';

export const metadata: Metadata = {
  title: 'Vytvořit parte | Pegas',
  description:
    'Provedeme vás vytvořením parte. Odpovíte na pár otázek a my připravíme deset návrhů s vašimi údaji.',
  robots: { index: false, follow: false },
};

const ParteWizardPage = async ({ params }: BasePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className='max-w-container mx-auto'>
      <ParteWizard />
    </main>
  );
};

export default ParteWizardPage;
