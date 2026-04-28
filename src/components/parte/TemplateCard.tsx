import { useTranslations } from 'next-intl';

import ArrowRight from '@/components/icons/ArrowRight';
import StaticParteSvg from '@/components/parte/StaticParteSvg';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { ParteTemplate } from '@/types/parte';

interface TemplateCardProps {
  template: ParteTemplate;
  className?: string;
}

const TemplateCard = ({ template, className }: TemplateCardProps) => {
  const t = useTranslations('parte.gallery');

  return (
    <Link
      href={{ pathname: '/parte/editor/[templateId]', params: { templateId: template.id } }}
      className={cn('group flex flex-col gap-4', className)}
    >
      <div className='ring-primary/10 group-hover:ring-primary/30 aspect-[210/297] overflow-hidden ring-1 transition'>
        <StaticParteSvg
          template={template}
          className='h-full w-full'
        />
      </div>
      <div className='flex flex-col gap-2'>
        <h3 className='text-lg leading-tight tracking-wide'>{template.name}</h3>
        <span className='text-primary/80 flex items-center gap-1.5 text-xs transition-transform group-hover:translate-x-1'>
          {t('use-template')}
          <ArrowRight className='h-3 w-3' />
        </span>
      </div>
    </Link>
  );
};

export default TemplateCard;
