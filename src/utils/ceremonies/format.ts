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

export const formatCeremonyDate = (iso: string): string => {
  const date = new Date(iso);
  return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`;
};

export const formatCeremonyDateLong = (iso: string): string => {
  const date = new Date(iso);
  return `${date.getDate()}. ${MONTHS_GENITIVE[date.getMonth()]} ${date.getFullYear()}`;
};

export const formatCeremonyTime = (iso: string): string => {
  const date = new Date(iso);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours}:${String(minutes).padStart(2, '0')} hod.`;
};

export const formatPersonYears = (birthYear?: number, deathYear?: number): string => {
  if (birthYear && deathYear) return `(${birthYear}–${deathYear})`;
  if (birthYear) return `(${birthYear})`;
  return '';
};
