'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import CeremonyCard from '@/components/ceremonies/CeremonyCard';
import Search from '@/components/icons/Search';
import { cn } from '@/lib/utils';
import { Ceremony } from '@/types/ceremony';
import { getCeremonyStatus } from '@/utils/ceremonies/status';

type FilterKey = 'all' | 'past';

const PAGE_SIZE = 10;

interface CeremoniesListSectionProps {
  ceremonies: Ceremony[];
}

const CeremoniesListSection = ({ ceremonies }: CeremoniesListSectionProps) => {
  const t = useTranslations('ceremonies');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedVenue, setSelectedVenue] = useState('');
  const [page, setPage] = useState(1);

  const handleFilterClick = (key: FilterKey) => {
    setActiveFilter(key);
    if (key === 'all') {
      setSearchQuery('');
      setSelectedDate('');
      setSelectedVenue('');
    }
  };

  const renderFilterButton = (key: FilterKey, label: string) => {
    const isActive = activeFilter === key;
    return (
      <button
        key={key}
        type='button'
        onClick={() => handleFilterClick(key)}
        className={cn(
          'box-border flex max-h-[40px] shrink-0 items-center justify-center px-3 py-[10px] transition-opacity duration-300 hover:opacity-70',
          isActive ? 'bg-primary' : 'bg-white'
        )}
      >
        <span
          className={cn(
            'text-sm whitespace-pre',
            isActive ? 'font-heading text-white-smoke' : 'font-text text-primary'
          )}
        >
          {label}
        </span>
      </button>
    );
  };

  const venues = useMemo(() => {
    const set = new Set<string>();
    ceremonies.forEach((ceremony) => set.add(ceremony.venue.name));
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'cs'));
  }, [ceremonies]);

  const toYmd = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const dateShortcuts = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return [
      { key: 'today', label: t('filters.today'), value: toYmd(today) },
      { key: 'tomorrow', label: t('filters.tomorrow'), value: toYmd(tomorrow) },
    ];
  }, [t]);

  const filtered = useMemo(() => {
    const now = new Date();
    const query = searchQuery.trim().toLowerCase();

    const list = ceremonies.filter((ceremony) => {
      const status = getCeremonyStatus(ceremony, now);

      if (activeFilter === 'past' && status !== 'past') return false;

      if (selectedVenue && ceremony.venue.name !== selectedVenue) return false;

      if (selectedDate) {
        const ceremonyDate = new Date(ceremony.startAt);
        const ymd = `${ceremonyDate.getFullYear()}-${String(ceremonyDate.getMonth() + 1).padStart(2, '0')}-${String(ceremonyDate.getDate()).padStart(2, '0')}`;
        if (ymd !== selectedDate) return false;
      }

      if (query) {
        const fullName = `${ceremony.person.firstName} ${ceremony.person.lastName}`.toLowerCase();
        if (!fullName.includes(query)) return false;
      }

      return true;
    });

    return [...list].sort(
      (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
    );
  }, [ceremonies, activeFilter, searchQuery, selectedDate, selectedVenue]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageEnd = Math.min(pageStart + PAGE_SIZE, filtered.length);
  const pagedItems = filtered.slice(pageStart, pageEnd);

  useEffect(() => {
    setPage(1);
  }, [activeFilter, searchQuery, selectedDate, selectedVenue]);

  return (
    <section className='section-container pt-0! lg:pt-0!'>
      <div
        data-hide-sticky
        className='mb-10 flex flex-col gap-3'
      >
        <div className='flex flex-wrap items-center gap-2'>
          {renderFilterButton('all', t('filters.all'))}
          {dateShortcuts.map((shortcut) => {
            const isActive = selectedDate === shortcut.value;
            return (
              <button
                key={shortcut.key}
                type='button'
                onClick={() => setSelectedDate(isActive ? '' : shortcut.value)}
                className={cn(
                  'box-border flex max-h-[40px] shrink-0 items-center justify-center px-3 py-[10px] transition-opacity duration-300 hover:opacity-70',
                  isActive ? 'bg-primary' : 'bg-white'
                )}
              >
                <span
                  className={cn(
                    'text-sm whitespace-pre',
                    isActive ? 'font-heading text-white-smoke' : 'font-text text-primary'
                  )}
                >
                  {shortcut.label}
                </span>
              </button>
            );
          })}
          <input
            type='date'
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            placeholder={t('filters.date-placeholder')}
            className='text-primary h-[40px] border-none bg-white px-3 text-sm outline-none lg:max-w-[220px]'
          />
          <label className='relative flex h-[40px] min-w-[200px] flex-1 items-center gap-2 bg-white px-3 lg:max-w-md'>
            <Search className='text-primary size-[19px] shrink-0' />
            <input
              type='text'
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t('filters.search-placeholder')}
              className='text-primary placeholder:text-primary/60 min-w-0 flex-1 border-none bg-transparent text-sm outline-none'
            />
          </label>
          {renderFilterButton('past', t('filters.past'))}
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <select
            value={selectedVenue}
            onChange={(event) => setSelectedVenue(event.target.value)}
            className='text-primary h-[40px] border-none bg-white px-3 text-sm outline-none lg:max-w-[260px]'
          >
            <option value=''>{t('filters.venue-placeholder')}</option>
            {venues.map((venue) => (
              <option
                key={venue}
                value={venue}
              >
                {venue}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className='font-text text-primary py-12 text-center'>{t('empty')}</p>
      ) : (
        <>
          <div className='grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-5 lg:gap-x-8 lg:gap-y-14'>
            {pagedItems.map((ceremony) => (
              <CeremonyCard
                key={ceremony.slug}
                ceremony={ceremony}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className='mt-10 flex flex-wrap items-center justify-between gap-4 lg:mt-14'>
              <span className='font-text text-primary text-sm'>
                {t('pagination.showing', {
                  from: pageStart + 1,
                  to: pageEnd,
                  total: filtered.length,
                })}
              </span>
              <div className='flex items-center gap-2'>
                <button
                  type='button'
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className='font-text text-primary box-border flex h-[40px] items-center justify-center bg-white px-3 text-sm transition-opacity duration-300 hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40'
                >
                  {t('pagination.prev')}
                </button>
                <span className='font-text text-primary px-2 text-sm'>
                  {t('pagination.page', { current: currentPage, total: totalPages })}
                </span>
                <button
                  type='button'
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className='font-text text-primary box-border flex h-[40px] items-center justify-center bg-white px-3 text-sm transition-opacity duration-300 hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40'
                >
                  {t('pagination.next')}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default CeremoniesListSection;
