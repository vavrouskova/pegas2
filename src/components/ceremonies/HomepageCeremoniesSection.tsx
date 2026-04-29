import { getTranslations } from 'next-intl/server';

import Button from '@/components/_shared/Button';
import HomepageCeremoniesGrid from '@/components/ceremonies/HomepageCeremoniesGrid';
import { Link } from '@/i18n/routing';
import { CEREMONIES } from '@/data/ceremonies';
import { getCeremonyStatus } from '@/utils/ceremonies/status';

const HomepageCeremoniesSection = async () => {
  const t = await getTranslations('ceremonies.homepage');

  const withStatus = CEREMONIES.map((ceremony) => ({
    ceremony,
    status: getCeremonyStatus(ceremony),
  }));
  const publicSorted = withStatus
    .filter(({ ceremony }) => ceremony.visibility !== 'private')
    .sort((a, b) => {
      const order = { upcoming: 0, ongoing: 0, past: 1 };
      if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
      return new Date(a.ceremony.startAt).getTime() - new Date(b.ceremony.startAt).getTime();
    })
    .slice(0, 23)
    .map(({ ceremony }) => ceremony);
  const privateSorted = withStatus
    .filter(({ ceremony }) => ceremony.visibility === 'private')
    .sort((a, b) => a.ceremony.person.lastName.localeCompare(b.ceremony.person.lastName, 'cs'))
    .slice(0, 2)
    .map(({ ceremony }) => ceremony);
  const sorted = [...publicSorted, ...privateSorted];

  return (
    <section className='section-container'>
      <div className='mb-6 flex flex-col gap-2.5 lg:mb-8'>
        <h2 className='font-heading text-primary text-3xl lg:text-4xl'>{t('title')}</h2>
        <p className='font-text max-w-content text-base'>{t('description')}</p>
      </div>

      <HomepageCeremoniesGrid ceremonies={sorted} />

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
