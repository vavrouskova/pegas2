'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import { showPreferences } from 'vanilla-cookieconsent';

import { Button } from '@/components/ui/button';

const CookieSettingButton = () => {
  const t = useTranslations();

  return (
    <Button
      variant='secondary'
      onClick={showPreferences}
    >
      {t('cookie.setting_button')}
    </Button>
  );
};

export default CookieSettingButton;
