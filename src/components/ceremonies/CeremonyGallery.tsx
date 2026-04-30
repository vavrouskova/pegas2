'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';

import { CeremonyGalleryItem } from '@/types/ceremony';

interface CeremonyGalleryProps {
  items: CeremonyGalleryItem[];
  ceremonySlug: string;
}

const triggerDownload = (src: string, filename: string) => {
  const link = document.createElement('a');
  link.href = src;
  link.download = filename;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const filenameFromSrc = (src: string, fallback: string): string => {
  const last = src.split('/').pop();
  if (last && last.includes('.')) return last;
  return `${fallback}.jpg`;
};

const CeremonyGallery = ({ items, ceremonySlug }: CeremonyGalleryProps) => {
  const t = useTranslations('ceremonies.detail');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);

  useEffect(() => {
    if (activeIndex === null) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') {
        setActiveIndex((i) => (i === null ? null : (i + 1) % items.length));
      }
      if (event.key === 'ArrowLeft') {
        setActiveIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIndex, close, items.length]);

  const handleDownloadAll = () => {
    items.forEach((item, index) => {
      setTimeout(() => {
        triggerDownload(item.src, filenameFromSrc(item.src, `${ceremonySlug}-${index + 1}`));
      }, index * 250);
    });
  };

  if (items.length === 0) return null;

  const active = activeIndex !== null ? items[activeIndex] : null;

  return (
    <section className='mt-12'>
      <h2 className='font-heading text-primary mb-6 text-base'>{t('gallery-title')}</h2>

      <div className='grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4'>
        {items.map((item, index) => (
          <div
            key={`${item.src}-${index}`}
            className='group bg-grey-warm relative aspect-square overflow-hidden'
          >
            <button
              type='button'
              onClick={() => setActiveIndex(index)}
              className='absolute inset-0 z-10 cursor-zoom-in'
              aria-label={item.alt}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes='(max-width: 1024px) 50vw, 25vw'
                className='object-cover transition-opacity duration-300 group-hover:opacity-80'
              />
            </button>
            <button
              type='button'
              onClick={(event) => {
                event.stopPropagation();
                triggerDownload(item.src, filenameFromSrc(item.src, `${ceremonySlug}-${index + 1}`));
              }}
              className='bg-primary/90 text-white-smoke hover:bg-primary absolute right-2 bottom-2 z-20 flex h-9 w-9 items-center justify-center transition-opacity'
              aria-label={`Stáhnout ${item.alt}`}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
                <polyline points='7 10 12 15 17 10' />
                <line x1='12' y1='15' x2='12' y2='3' />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className='mt-6 flex justify-end'>
        <button
          type='button'
          onClick={handleDownloadAll}
          className='text-primary font-text inline-flex items-center gap-2 text-base underline underline-offset-4 hover:no-underline'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='18'
            height='18'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
            <polyline points='7 10 12 15 17 10' />
            <line x1='12' y1='15' x2='12' y2='3' />
          </svg>
          {t('download-all')}
        </button>
      </div>

      {active && (
        <div
          className='fixed inset-0 z-[1100] flex items-center justify-center bg-black/80 p-4'
          onClick={close}
          role='dialog'
          aria-modal='true'
        >
          <button
            type='button'
            onClick={(event) => {
              event.stopPropagation();
              close();
            }}
            className='absolute top-6 right-6 z-10 text-white hover:opacity-70'
            aria-label='Zavřít'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='28'
              height='28'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M18 6 6 18' />
              <path d='m6 6 12 12' />
            </svg>
          </button>
          <div
            className='relative max-h-[90vh] max-w-[90vw]'
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={active.src}
              alt={active.alt}
              width={1600}
              height={1200}
              className='max-h-[90vh] w-auto object-contain'
              unoptimized
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default CeremonyGallery;
