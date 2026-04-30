'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { ShoppingBasket } from 'lucide-react';

import CeremonyFlowerWizard from '@/components/ceremonies/flower-wizard/CeremonyFlowerWizard';
import { Ceremony } from '@/types/ceremony';

interface CeremonyFlowerCTAProps {
  ceremony: Ceremony;
}

const CeremonyFlowerCTA = ({ ceremony }: CeremonyFlowerCTAProps) => {
  const t = useTranslations('ceremonies.detail.flower-cta');
  const [open, setOpen] = useState(false);

  return (
    <section className='-mt-8 mb-20 px-4 md:px-14 lg:-mt-24 lg:mb-32'>
      <button
        type='button'
        onClick={() => setOpen(true)}
        className='bg-primary mx-auto flex w-full max-w-3xl items-stretch overflow-hidden text-left transition-opacity duration-300 hover:opacity-95 max-lg:flex-col lg:h-72 lg:flex-row'
      >
        <picture className='relative aspect-square w-full shrink-0 lg:size-72'>
          <Image
            src='/images/ceremonies/posli-kvetinu.png'
            alt='Smuteční kytice'
            fill
            sizes='(max-width: 1024px) 100vw, 288px'
            className='object-cover'
          />
        </picture>
        <div className='flex flex-1 flex-col justify-between gap-4 px-4 py-5 lg:px-17.5 lg:py-7.5'>
          <div className='flex flex-col gap-2.5'>
            <h2 className='text-white-smoke font-heading text-xl'>{t('title')}</h2>
            <p className='text-white-smoke font-text text-sm'>{t('description')}</p>
          </div>
          <span className='bg-white-smoke text-primary font-heading inline-flex w-fit items-center gap-3 px-6 py-3 text-base'>
            {t('button')}
            <ShoppingBasket className='size-5 shrink-0' />
          </span>
        </div>
      </button>

      <CeremonyFlowerWizard
        ceremony={ceremony}
        open={open}
        onOpenChange={setOpen}
      />
    </section>
  );
};

export default CeremonyFlowerCTA;
