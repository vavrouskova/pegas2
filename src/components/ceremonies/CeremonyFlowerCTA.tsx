'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import CeremonyFlowerWizard from '@/components/ceremonies/flower-wizard/CeremonyFlowerWizard';
import ArrowRight from '@/components/icons/ArrowRight';
import { Ceremony } from '@/types/ceremony';

interface CeremonyFlowerCTAProps {
  ceremony: Ceremony;
}

const CeremonyFlowerCTA = ({ ceremony }: CeremonyFlowerCTAProps) => {
  const t = useTranslations('ceremonies.detail.flower-cta');
  const [open, setOpen] = useState(false);

  return (
    <section className='my-20 px-4 md:px-14 lg:my-32'>
      <button
        type='button'
        onClick={() => setOpen(true)}
        className='bg-primary mx-auto flex min-h-[10rem] w-full max-w-88 items-stretch overflow-hidden text-left transition-opacity duration-300 hover:opacity-95 max-lg:flex-col lg:max-h-[14.375rem] lg:max-w-[48.1875rem] lg:flex-row'
      >
        <picture className='relative aspect-square h-auto w-full lg:max-h-57.5 lg:max-w-57.5'>
          <Image
            src='/images/ceremonies/posli-kvetinu.png'
            alt='Smuteční kytice'
            fill
            sizes='(max-width: 768px) 160px, 256px'
            className='object-cover'
          />
        </picture>
        <div className='flex flex-1 flex-col justify-between gap-2 px-4 py-5 lg:px-17.5 lg:py-7.5'>
          <h2 className='text-white-smoke font-heading mb-2.5 text-xl'>{t('title')}</h2>
          <div className='text-white-smoke flex items-center gap-3'>
            <span className='text-white-smoke font-heading text-lg'>{t('button')}</span>
            <ArrowRight className='size-5 shrink-0' />
          </div>
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
