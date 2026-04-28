export const CZECH_MONTHS_GENITIVE = [
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

export const formatCzechDate = (iso: string): string | null => {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return null;
  return `${d}. ${CZECH_MONTHS_GENITIVE[m - 1]} ${y}`;
};

export const buildDatesString = (birthIso: string, deathIso: string): string => {
  const birth = formatCzechDate(birthIso);
  const death = formatCzechDate(deathIso);
  if (birth && death) return `* ${birth}    † ${death}`;
  if (birth) return `* ${birth}`;
  if (death) return `† ${death}`;
  return '';
};
