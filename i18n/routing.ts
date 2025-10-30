import { createNavigation } from 'next-intl/navigation';
import { defineRouting, Pathnames } from 'next-intl/routing';

export const locales = ['cs'] as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  cs: 'Čeština',
};

export const defaultLocale = 'cs';

export const pathnames = {
  '/': { cs: '/' },

  '/blog': { cs: '/blog' },

  '/blog/[slug]': { cs: '/blog/[slug]' },

  '/about-us': { cs: '/o-nas' },

  '/faq': { cs: '/jak-postupovat' },

  '/services': { cs: '/sluzby' },

  '/services/[slug]': { cs: '/[slug]' },
} satisfies Pathnames<typeof locales>;

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  pathnames,
});

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
