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
