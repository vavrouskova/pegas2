import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { getPobockyPosts } from '@/api/wordpress-api';
import DirectorateInfo from '@/components/footer/DirectorateInfo';
import Facebook from '@/components/icons/Facebook';
import Instagram from '@/components/icons/Instagram';
import { PhoneNumber } from '@/lib/constants';
import { PobockaPost } from '@/utils/wordpress-types';

const Footer = async () => {
  const t = await getTranslations();
  const pobockyData = await getPobockyPosts();

  return (
    <footer className='bg-primary mx-auto px-4 pt-11 pb-10 md:px-14 md:pt-[7.75rem] md:pb-[3.75rem]'>
      <div className='max-w-container grid gap-9 md:grid-cols-3 md:gap-4 lg:grid-cols-4'>
        <div className='col-span-1 flex flex-col-reverse justify-between gap-11 md:flex-col md:gap-0 lg:col-span-2'>
          <div className='flex flex-col-reverse gap-11 md:flex-col md:gap-0'>
            <div className='mb-7.5 flex flex-col gap-2 md:gap-4'>
              <span className='font-heading text-white-smoke'>{t('common.nonstop')}</span>
              <Link
                className='text-white-smoke w-fit text-2xl transition-all duration-300 hover:opacity-70'
                href={`tel:${PhoneNumber}`}
              >
                +420 {PhoneNumber}
              </Link>
            </div>
            <div className='flex items-center gap-2'>
              <div className='flex gap-2'>
                <Link
                  className='flex size-12 items-center justify-center transition-all duration-300 hover:opacity-70'
                  href='https://www.facebook.com/'
                >
                  <Facebook className='text-white-smoke' />
                </Link>
                <Link
                  className='flex size-12 items-center justify-center transition-all duration-300 hover:opacity-70'
                  href='https://www.instagram.com/'
                >
                  <Instagram className='text-white-smoke' />
                </Link>
              </div>
            </div>
          </div>
          <Image
            src='/images/icons/logo-white.svg'
            alt='Logo'
            width={100}
            height={100}
            className='mx-2 md:mx-0'
          />
        </div>
        <div className='flex flex-col justify-between'>
          <div className='flex flex-col gap-6'>
            <span className='font-heading text-white-smoke max-w-[16.875rem] text-lg text-balance'>
              {t('footer.nonstop-branches')}
            </span>
            <div className='flex flex-col gap-4'>
              {pobockyData
                .filter((pobocka: PobockaPost) => pobocka.pobockyACF?.openSwitcher === true)
                .map((pobocka: PobockaPost) => (
                  <Link
                    key={pobocka.id}
                    href={`/${pobocka.slug}`}
                    className='text-tertiary font-text text-sm transition-all duration-300 hover:opacity-70'
                  >
                    {pobocka.pobockyACF?.city && (
                      <span className='font-cta mr-1 text-white'>{pobocka.pobockyACF.city}</span>
                    )}
                    {pobocka.title}
                  </Link>
                ))}
            </div>
          </div>
          <div className='max-md:hidden'>
            <DirectorateInfo />
          </div>
        </div>
        <div className='flex flex-col'>
          <span className='font-heading text-white-smoke mb-6 max-w-[10.875rem] text-lg text-balance'>
            {t('footer.all-branches')}
          </span>
          <div className='flex flex-col gap-4'>
            {pobockyData.map((pobocka: PobockaPost) => (
              <Link
                key={pobocka.id}
                href={`/${pobocka.slug}`}
                className='text-tertiary font-text text-sm transition-all duration-300 hover:opacity-70'
              >
                {pobocka.pobockyACF?.city && <span className='font-cta text-white'>{pobocka.pobockyACF.city}</span>}{' '}
                {pobocka.title}
              </Link>
            ))}
          </div>
        </div>
        <div className='md:hidden'>
          <DirectorateInfo />
        </div>
      </div>
      <div className='max-w-container mt-10 flex flex-col gap-6 pt-4 md:mt-24'>
        <div className='text-tertiary flex gap-6 text-sm max-lg:flex-col lg:items-center lg:gap-4'>
          <Link
            className='font-text transition-all duration-300 hover:opacity-70'
            href={t('routes.gdpr')}
          >
            {t('footer.gdpr')}
          </Link>
          <Link
            className='font-text transition-all duration-300 hover:opacity-70'
            href={t('routes.consumer-information')}
          >
            {t('footer.consumer-information')}
          </Link>
          <Link
            className='font-text transition-all duration-300 hover:opacity-70'
            href={t('routes.cookies')}
          >
            {t('footer.cookies')}
          </Link>
          <Link
            className='font-text transition-all duration-300 hover:opacity-70'
            href={t('routes.terms-of-use')}
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
