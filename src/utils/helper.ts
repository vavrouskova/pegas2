import { WP_REST_API_Post } from 'wp-types';

// Header navigation helpers

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export default IS_PRODUCTION;

export const postHelper = (post?: WP_REST_API_Post) => {
  const getPostFeaturedMedia = () => {
    const mediaPost = (
      post?.featured_media
        ? post?._embedded?.['wp:featuredmedia']?.find((media: any) => media.id === post.featured_media)
        : undefined
    ) as WP_REST_API_Post | undefined;

    const embeddedUrl = (mediaPost as any)?.source_url as string | undefined;
    // Fallback: some posts supply a placeholder in `featured_media_src_url`
    const placeholderUrl = (post as any)?.featured_media_src_url as string | undefined;
    return embeddedUrl ?? placeholderUrl;
  };

  const getPostCategoryNames = (): string[] => {
    const terms = post?._embedded?.['wp:term'] || [];

    return terms.flatMap((termGroup: any) =>
      termGroup
        .filter((term: { taxonomy: string }) => term.taxonomy === 'category')
        .map((term: { name: string }) => term.name)
    );
  };

  return { getPostFeaturedMedia, getPostCategoryNames };
};

export function getUniqueId(prefix?: string) {
  // eslint-disable-next-line sonarjs/pseudo-random
  const uniqueId = Math.random().toString(8).slice(2);

  if (prefix) {
    return `${prefix}-${uniqueId}`;
  }

  return uniqueId;
}

export function removeSitemapStylesheet(xmlString: string) {
  // Regular expression to match the xml-stylesheet processing instruction
  const stylesheetRegex = /<\?xml-stylesheet[^>]+\?>/g;

  // Remove the matched stylesheet declaration from the XML string
  return xmlString.replace(stylesheetRegex, '');
}

export function replaceWordpressUrl(xmlString: string, replaceWith: string) {
  return xmlString.replace(
    // eslint-disable-next-line security/detect-non-literal-regexp
    new RegExp(process.env.NEXT_PUBLIC_BACKEND_URL as string, 'g'),
    replaceWith
  );
}

export function removeNumberFromUrl(xmlString: string) {
  // Escape special regex characters in the environment variable for safe RegExp construction
  const escapedPrefix = (process.env.NEXT_PUBLIC_ASSET_PREFIX || '').replace(/[$()*+.?[\\\]^{|}]/g, '\\$&');
  // eslint-disable-next-line security/detect-non-literal-regexp -- Safe: environment variable is escaped before use
  const regex = new RegExp(`(${escapedPrefix})/\\d+(?=/)`, 'g');
  return xmlString.replace(regex, '$1');
}

export function replaceHttpWithHttps(xmlString: string) {
  return xmlString.replace(/http:\/\//g, 'https://');
}

export function filterUndefinedParameters(parameters: Record<string, any>) {
  // eslint-disable-next-line no-unused-vars
  return Object.fromEntries(Object.entries(parameters).filter(([_, v]) => v !== undefined && v !== ''));
}

export const slugify = (text: string) => {
  return String(text)
    .normalize('NFKD') // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036F]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^\d a-z-]/g, '') // remove non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // remove consecutive hyphens
};

export const truncateByThousands = (number: number) => {
  const truncated = Math.floor(number / 1000);
  return `${truncated} tis.`;
};

export const truncateByMillions = (number: number) => {
  const truncated = Math.floor(number / 1_000_000);
  return `${truncated} mil.`;
};

/**
 * Odstraní všechny HTML tagy ze stringu
 * @param html - string obsahující HTML tagy
 * @returns string bez HTML tagů
 */
export const stripHtmlTags = (html: string): string => {
  if (!html) return '';
  // eslint-disable-next-line sonarjs/slow-regex
  return html.replace(/<[^>]*>/g, '').trim();
};

export const truncateText = (text: string, maxLength: number = 100) => {
  if (!text) return '';

  const strippedText = stripHtmlTags(text);
  if (strippedText.length <= maxLength) return strippedText;
  return `${strippedText.slice(0, maxLength)}...`;
};

export const stripDiacritics = (string_: string) => {
  return string_.normalize('NFD').replace(/[\u0300-\u036F]/g, '');
};

export function isActiveLink(link: string, pathname: string): boolean {
  return pathname === link;
}

/**
 * Extrahuje numerickou hodnotu ze stringu
 * Odstraní všechny ne-numerické znaky kromě desetinných teček
 * @param value - string obsahující numerickou hodnotu
 * @returns číslo nebo 0 pokud parsing selže
 */
export function extractNumericValue(value: string): number {
  // Remove non-numeric characters except decimal points
  const numericValue = value.replace(/[^\d.]/g, '');
  const parsed = Number.parseFloat(numericValue);
  return Number.isNaN(parsed) ? 0 : parsed;
}

/**
 * Kontroluje, jestli je datum expirace validní a vyplněné
 * @param expiryDate - datum expirace jako string
 * @returns true pokud je datum validní, false pokud není
 */
export function isValidExpiryDate(expiryDate: string | null | undefined): boolean {
  if (!expiryDate || expiryDate.trim() === '') return false;
  const date = new Date(expiryDate);
  return !Number.isNaN(date.getTime());
}

/**
 * Určuje, jestli je nabídka vypršelá
 * @param expiryDate - datum expirace jako string
 * @returns true pokud je nabídka vypršelá, false pokud není nebo nemá datum expirace
 */
export function isOfferExpired(expiryDate: string | null | undefined): boolean {
  if (!isValidExpiryDate(expiryDate)) return false; // If no valid expiry date, never expires
  const date = new Date(expiryDate!);
  return date < new Date();
}

/**
 * Formats a date in a consistent, locale-aware way
 * Defaults to en-GB with format: D Mon YYYY (e.g., 5 Jan 2025)
 * If hour and minute options are provided, will include time in the output
 */
export function formatDate(
  dateInput: string | number | Date,
  locale: string = 'en-GB',
  options?: Intl.DateTimeFormatOptions
): string {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return '';

  const fallbackOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

  const formatOptions = options ?? fallbackOptions;

  // If time options are provided, use toLocaleString instead of toLocaleDateString
  if (formatOptions.hour !== undefined || formatOptions.minute !== undefined) {
    return date.toLocaleString(locale, formatOptions);
  }

  return date.toLocaleDateString(locale, formatOptions);
}

/**
 * Formats a date in Czech format: "26. 11. 2025"
 * @param dateInput - date string, number, or Date object
 * @returns formatted date string or empty string if invalid
 */
export function formatBlogDate(dateInput: string | number | Date | undefined): string {
  if (!dateInput) return '';

  const dateObject = new Date(dateInput);
  if (Number.isNaN(dateObject.getTime())) return '';

  const day = dateObject.getDate();
  const month = dateObject.getMonth() + 1;
  const year = dateObject.getFullYear();

  return `${day}. ${month}. ${year}`;
}

/**
 * Decodes HTML entities in a string
 * @param text - string containing HTML entities
 * @returns decoded string
 */
export function decodeHtmlEntities(text: string): string {
  if (!text) return '';

  // Create a temporary element to decode HTML entities
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

/**
 * Decodes HTML entities in a string (server-side safe version)
 * @param text - string containing HTML entities
 * @returns decoded string
 */
export function decodeHtmlEntitiesServer(text: string): string {
  if (!text) return '';

  // Common HTML entities mapping
  const htmlEntities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
    '&#8211;': '–',
    '&#8212;': '—',
    '&#8216;': '\u2018',
    '&#8217;': '\u2019',
    '&#8220;': '\u201C',
    '&#8221;': '\u201D',
    '&#8230;': '…',
    '&#8242;': '′',
    '&#8243;': '″',
    '&#8364;': '€',
    '&#163;': '£',
    '&#165;': '¥',
    '&#169;': '©',
    '&#174;': '®',
    '&#8482;': '™',
  };

  return text.replace(/&[#\w]+;/g, (entity) => {
    return htmlEntities[entity] || entity;
  });
}

export function normalizePath(path: string): string {
  return path.replace(/\/$/, '');
}

/**
 * Formátuje datum a čas pro rozloučení z WordPress ACF pole
 * WordPress ukládá datum v UTC, ale my chceme zobrazit čas který byl zadán v admin
 * @param dateString - datum jako string z WordPressu (např. "2025-10-07T14:00:00+00:00")
 * @returns formátované datum v češtině (např. "úterý 7. 10. 2025 14:00")
 */
export function formatFarewellDateTime(dateString?: string): string {
  if (!dateString) return '';
  try {
    // Odstranit timezone suffix a interpretovat jako lokální čas
    const dateWithoutTZ = dateString.replace(/([+-]\d{2}:\d{2}|Z)$/, '');
    const date = new Date(dateWithoutTZ);

    return new Intl.DateTimeFormat('cs-CZ', {
      weekday: 'long',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Formats date to Czech format: "D. M. YYYY"
 * @param dateString - ISO date string or Date object
 * @returns Formatted date string or empty string if invalid
 */
export function formatCzechDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return '';

  try {
    let date: Date;
    if (typeof dateString === 'string') {
      // Strip timezone suffix to interpret as local time (matches original behavior)
      const dateWithoutTZ = dateString.replace(/([+-]\d{2}:\d{2}|Z)$/, '');
      date = new Date(dateWithoutTZ);
    } else {
      date = dateString;
    }

    if (Number.isNaN(date.getTime())) return '';

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}. ${month}. ${year}`;
  } catch {
    return '';
  }
}

// Keep backwards compatibility aliases
export const formatFarewellDate = formatCzechDate;
export const formatSimpleDate = formatCzechDate;

/**
 * Formátuje rozsah dvou datumů z WordPress ACF polí
 * Pokud jsou roky stejné, zobrazí rok jen u druhého data
 * @param dateFromString - počáteční datum (např. "2025-12-01T00:00:00+00:00")
 * @param dateToString - konečné datum (např. "2025-11-27T00:00:00+00:00")
 * @returns formátovaný rozsah datumů (např. "1. 12. – 27. 11. 2025")
 */
export function formatDateRange(dateFromString?: string, dateToString?: string): string {
  if (!dateFromString || !dateToString) return '';

  try {
    const dateFromWithoutTZ = dateFromString.replace(/([+-]\d{2}:\d{2}|Z)$/, '');
    const dateToWithoutTZ = dateToString.replace(/([+-]\d{2}:\d{2}|Z)$/, '');

    const dateFrom = new Date(dateFromWithoutTZ);
    const dateTo = new Date(dateToWithoutTZ);

    const yearFrom = dateFrom.getFullYear();
    const yearTo = dateTo.getFullYear();

    // Pokud jsou roky stejné, zobraz rok jen u druhého data
    if (yearFrom === yearTo) {
      const fromFormatted = new Intl.DateTimeFormat('cs-CZ', {
        day: 'numeric',
        month: 'numeric',
      }).format(dateFrom);

      const toFormatted = new Intl.DateTimeFormat('cs-CZ', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }).format(dateTo);

      return `${fromFormatted} – ${toFormatted}`;
    }

    // Pokud jsou roky různé, zobraz rok u obou datumů
    const fromFormatted = formatSimpleDate(dateFromString);
    const toFormatted = formatSimpleDate(dateToString);

    return `${fromFormatted} – ${toFormatted}`;
  } catch {
    return `${dateFromString} – ${dateToString}`;
  }
}

/**
 * Detekuje mobilní zařízení na základě User-Agent stringu
 * @param userAgent - User-Agent header string
 * @returns true pokud je zařízení mobilní
 */
export function isMobileUserAgent(userAgent: string): boolean {
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent);
}

/**
 * Filtruje zaměstnance podle typu pozice na vedení a tým
 * @param employees - pole zaměstnanců
 * @param managementType - typ pozice pro vedení (default: 'company_management')
 * @returns objekt s rozdělením zaměstnanců na management a team
 */
export function filterEmployeesByPosition<T extends { zamestnanciACF?: { positonType?: string[] } }>(
  employees: T[],
  managementType: string = 'company_management'
): { management: T[]; team: T[] } {
  const management = employees.filter((employee) => {
    const positionType = employee.zamestnanciACF?.positonType;
    return Array.isArray(positionType) && positionType.includes(managementType);
  });

  const team = employees.filter((employee) => {
    const positionType = employee.zamestnanciACF?.positonType;
    return !Array.isArray(positionType) || !positionType.includes(managementType);
  });

  return { management, team };
}
