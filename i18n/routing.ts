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

  '/about-us': { cs: '/o-nas' },

  '/faq': { cs: '/jak-postupovat' },

  '/services': { cs: '/sluzby' },

  '/references': { cs: '/reference' },

  '/references/wrote-about-us': { cs: '/reference/napsali-o-nas' },

  '/references/[category]': { cs: '/reference/[category]' },

  '/contacts': { cs: '/kontakty' },

  '/gdpr': { cs: '/zasady-ochrany-osobnich-udaju' },

  '/cookies': { cs: '/informace-o-vyuziti-cookies' },

  '/consumer-information': { cs: '/informace-pro-spotrebitele' },

  '/thank-you': { cs: '/dekujeme' },

  '/[slug]': { cs: '/[slug]' },
} satisfies Pathnames<typeof locales>;

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  pathnames,
});

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
