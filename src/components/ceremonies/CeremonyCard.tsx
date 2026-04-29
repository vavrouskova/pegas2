import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import { Ceremony } from '@/types/ceremony';
import { formatCeremonyDate } from '@/utils/ceremonies/format';
import { getCeremonyStatus } from '@/utils/ceremonies/status';

interface CeremonyCardProps {
  ceremony: Ceremony;
}

const CeremonyCard = ({ ceremony }: CeremonyCardProps) => {
  const t = useTranslations('routes');
  const tCeremonies = useTranslations('ceremonies');
  const status = getCeremonyStatus(ceremony);
  const fullName = `${ceremony.person.firstName} ${ceremony.person.lastName}`;
  const start = new Date(ceremony.startAt);
  const time = `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}`;
  const formattedDate = formatCeremonyDate(ceremony.startAt);
  const isPast = status === 'past';
  const href = `/${t('ceremonies')}/${ceremony.slug}`;

  return (
    <Link
      href={href}
      className='group flex flex-col gap-3 transition-opacity duration-300 hover:opacity-80'
    >
      <div className='bg-grey-warm relative aspect-square overflow-hidden p-[20%]'>
        {ceremony.person.photo ? (
          <div className='relative h-full w-full'>
            <Image
              src={ceremony.person.photo}
              alt={fullName}
              fill
              sizes='(max-width: 1024px) 50vw, 25vw'
              className={cn('object-cover', status === 'past' && 'grayscale')}
            />
          </div>
        ) : (
          <div className='flex h-full w-full items-center justify-center'>
            <span className='font-heading text-primary text-3xl tracking-tight lg:text-4xl'>
              {ceremony.person.firstName[0]}
              {ceremony.person.lastName[0]}
            </span>
          </div>
        )}

        <div
          aria-hidden='true'
          className='bg-primary pointer-events-none absolute top-[13%] left-[13%] h-[6.4%] w-[48%] -translate-x-1/2 -translate-y-1/2 rotate-[-45deg]'
        />
      </div>

      <span className='font-heading text-primary text-base leading-tight'>{fullName}</span>
      <div className='flex flex-col'>
        <span className='font-text text-sm leading-tight'>
          {isPast ? (
            <>
              <span
                className='font-heading block lg:inline'
                style={{ fontSize: 'inherit' }}
              >
                {tCeremonies('status.past-card-prefix')}
              </span>{' '}
              {formattedDate}
            </>
          ) : (
            `${formattedDate} · ${time}`
          )}
        </span>
        <span className='font-text text-sm leading-tight mt-1'>{ceremony.venue.name}</span>
      </div>
    </Link>
  );
};

export default CeremonyCard;
