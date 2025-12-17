import { FormattedText } from '@/components/_shared/FormattedText';
import LeavesImage from '@/components/_shared/LeavesImage';
import { cn } from '@/lib/utils';

interface PageHeroSectionProps {
  title: string;
  description: string;
  classNameSection?: string;
  classNameContent?: string;
}

const PageHeroSection = ({ title, description, classNameSection, classNameContent }: PageHeroSectionProps) => {
  return (
    <section className={cn('lg:px-30', classNameSection)}>
      <div className={cn('flex flex-col gap-2.5', classNameContent)}>
        <FormattedText
          text={title}
          as='h1'
        />
        <FormattedText
          text={description}
          as='p'
          className='max-w-content'
        />
        <LeavesImage />
      </div>
    </section>
  );
};

export default PageHeroSection;
