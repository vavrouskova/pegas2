import '@/styles/globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import React from 'react';
import { Toaster } from 'sonner';

import FadeIn from '@/components/_shared/FadeIn';
import IntroSplashScreen from '@/components/_shared/IntroSplashScreen';
import StickyContact from '@/components/_shared/StickyContact';
import CookieConsent from '@/components/cookie/CookieConsent';
import Footer from '@/components/footer/Footer';
import GoogleTagManagerComponent from '@/components/gtm/GoogleTagManagerComponent';
import Header from '@/components/header/Header';
import StickyHeaderWrapper from '@/components/header/StickyHeaderWrapper';
import { SearchOverlay } from '@/components/search';
import BaseProvider from '@/providers/BaseProvider';
import { SearchProvider } from '@/providers/SearchProvider';
import SmoothScrollProvider from '@/providers/SmoothScrollProvider';

// eslint-disable-next-line no-restricted-imports
import { routing } from '../../i18n/routing';

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

const RootLayout = async ({ children, params }: RootLayoutProps) => {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className='light scroll-pt-px'
    >
      <head>
        <link
          rel='icon'
          href='/favicon.ico'
        />
        <link
          rel='stylesheet'
          href='https://use.typekit.net/dnw8jfr.css'
        />
        <meta
          name='color-scheme'
          content='light'
        />
      </head>

      <GoogleTagManagerComponent gtmId={process.env.GTM_ID as string} />

      <body>
        <BaseProvider>
          <NextIntlClientProvider messages={messages}>
            <SearchProvider>
              <SmoothScrollProvider>
                <IntroSplashScreen />
                <CookieConsent />
                <FadeIn delay={1}>
                  <Header />
                </FadeIn>
                <StickyHeaderWrapper />
                <FadeIn delay={1.1}>{children}</FadeIn>
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
