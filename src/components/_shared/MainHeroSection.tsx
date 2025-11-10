import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';

import Breadcrumbs from '@/components/_shared/Breadcrumbs';
import { FormattedText } from '@/components/_shared/FormattedText';
import { PhoneNumber } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface MainHeroSectionProps {
  title: string;
  description: string;
  branchesCount?: number;
  sectionClassName?: string;
  contentClassName?: string;
  imageClassName?: string;
  pageTitle?: string;
  noImage?: boolean;
}

const MainHeroSection = async ({
  title,
  description,
  branchesCount = 0,
  sectionClassName,
  contentClassName,
  imageClassName,
  pageTitle,
  noImage = false,
}: MainHeroSectionProps) => {
  const t = await getTranslations('home.hero');

  return (
    <section className={cn('px-4 pb-12.5 sm:px-14 lg:pb-35', sectionClassName)}>
      {pageTitle && <Breadcrumbs pageTitle={pageTitle} />}
      <div className='max-w-section mt-[28.5rem]'>
        <div className={cn('max-w-hero-content flex flex-col justify-center gap-12 lg:gap-25 ', contentClassName)}>
          <div className='space-y-2.5'>
            <FormattedText
              text={title}
              as='h1'
            />
            <FormattedText
              text={description}
              as='p'
              className='text-lg'
            />
          </div>
          <div className='flex flex-col justify-between gap-7.5 text-lg md:flex-row lg:gap-4'>
            <div className='flex flex-col'>
              <span className='leading-9'>{t('contact-us')}</span>
              <Link
                className='link'
                href={`tel:${PhoneNumber}`}
              >
                {PhoneNumber}
              </Link>
            </div>
            <div className='flex flex-col'>
              <span className='leading-9'>{t('prepare')}</span>
              <Link
                className='link'
                href='/'
              >
                {t('needed-documents')}
              </Link>
            </div>
            <div className='flex flex-col'>
              <span className='leading-9'>{t('visit-us')}</span>
              <Link
                className='link'
                href='/contacts'
              >
                {branchesCount} {t('branches')}
              </Link>
            </div>
          </div>
        </div>
      </div>
      {!noImage && (
        <Image
          src='/images/wing.webp'
          alt='Background Image'
          width={2000}
          height={2000}
          className={cn(
            'absolute top-20 right-0 z-[-1] w-[45rem] min-w-[35rem] lg:w-[50rem] xl:top-40 xl:w-[58rem]',
            imageClassName
          )}
        />
      )}
    </section>
  );
};

export default MainHeroSection;
