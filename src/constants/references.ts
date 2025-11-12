/**
 * Konstanty pro references funkcionalitu
 */

/** Počet referencí zobrazených na jedné stránce */
export const REFERENCES_PER_PAGE = 9;

/** Maximální počet referencí načtených najednou z GraphQL API */
export const MAX_REFERENCES_FETCH = 1000;

/** URL query parametry pro references filtrování */
export const REFERENCES_QUERY_PARAMS = {
  CATEGORY: 'category',
  PAGE: 'page',
  SEARCH: 'search',
} as const;
