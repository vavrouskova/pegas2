'use client';

import Image from 'next/image';
import Link from 'next/link';

import { FormattedText } from '@/components/_shared/FormattedText';
import { cn } from '@/lib/utils';
import type { ZamestnanciPost } from '@/utils/wordpress-types';

interface ContactPeopleSectionProps {
  people: ZamestnanciPost[];
  title?: string;
}

interface PersonCardProps {
  person: ZamestnanciPost;
  className?: string;
}

const PersonCard = ({ person, className }: Readonly<PersonCardProps>) => {
  const { zamestnanciACF } = person;
  const imageUrl = zamestnanciACF?.profileImage?.node?.sourceUrl;
  const imageAlt = zamestnanciACF?.profileImage?.node?.altText || person.title || 'Contact person';
  const email = zamestnanciACF?.employeeEmail;

  return (
    <article className={cn('group flex h-full flex-col max-lg:max-w-[16.625rem]', className)}>
      <div className='relative aspect-square w-full overflow-hidden'>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
            className='object-cover'
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center bg-gray-200'>
            <span className='text-gray-400'>No image</span>
          </div>
        )}
      </div>
      <div className='flex flex-1 flex-col py-6'>
        {person.title && (
          <FormattedText
            text={person.title}
            as='h3'
            className='text-xl'
          />
        )}
        {zamestnanciACF?.positionDescription && (
          <FormattedText
            text={zamestnanciACF.positionDescription}
            as='p'
            className='text-primary text-lg'
          />
        )}
        {email && (
          <Link
            href={`mailto:${email}`}
            className='text-primary mt-5 text-lg underline hover:no-underline'
          >
            {email}
          </Link>
        )}
      </div>
    </article>
  );
};

const ContactPeopleSection = ({ people, title }: Readonly<ContactPeopleSectionProps>) => {
  if (people.length === 0) return null;

  return (
    <section className='section-container'>
      <div className='max-w-container mx-auto'>
        {title && (
          <FormattedText
            text={title}
            as='h2'
            className='mb-25 text-center'
          />
        )}

        <div className='flex flex-wrap justify-center gap-x-7.5 gap-y-12.5 lg:gap-7.5'>
          {people.map((person) => (
            <PersonCard
              key={person.id}
              person={person}
              className='w-full max-w-[15.75rem] min-w-[15.75rem]'
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactPeopleSection;
