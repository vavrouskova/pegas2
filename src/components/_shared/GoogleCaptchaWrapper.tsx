'use client';

import React from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

const GoogleCaptchaWrapper = ({ children }: { children: React.ReactNode }) => {
  const recaptchaKey: string | undefined = process?.env?.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  return <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey ?? 'NOT DEFINED'}>{children}</GoogleReCaptchaProvider>;
};

export default GoogleCaptchaWrapper;
