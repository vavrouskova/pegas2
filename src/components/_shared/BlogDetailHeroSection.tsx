import Image from 'next/image';

import Breadcrumbs from '@/components/_shared/Breadcrumbs';
import { FormattedText } from '@/components/_shared/FormattedText';
import LeavesAnimation from '@/components/_shared/LeavesAnimation';
import Calendar from '@/components/icons/Calendar';
import { formatBlogDate } from '@/utils/helper';
import Socials from '@/components/_shared/Socials';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BlogDetailHeroSectionProps {
  title: string;
  date?: string;
  image?: string;
  imageAlt: string;
  description: string;
  pageTitle: string;
  breadcrumbItems?: BreadcrumbItem[];
}

const BlogDetailHeroSection = ({
  title,
  date,
  image,
  imageAlt,
  description,
  pageTitle,
  breadcrumbItems,
}: Readonly<BlogDetailHeroSectionProps>) => {
  const formattedDate = formatBlogDate(date);

  return (
    <section className='relative px-4 sm:px-14 lg:px-44'>
      <LeavesAnimation />
      <Breadcrumbs
        pageTitle={pageTitle}
        items={breadcrumbItems}
      />
      <div className='max-w-dynamic-content mx-auto pt-18 lg:pt-[11.65rem]'>
        <div className='relative z-10 flex flex-col gap-6 lg:gap-8'>
          {/* Title */}
          <FormattedText
            text={title}
            as='h1'
            className='text-4xl'
          />

          {/* Publication Date */}
          {formattedDate && (
            <div className='flex items-center gap-2'>
              <Calendar className='text-primary size-6' />
              <time
                dateTime={date}
                className='text-primary text-lg'
              >
                {formattedDate}
              </time>
            </div>
          )}

          {/* Featured Image */}
          {image && (
            <div className='relative w-full overflow-hidden'>
              <Image
                src={image}
                alt={imageAlt}
                width={1272}
                height={1272}
                className='relative z-0 h-auto w-full'
                priority
              />
            </div>
          )}
        </div>
      </div>

      <div className='2lg:pt-11 relative z-10 pt-30'>
        <Socials className='2lg:top-14 absolute top-11 lg:left-0' />
        {description && (
          <FormattedText
            text={description}
            as='p'
            className='text-primary font-bold-text mx-auto max-w-[684px] text-lg'
          />
        )}
      </div>
    </section>
  );
};

export default BlogDetailHeroSection;
