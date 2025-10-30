import { FormattedText } from '@/components/_shared/FormattedText';

interface BlogHeroSectionProps {
  title: string;
  description: string;
}

const BlogHeroSection = ({ title, description }: BlogHeroSectionProps) => {
  return (
    <section className='flex flex-col gap-8 lg:px-30'>
      <FormattedText
        text={title}
        as='h1'
      />
      <FormattedText
        text={description}
        as='p'
        className='max-w-[549px] text-xl'
      />
    </section>
  );
};

export default BlogHeroSection;
