import { getTranslations } from 'next-intl/server';

import Button from '@/components/_shared/Button';
import CeremonyCard from '@/components/ceremonies/CeremonyCard';
import { Link } from '@/i18n/routing';
import { CEREMONIES } from '@/data/ceremonies';
import { getCeremonyStatus } from '@/utils/ceremonies/status';

const HomepageCeremoniesSection = async () => {
  const t = await getTranslations('ceremonies.homepage');

  const sorted = [...CEREMONIES]
    .map((ceremony) => ({ ceremony, status: getCeremonyStatus(ceremony) }))
    .sort((a, b) => {
      const order = { upcoming: 0, ongoing: 0, past: 1 };
      if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
      return new Date(a.ceremony.startAt).getTime() - new Date(b.ceremony.startAt).getTime();
    })
    .slice(0, 10)
    .map(({ ceremony }) => ceremony);

  return (
    <section className='section-container'>
      <div className='mb-12 flex flex-col gap-2.5 lg:mb-16'>
        <h2 className='font-heading text-primary text-3xl lg:text-4xl'>{t('title')}</h2>
        <p className='font-text max-w-content text-base'>{t('description')}</p>
      </div>

      <div className='grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-5 lg:gap-x-8 lg:gap-y-14'>
        {sorted.map((ceremony) => (
          <CeremonyCard
            key={ceremony.slug}
            ceremony={ceremony}
          />
        ))}
      </div>

      <div className='mt-12 flex justify-end'>
        <Link href='/ceremonies'>
          <Button
            buttonText={t('cta')}
            variant='primary'
          />
        </Link>
      </div>
    </section>
  );
};

export default HomepageCeremoniesSection;
