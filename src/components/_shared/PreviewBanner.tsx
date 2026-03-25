'use client';

import { useTranslations } from 'next-intl';

const PreviewBanner = () => {
  const t = useTranslations('preview');

  return (
    <div className='fixed top-0 right-0 left-0 z-9999 bg-yellow-500 py-2.5 text-center text-sm font-normal text-black'>
      {t('banner-text')}
    </div>
  );
};

export default PreviewBanner;
