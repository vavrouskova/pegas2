import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

import { PARTNERS } from '@/lib/constants';

const PartnersSection = async () => {
  const t = await getTranslations('about-us');

  return (
    <section className='section-container pt-44 lg:pt-72 lg:pb-30'>
      <h2 className='mb-24 text-3xl lg:text-center'>{t('partners.title')}</h2>
      <div className='mx-auto grid max-w-[1000px] grid-cols-2 gap-4 md:grid-cols-4'>
        {PARTNERS.map((partner) => (
          <div
            key={partner.id}
            className='flex items-center justify-center'
          >
            <Image
              src={partner.imageSrc}
              alt={partner.name}
              width={partner.width}
              height={partner.height}
              className='mix-blend-darken'
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PartnersSection;
