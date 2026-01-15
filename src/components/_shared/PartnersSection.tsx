import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';

import { FormattedText } from '@/components/_shared/FormattedText';
import { PARTNERS } from '@/lib/constants';

const PartnersSection = async () => {
  const t = await getTranslations('about-us');

  return (
    <section className='section-container'>
      <div className='flex flex-col gap-12.5 lg:gap-25'>
        <FormattedText
          text={t('partners.title')}
          as='h2'
        />
        <div className='grid grid-cols-2 gap-7.5 md:grid-cols-6'>
          {PARTNERS.map((partner) => {
            const imageElement = (
              <Image
                src={partner.imageSrc}
                alt={partner.name}
                width={partner.width}
                height={partner.height}
                className='mix-blend-darken'
              />
            );

            return (
              <div
                key={partner.id}
                className='flex items-center justify-center'
              >
                {partner.url ? (
                  <Link
                    href={partner.url}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {imageElement}
                  </Link>
                ) : (
                  imageElement
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
