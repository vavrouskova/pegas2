/**
 * Konstanty pro blog funkcionalitu
 */

/** Počet blog postů zobrazených na jedné stránce */
export const POSTS_PER_PAGE = 9;

/** ID kategorie "Nezařazené" v WordPressu */
export const UNCATEGORIZED_CATEGORY_ID = 1;

/** Maximální počet postů načtených najednou z GraphQL API */
export const MAX_POSTS_FETCH = 1000;

/** URL query parametry pro blog filtrování */
export const BLOG_QUERY_PARAMS = {
  CATEGORY: 'category',
  SEARCH: 'search',
  PAGE: 'page',
} as const;
