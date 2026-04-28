import Image from 'next/image';
import { useTranslations } from 'next-intl';

import Button from '@/components/_shared/Button';
import { Link } from '@/i18n/routing';
import { Ceremony } from '@/types/ceremony';

interface CeremonyFlowerCTAProps {
  ceremony: Ceremony;
}

const CeremonyFlowerCTA = ({ ceremony }: CeremonyFlowerCTAProps) => {
  const t = useTranslations('ceremonies.detail.flower-cta');

  return (
    <section className='bg-primary section-container my-20 flex flex-col overflow-hidden p-0 lg:my-32 lg:flex-row lg:items-stretch'>
      <picture className='relative aspect-[4/3] w-full lg:aspect-auto lg:w-1/2 lg:min-h-[28rem]'>
        <Image
          src='/images/flowers.webp'
          alt='Smuteční kytice'
          fill
          sizes='(max-width: 1024px) 100vw, 50vw'
          className='object-cover'
        />
      </picture>
      <div className='flex flex-1 flex-col justify-center gap-6 p-8 lg:p-16'>
        <h2 className='font-heading text-white-smoke text-2xl lg:text-3xl'>{t('title')}</h2>
        <p className='font-text text-white-smoke/90 max-w-prose text-base'>{t('description')}</p>
        <Link
          href={{ pathname: '/ceremonies/[slug]/send-flower', params: { slug: ceremony.slug } }}
          className='self-start'
        >
          <Button
            buttonText={t('button')}
            variant='white'
            arrowPosition='right'
            reverseArrow
          />
        </Link>
      </div>
    </section>
  );
};

export default CeremonyFlowerCTA;
