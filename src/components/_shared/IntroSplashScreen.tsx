'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'pegas_intro_seen';

const handleAnimationComplete = () => {
  sessionStorage.setItem(STORAGE_KEY, 'true');
};

const IntroSplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: hydration detection pattern
    setIsMounted(true);
    const hasSeen = sessionStorage.getItem(STORAGE_KEY);
    if (hasSeen === 'true') {
      setIsVisible(false);
    } else {
      // Prevent scrolling while splash is visible
      document.body.style.overflow = 'hidden';
    }
  }, []);

  // Add cleanup effect
  useEffect(() => {
    if (!isVisible && isMounted) {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible, isMounted]);

  // Keyboard accessibility - dismiss on Enter, Space, or Escape
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

  const handleDismiss = () => {
    setIsVisible(false);
  };

  // Don't render anything on server or if already seen
  if (!isMounted) {
    return null;
  }

  return (
    <AnimatePresence onExitComplete={handleAnimationComplete}>
      {isVisible && (
        <motion.div
          className='bg-white-smoke fixed inset-0 z-[9999] flex cursor-pointer items-center justify-center'
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          onClick={handleDismiss}
        >
          <div className='flex flex-col items-center gap-4'>
            {/* Winged Horse Icon */}
            <motion.svg
              width='80'
              height='80'
              viewBox='0 0 31 35'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <path
                d='M4.98035 34.9136C4.97303 34.4456 4.98766 33.9921 4.57811 33.685L6.14316 28.7997C6.64777 28.2585 7.27672 27.4541 7.75939 26.8983C7.99342 26.6277 8.17625 26.4083 8.2055 26.0353C8.29326 24.8725 7.99342 23.7243 8.28595 22.5469C8.35908 22.2616 8.52729 21.9252 8.65161 21.6693C7.20358 21.6839 6.26748 22.5469 5.90182 23.8852C4.93647 27.3809 2.95457 27.615 2.31831 27.593C1.64549 27.5638 1.19938 27.0884 1.19938 27.0884C2.08429 26.7812 2.56696 26.3863 2.8083 25.4137C3.0277 24.5507 2.89606 23.7316 3.07889 22.9345C3.48844 21.1793 4.98034 19.9945 7.04269 20.3017C8.28595 20.4845 8.92952 21.1793 8.92952 21.1793C9.63159 20.2797 10.575 20.1042 11.7232 19.9214C12.7251 19.7678 14.0196 19.5923 14.1951 19.5777C14.3048 19.563 15.548 19.4021 15.5407 19.3656L15.3579 19.3436C15.0361 19.3436 14.8533 19.3436 14.5461 19.3363C12.5203 19.2851 9.86562 18.7586 8.68087 18.1662C7.65701 17.6616 7.5985 17.3837 7.5985 17.3837C8.38102 17.4202 9.33906 17.4934 9.89487 17.5153C11.2259 17.5592 11.9572 17.5884 13.2955 17.5373L13.3979 17.5153L13.3102 17.4787C11.7013 17.1789 10.202 16.9961 8.39565 16.6523C7.09388 16.4037 5.9457 16.0673 4.77557 15.4018C3.47381 14.6631 2.49383 13.4491 1.92339 12.0742L2.20861 12.1986C5.68973 13.727 9.24399 14.6412 13.003 15.2628L13.2297 15.2994L13.2444 15.2336C12.2497 14.8825 10.0996 14.2097 9.1416 13.8587C5.56541 12.5642 1.97459 11.5916 0.394917 7.21821C0.234025 6.76479 0.102386 6.29674 0 5.82869C4.2417 8.49072 8.67355 10.8602 13.3102 12.769L13.4711 12.8129L13.4272 12.7544C10.5311 10.9041 6.72091 8.81982 4.25633 6.50151C2.41338 4.7902 1.25057 2.58159 1.40415 0C4.03693 2.69129 13.2809 9.4122 14.8606 10.5458C15.7382 11.1747 16.3086 11.8548 17.0034 12.6666C17.5373 13.2882 18.0419 13.9391 18.5538 14.5827L18.7805 14.8679L19.468 13.8002C20.5869 11.9353 22.1446 9.77786 25.1577 9.23668L26.869 7.72283L26.4668 9.55115L26.4814 9.71935L29.6261 13.5881L29.7358 13.9757L29.5164 14.8825L28.4267 15.1019C28.3024 15.0873 27.8709 14.6193 27.71 14.5388C27.1762 14.2755 26.2693 14.0415 25.6477 13.8221C25.0699 13.6173 24.8359 13.493 24.4191 13.0176C23.9656 14.1 23.6804 15.2482 23.5341 16.411L24.6677 18.8536L28.3097 17.6396C28.8728 17.4787 29.0264 17.7859 29.1654 18.0638C29.7797 19.2486 30.2551 20.5796 30.8621 21.7863L29.9406 24.4995L28.9825 22.9052L29.8236 22.0934L29.9771 21.8375L28.1488 19.3509L23.3952 21.8082L21.9984 20.543L22.4152 22.3421C19.9287 23.7024 16.0527 24.3971 14.3267 24.6896C14.6193 23.1904 14.5169 22.7297 14.5169 22.7297C14.1 23.7462 13.6978 24.7993 13.0323 25.6842C11.6793 27.4906 9.33175 28.6827 7.42298 29.7724L5.66048 33.2242C6.2236 33.6777 6.6624 34.2335 6.8818 34.9282H4.96572L4.98035 34.9136Z'
                fill='oklch(var(--primary))'
              />
              <path
                d='M16.016 34.9429C15.9501 34.7162 15.9136 34.4163 15.8478 34.1896C15.6649 33.5899 15.3651 33.4729 14.9628 33.0414C13.9024 31.8932 12.6811 30.3574 11.6938 29.1727C11.511 28.9533 11.3062 28.7339 11.5622 28.4633C11.862 28.1561 13.4709 27.3297 14.5167 25.4649L16.623 25.0114C16.623 25.0114 16.6157 25.304 16.5352 25.6257C16.2207 26.9056 15.4455 27.9806 14.3778 28.7778C14.2754 28.8582 13.7196 29.2604 13.7196 29.2604L16.1769 33.1365C16.8862 33.568 17.5518 34.1165 17.8223 34.9429H16.016Z'
                fill='oklch(var(--primary))'
              />
              <path
                d='M26.5545 26.6569L24.7262 28.0903L24.6457 26.5399L26.006 25.8963L26.7154 23.0953L23.4902 22.7516L25.4283 21.523L27.8051 22.1007C28.1415 22.1812 28.2804 22.4445 28.1561 22.7882L26.5545 26.6496V26.6569Z'
                fill='oklch(var(--primary))'
              />
            </motion.svg>

            {/* PEGAS Text */}
            <motion.h1
              className='font-display text-primary text-4xl font-bold tracking-[0.3em]'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              PEGAS
            </motion.h1>

            {/* Tagline */}
            <motion.p
              className='text-secondary text-lg'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              V tichu jsme.
            </motion.p>
          </div>

          {/* Auto-dismiss after 3 seconds */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 3 }}
            onAnimationComplete={handleDismiss}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroSplashScreen;
