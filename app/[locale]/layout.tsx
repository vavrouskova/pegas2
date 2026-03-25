import '@/styles/globals.css';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import React from 'react';
import { Toaster } from 'sonner';

import { getInfoBarData } from '@/api/wordpress-api';
import FadeIn from '@/components/_shared/FadeIn';
import IntroSplashScreen from '@/components/_shared/IntroSplashScreen';
import StickyContact from '@/components/_shared/StickyContact';
import CookieConsent from '@/components/cookie/CookieConsent';
import Footer from '@/components/footer/Footer';
import GoogleTagManagerComponent from '@/components/gtm/GoogleTagManagerComponent';
import Header from '@/components/header/Header';
import InfoBar from '@/components/header/InfoBar';
import StickyNav from '@/components/header/StickyNav';
import { SearchOverlay } from '@/components/search';
import BaseProvider from '@/providers/BaseProvider';
import { SearchProvider } from '@/providers/SearchProvider';
import SmoothScrollProvider from '@/providers/SmoothScrollProvider';

// eslint-disable-next-line no-restricted-imports
import { routing } from '../../i18n/routing';

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

interface RootLayoutProps extends BasePageProps {
  children: React.ReactNode;
}

export interface BasePageProps {
  params: Promise<{
    locale: string;
  }>;
}

// eslint-disable-next-line unicorn/prevent-abbreviations
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const isProduction = process.env.APP_ENV === 'production';

const RootLayout = async ({ children, params }: RootLayoutProps) => {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  const [messages, infoBarItems] = await Promise.all([getMessages(), getInfoBarData()]);

  return (
    <html
      lang={locale}
      className='light scroll-pt-px'
    >
      <head>
        <link
          rel='dns-prefetch'
          href='https://use.typekit.net'
        />
        <link
          rel='preconnect'
          href='https://use.typekit.net'
        />
        <link
          rel='preconnect'
          href='https://p.typekit.net'
          crossOrigin='anonymous'
        />
        <link
          rel='preload'
          href='https://use.typekit.net/dnw8jfr.css'
          as='style'
        />
        <link
          rel='stylesheet'
          href='https://use.typekit.net/dnw8jfr.css'
        />
        <meta
          name='color-scheme'
          content='light'
        />
        {!isProduction && (
          <meta
            name='robots'
            content='noindex, nofollow'
          />
        )}
      </head>

      {isProduction && process.env.GTM_ID && <GoogleTagManagerComponent gtmId={process.env.GTM_ID} />}

      <body>
        <BaseProvider>
          <NextIntlClientProvider messages={messages}>
            <SearchProvider>
              <SmoothScrollProvider>
                <IntroSplashScreen />
                <CookieConsent />
                {infoBarItems && infoBarItems.length > 0 && (
                  <FadeIn delay={1} className='bg-white-smoke'>
                    <InfoBar items={infoBarItems} />
                  </FadeIn>
                )}
                <StickyNav>
                  <FadeIn delay={1}>
                    <Header />
                  </FadeIn>
                </StickyNav>
                {children}
                <Footer />
                <StickyContact />
                <Toaster />
                <SearchOverlay />
              </SmoothScrollProvider>
            </SearchProvider>
          </NextIntlClientProvider>
        </BaseProvider>
      </body>
    </html>
  );
};

export default RootLayout;
