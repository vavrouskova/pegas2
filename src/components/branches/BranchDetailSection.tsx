import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getBranchBySlug } from '@/api/wordpress-api';
import Breadcrumbs from '@/components/_shared/Breadcrumbs';
import { FormattedText } from '@/components/_shared/FormattedText';
import Parking from '@/components/icons/Parking';
import WheelChair from '@/components/icons/WheelChair';

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
  const visitUs = pobockyACF?.visitUs;
  const wheelchairAccess = pobockyACF?.wheelchairAccess;
  const internalImage = pobockyACF?.internalImage?.node?.sourceUrl;
  const internalImageAlt = pobockyACF?.internalImage?.node?.altText || '';
  const externalImage = featuredImage?.node?.sourceUrl;
  const externalImageAlt = featuredImage?.node?.altText || '';
  const consultant = pobockyACF?.consultant?.nodes?.[0];
  const email = pobockyACF?.email;

  return (
    <>
      <Breadcrumbs
        className='pb-23'
        items={[
          {
            label: t('contacts.page-title'),
            href: `/${t('routes.contacts')}`,
          },
        ]}
        pageTitle={`${city}, ${t('branches.branch')} ${title}`}
      />
      <section className='grid grid-cols-1 px-4 py-12 lg:grid-cols-20 lg:px-14 lg:py-20'>
        {/* Left column - Branch info */}
        <div className='col-span-12 flex flex-col gap-20 lg:pr-25'>
          <div className='flex flex-col gap-2.5'>
            <h1 className='flex flex-col'>
              <FormattedText
                text={city}
                as='span'
                className='font-heading text-primary text-2xl leading-[150%]'
              />
              <FormattedText
                text={`${t('branches.branch')} ${title}`}
                as='span'
                className='font-heading text-primary text-2xl leading-[150%]'
              />
            </h1>
            {/* Opening hours */}
            <div>
              {openDaysWorking && (
                <FormattedText
                  text={openDaysWorking}
                  as='p'
                />
              )}
              {openDaysWeekend && (
                <FormattedText
                  text={openDaysWeekend}
                  as='p'
                />
              )}
            </div>
            {/* Contact */}
            {phoneNumber && (
              <div>
                <Link
                  href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                  className='text-primary text-lg underline hover:no-underline'
                >
                  {phoneNumber}
                </Link>
              </div>
            )}
            {email && (
              <div>
                <Link
                  href={`mailto:${email}`}
                  className='text-primary text-lg underline hover:no-underline'
                >
                  {email}
                </Link>
              </div>
            )}
          </div>

          {/* Consultant */}
          {consultant && (
            <div className='flex items-center gap-7.5'>
              {consultant.zamestnanciACF?.profileImage?.node && (
                <div className='shrink-0'>
                  <Image
                    src={consultant.zamestnanciACF.profileImage.node.sourceUrl}
                    alt={consultant.zamestnanciACF.profileImage.node.altText}
                    width={120}
                    height={120}
                    className='aspect-square object-cover'
                  />
                </div>
              )}
              <div className='flex flex-col'>
                {consultant.title && (
                  <FormattedText
                    text={consultant.title}
                    as='p'
                    className='font-heading text-primary text-xl'
                  />
                )}
                {consultant.zamestnanciACF?.positionDescription && (
                  <FormattedText
                    text={consultant.zamestnanciACF.positionDescription}
                    as='p'
                    className='text-primary'
                  />
                )}
              </div>
            </div>
          )}

          <div>
            {visitUs && (
              <div className='mb-8'>
                <FormattedText
                  text={t('branches.where-to-find')}
                  as='p'
                  className='text-primary font-heading text-lg'
                />
                <FormattedText
                  text={visitUs}
                  as='p'
                  className='text-primary text-lg'
                />
              </div>
            )}
            {/* Features */}
            {(parking || wheelchairAccess) && (
              <div className='flex flex-col gap-4'>
                {parking && (
                  <div className='flex items-center gap-2'>
                    <Parking className='size-9' />
                    <span className='text-primary text-lg'>{parking}</span>
                  </div>
                )}
                {wheelchairAccess && (
                  <div className='flex items-center gap-2'>
                    <WheelChair className='size-9' />
                    <span className='text-primary text-lg'>{t('contacts.wheelchair-access')}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right column - Images */}
        <div className='col-span-8 flex flex-col gap-8'>
          {internalImage && (
            <div className='aspect-square overflow-hidden'>
              <Image
                src={internalImage}
                alt={internalImageAlt}
                width={100}
                height={100}
                className='h-full w-full object-cover'
              />
            </div>
          )}
          <div className='grid grid-cols-2 gap-8'>
            {externalImage && (
              <div className='aspect-square overflow-hidden'>
                <Image
                  src={externalImage}
                  alt={externalImageAlt}
                  width={100}
                  height={100}
                  className='h-full w-full object-cover'
                />
              </div>
            )}
            {/* Map placeholder - můžeš přidat mapu zde */}
            <div className='aspect-square overflow-hidden bg-gray-200'></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BranchDetailSection;
