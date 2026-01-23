'use client';

import { motion } from 'framer-motion';
import { ReactNode, useRef, useState, useEffect } from 'react';

interface FadeInOnScrollProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
  translateY?: number;
}

const FadeInOnScroll = ({
  children,
  delay = 0,
  duration = 0.6,
  className,
  threshold = 0.1,
  translateY = 20,
}: FadeInOnScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: translateY }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: translateY }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeInOnScroll;
