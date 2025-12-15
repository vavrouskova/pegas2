import type { IFuseOptions } from 'fuse.js';

import { SearchableItem } from '@/utils/search-types';

export const FUSE_OPTIONS: IFuseOptions<SearchableItem> = {
  keys: [
    { name: 'title', weight: 2 },
    { name: 'content', weight: 1 },
  ],
  threshold: 0.3,
  ignoreLocation: true,
  minMatchCharLength: 2,
  includeScore: true,
  includeMatches: true,
};

export const SEARCH_DEBOUNCE_MS = 300;

export const POST_TYPE_LABELS: Record<string, string> = {
  page: 'Stránky',
  post: 'Články',
  sluzbyPost: 'Služby',
  referencePost: 'Reference',
  pobockaPost: 'Pobočky',
  postupPost: 'Jak postupovat',
};
