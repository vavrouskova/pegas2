'use client';

import { FormattedText } from '@/components/_shared/FormattedText';
import PersonCard from '@/components/_shared/PersonCard';
import type { ZamestnanciPost } from '@/utils/wordpress-types';

interface ContactPeopleSectionProps {
  people: ZamestnanciPost[];
  title?: string;
}

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

        <div className='grid grid-cols-[repeat(auto-fill,minmax(15.75rem,15.75rem))] justify-center gap-x-7.5 gap-y-12.5 lg:gap-7.5'>
          {people.map((person) => (
            <PersonCard
              key={person.id}
              person={person}
              showEmail
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactPeopleSection;
