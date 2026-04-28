'use client';

import { ArrowLeft, Redo2, Undo2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/routing';

/* eslint-disable no-unused-vars */
interface EditorToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}
/* eslint-enable no-unused-vars */

const IconChip = ({
  label,
  icon: Icon,
  onClick,
  disabled = false,
}: {
  label: string;
  icon: typeof Undo2;
  onClick: () => void;
  disabled?: boolean;
}) => (
  <button
    type='button'
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={label}
    className='box-border flex h-[40px] w-[40px] shrink-0 items-center justify-center bg-white transition-opacity duration-300 hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30'
  >
    <Icon className='text-primary h-4 w-4' />
  </button>
);

const EditorToolbar = ({ canUndo, canRedo, onUndo, onRedo }: EditorToolbarProps) => {
  const t = useTranslations('parte.editor');

  return (
    <div className='bg-white-smoke flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 lg:px-8'>
      <Link
        href='/parte'
        className='text-primary font-text flex items-center gap-2 text-sm transition-opacity duration-300 hover:opacity-70'
      >
        <ArrowLeft className='h-4 w-4' />
        <span>{t('back')}</span>
      </Link>

      <div className='flex flex-wrap items-center gap-1'>
        <IconChip
          label={t('undo')}
          icon={Undo2}
          onClick={onUndo}
          disabled={!canUndo}
        />
        <IconChip
          label={t('redo')}
          icon={Redo2}
          onClick={onRedo}
          disabled={!canRedo}
        />
      </div>
    </div>
  );
};

export default EditorToolbar;
