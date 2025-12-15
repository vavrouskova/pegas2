'use client';

import Fuse from 'fuse.js';
import { useLenis } from 'lenis/react';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { fetchSearchIndex } from '@/api/wordpress-api';
import { FUSE_OPTIONS, SEARCH_DEBOUNCE_MS } from '@/config/search.config';
import { useDebounce } from '@/hooks/useDebounce';
import { GroupedSearchResults, SearchableItem, SearchContextType, SearchResult } from '@/utils/search-types';
import { useQuery } from '@tanstack/react-query';

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return context;
}

interface SearchProviderProps {
  children: React.ReactNode;
}

export const SearchProvider = ({ children }: SearchProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS);

  const { data: searchIndex, isLoading: isIndexLoading } = useQuery({
    queryKey: ['searchIndex'],
    queryFn: fetchSearchIndex,
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    enabled: isOpen,
  });

  const searchableItems: SearchableItem[] = useMemo(() => {
    if (!searchIndex) return [];
    return searchIndex.map((item) => {
      let url = `/${item.slug}`;
      if (item.postType === 'page' && item.slug === 'uvod') {
        url = '/';
      }
      return {
        ...item,
        postType: item.postType as SearchableItem['postType'],
        url,
      };
    });
  }, [searchIndex]);

  const results: GroupedSearchResults | null = useMemo(() => {
    if (searchableItems.length === 0 || !debouncedQuery || debouncedQuery.length < 2) {
      return null;
    }

    const fuse = new Fuse(searchableItems, FUSE_OPTIONS);
    const searchResults = fuse.search(debouncedQuery) as SearchResult[];

    const grouped: GroupedSearchResults = {
      pages: [],
      posts: [],
      services: [],
      references: [],
      branches: [],
      procedures: [],
    };

    searchResults.forEach((result) => {
      switch (result.item.postType) {
        case 'page': {
          grouped.pages.push(result);
          break;
        }
        case 'post': {
          grouped.posts.push(result);
          break;
        }
        case 'sluzbyPost': {
          grouped.services.push(result);
          break;
        }
        case 'referencePost': {
          grouped.references.push(result);
          break;
        }
        case 'pobockaPost': {
          grouped.branches.push(result);
          break;
        }
        case 'postupPost': {
          grouped.procedures.push(result);
          break;
        }
      }
    });

    return grouped;
  }, [searchableItems, debouncedQuery]);

  const openSearch = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, []);

  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    if (isOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [isOpen, lenis]);

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      return () => {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closeSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeSearch]);

  const value = useMemo(
    () => ({
      isOpen,
      query,
      results,
      isLoading: isIndexLoading,
      openSearch,
      closeSearch,
      setQuery,
    }),
    [isOpen, query, results, isIndexLoading, openSearch, closeSearch]
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};
