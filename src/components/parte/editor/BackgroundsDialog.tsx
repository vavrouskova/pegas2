'use client';

import type React from 'react';
import { useState } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  ParteBackground,
  ParteBackgroundCategory,
  parteBackgroundCategoryLabels,
  parteBackgrounds,
} from '@/data/parte-backgrounds';
import { cn } from '@/lib/utils';

/* eslint-disable no-unused-vars */
interface BackgroundsDialogProps {
  open: boolean;
  onOpenChange: (nextOpen: boolean) => void;
  onSelect: (background: ParteBackground) => void;
  selectedId?: string;
}
/* eslint-enable no-unused-vars */

const BackgroundsDialog = ({ open, onOpenChange, onSelect, selectedId }: BackgroundsDialogProps) => {
  const [category, setCategory] = useState<ParteBackgroundCategory | 'all'>('all');

  const categories: (ParteBackgroundCategory | 'all')[] = ['all', 'solid', 'gradient', 'motif'];
  const visible =
    category === 'all' ? parteBackgrounds : parteBackgrounds.filter((b) => b.category === category);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className='max-w-2xl bg-white'>
        <DialogHeader>
          <DialogTitle>Vyberte pozadí</DialogTitle>
        </DialogHeader>

        <p className='text-primary/60 text-sm'>
          Plnou galerii pozadí (fotky, textury) doplníme později. Zatím jsou k dispozici barvy a motivy v duchu značky.
        </p>

        <div className='border-primary/10 flex flex-wrap gap-1 border-b'>
          {categories.map((cat) => (
            <button
              key={cat}
              type='button'
              onClick={() => setCategory(cat)}
              className={cn(
                '-mb-px border-b-2 px-4 py-2 text-sm transition',
                category === cat
                  ? 'border-primary text-primary font-medium'
                  : 'text-primary/60 hover:text-primary border-transparent'
              )}
            >
              {cat === 'all' ? 'Vše' : parteBackgroundCategoryLabels[cat]}
            </button>
          ))}
        </div>

        <div className='grid max-h-[60vh] grid-cols-3 gap-3 overflow-y-auto p-1 sm:grid-cols-4'>
          {visible.map((bg) => {
            const style: React.CSSProperties =
              bg.category === 'gradient'
                ? { background: bg.fill }
                : bg.category === 'motif'
                  ? { backgroundColor: bg.fill, backgroundImage: `url("${bg.preview}")`, backgroundSize: 'cover' }
                  : { backgroundColor: bg.fill };
            return (
              <button
                key={bg.id}
                type='button'
                onClick={() => {
                  onSelect(bg);
                  onOpenChange(false);
                }}
                className={cn(
                  'group flex flex-col gap-2 p-2 transition',
                  selectedId === bg.id ? 'bg-primary/10' : 'hover:bg-white-smoke'
                )}
              >
                <div
                  className={cn(
                    'ring-primary/10 aspect-square w-full ring-1',
                    selectedId === bg.id && 'ring-primary ring-2'
                  )}
                  style={style}
                />
                <span className='text-primary/80 line-clamp-2 min-h-8 text-xs leading-tight'>
                  {bg.name}
                </span>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BackgroundsDialog;
