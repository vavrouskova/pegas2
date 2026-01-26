import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';

import { FormattedText } from '@/components/_shared/FormattedText';
import { FormLeadTracker } from '@/utils/datalayer';

interface ThankYouPageProps {
  params: Promise<{ locale: string }>;
}

export const generateMetadata = async ({ params }: ThankYouPageProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'forms' });

  return {
    title: t('success.meta_title'),
    description: t('success.meta_description'),
    robots: {
      index: false,
      follow: true,
    },
  };
};

const ThankYouPage = async ({ params }: ThankYouPageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('forms');

  return (
    <main className='bg-white-smoke relative z-10 flex min-h-[85vh] flex-col items-center justify-center px-4 py-20'>
      <FormLeadTracker />
      <div className='flex flex-col items-center text-center'>
        <Image
          src='/images/leaf.webp'
          alt=''
          width={300}
          height={300}
          className='w-[300px]'
          priority
        />

        <FormattedText
          text={t('success.title')}
          as='h1'
          className='mb-12.5 text-5xl'
        />

        <div>
          <FormattedText
            text={t('success.description')}
            as='p'
            className='text-lg md:text-xl'
          />
          <FormattedText
            text={t('success.back_to_home_text')}
            as='span'
            className='text-lg md:text-xl'
          />
          <Link
            href='/'
            className='link font-text text-lg md:text-xl'
          >
            {t('success.back_to_home_link')}
          </Link>
          .
        </div>
      </div>
    </main>
  );
};

export default ThankYouPage;
