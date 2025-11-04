/**
 * Helper funkce pro references funkcionalitu
 */

import { REFERENCES_QUERY_PARAMS } from '@/constants/references';

/**
 * Parsuje číslo stránky z URL parametrů s validací
 * @param pageParam - String hodnota z URL parametrů
 * @param defaultValue - Výchozí hodnota pokud parsing selže
 * @returns Validní číslo stránky
 */
export function parsePageNumber(pageParam: string | undefined, defaultValue = 1): number {
  if (!pageParam) {
    return defaultValue;
  }

  const parsed = Number.parseInt(pageParam, 10);
  return Number.isNaN(parsed) || parsed < 1 ? defaultValue : parsed;
}

/**
 * Vytvoří URL search params s aktualizovanými hodnotami
 * @param currentParams - Aktuální URLSearchParams
 * @param updates - Objekt s hodnotami k aktualizaci (null = smazat parametr)
 * @returns Nový URLSearchParams
 */
export function updateSearchParams(
  currentParams: URLSearchParams,
  updates: Record<string, string | null>
): URLSearchParams {
  const params = new URLSearchParams(currentParams.toString());

  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  });

  return params;
}

/**
 * Resetuje paginaci při změně filtru nebo vyhledávání
 * @param params - Aktuální URLSearchParams
 * @returns Nový URLSearchParams bez page parametru
 */
export function resetPagination(params: URLSearchParams): URLSearchParams {
  const newParams = new URLSearchParams(params.toString());
  newParams.delete(REFERENCES_QUERY_PARAMS.PAGE);
  return newParams;
}
