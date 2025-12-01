import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { getBranchBySlug } from '@/api/wordpress-api';
import ContactForm from '@/components/forms/contact/ContactForm';
import FooterClaim from '@/components/_shared/FooterClaim';

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
  const city = pobockyACF?.city || '';
  const phoneNumber = pobockyACF?.phoneNumber || '';
  const openDaysWorking = pobockyACF?.openDaysWorking || '';
  const openDaysWeekend = pobockyACF?.openDaysWeekend || '';
  const parking = pobockyACF?.parking;
  const wheelchairAccess = pobockyACF?.wheelchairAccess;
  const internalImage = pobockyACF?.internalImage?.node?.sourceUrl;
  const internalImageAlt = pobockyACF?.internalImage?.node?.altText || '';
  const externalImage = featuredImage?.node?.sourceUrl;
  const externalImageAlt = featuredImage?.node?.altText || '';

  return (
      <section className='grid grid-cols-1 gap-8 px-4 py-12 lg:grid-cols-2 lg:gap-12 lg:px-14 lg:py-20'>
        {/* Left column - Branch info */}
        <div className='space-y-8'>
          <div>
            <h1 className='mb-2 text-4xl font-bold'>{title}</h1>
            <p className='text-xl text-gray-600'>{city}</p>
          </div>

          {/* Opening hours */}
          <div>
            <h2 className='mb-3 text-xl font-semibold'>{t('contacts.opening-hours')}</h2>
            <div className='space-y-2'>
              {openDaysWorking && <p className='text-gray-700'>{openDaysWorking}</p>}
              {openDaysWeekend && <p className='text-gray-700'>{openDaysWeekend}</p>}
            </div>
          </div>

          {/* Contact */}
          {phoneNumber && (
            <div>
              <h2 className='mb-3 text-xl font-semibold'>{t('contacts.phone')}</h2>
              <a
                href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                className='text-lg text-primary hover:underline'
              >
                {phoneNumber}
              </a>
            </div>
          )}

          {/* Features */}
          {(parking || wheelchairAccess) && (
            <div className='flex gap-6'>
              {parking && (
                <div className='flex items-center gap-2'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
                    <span className='text-lg'>P</span>
                  </div>
                  <span className='text-sm text-gray-600'>{parking}</span>
                </div>
              )}
              {wheelchairAccess && (
                <div className='flex items-center gap-2'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
                    <span className='text-lg'>♿</span>
                  </div>
                  <span className='text-sm text-gray-600'>{t('contacts.wheelchair-access')}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right column - Images */}
        <div className='space-y-4'>
          {internalImage && (
            <div className='aspect-video overflow-hidden rounded-lg'>
              <img
                src={internalImage}
                alt={internalImageAlt}
                className='h-full w-full object-cover'
              />
            </div>
          )}
          <div className='grid grid-cols-2 gap-4'>
            {externalImage && (
              <div className='aspect-square overflow-hidden rounded-lg'>
                <img
                  src={externalImage}
                  alt={externalImageAlt}
                  className='h-full w-full object-cover'
                />
              </div>
            )}
            {/* Map placeholder - můžeš přidat mapu zde */}
            <div className='aspect-square overflow-hidden rounded-lg bg-gray-200'>
              {/* TODO: Add map component */}
            </div>
          </div>
        </div>
      </section>

  );
};

export default BranchDetailSection;
