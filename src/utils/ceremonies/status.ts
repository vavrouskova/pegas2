import { Ceremony, CeremonyStatus } from '@/types/ceremony';

export const getCeremonyStatus = (ceremony: Ceremony, now: Date = new Date()): CeremonyStatus => {
  const start = new Date(ceremony.startAt).getTime();
  const end = new Date(ceremony.endAt).getTime();
  const current = now.getTime();

  if (current < start) return 'upcoming';
  if (current >= start && current <= end) return 'ongoing';
  return 'past';
};

export const isThisWeek = (ceremony: Ceremony, now: Date = new Date()): boolean => {
  const start = new Date(ceremony.startAt);
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  return start >= startOfWeek && start < endOfWeek;
};
