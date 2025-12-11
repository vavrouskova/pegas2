'use client';

import { useTranslations } from 'next-intl';
import { showPreferences } from 'vanilla-cookieconsent';

import Button from '@/components/_shared/Button';

const CookieSettingButton = () => {
  const t = useTranslations();

  return (
    <Button
      variant='primary'
      buttonText={t('cookie.setting_button')}
      onClick={showPreferences}
    />
  );
};

export default CookieSettingButton;
