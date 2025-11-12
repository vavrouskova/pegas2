import Image from 'next/image';

import Breadcrumbs from '@/components/_shared/Breadcrumbs';
import { FormattedText } from '@/components/_shared/FormattedText';
import LeavesAnimation from '@/components/_shared/LeavesAnimation';
import { formatBlogDate } from '@/utils/helper';

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
    <section className='relative px-4 lg:px-14'>
      <LeavesAnimation />
      <Breadcrumbs
        pageTitle={pageTitle}
        items={breadcrumbItems}
      />
      <div className='max-w-dynamic-content mx-auto pt-18 lg:pt-[11.65rem]'>
        <div className='relative z-10 flex flex-col gap-7.5'>
          {/* Title */}
          <FormattedText
            text={title}
            as='h1'
          />

          {/* Publication Date */}
          {formattedDate && (
            <div className='mb-5 flex items-center gap-2'>
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
            <div className='bg-grey-warm mb-12.5 w-full p-[8%]'>
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
            </div>
          )}
        </div>
        {description && (
          <FormattedText
            text={description}
            as='p'
            className='text-primary font-cta text-lg'
          />
        )}
      </div>
    </section>
  );
};

export default BlogDetailHeroSection;
