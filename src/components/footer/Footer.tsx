import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import Facebook from '@/components/icons/Facebook';
import Instagram from '@/components/icons/Instagram';
import { PhoneNumber } from '@/lib/constants';

const Footer = async () => {
  const t = await getTranslations();

  return (
    <footer className='bg-primary px-14 pt-[7.75rem] pb-[3.75rem]'>
      <div className='grid grid-cols-4 gap-4'>
        <div className='col-span-2 flex flex-col justify-between'>
          <div>
            <div className='mb-12 flex flex-col gap-4'>
              <span className='text-white-smoke'>{t('common.nonstop')}</span>
              <Link
                className='text-white-smoke text-2xl'
                href={`tel:${PhoneNumber}`}
              >
                +420 {PhoneNumber}
              </Link>
            </div>
            <div className='flex items-center gap-2'>
              <div className='flex gap-4'>
                <Link
                  className='p-1.25'
                  href='https://www.facebook.com/'
                >
                  <Facebook className='text-white-smoke h-5.5 w-5.5' />
                </Link>
                <Link
                  className='p-1.25'
                  href='https://www.instagram.com/'
                >
                  <Instagram className='text-white-smoke h-5.5 w-5.5' />
                </Link>
              </div>
              <span className='text-white-smoke text-sm'>{t('common.follow-us')}</span>
            </div>
          </div>
          <Image
            src='/images/icons/logo-white.svg'
            alt='Logo'
            width={100}
            height={100}
          />
        </div>
        <div className='flex flex-col gap-4'>column 2</div>
        <div className='flex flex-col gap-4'>column 3</div>
      </div>
      <div className='mt-12 pt-4'>
        <div className='text-tertiary flex items-center gap-4 text-sm'>
          <Link
            className='font-text'
            href={t('footer.gdpr')}
          >
            {t('footer.gdpr')}
          </Link>
          <Link
            className='font-text'
            href={t('footer.consumer-information')}
          >
            {t('footer.consumer-information')}
          </Link>
          <Link
            className='font-text'
            href={t('footer.cookies')}
          >
            {t('footer.cookies')}
          </Link>
          <Link
            className='font-text'
            href={t('footer.terms-of-use')}
          >
            {t('footer.terms-of-use')}
          </Link>
        </div>
        <p className='text-tertiary text-sm'>© 2025 PEGAS | {t('footer.copyright')}</p>
      </div>
    </footer>
  );
};

export default Footer;
