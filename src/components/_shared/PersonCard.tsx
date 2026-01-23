import Image from 'next/image';
import Link from 'next/link';

import { FormattedText } from '@/components/_shared/FormattedText';
import { cn } from '@/lib/utils';
import type { ZamestnanciPost } from '@/utils/wordpress-types';

interface PersonCardProps {
  person: ZamestnanciPost;
  className?: string;
  showQuote?: boolean;
  showEmail?: boolean;
}

const PersonCard = ({ person, className, showQuote = false, showEmail = false }: Readonly<PersonCardProps>) => {
  const { zamestnanciACF } = person;
  const imageUrl = zamestnanciACF?.profileImage?.node?.sourceUrl;
  const imageAlt = zamestnanciACF?.profileImage?.node?.altText || person.title || 'Person';
  const email = zamestnanciACF?.employeeEmail;
  const quote = zamestnanciACF?.employeeQuote;

  return (
    <article className={cn('group flex h-full flex-col', className)}>
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
          <Image
            src='/images/placeholder.webp'
            alt={imageAlt}
            fill
            sizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
            className='object-cover'
          />
        )}
      </div>
      <div className='flex flex-1 flex-col bg-white px-3.5 py-6'>
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
            className='text-lg leading-[145%]'
          />
        )}
        {showQuote && quote && <p className='mt-7.5 text-sm tracking-[0.03125rem] italic'>&bdquo;{quote}&ldquo;</p>}
        {showEmail && email && (
          <Link
            href={`mailto:${email}`}
            className='mt-5 text-xs break-all underline hover:no-underline'
          >
            {email}
          </Link>
        )}
      </div>
    </article>
  );
};

export default PersonCard;
