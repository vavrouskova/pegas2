'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { parteLibraryPhotos } from '@/data/parte-library';
import { cn } from '@/lib/utils';
import { ParteLibraryPhoto } from '@/types/parte';

interface PhotoLibraryDialogProps {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (nextOpen: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  onSelect: (selectedPhoto: ParteLibraryPhoto) => void;
}

type Category = 'backgrounds' | 'symbols';

const PhotoLibraryDialog = ({ open, onOpenChange, onSelect }: PhotoLibraryDialogProps) => {
  const t = useTranslations('parte.editor.library');
  const [category, setCategory] = useState<Category>('backgrounds');

  const photos = parteLibraryPhotos.filter((p) => p.category === category);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className='max-w-3xl bg-white'>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>

        <div className='border-primary/10 flex gap-2 border-b'>
          {(['backgrounds', 'symbols'] as Category[]).map((cat) => (
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
              {t(cat)}
            </button>
          ))}
        </div>

        <div className='grid max-h-96 grid-cols-3 gap-4 overflow-y-auto p-1 sm:grid-cols-4'>
          {photos.map((photo) => (
            <button
              key={photo.id}
              type='button'
              onClick={() => {
                onSelect(photo);
                onOpenChange(false);
              }}
              className='group hover:bg-white-smoke flex flex-col gap-1 p-2 transition'
            >
              <div className='ring-primary/10 aspect-square overflow-hidden bg-white ring-1'>
                <img
                  src={photo.url}
                  alt={photo.label}
                  className='h-full w-full object-cover transition-transform group-hover:scale-105'
                />
              </div>
              <span className='text-primary/70 text-xs'>{photo.label}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoLibraryDialog;
