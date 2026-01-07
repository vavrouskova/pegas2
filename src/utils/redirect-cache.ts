import { WordPressRedirect } from '@/api/wordpress-api';

interface RedirectCache {
  redirects: WordPressRedirect[];
  lastFetched: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

let cache: RedirectCache | null = null;

export const getRedirectsFromCache = (): WordPressRedirect[] | null => {
  if (!cache) return null;

  const now = Date.now();
  if (now - cache.lastFetched > CACHE_TTL_MS) {
    return null; // Cache expired
  }

  return cache.redirects;
};

export const setRedirectsCache = (redirects: WordPressRedirect[]): void => {
  cache = {
    redirects,
    lastFetched: Date.now(),
  };
};

export const findRedirect = (pathname: string, redirects: WordPressRedirect[]): WordPressRedirect | undefined => {
  // Exact match first
  const exactMatch = redirects.find((r) => r.origin === pathname);
  if (exactMatch) return exactMatch;

  // Match without trailing slash
  const normalizedPathname = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  return redirects.find((r) => {
    const normalizedOrigin = r.origin.endsWith('/') ? r.origin.slice(0, -1) : r.origin;
    return normalizedOrigin === normalizedPathname;
  });
};
