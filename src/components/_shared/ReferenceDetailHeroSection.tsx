import Image from 'next/image';

import Breadcrumbs from '@/components/_shared/Breadcrumbs';
import { FormattedText } from '@/components/_shared/FormattedText';
import LeavesAnimation from '@/components/_shared/LeavesAnimation';
import { formatFarewellDate } from '@/utils/helper';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ReferenceDetailHeroSectionProps {
  title: string;
  farewellDate?: string;
  farewellPlace?: string;
  image?: string;
  imageAlt: string;
  pageTitle: string;
  breadcrumbItems?: BreadcrumbItem[];
}

const ReferenceDetailHeroSection = ({
  title,
  farewellDate,
  farewellPlace,
  image,
  imageAlt,
  pageTitle,
  breadcrumbItems,
}: Readonly<ReferenceDetailHeroSectionProps>) => {
  const formattedDate = formatFarewellDate(farewellDate);

  return (
    <section className='relative px-4 lg:px-14'>
      <LeavesAnimation />
      <Breadcrumbs
        pageTitle={pageTitle}
        items={breadcrumbItems}
      />
      <div className='max-w-dynamic-content mx-auto pt-18 lg:pt-[11.65rem]'>
        <div className='relative z-10 flex flex-col gap-2.5'>
          {/* Title */}
          <FormattedText
            text={title}
            as='h1'
          />

          {/* Farewell Place and Date */}
          <div className='mb-12.5 flex flex-col gap-2'>
            {formattedDate && (
              <div className='flex items-center gap-2'>
                <time
                  dateTime={farewellDate}
                  className='text-primary text-lg'
                >
                  {formattedDate}
                </time>
              </div>
            )}
            {farewellPlace && <p className='text-primary text-lg font-light'>{farewellPlace}</p>}
          </div>

          {/* Featured Image */}
          {image && (
            <div className='bg-grey-warm w-full p-[8%]'>
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
      </div>
    </section>
  );
};

export default ReferenceDetailHeroSection;
