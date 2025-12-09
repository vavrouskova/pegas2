import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { getBranchBySlug } from '@/api/wordpress-api';
import Breadcrumbs from '@/components/_shared/Breadcrumbs';
import { BranchConsultant } from '@/components/branches/BranchConsultant';
import { BranchContactInfo } from '@/components/branches/BranchContactInfo';
import { BranchHeader } from '@/components/branches/BranchHeader';
import { BranchImages } from '@/components/branches/BranchImages';
import { BranchLocation } from '@/components/branches/BranchLocation';
import { BranchOpeningHours } from '@/components/branches/BranchOpeningHours';

interface BranchDetailSectionProps {
  slug: string;
}

const BranchDetailSection = async ({ slug }: BranchDetailSectionProps) => {
  const t = await getTranslations();
  const branchData = await getBranchBySlug(slug);

  if (!branchData) {
    notFound();
  }

  const { title, pobockyACF, featuredImage } = branchData;

  // Extract data with fallbacks
  const city = pobockyACF?.city || '';
  const branchTitle = `${t('branches.branch')} ${title}`;
  const consultant = pobockyACF?.consultant?.nodes?.[0];

  // Prepare image data
  const internalImageNode = pobockyACF?.internalImage?.node;
  const externalImageNode = featuredImage?.node;

  const internalImage = internalImageNode
    ? { url: internalImageNode.sourceUrl, alt: internalImageNode.altText }
    : undefined;

  const externalImage = externalImageNode
    ? { url: externalImageNode.sourceUrl, alt: externalImageNode.altText }
    : undefined;

  return (
    <>
      <Breadcrumbs
        className='px-4 pb-23 lg:px-14'
        items={[
          {
            label: t('contacts.page-title'),
            href: `/${t('routes.contacts')}`,
          },
        ]}
        pageTitle={`${city}, ${branchTitle}`}
      />

      <section className='flex flex-col gap-12 px-4 py-12 lg:grid lg:grid-cols-20 lg:gap-0 lg:px-14 lg:py-20'>
        {/* Contact info - Order 1 on mobile */}
        <div className='order-1 flex flex-col gap-2.5 lg:col-span-12 lg:pr-25'>
          <BranchHeader
            city={city}
            branchTitle={branchTitle}
          />
          <BranchOpeningHours
            workingDays={pobockyACF?.openDaysWorking}
            weekendDays={pobockyACF?.openDaysWeekend}
          />
          <BranchContactInfo
            phoneNumber={pobockyACF?.phoneNumber}
            email={pobockyACF?.email}
          />
        </div>

        {/* Images - Order 2 on mobile, right column on desktop */}
        <BranchImages
          internalImage={internalImage}
          externalImage={externalImage}
        />

        {/* Consultant - Order 3 on mobile */}
        <BranchConsultant consultant={consultant} />

        {/* Location and features - Order 4 on mobile */}
        <BranchLocation
          visitUs={pobockyACF?.visitUs}
          parking={pobockyACF?.parking}
          wheelchairAccess={pobockyACF?.wheelchairAccess}
          whereToFindLabel={t('branches.where-to-find')}
          wheelchairAccessLabel={t('contacts.wheelchair-access')}
        />
      </section>
    </>
  );
};

export default BranchDetailSection;
