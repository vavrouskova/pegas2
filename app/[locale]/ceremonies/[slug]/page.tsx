import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import Breadcrumbs from '@/components/_shared/Breadcrumbs';
import FooterClaim from '@/components/_shared/FooterClaim';
import LeavesImage from '@/components/_shared/LeavesImage';
import CeremonyActions from '@/components/ceremonies/CeremonyActions';
import CeremonyFlowerCTA from '@/components/ceremonies/CeremonyFlowerCTA';
import CeremonyGallery from '@/components/ceremonies/CeremonyGallery';
import { CEREMONIES, getCeremonyBySlug } from '@/data/ceremonies';
import { Link } from '@/i18n/routing';
import { formatCeremonyDateLong, formatCeremonyTime } from '@/utils/ceremonies/format';

interface CeremonyDetailParams {
  locale: string;
  slug: string;
}

interface CeremonyDetailPageProps {
  params: Promise<CeremonyDetailParams>;
}

export const generateStaticParams = async () =>
  CEREMONIES.map((ceremony) => ({ slug: ceremony.slug }));

export const generateMetadata = async ({
  params,
}: CeremonyDetailPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const ceremony = getCeremonyBySlug(slug);

  if (!ceremony) return { title: 'Kalendář obřadů | Pegas' };

  const fullName = `${ceremony.person.firstName} ${ceremony.person.lastName}`;

  if (ceremony.visibility === 'private') {
    return { title: `Neveřejné rozloučení – ${fullName} | Pegas` };
  }

  return {
    title: `Poslední rozloučení – ${fullName} | Pegas`,
    description: `${formatCeremonyDateLong(ceremony.startAt)}, ${ceremony.venue.name}, ${ceremony.venue.city}`,
  };
};

const CeremonyDetailPage = async ({ params }: CeremonyDetailPageProps) => {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const ceremony = getCeremonyBySlug(slug);
  if (!ceremony) notFound();

  const [tDetail, tCeremonies] = await Promise.all([
    getTranslations('ceremonies.detail'),
    getTranslations('ceremonies'),
  ]);
  const ceremoniesListTitle = tCeremonies('page-title');

  const fullName = `${ceremony.person.firstName} ${ceremony.person.lastName}`;
  const isPrivate = ceremony.visibility === 'private';
  const announcementParagraphs = ceremony.announcement.split('\n').filter(Boolean);

  const halfDonors = Math.ceil(ceremony.donors.length / 2);
  const donorsLeft = ceremony.donors.slice(0, halfDonors);
  const donorsRight = ceremony.donors.slice(halfDonors);

  return (
    <main className='max-w-container relative mx-auto'>
      <Breadcrumbs
        className='px-4 md:px-14'
        pageTitle={fullName}
        items={[{ label: ceremoniesListTitle, href: '/ceremonies' }]}
      />

      <section className='section-container relative pt-12'>
        <Link
          href='/ceremonies'
          className='font-text text-primary inline-flex items-center gap-2 text-sm underline underline-offset-4 hover:no-underline'
        >
          <ArrowRight className='size-4 rotate-180' />
          {tCeremonies('back-to-list')}
        </Link>

        <div className='mt-12 lg:mt-20'>
          <LeavesImage />
        </div>

        <div className='max-w-dynamic-content mx-auto flex flex-col items-start gap-10 pt-12 lg:pt-20'>
          <div className='bg-grey-warm flex aspect-square w-3/5 max-w-[17rem] items-center justify-center'>
            <div className='relative aspect-square w-3/5'>
              {ceremony.person.photo ? (
                <Image
                  src={ceremony.person.photo}
                  alt={fullName}
                  fill
                  sizes='(max-width: 1024px) 100vw, 400px'
                  className='object-cover'
                />
              ) : (
                <div className='bg-primary/10 absolute inset-0 flex items-center justify-center'>
                  <span className='font-heading text-primary/40 text-3xl'>
                    {ceremony.person.firstName[0]}
                    {ceremony.person.lastName[0]}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className='flex w-full flex-col gap-6'>
            <div className='flex flex-col gap-1'>
              <h1 className='font-heading text-primary text-3xl lg:text-4xl'>{fullName}</h1>
              {(ceremony.person.birthYear || ceremony.person.deathYear) && (
                <span className='font-text text-primary text-base'>
                  {ceremony.person.birthYear && ceremony.person.deathYear
                    ? `${ceremony.person.birthYear}–${ceremony.person.deathYear}`
                    : ceremony.person.birthYear || ceremony.person.deathYear}
                </span>
              )}
            </div>

            {isPrivate ? (
              <div className='border-primary/20 mt-4 flex flex-col gap-2 border-l-2 pl-4'>
                <p className='font-heading text-primary text-lg'>
                  {tCeremonies('status.private-card-prefix')}
                </p>
                <p className='font-text text-primary/80 text-base'>
                  {tCeremonies('status.private-card-note')}
                </p>
              </div>
            ) : (
              <>
                <div className='flex flex-col gap-1'>
                  <p className='font-text text-primary text-lg'>
                    {formatCeremonyDateLong(ceremony.startAt)},{' '}
                    {formatCeremonyTime(ceremony.startAt)}
                  </p>
                  <p className='font-text text-primary text-lg'>
                    {ceremony.venue.name}, {ceremony.venue.city}
                  </p>
                </div>

                <CeremonyActions ceremony={ceremony} />

                <div className='font-text text-primary mt-8 flex flex-col gap-4 text-base'>
                  {announcementParagraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                {ceremony.donors.length > 0 && (
                  <div className='mt-10 flex flex-col gap-4'>
                    <h2 className='font-heading text-primary text-base'>
                      {tDetail('donors-title')}
                    </h2>
                    <div className='grid grid-cols-1 gap-x-12 gap-y-2 lg:grid-cols-2'>
                      <ul className='font-text text-primary flex flex-col gap-1 text-base'>
                        {donorsLeft.map((donor) => (
                          <li key={donor.name}>· {donor.name}</li>
                        ))}
                      </ul>
                      <ul className='font-text text-primary flex flex-col gap-1 text-base'>
                        {donorsRight.map((donor) => (
                          <li key={donor.name}>· {donor.name}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {ceremony.gallery.length > 0 && (
                  <CeremonyGallery
                    items={ceremony.gallery}
                    ceremonySlug={ceremony.slug}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {ceremony.allowFlowers && <CeremonyFlowerCTA ceremony={ceremony} />}

      <FooterClaim />
    </main>
  );
};

export default CeremonyDetailPage;
