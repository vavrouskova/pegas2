'use client';

import { Check, Plus, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

/* eslint-disable no-unused-vars */
interface ActionsPanelProps {
  onDownloadPdf: () => void;
  onDownloadCmyk: () => void;
  onShare: () => void;
  onSendEmail: () => void;
  onSaveDraft: () => void;
  onReset: () => void;
  onOpenBackgrounds: () => void;
  onAddPortrait: () => void;
  onAddCross: () => void;
  onRemovePortrait: () => void;
  onRemoveCross: () => void;
  hasPortrait: boolean;
  hasCross: boolean;
}
/* eslint-enable no-unused-vars */

const ActionButton = ({
  label,
  onClick,
  active = false,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
}) => (
  <button
    type='button'
    onClick={onClick}
    className={cn(
      'box-border flex w-full max-h-[40px] items-center justify-center px-3 py-[10px] transition-opacity duration-300 hover:opacity-70',
      active ? 'bg-primary' : 'bg-white'
    )}
  >
    <span
      className={cn(
        'text-sm whitespace-pre',
        active ? 'font-heading text-white-smoke' : 'font-text text-primary'
      )}
    >
      {label}
    </span>
  </button>
);

const AddChip = ({
  label,
  onClick,
  onRemove,
  present,
}: {
  label: string;
  onClick: () => void;
  onRemove: () => void;
  present: boolean;
}) => (
  <div className='flex items-stretch gap-1'>
    <button
      type='button'
      onClick={onClick}
      className='text-primary font-text bg-white box-border flex w-full max-h-[40px] items-center justify-center gap-1.5 px-3 py-[10px] text-sm transition-opacity duration-300 hover:opacity-70'
    >
      {present ? <Check className='h-3.5 w-3.5' /> : <Plus className='h-3.5 w-3.5' />}
      <span>{label}</span>
    </button>
    {present && (
      <button
        type='button'
        onClick={onRemove}
        aria-label={`Odebrat ${label.toLowerCase()}`}
        className='text-primary bg-white box-border flex h-[40px] w-[40px] shrink-0 items-center justify-center transition-opacity duration-300 hover:opacity-70'
      >
        <X className='h-3.5 w-3.5' />
      </button>
    )}
  </div>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className='text-primary/50 text-[11px] font-medium tracking-[0.08em] uppercase'>{children}</p>
);

const ActionsPanel = ({
  onDownloadPdf,
  onDownloadCmyk,
  onShare,
  onSendEmail,
  onSaveDraft,
  onReset,
  onOpenBackgrounds,
  onAddPortrait,
  onAddCross,
  onRemovePortrait,
  onRemoveCross,
  hasPortrait,
  hasCross,
}: ActionsPanelProps) => {
  const t = useTranslations('parte.editor');

  return (
    <div className='bg-white-smoke border-primary/10 flex flex-col gap-4 border-t p-4'>
      <div className='flex flex-col gap-2'>
        <SectionLabel>Úpravy</SectionLabel>
        <ActionButton
          label='Pozadí'
          onClick={onOpenBackgrounds}
        />
        <AddChip
          label='Portrét'
          onClick={onAddPortrait}
          onRemove={onRemovePortrait}
          present={hasPortrait}
        />
        <AddChip
          label='Symbol'
          onClick={onAddCross}
          onRemove={onRemoveCross}
          present={hasCross}
        />
      </div>

      <div className='flex flex-col gap-2'>
        <SectionLabel>Odeslat</SectionLabel>
        <div className='flex gap-1'>
          <ActionButton
            label='Odkazem'
            onClick={onShare}
          />
          <ActionButton
            label='E-mailem'
            onClick={onSendEmail}
          />
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <SectionLabel>Stáhnout</SectionLabel>
        <ActionButton
          label='Pro tisk (CMYK)'
          onClick={onDownloadCmyk}
        />
        <ActionButton
          label={t('download-pdf')}
          onClick={onDownloadPdf}
          active
        />
      </div>

      <div className='text-primary/60 flex flex-wrap items-center justify-between gap-2 pt-1 text-xs'>
        <span className='flex items-center gap-1.5'>
          <Check className='h-3 w-3' />
          Ukládá se automaticky
        </span>
        <div className='flex items-center gap-3'>
          <button
            type='button'
            onClick={onReset}
            className='text-primary/70 underline-offset-2 transition-opacity hover:opacity-70 hover:underline'
          >
            Vrátit na výchozí
          </button>
          <span className='text-primary/20' aria-hidden='true'>·</span>
          <button
            type='button'
            onClick={onSaveDraft}
            className='text-primary underline-offset-2 transition-opacity hover:opacity-70 hover:underline'
          >
            Uložit teď
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionsPanel;
