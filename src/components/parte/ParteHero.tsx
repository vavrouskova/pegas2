import { useTranslations } from 'next-intl';

import Button from '@/components/_shared/Button';
import { FormattedText } from '@/components/_shared/FormattedText';
import LeavesImage from '@/components/_shared/LeavesImage';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

interface ParteHeroProps {
  className?: string;
}

const ParteHero = ({ className }: ParteHeroProps) => {
  const t = useTranslations('parte.hero');

  return (
    <section className={cn('relative pt-10 pb-12 lg:px-30 lg:pt-16', className)}>
      <div className='flex flex-col gap-4'>
        <FormattedText
          text={t('title')}
          as='h1'
        />
        <FormattedText
          text={t('description')}
          as='p'
          className='max-w-content'
        />
        <div className='mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center'>
          <a href='#gallery'>
            <Button
              buttonText={t('cta')}
              variant='primary'
            />
          </a>
          <Link href='/parte/vytvorit'>
            <Button
              buttonText={t('cta-wizard')}
              variant='white'
            />
          </Link>
        </div>
        <LeavesImage />
      </div>
    </section>
  );
};

export default ParteHero;
