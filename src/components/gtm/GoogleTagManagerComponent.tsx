'use client';

import React from 'react';

import { GoogleTagManager, sendGTMEvent } from '@next/third-parties/google';

export const sendGTMEventFunction = (eventData: any) => {
  return new Promise<void>((resolve) => {
    if (window.dataLayer) {
      sendGTMEvent(eventData);
      resolve();
    } else {
      const interval = setInterval(() => {
        if (window.dataLayer) {
          window.dataLayer.push(eventData);
          clearInterval(interval);
          resolve();
        }
      }, 100);
    }
  });
};

const GoogleTagManagerComponent = ({ gtmId }: { gtmId: string }) => {
  return <GoogleTagManager gtmId={gtmId} />;
};

export default GoogleTagManagerComponent;
