'use client';

import { LayoutGrid, List } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import CeremonyCard from '@/components/ceremonies/CeremonyCard';
import CeremonyListRow from '@/components/ceremonies/CeremonyListRow';
import Search from '@/components/icons/Search';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Ceremony } from '@/types/ceremony';
import { getCeremonyStatus } from '@/utils/ceremonies/status';

type FilterKey = 'all' | 'past';
type ViewMode = 'grid' | 'list';
type SortMode = 'date' | 'venue' | 'name';

const PAGE_SIZE = 25;

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
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortMode, setSortMode] = useState<SortMode>('date');

  const handleFilterClick = (key: FilterKey) => {
    if (key === activeFilter && key !== 'all') {
      setActiveFilter('all');
      return;
    }
    setActiveFilter(key);
    if (key === 'all') {
      setSearchQuery('');
      setSelectedDate('');
      setSelectedVenue('');
    }
  };

  const renderFilterButton = (key: FilterKey, label: string) => {
    const isActive =
      key === 'all'
        ? activeFilter === 'all' && !searchQuery && !selectedDate && !selectedVenue
        : activeFilter === key;
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
    ceremonies.forEach((ceremony) => {
      if (ceremony.visibility !== 'private') set.add(ceremony.venue.name);
    });
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
      const isPrivate = ceremony.visibility === 'private';

      if (activeFilter === 'past' && status !== 'past') return false;

      if (selectedVenue) {
        if (isPrivate) return false;
        if (ceremony.venue.name !== selectedVenue) return false;
      }

      if (selectedDate) {
        if (isPrivate) return false;
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

    const nowTime = now.getTime();
    const byDate = (a: Ceremony, b: Ceremony) => {
      const aTime = new Date(a.startAt).getTime();
      const bTime = new Date(b.startAt).getTime();
      const aPast = aTime < nowTime;
      const bPast = bTime < nowTime;
      if (aPast && !bPast) return 1;
      if (!aPast && bPast) return -1;
      if (aPast && bPast) return bTime - aTime;
      return aTime - bTime;
    };

    const byName = (a: Ceremony, b: Ceremony) => {
      const nameCmp = a.person.lastName.localeCompare(b.person.lastName, 'cs');
      if (nameCmp !== 0) return nameCmp;
      return a.person.firstName.localeCompare(b.person.firstName, 'cs');
    };
    const byVenue = (a: Ceremony, b: Ceremony) => {
      const venueCmp = a.venue.name.localeCompare(b.venue.name, 'cs');
      if (venueCmp !== 0) return venueCmp;
      return byDate(a, b);
    };
    const comparator = sortMode === 'name' ? byName : sortMode === 'venue' ? byVenue : byDate;

    const publicList = list.filter((c) => c.visibility !== 'private');
    const privateList = list.filter((c) => c.visibility === 'private');
    publicList.sort(comparator);
    privateList.sort(byName);
    return [...publicList, ...privateList];
  }, [ceremonies, activeFilter, searchQuery, selectedDate, selectedVenue, sortMode]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageEnd = Math.min(pageStart + PAGE_SIZE, filtered.length);
  const pagedItems = filtered.slice(pageStart, pageEnd);

  useEffect(() => {
    setPage(1);
  }, [activeFilter, searchQuery, selectedDate, selectedVenue, sortMode]);

  return (
    <section className='section-container pt-0! lg:pt-0!'>
      <div
        data-hide-sticky
        className='mb-10 flex flex-wrap items-center gap-2'
      >
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
        <Select
          value={selectedVenue || 'all'}
          onValueChange={(value) => setSelectedVenue(value === 'all' ? '' : value)}
        >
          <SelectTrigger className='lg:min-w-[220px]'>
            <SelectValue placeholder={t('filters.venue-placeholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>{t('filters.venue-placeholder')}</SelectItem>
            {venues.map((venue) => (
              <SelectItem
                key={venue}
                value={venue}
              >
                {venue}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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

      <div className='mb-6 flex items-center justify-end gap-2'>
        <Select
          value={sortMode}
          onValueChange={(value) => setSortMode(value as SortMode)}
        >
          <SelectTrigger
            aria-label={t('filters.sort-label')}
            className='justify-end bg-transparent lg:min-w-[180px]'
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='date'>{t('filters.sort-date')}</SelectItem>
            <SelectItem value='venue'>{t('filters.sort-venue')}</SelectItem>
            <SelectItem value='name'>{t('filters.sort-name')}</SelectItem>
          </SelectContent>
        </Select>
        <button
          type='button'
          onClick={() => setViewMode('grid')}
          aria-label={t('view.grid')}
          aria-pressed={viewMode === 'grid'}
          className={cn(
            'flex h-[36px] w-[36px] items-center justify-center transition-opacity duration-300 hover:opacity-70',
            viewMode === 'grid' ? 'bg-primary text-white-smoke' : 'bg-white text-primary'
          )}
        >
          <LayoutGrid className='size-4' />
        </button>
        <button
          type='button'
          onClick={() => setViewMode('list')}
          aria-label={t('view.list')}
          aria-pressed={viewMode === 'list'}
          className={cn(
            'flex h-[36px] w-[36px] items-center justify-center transition-opacity duration-300 hover:opacity-70',
            viewMode === 'list' ? 'bg-primary text-white-smoke' : 'bg-white text-primary'
          )}
        >
          <List className='size-4' />
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className='font-text text-primary py-12 text-center'>{t('empty')}</p>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className='grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-8 lg:gap-y-14'>
              {pagedItems.map((ceremony) => (
                <CeremonyCard
                  key={ceremony.slug}
                  ceremony={ceremony}
                />
              ))}
            </div>
          ) : (
            <ul className='border-primary/10 flex flex-col border-t'>
              {pagedItems.map((ceremony) => (
                <li
                  key={ceremony.slug}
                  className='border-primary/10 border-b'
                >
                  <CeremonyListRow ceremony={ceremony} />
                </li>
              ))}
            </ul>
          )}

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
