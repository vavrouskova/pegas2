import type { FuseResultMatch } from 'fuse.js';

export type SearchPostType = 'post' | 'sluzbyPost' | 'referencePost' | 'pobockaPost' | 'postupPost' | 'page';

export interface SearchableItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  postType: SearchPostType;
  url: string;
}

export interface SearchResult {
  item: SearchableItem;
  score?: number;
  matches?: readonly FuseResultMatch[];
}

export interface GroupedSearchResults {
  pages: SearchResult[];
  posts: SearchResult[];
  services: SearchResult[];
  references: SearchResult[];
  branches: SearchResult[];
  procedures: SearchResult[];
}

export interface SearchContextType {
  isOpen: boolean;
  query: string;
  results: GroupedSearchResults | null;
  isLoading: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  // eslint-disable-next-line no-unused-vars
  setQuery: (searchQuery: string) => void;
}
