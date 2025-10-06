'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';

import { MotionDiv } from '@/components/animate-ui/MotionWrappers';
import Phone from '@/components/icons/Phone';
import { PhoneNumber } from '@/lib/constants';

const StickyContact = () => {
  const t = useTranslations('common');

  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsFooterVisible(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.05,
      }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const animateTarget = useMemo(
    () => (isFooterVisible ? { x: 120, opacity: 0 } : { x: 0, opacity: 1 }),
    [isFooterVisible]
  );

  return (
    <MotionDiv
      initial={{ x: 120, opacity: 0 }}
      animate={animateTarget}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className='bg-primary fixed right-0 bottom-20 z-50 flex gap-4 p-4 pr-12 shadow-lg will-change-transform'
    >
      <div className='flex h-16 w-16 items-center justify-center'>
        <Phone className='text-white-smoke size-[1.9375rem]' />
      </div>
      <div className='flex flex-col justify-center gap-1 pr-2'>
        <span className='text-base text-white'>{t('nonstop')}</span>
        <Link
          className='text-2xl text-white'
          href={`tel:${PhoneNumber}`}
        >
          {PhoneNumber}
        </Link>
      </div>
    </MotionDiv>
  );
};

export default StickyContact;
