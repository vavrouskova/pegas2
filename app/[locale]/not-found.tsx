import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';

import { FormattedText } from '@/components/_shared/FormattedText';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('error_page');

  return {
    title: t('404.title'),
    description: t('404.description'),
  };
}

const NotFound = async () => {
  const t = await getTranslations('error_page');

  return (
    <main className='bg-white-smoke relative z-10 flex min-h-[85vh] flex-col items-center justify-center px-4 py-20'>
      <div className='flex flex-col items-center text-center'>
        <Image
          src='/images/404-feather.webp'
          alt=''
          width={300}
          height={150}
          className='w-[300px]'
          priority
        />

        <FormattedText
          text={t('404.title')}
          as='h1'
          className='mb-12.5 text-5xl tracking-[0.37781rem]'
        />

        <div>
          <p className='text-primary text-lg md:text-xl'>{t('404.description')}</p>
          <div>
            <span className='text-primary text-lg md:text-xl'>{t('404.back_to_home_text')}</span>
            <Link
              href='/'
              className='link text-primary font-text text-lg md:text-xl'
            >
              {t('404.back_to_home_link')}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
