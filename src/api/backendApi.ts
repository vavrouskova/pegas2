import { filterUndefinedParameters } from '@/utils/helper';

export interface ApiResponse<T = any> {
  data: T;
  headers: Headers;
}

export async function makeApiCall<T>(
  url: string,
  options: RequestInit = {},
  searchParameters: Record<string, any> = {}
): Promise<ApiResponse<T>> {
  const headers: HeadersInit = {
    ...options.headers,
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.WORDPRESS_API_KEY}`,
  };

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';
  let fullUrl = `${baseUrl}${url}`;

  // Append params to URL for GET requests (only when non-empty)
  if (searchParameters) {
    const filteredParameters = filterUndefinedParameters(searchParameters);
    const queryParameters = new URLSearchParams(filteredParameters).toString();
    if (queryParameters.length > 0) {
      fullUrl += `?${queryParameters}`;
    }
  }

  const response = await fetch(fullUrl, {
    ...options,
    headers,
    // Preserve any existing next options (like revalidate) and merge tags
    next: (() => {
      const originalNext = (options as any)?.next ?? {};
      const originalTags = Array.isArray((originalNext as any).tags) ? (originalNext as any).tags : [];
      return {
        ...originalNext,
        tags: [...new Set([...(originalTags as string[]), 'api'])],
      } as any;
    })(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  const data: T = await response.json();

  return { data, headers: response.headers };
}
