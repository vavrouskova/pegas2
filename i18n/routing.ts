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

  '/references/organized': { cs: '/reference/organizovali-jsme' },

  '/references/[category]': { cs: '/reference/[category]' },

  '/contacts': { cs: '/kontakty' },

  '/gdpr': { cs: '/zasady-ochrany-osobnich-udaju' },

  '/cookies': { cs: '/informace-o-vyuziti-cookies' },

  '/consumer-information': { cs: '/informace-pro-spotrebitele' },

  '/thank-you': { cs: '/dekujeme' },

  '/parte': { cs: '/parte' },

  '/parte/vytvorit': { cs: '/parte/vytvorit' },

  '/parte/editor/[templateId]': { cs: '/parte/editor/[templateId]' },

  '/parte/share/[token]': { cs: '/parte/sdileni/[token]' },

  '/ceremonies': { cs: '/kalendar-obradu' },

  '/ceremonies/[slug]': { cs: '/kalendar-obradu/[slug]' },

  '/ceremonies/[slug]/send-flower': { cs: '/kalendar-obradu/[slug]/poslat-kvetinu' },

  '/[slug]': { cs: '/[slug]' },
} satisfies Pathnames<typeof locales>;

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  pathnames,
});

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
