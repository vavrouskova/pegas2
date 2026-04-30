const MONTHS_GENITIVE = [
  'ledna',
  'února',
  'března',
  'dubna',
  'května',
  'června',
  'července',
  'srpna',
  'září',
  'října',
  'listopadu',
  'prosince',
];

const WEEKDAYS_SHORT = ['NE', 'PO', 'ÚT', 'ST', 'ČT', 'PÁ', 'SO'];

export const formatCeremonyDate = (iso: string): string => {
  const date = new Date(iso);
  const day = WEEKDAYS_SHORT[date.getDay()];
  return `${day} · ${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`;
};

export const formatCeremonyDateLong = (iso: string): string => {
  const date = new Date(iso);
  return `${date.getDate()}. ${MONTHS_GENITIVE[date.getMonth()]} ${date.getFullYear()}`;
};

export const formatCeremonyDateLongWithWeekday = (iso: string): string => {
  const date = new Date(iso);
  const day = WEEKDAYS_SHORT[date.getDay()];
  return `${day} · ${date.getDate()}. ${MONTHS_GENITIVE[date.getMonth()]} ${date.getFullYear()}`;
};

export const getCeremonyWeekday = (iso: string): string => {
  const date = new Date(iso);
  return WEEKDAYS_SHORT[date.getDay()];
};

export const formatCeremonyTime = (iso: string): string => {
  const date = new Date(iso);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes} hod.`;
};

export const formatPersonYears = (birthYear?: number, deathYear?: number): string => {
  if (birthYear && deathYear) return `${birthYear}–${deathYear}`;
  if (birthYear) return `${birthYear}`;
  return '';
};
