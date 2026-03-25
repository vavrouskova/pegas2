'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

import { useScrollDirection } from '@/hooks/useScrollDirection';
import { cn } from '@/lib/utils';

interface StickyNavProps {
  children: ReactNode;
}

const StickyNav = ({ children }: StickyNavProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(150);

  useEffect(() => {
    if (!ref.current) return;

    // ResizeObserver callback needs setState to keep threshold in sync with actual element height
    const measure = () => {
      setHeight(ref.current?.offsetHeight ?? 150); // eslint-disable-line react-hooks/set-state-in-effect
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const { scrollDirection, isScrolled } = useScrollDirection({ threshold: height });

  const isHidden = isScrolled && scrollDirection === 'down';

  return (
    <div
      ref={ref}
      className={cn(
        'sticky top-0 z-50 bg-white-smoke transition-transform duration-300 ease-out',
        isHidden && '-translate-y-full'
      )}
    >
      {children}
    </div>
  );
};

export default StickyNav;
