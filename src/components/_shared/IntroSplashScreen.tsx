'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

import { FormattedText } from '@/components/_shared/FormattedText';
import Logo from '@/components/icons/Logo';

const STORAGE_KEY = 'pegas_intro_seen';

const handleAnimationComplete = () => {
  sessionStorage.setItem(STORAGE_KEY, 'true');
};

const IntroSplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const t = useTranslations('home.footer-bg');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: hydration detection pattern
    setIsMounted(true);
    const hasSeen = sessionStorage.getItem(STORAGE_KEY);
    if (hasSeen === 'true') {
      setIsVisible(false);
    } else {
      document.body.style.overflow = 'hidden';
    }
  }, []);

  useEffect(() => {
    if (!isVisible && isMounted) {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible, isMounted]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'Escape') {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isMounted) {
    return <div className='bg-white-smoke fixed inset-0 z-9999' />;
  }

  return (
    <AnimatePresence onExitComplete={handleAnimationComplete}>
      {isVisible && (
        <motion.div
          className='bg-white-smoke fixed inset-0 z-9999 flex cursor-pointer items-center justify-center'
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          onClick={handleDismiss}
        >
          <div className='flex flex-col items-center gap-5'>
            <motion.div
              className='w-40 lg:w-53'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            >
              <Logo className='text-primary h-auto w-full' />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
            >
              <FormattedText
                text={t('claim')}
                as='p'
                className='text-xl'
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroSplashScreen;
