import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { SocialLinks } from '@/components/footer/SocialLinks';
import { PhoneNumber } from '@/lib/constants';

interface LogoAndContactProps {
  nonstopText: string;
}

export const LogoAndContact = ({ nonstopText }: LogoAndContactProps) => {
  return (
    <div className='flex flex-col gap-11 md:flex-col md:gap-0'>
      <div className='mb-7.5 flex flex-col gap-14'>
        <div className='flex items-center justify-between md:block'>
          <Link href='/'>
            <Image
              src='/images/icons/logo-white.svg'
              alt='Logo'
              width={100}
              height={100}
              className='mb-0 w-[7.5rem] md:mb-8'
            />
          </Link>
          <SocialLinks className='md:hidden' />
        </div>

        <div className='flex flex-col'>
          <span className='font-text text-white-smoke text-base'>{nonstopText}</span>
          <Link
            className='text-white-smoke w-fit text-xl transition-all duration-300 hover:opacity-70'
            href={`tel:${PhoneNumber}`}
          >
            {PhoneNumber}
          </Link>
        </div>
      </div>

      <SocialLinks className='hidden md:flex' />
    </div>
  );
};
