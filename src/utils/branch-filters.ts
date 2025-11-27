import type { PobockaPost } from '@/utils/wordpress-types';

/**
 * Type definition for branch filter function
 */
export type BranchFilterFn = (branch: PobockaPost) => boolean;

/**
 * Filter branches that have showroom
 */
export const filterShowroomBranches: BranchFilterFn = (branch) => {
  return branch.pobockyACF?.showRoom === true;
};

/**
 * Filter branches that are open on weekends and holidays
 */
export const filterWeekendBranches: BranchFilterFn = (branch) => {
  return branch.pobockyACF?.openSwitcher === true;
};

/**
 * Filter that returns all branches (no filtering)
 */
export const filterAllBranches: BranchFilterFn = () => {
  return true;
};

/**
 * Compose multiple filters with AND logic
 */
export const composeFilters = (...filters: BranchFilterFn[]): BranchFilterFn => {
  return (branch: PobockaPost) => filters.every((filter) => filter(branch));
};

/**
 * Compose multiple filters with OR logic
 */
export const composeFiltersOr = (...filters: BranchFilterFn[]): BranchFilterFn => {
  return (branch: PobockaPost) => filters.some((filter) => filter(branch));
};
