import { ShoppingBasket } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/routing';
import { Ceremony } from '@/types/ceremony';

interface CeremonyFlowerCTAProps {
  ceremony: Ceremony;
}

const CeremonyFlowerCTA = ({ ceremony }: CeremonyFlowerCTAProps) => {
  const t = useTranslations('ceremonies.detail.flower-cta');

  return (
    <section className='bg-primary my-20 flex flex-col overflow-hidden lg:my-32 lg:flex-row lg:items-stretch'>
      <picture className='relative aspect-[4/3] w-full lg:w-1/2'>
        <Image
          src='/images/ceremonies/posli-kvetinu.png'
          alt='Smuteční kytice'
          fill
          sizes='(max-width: 1024px) 100vw, 50vw'
          className='object-cover'
        />
      </picture>
      <div className='flex flex-1 flex-col justify-center gap-4 p-8 lg:gap-6 lg:p-12'>
        <h2 className='font-heading text-white-smoke text-2xl lg:text-3xl'>{t('title')}</h2>
        <p className='font-text text-white-smoke/90 max-w-prose text-base'>{t('description')}</p>
        <Link
          href={{ pathname: '/ceremonies/[slug]/send-flower', params: { slug: ceremony.slug } }}
          className='text-primary inline-flex items-center gap-3 self-start bg-white px-8 py-3 text-lg transition-opacity duration-300 hover:opacity-90 lg:px-16'
        >
          {t('button')}
          <ShoppingBasket className='size-5' />
        </Link>
      </div>
    </section>
  );
};

export default CeremonyFlowerCTA;
