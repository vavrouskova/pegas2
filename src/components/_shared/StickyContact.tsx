'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';

import { MotionDiv } from '@/components/animate-ui/MotionWrappers';
import { PhoneNumber } from '@/lib/constants';

const StickyContact = () => {
  const t = useTranslations('common');
  const pathname = usePathname();

  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector('#main-footer');
    if (!footer) return;

    const checkFooterVisibility = () => {
      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Footer je viditelný když jeho top je v dolní části obrazovky (méně než 300px od spodu)
      const isVisible = footerRect.top < windowHeight - 100;

      setIsFooterVisible(isVisible);
    };

    // Kontrola při scrollu
    window.addEventListener('scroll', checkFooterVisibility, { passive: true });
    // Počáteční kontrola
    checkFooterVisibility();

    return () => {
      window.removeEventListener('scroll', checkFooterVisibility);
    };
  }, []);

  const animateTarget = useMemo(
    () => (isFooterVisible ? { x: 120, opacity: 0 } : { x: 0, opacity: 1 }),
    [isFooterVisible]
  );

  if (pathname === '/o-nas' || pathname === '/cs/o-nas') {
    return null;
  }

  return (
    <MotionDiv
      initial={{ x: 120, opacity: 0 }}
      animate={animateTarget}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className='bg-primary fixed right-0 bottom-5 z-[1000] flex gap-4 p-4 pr-12 shadow-lg will-change-transform lg:bottom-1/2'
    >
      <div className='flex flex-col justify-between pr-2'>
        <span className='text-base text-white'>{t('nonstop')}</span>
        <Link
          className='text-2xl !leading-none text-white transition-all duration-300 hover:opacity-70'
          href={`tel:${PhoneNumber}`}
        >
          {PhoneNumber}
        </Link>
      </div>
    </MotionDiv>
  );
};

export default StickyContact;
