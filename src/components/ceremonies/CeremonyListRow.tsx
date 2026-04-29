'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { Ceremony } from '@/types/ceremony';
import { formatCeremonyDate, formatPersonYears } from '@/utils/ceremonies/format';
import { getCeremonyStatus } from '@/utils/ceremonies/status';

interface CeremonyListRowProps {
  ceremony: Ceremony;
}

const CeremonyListRow = ({ ceremony }: CeremonyListRowProps) => {
  const t = useTranslations('ceremonies');
  const tRoutes = useTranslations('routes');
  const start = new Date(ceremony.startAt);
  const time = `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}`;
  const date = formatCeremonyDate(ceremony.startAt);
  const status = getCeremonyStatus(ceremony);
  const isPast = status === 'past';
  const isPrivate = ceremony.visibility === 'private';
  const fullName = `${ceremony.person.firstName} ${ceremony.person.lastName}`;
  const years = formatPersonYears(ceremony.person.birthYear, ceremony.person.deathYear);

  let statusLabel = '';
  if (isPrivate) statusLabel = t('status.private-card-prefix');
  else if (isPast) statusLabel = t('status.past-card-prefix');

  const content = (
    <>
      <span className='font-text text-primary order-2 w-full text-sm lg:order-1 lg:w-56 lg:shrink-0 lg:whitespace-nowrap'>
        {isPrivate ? '—' : `${date} · ${time}`}
      </span>
      <span className='order-1 flex flex-1 flex-wrap items-baseline gap-x-2 lg:order-2'>
        <span className='font-heading text-primary text-base'>{fullName}</span>
        {years && <span className='font-text text-primary text-xs'>{years}</span>}
      </span>
      <span
        className={cn(
          'font-text order-3 text-sm lg:w-56 lg:shrink-0 lg:whitespace-nowrap',
          isPrivate ? 'text-primary/70' : 'text-primary'
        )}
      >
        {isPrivate ? t('status.private-card-note') : ceremony.venue.name}
      </span>
      <span
        className={cn(
          'font-heading text-primary order-4 text-sm lg:w-32 lg:shrink-0 lg:whitespace-nowrap',
          !isPast && !isPrivate && 'max-lg:hidden'
        )}
      >
        {statusLabel}
      </span>
    </>
  );

  if (isPrivate) {
    return (
      <div className='flex flex-col gap-1 px-3 py-2.5 lg:flex-row lg:items-center lg:gap-6 lg:px-4'>{content}</div>
    );
  }

  return (
    <Link
      href={`/${tRoutes('ceremonies')}/${ceremony.slug}` as never}
      className='hover:bg-primary/[0.03] flex flex-col gap-1 px-3 py-2.5 transition-colors lg:flex-row lg:items-center lg:gap-6 lg:px-4'
    >
      {content}
    </Link>
  );
};

export default CeremonyListRow;
