import '@/styles/globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import React from 'react';
import { Toaster } from 'sonner';

import StickyContact from '@/components/_shared/StickyContact';
import Footer from '@/components/footer/Footer';
import GoogleTagManagerComponent from '@/components/gtm/GoogleTagManagerComponent';
import Header from '@/components/header/Header';
import BaseProvider from '@/providers/BaseProvider';
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
      className='light scroll-pt-[1px]'
    >
      <head>
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
            <SmoothScrollProvider>
              <Header />
              {children}
              <Footer />
              <StickyContact />
              <Toaster />
            </SmoothScrollProvider>
          </NextIntlClientProvider>
        </BaseProvider>
      </body>
    </html>
  );
};

export default RootLayout;
