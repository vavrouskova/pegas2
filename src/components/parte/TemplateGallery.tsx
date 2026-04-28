import { useTranslations } from 'next-intl';

import TemplateCard from '@/components/parte/TemplateCard';
import { parteTemplates } from '@/data/parte-templates';
import { cn } from '@/lib/utils';

interface TemplateGalleryProps {
  className?: string;
}

const TemplateGallery = ({ className }: TemplateGalleryProps) => {
  const t = useTranslations('parte.gallery');

  return (
    <section
      id='gallery'
      className={cn('flex flex-col gap-8 py-12 lg:px-30', className)}
    >
      <div className='flex flex-col gap-2.5'>
        <h2>{t('title')}</h2>
        <p className='max-w-content text-primary/70'>{t('description')}</p>
      </div>

      <div className='grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5'>
        {parteTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
          />
        ))}
      </div>
    </section>
  );
};

export default TemplateGallery;
