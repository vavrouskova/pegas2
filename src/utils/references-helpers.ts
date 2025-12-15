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
export function parsePageNumber(pageParameter: string | undefined, defaultValue = 1): number {
  if (!pageParameter) {
    return defaultValue;
  }

  const parsed = Number.parseInt(pageParameter, 10);
  return Number.isNaN(parsed) || parsed < 1 ? defaultValue : parsed;
}

/**
 * Vytvoří URL search params s aktualizovanými hodnotami
 * @param currentParams - Aktuální URLSearchParams
 * @param updates - Objekt s hodnotami k aktualizaci (null = smazat parametr)
 * @returns Nový URLSearchParams
 */
export function updateSearchParameters(
  currentParameters: URLSearchParams,
  updates: Record<string, string | null>
): URLSearchParams {
  const parameters = new URLSearchParams(currentParameters.toString());

  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === '') {
      parameters.delete(key);
    } else {
      parameters.set(key, value);
    }
  });

  return parameters;
}

/**
 * Resetuje paginaci při změně filtru nebo vyhledávání
 * @param params - Aktuální URLSearchParams
 * @returns Nový URLSearchParams bez page parametru
 */
export function resetPagination(parameters: URLSearchParams): URLSearchParams {
  const newParameters = new URLSearchParams(parameters.toString());
  newParameters.delete(REFERENCES_QUERY_PARAMS.PAGE);
  return newParameters;
}
