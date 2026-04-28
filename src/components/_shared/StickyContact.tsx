'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useParams } from 'next/navigation';
import { MotionDiv } from '@/components/animate-ui/MotionWrappers';
import { usePathname } from '@/i18n/routing';
import { PhoneNumber } from '@/lib/constants';

const STORAGE_KEY = 'pegas_intro_seen';

// Slug prefixes identifying branch pages per locale (CS = pobocka-, EN = office-)
// Extend this array when adding new locales with different branch URL conventions.
const BRANCH_PAGE_PREFIXES = ['pobocka-', 'office-'];

const StickyContact = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const { slug } = useParams<{ slug?: string }>();

  const [shouldHide, setShouldHide] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  // Check if first visit and setup mouse activity listener
  useEffect(() => {
    const hasSeen = (() => {
      try {
        return sessionStorage.getItem(STORAGE_KEY);
      } catch {
        return null;
      }
    })();
    const firstVisit = hasSeen !== 'true';
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: session check on mount
    setIsFirstVisit(firstVisit);

    // If not first visit, show immediately
    if (!firstVisit) {
      setIsActivated(true);
      return;
    }

    // On first visit, wait for mouse activity
    const handleMouseActivity = () => {
      setIsActivated(true);
      window.removeEventListener('mousemove', handleMouseActivity);
      window.removeEventListener('click', handleMouseActivity);
      window.removeEventListener('touchstart', handleMouseActivity);
    };

    // Delay adding listeners to avoid immediate trigger
    const timer = setTimeout(() => {
      window.addEventListener('mousemove', handleMouseActivity, { once: true });
      window.addEventListener('click', handleMouseActivity, { once: true });
      window.addEventListener('touchstart', handleMouseActivity, { once: true });
    }, 2000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseActivity);
      window.removeEventListener('click', handleMouseActivity);
      window.removeEventListener('touchstart', handleMouseActivity);
    };
  }, []);

  // Sledování viditelnosti – na HP: zobrazit jen v hero oblasti, schovat od slideru dolů
  // Na ostatních stránkách: schovat u footeru
  const checkVisibility = useCallback(() => {
    if (!isActivated) return;

    const windowHeight = window.innerHeight;

    // Kontrola footeru (platí pro všechny stránky)
    const footer = document.querySelector('#main-footer');
    if (footer) {
      const footerRect = footer.getBoundingClientRect();
      if (footerRect.top < windowHeight - 100) {
        setShouldHide(true);
        return;
      }
    }

    // Na HP: najít první [data-hide-sticky] sekci (slider) a schovat lištu od ní dolů
    const firstTrigger = document.querySelector('[data-hide-sticky]');
    if (firstTrigger) {
      const rect = firstTrigger.getBoundingClientRect();
      // Jakmile sekce vstoupí do horní poloviny viewportu, schovat lištu
      if (rect.top < windowHeight * 0.4) {
        setShouldHide(true);
        return;
      }
    }

    setShouldHide(false);
  }, [isActivated]);

  useEffect(() => {
    window.addEventListener('scroll', checkVisibility, { passive: true });
    // Zpožděná počáteční kontrola – čeká na plné vykreslení stránky
    const timer = setTimeout(checkVisibility, 500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', checkVisibility);
    };
  }, [checkVisibility]);

  const animateTarget = useMemo(() => {
    if (!isActivated) {
      return { opacity: 0 };
    }
    return shouldHide ? { opacity: 0 } : { opacity: 1 };
  }, [shouldHide, isActivated]);

  if (
    pathname === '/about-us' ||
    pathname === '/blog' ||
    pathname === '/contacts' ||
    pathname.startsWith('/parte') ||
    (typeof slug === 'string' && BRANCH_PAGE_PREFIXES.some(prefix => slug.toLowerCase().startsWith(prefix)))
  ) {
    return null;
  }

  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={animateTarget}
      transition={{
        duration: isFirstVisit ? 1.8 : 0.8,
        ease: 'easeOut',
      }}
      className='bg-primary fixed right-0 bottom-5 z-30 flex gap-3 p-3.5 pr-10 shadow-lg will-change-transform lg:bottom-auto lg:top-36'
    >
      <div className='flex flex-col justify-between pr-1.5'>
        <span className='text-sm text-white'>{t('common.nonstop')}</span>
        <Link
          className='text-xl leading-none! text-white transition-all duration-300 hover:opacity-70'
          href={`tel:${PhoneNumber}`}
        >
          {PhoneNumber}
        </Link>
      </div>
    </MotionDiv>
  );
};

export default StickyContact;
