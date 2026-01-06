/**
 * Generic pagination helper functions
 */

/**
 * Parses page number from URL params with validation
 */
export function parsePageNumber(pageParameter: string | undefined, defaultValue = 1): number {
  if (!pageParameter) {
    return defaultValue;
  }

  const parsed = Number.parseInt(pageParameter, 10);
  return Number.isNaN(parsed) || parsed < 1 ? defaultValue : parsed;
}

/**
 * Creates URL search params with updated values
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
 * Resets pagination parameter
 */
export function resetPagination(parameters: URLSearchParams, pageParameter: string): URLSearchParams {
  const newParameters = new URLSearchParams(parameters.toString());
  newParameters.delete(pageParameter);
  return newParameters;
}
