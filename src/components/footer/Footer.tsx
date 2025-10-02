import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import Facebook from '@/components/icons/Facebook';
import Instagram from '@/components/icons/Instagram';
import { DirectorateInformation, Email, PhoneNumber, SecondaryPhoneNumber } from '@/lib/constants';
import { getBranchOffices } from '@/utils/data';

const Footer = async () => {
  const t = await getTranslations();
  const branchesData = await getBranchOffices();

  return (
    <footer className='bg-primary px-14 pt-[7.75rem] pb-[3.75rem]'>
      <div className='grid grid-cols-4 gap-4'>
        <div className='col-span-2 flex flex-col justify-between'>
          <div>
            <div className='mb-7.5 flex flex-col gap-4'>
              <span className='font-heading text-white-smoke'>{t('common.nonstop')}</span>
              <Link
                className='text-white-smoke w-fit text-2xl'
                href={`tel:${PhoneNumber}`}
              >
                +420 {PhoneNumber}
              </Link>
            </div>
            <div className='flex items-center gap-2'>
              <div className='flex gap-2'>
                <Link
                  className='bg-white-smoke flex size-12 items-center justify-center transition-all duration-300 hover:opacity-80'
                  href='https://www.facebook.com/'
                >
                  <Facebook className='text-primary' />
                </Link>
                <Link
                  className='bg-white-smoke flex size-12 items-center justify-center transition-all duration-300 hover:opacity-80'
                  href='https://www.instagram.com/'
                >
                  <Instagram className='text-primary' />
                </Link>
              </div>
            </div>
          </div>
          <Image
            src='/images/icons/logo-white.svg'
            alt='Logo'
            width={100}
            height={100}
          />
        </div>
        <div className='flex flex-col justify-between'>
          <div className='flex flex-col gap-6'>
            <span className='font-heading text-white-smoke max-w-[16.875rem] text-lg text-balance'>
              {t('footer.nonstop-branches')}
            </span>
            <div className='flex flex-col gap-4'>
              {branchesData
                .filter((branch) => branch.isNonStop)
                .map((branch) => (
                  <Link
                    key={branch.id}
                    href={branch.url}
                    className='text-tertiary font-text text-sm'
                  >
                    <span className='font-cta mr-1 text-white'>{branch.city}</span> {branch.address}
                  </Link>
                ))}
            </div>
          </div>
          <div className='flex flex-col gap-3'>
            <span className='font-heading text-white-smoke text-lg text-balance'>{t('footer.directorate')}</span>
            <div className='flex flex-col gap-4'>
              <span className='text-tertiary text-sm'>{DirectorateInformation.name}</span>
              <span className='text-tertiary text-sm'>{DirectorateInformation.address}</span>
              <span className='text-tertiary text-sm'>{DirectorateInformation.openingHours}</span>
              <span className='text-tertiary text-sm'>{DirectorateInformation.openingHoursWeekend}</span>
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            <Link
              className='text-sm text-white'
              href={`mailto:${Email}`}
            >
              {Email}
            </Link>
            <div className='flex items-center gap-2 text-white'>
              <Link
                className='text-sm text-white'
                href={`tel:${PhoneNumber}`}
              >
                +420 {PhoneNumber}
              </Link>
              |
              <Link
                className='text-sm text-white'
                href={`tel:${SecondaryPhoneNumber}`}
              >
                +420 {SecondaryPhoneNumber}
              </Link>
            </div>
          </div>
        </div>
        <div className='flex flex-col'>
          <span className='font-heading text-white-smoke mb-6 max-w-[10.875rem] text-lg text-balance'>
            {t('footer.all-branches')}
          </span>
          <div className='flex flex-col gap-4'>
            {branchesData.map((branch) => (
              <Link
                key={branch.id}
                href={branch.url}
                className='text-tertiary font-text text-sm'
              >
                <span className='font-cta text-white'>{branch.city}</span> {branch.address}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className='mt-24 flex flex-col gap-6 pt-4'>
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
