import type { PobockaPost } from '@/utils/wordpress-types';

/**
 * Type definition for branch filter function
 */
// eslint-disable-next-line no-unused-vars
export type BranchFilterFunction = (branch: PobockaPost) => boolean;

/**
 * Filter branches that have showroom
 */
export const filterShowroomBranches: BranchFilterFunction = (branch) => {
  return branch.pobockyACF?.showRoom === true;
};

/**
 * Filter branches that are open on weekends and holidays
 */
export const filterWeekendBranches: BranchFilterFunction = (branch) => {
  return branch.pobockyACF?.openSwitcher === true;
};

/**
 * Filter that returns all branches (no filtering)
 */
export const filterAllBranches: BranchFilterFunction = () => {
  return true;
};

/**
 * Compose multiple filters with AND logic
 */
export const composeFilters = (...filters: BranchFilterFunction[]): BranchFilterFunction => {
  return (branch: PobockaPost) => filters.every((filter) => filter(branch));
};

/**
 * Compose multiple filters with OR logic
 */
export const composeFiltersOr = (...filters: BranchFilterFunction[]): BranchFilterFunction => {
  return (branch: PobockaPost) => filters.some((filter) => filter(branch));
};

/**
 * Sort branches by city (Praha districts first by number, then other cities alphabetically)
 * and by title within the same city
 */
export const sortBranches = (branches: PobockaPost[]): PobockaPost[] => {
  return [...branches].sort((a, b) => {
    const cityA = a.pobockyACF?.city ?? '';
    const cityB = b.pobockyACF?.city ?? '';

    const prahaMatchA = cityA.match(/^Praha\s+(\d+)$/i);
    const prahaMatchB = cityB.match(/^Praha\s+(\d+)$/i);

    const isPrahaA = prahaMatchA !== null;
    const isPrahaB = prahaMatchB !== null;

    // Praha cities first, non-Praha at the end
    if (isPrahaA && !isPrahaB) return -1;
    if (!isPrahaA && isPrahaB) return 1;

    // Both are Praha - sort by district number
    if (isPrahaA && isPrahaB) {
      const numA = parseInt(prahaMatchA[1], 10);
      const numB = parseInt(prahaMatchB[1], 10);
      if (numA !== numB) return numA - numB;
    }

    // Both are non-Praha or same Praha district - sort by city name then title
    const cityCompare = cityA.localeCompare(cityB, 'cs');
    if (cityCompare !== 0) return cityCompare;
    return (a.title ?? '').localeCompare(b.title ?? '', 'cs');
  });
};
