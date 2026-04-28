'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { Ceremony } from '@/types/ceremony';
import { buildCeremonyIcs } from '@/utils/ceremonies/ics';

interface CeremonyActionsProps {
  ceremony: Ceremony;
}

const CeremonyActions = ({ ceremony }: CeremonyActionsProps) => {
  const t = useTranslations('ceremonies.detail');
  const [shareOpen, setShareOpen] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(t('link-copied'));
    } catch {
      // ignore
    }
  };

  const handleSaveToCalendar = () => {
    const ics = buildCeremonyIcs(ceremony);
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rozlouceni-${ceremony.slug}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const shareTitle = `Rozloučení s ${ceremony.person.firstName} ${ceremony.person.lastName}`;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = encodeURIComponent(`${shareTitle} – ${shareUrl}`);

  return (
    <div className='flex flex-wrap items-center gap-x-8 gap-y-3'>
      <a
        href={ceremony.venue.mapsUrl}
        target='_blank'
        rel='noopener noreferrer'
        className='text-primary font-text text-base underline underline-offset-4 hover:no-underline'
      >
        {t('show-on-map')}
      </a>
      <button
        type='button'
        onClick={handleSaveToCalendar}
        className='text-primary font-text text-base underline underline-offset-4 hover:no-underline'
      >
        {t('save-to-calendar')}
      </button>
      <button
        type='button'
        onClick={handleCopyLink}
        className='text-primary font-text text-base underline underline-offset-4 hover:no-underline'
      >
        {t('copy-link')}
      </button>
      <div className='relative'>
        <button
          type='button'
          onClick={() => setShareOpen((open) => !open)}
          className='text-primary font-text text-base underline underline-offset-4 hover:no-underline'
        >
          {t('share')}
        </button>
        {shareOpen && (
          <div className='absolute top-full left-0 z-10 mt-2 flex flex-col gap-2 bg-white p-4 shadow-lg'>
            <a
              href={`https://wa.me/?text=${shareText}`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary font-text text-sm hover:underline'
            >
              {t('share-whatsapp')}
            </a>
            <a
              href={`sms:?body=${shareText}`}
              className='text-primary font-text text-sm hover:underline'
            >
              {t('share-sms')}
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${shareText}`}
              className='text-primary font-text text-sm hover:underline'
            >
              {t('share-email')}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default CeremonyActions;
