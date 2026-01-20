'use client';

import { motion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';

const STORAGE_KEY = 'pegas_intro_seen';

interface FadeInOnActivityProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

const FadeInOnActivity = ({ children, delay = 0, duration = 0.5, className }: FadeInOnActivityProps) => {
  const [isActivated, setIsActivated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: hydration detection
    setIsMounted(true);

    const hasSeen = sessionStorage.getItem(STORAGE_KEY);
    const isFirstVisit = hasSeen !== 'true';

    // If not first visit, show immediately
    if (!isFirstVisit) {
      setIsActivated(true);
      return;
    }

    // On first visit, wait for mouse activity
    const handleActivity = () => {
      setIsActivated(true);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };

    // Delay adding listeners to avoid immediate trigger
    const timer = setTimeout(() => {
      window.addEventListener('mousemove', handleActivity, { once: true });
      window.addEventListener('click', handleActivity, { once: true });
      window.addEventListener('touchstart', handleActivity, { once: true });
    }, 1500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, []);

  // Before hydration
  if (!isMounted) {
    return <div className={className}>{children}</div>;
  }

  // If not activated yet, render invisible
  if (!isActivated) {
    return (
      <div
        className={className}
        style={{ opacity: 0 }}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeInOnActivity;
