import Image from 'next/image';

import Breadcrumbs from '@/components/_shared/Breadcrumbs';
import { FormattedText } from '@/components/_shared/FormattedText';
import LeavesAnimation from '@/components/_shared/LeavesAnimation';
import { formatBlogDate, formatFarewellDate } from '@/utils/helper';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DetailHeroSectionProps {
  title: string;
  // Blog properties
  date?: string;
  description?: string;
  // Reference properties
  farewellDate?: string;
  farewellPlace?: string;
  // Common properties
  image?: string;
  imageAlt: string;
  pageTitle: string;
  breadcrumbItems?: BreadcrumbItem[];
}

const DetailHeroSection = ({
  title,
  date,
  description,
  farewellDate,
  farewellPlace,
  image,
  imageAlt,
  pageTitle,
  breadcrumbItems,
}: Readonly<DetailHeroSectionProps>) => {
  const formattedBlogDate = formatBlogDate(date);
  const formattedFarewellDate = formatFarewellDate(farewellDate);

  // Determine if this is a blog post (has date or description) or reference (has farewellDate or farewellPlace)
  const isBlogPost = Boolean(date || description);
  const isReference = Boolean(farewellDate || farewellPlace);

  return (
    <section className='relative px-4 lg:px-14'>
      <LeavesAnimation />
      <Breadcrumbs
        pageTitle={pageTitle}
        items={breadcrumbItems}
      />
      <div className='max-w-dynamic-content mx-auto pt-18 lg:pt-[11.65rem]'>
        <div className={`relative z-10 flex flex-col ${isBlogPost ? 'gap-7.5' : 'gap-2.5'}`}>
          {/* Title */}
          <FormattedText
            text={title}
            as='h1'
          />

          {/* Blog Date */}
          {isBlogPost && formattedBlogDate && (
            <div className='mb-5 flex items-center gap-2'>
              <time
                dateTime={date}
                className='text-primary text-lg'
              >
                {formattedBlogDate}
              </time>
            </div>
          )}

          {/* Reference Farewell Date and Place */}
          {isReference && (formattedFarewellDate || farewellPlace) && (
            <div className='mb-12.5 flex flex-col gap-2'>
              {formattedFarewellDate && (
                <div className='flex items-center gap-2'>
                  <time
                    dateTime={farewellDate}
                    className='text-primary text-lg'
                  >
                    {formattedFarewellDate}
                  </time>
                </div>
              )}
              {farewellPlace && <p className='text-lg font-light'>{farewellPlace}</p>}
            </div>
          )}

          {/* Featured Image */}
          {image && (
            <div className={`bg-grey-warm w-full p-[8%] ${isBlogPost ? 'mb-12.5' : ''}`}>
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

        {/* Blog Description */}
        {isBlogPost && description && (
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

export default DetailHeroSection;
