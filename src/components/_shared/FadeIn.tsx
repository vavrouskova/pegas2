'use client';

import { motion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';

const STORAGE_KEY = 'pegas_intro_seen';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

const FadeIn = ({ children, delay = 0, duration = 0.3, className }: FadeInProps) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: hydration detection pattern
    setIsMounted(true);
    const hasSeen = sessionStorage.getItem(STORAGE_KEY);
    // Only animate on first visit (when intro is shown)
    if (hasSeen !== 'true') {
      setShouldAnimate(true);
    }
  }, []);

  // Before hydration, render children without wrapper to avoid layout shift
  if (!isMounted) {
    return <div className={className}>{children}</div>;
  }

  // If not first visit, render without animation
  if (!shouldAnimate) {
    return <div className={className}>{children}</div>;
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

export default FadeIn;
