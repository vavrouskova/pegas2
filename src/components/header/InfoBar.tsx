'use client';

import { useTranslations } from 'next-intl';
import { useId, useMemo } from 'react';

import Fade from 'embla-carousel-fade';

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useCarouselAutoplay } from '@/hooks/useCarouselAutoplay';
import type { InfoBarItem } from '@/utils/wordpress-types';

const ALLOWED_SCHEMES = new Set(['http:', 'https:', 'mailto:', 'tel:']);

const isUrlSafe = (url: string): boolean => {
  const trimmed = url.trim();
  if ((trimmed.startsWith('/') && !trimmed.startsWith('//')) || trimmed.startsWith('#')) return true;
  try {
    return ALLOWED_SCHEMES.has(new URL(trimmed).protocol);
  } catch {
    return true; // relative URLs
  }
};

const ALLOWED_TAGS = ['strong', 'b', 'em', 'i', 'u'];

const sanitizeHtml = (html: string): string => {
  if (!html) return '';

  const allowedPattern = ALLOWED_TAGS.map((tag) => `</?${tag}\\b[^>]*>`).join('|');
  const allowedRegex = new RegExp(allowedPattern, 'gi');

  const allowedMatches: { index: number; match: string }[] = [];
  let match;
  while ((match = allowedRegex.exec(html)) !== null) {
    allowedMatches.push({ index: match.index, match: match[0] });
  }

  let result = '';
  let lastIndex = 0;
  for (const { index, match: tagMatch } of allowedMatches) {
    const textBetween = html.slice(lastIndex, index).replaceAll(/<[^>]*>/g, '');
    const safeTag = tagMatch.replace(/<(\w+)[^>]*>/, '<$1>');
    result += textBetween + safeTag;
    lastIndex = index + tagMatch.length;
  }
  result += html.slice(lastIndex).replaceAll(/<[^>]*>/g, '');

  return result.trim();
};

interface InfoBarProps {
  items: InfoBarItem[];
}

const InfoBar = ({ items }: InfoBarProps) => {
  const t = useTranslations('header');
  const uniqueId = useId();
  const hasMultipleItems = items.length > 1;
  const { setApi, carouselRef, setIsHovering, api } = useCarouselAutoplay({
    autoplayInterval: 4000,
  });
  const fadePlugin = useMemo(() => Fade(), []);

  if (items.length === 0) {
    return null;
  }

  const handlePrev = () => api?.scrollPrev();
  const handleNext = () => api?.scrollNext();

  const renderItem = (item: InfoBarItem, index: number) => {
    const maskId = `${uniqueId}-arrow-${index}`;
    return (
      <div className='flex items-center justify-start gap-2 text-left text-xs text-white lg:justify-center lg:text-center lg:text-sm'>
        <span
          className='text-xs! lg:text-sm! leading-normal! text-white! **:text-xs! **:lg:text-sm! **:leading-normal! **:text-white! [&_strong]:[font-variation-settings:var(--font-heading)] [&_b]:[font-variation-settings:var(--font-heading)] [&_em]:italic [&_u]:underline'
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.infoText ?? '') }}
        />
        {item.infoButtonUrl?.url?.trim() && isUrlSafe(item.infoButtonUrl.url) && (
          <a
            href={item.infoButtonUrl.url.trim()}
            target={item.infoButtonUrl.target || undefined}
            rel={item.infoButtonUrl.target === '_blank' ? 'noopener noreferrer' : undefined}
            className='flex shrink-0 items-center gap-1 whitespace-nowrap text-white underline underline-offset-2 hover:no-underline'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='none'
              aria-hidden='true'
            >
              <mask
                id={maskId}
                style={{ maskType: 'alpha' }}
                maskUnits='userSpaceOnUse'
                x='0'
                y='0'
                width='20'
                height='20'
              >
                <rect
                  width='20'
                  height='20'
                  fill='#D9D9D9'
                />
              </mask>
              <g mask={`url(#${maskId})`}>
                <path
                  d='M11.8732 13.7115L11.099 12.9535L13.5109 10.5417H4.41797V9.45834H13.5109L11.099 7.04646L11.8732 6.28854L15.5846 10L11.8732 13.7115Z'
                  fill='#F5F4F5'
                />
              </g>
            </svg>
            {t('infoBarMore')}
          </a>
        )}
      </div>
    );
  };

  if (!hasMultipleItems) {
    return (
      <div className='w-full bg-primary py-2.5 lg:py-0 lg:h-10 lg:flex lg:items-center'>
        <div className='mx-auto w-full max-w-(--max-w) px-4 lg:px-12'>{renderItem(items[0], 0)}</div>
      </div>
    );
  }

  return (
    <div
      ref={carouselRef}
      className='w-full bg-primary py-2.5 lg:py-0 lg:h-10 lg:flex lg:items-center'
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className='mx-auto flex w-full max-w-(--max-w) items-center px-1 lg:px-12'>
        <button
          onClick={handlePrev}
          className='shrink-0 cursor-pointer transition-opacity hover:opacity-70'
          aria-label={t('infoBarPrev')}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            className='size-[18px] rotate-180 lg:size-5'
            fill='none'
            aria-hidden='true'
          >
            <mask
              id={`${uniqueId}-chevron-prev`}
              style={{ maskType: 'alpha' }}
              maskUnits='userSpaceOnUse'
              x='0'
              y='0'
              width='24'
              height='24'
            >
              <rect
                width='24'
                height='24'
                fill='#D9D9D9'
              />
            </mask>
            <g mask={`url(#${uniqueId}-chevron-prev)`}>
              <path
                d='M10.0572 12L5.47266 7.4L6.52641 6.34625L12.1802 12L6.52641 17.6538L5.47266 16.6L10.0572 12ZM16.4072 12L11.8227 7.4L12.8764 6.34625L18.5302 12L12.8764 17.6538L11.8227 16.6L16.4072 12Z'
                fill='#F5F4F5'
              />
            </g>
          </svg>
        </button>

        <Carousel
          opts={{ loop: true, align: 'center' }}
          plugins={[fadePlugin]}
          setApi={setApi}
          className='mx-2 flex-1 overflow-hidden lg:mx-0'
        >
          <CarouselContent className='ml-0 [&]:grid [&]:grid-cols-1'>
            {items.map((item, index) => (
              <CarouselItem
                key={index}
                className='pl-0 [grid-area:1/1]'
              >
                {renderItem(item, index)}
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <button
          onClick={handleNext}
          className='shrink-0 cursor-pointer transition-opacity hover:opacity-70'
          aria-label={t('infoBarNext')}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            className='size-[18px] lg:size-5'
            fill='none'
            aria-hidden='true'
          >
            <mask
              id={`${uniqueId}-chevron-next`}
              style={{ maskType: 'alpha' }}
              maskUnits='userSpaceOnUse'
              x='0'
              y='0'
              width='24'
              height='24'
            >
              <rect
                width='24'
                height='24'
                fill='#D9D9D9'
              />
            </mask>
            <g mask={`url(#${uniqueId}-chevron-next)`}>
              <path
                d='M10.0572 12L5.47266 7.4L6.52641 6.34625L12.1802 12L6.52641 17.6538L5.47266 16.6L10.0572 12ZM16.4072 12L11.8227 7.4L12.8764 6.34625L18.5302 12L12.8764 17.6538L11.8227 16.6L16.4072 12Z'
                fill='#F5F4F5'
              />
            </g>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default InfoBar;
