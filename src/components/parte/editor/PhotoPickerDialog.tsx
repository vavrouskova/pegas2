'use client';

import { Upload } from 'lucide-react';
import { ChangeEvent, useRef, useState } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { parteLibraryPhotos } from '@/data/parte-library';
import { cn } from '@/lib/utils';
import { ParteLibraryPhoto } from '@/types/parte';

/* eslint-disable no-unused-vars */
interface PhotoPickerDialogProps {
  open: boolean;
  onOpenChange: (nextOpen: boolean) => void;
  onSelect: (url: string) => void;
  title: string;
  category: ParteLibraryPhoto['category'];
}
/* eslint-enable no-unused-vars */

type Tab = 'upload' | 'library';

const PhotoPickerDialog = ({
  open,
  onOpenChange,
  onSelect,
  title,
  category,
}: PhotoPickerDialogProps) => {
  const [tab, setTab] = useState<Tab>('library');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const photos = parteLibraryPhotos.filter((p) => p.category === category);

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        onSelect(reader.result);
        onOpenChange(false);
      }
    });
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className='max-w-3xl bg-white'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className='flex gap-1'>
          {(['library', 'upload'] as Tab[]).map((value) => (
            <button
              key={value}
              type='button'
              onClick={() => setTab(value)}
              className={cn(
                'box-border flex max-h-[40px] items-center justify-center px-3 py-[10px] transition-opacity duration-300 hover:opacity-70',
                tab === value ? 'bg-primary' : 'bg-white-smoke'
              )}
            >
              <span
                className={cn(
                  'text-sm whitespace-pre',
                  tab === value ? 'font-heading text-white-smoke' : 'font-text text-primary'
                )}
              >
                {value === 'library' ? 'Z galerie' : 'Vlastní foto'}
              </span>
            </button>
          ))}
        </div>

        {tab === 'library' ? (
          <div className='grid max-h-96 grid-cols-3 gap-4 overflow-y-auto p-1 sm:grid-cols-4'>
            {photos.map((photo) => (
              <button
                key={photo.id}
                type='button'
                onClick={() => {
                  onSelect(photo.url);
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
        ) : (
          <div className='flex flex-col items-center gap-4 p-6'>
            <p className='text-primary/70 max-w-md text-center text-sm'>
              Nahrajte vlastní fotografii (JPG, PNG). Ideální poměr stran se liší podle šablony.
            </p>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              onChange={handleUpload}
              className='hidden'
            />
            <button
              type='button'
              onClick={() => fileInputRef.current?.click()}
              className='bg-primary text-white-smoke font-heading flex items-center justify-center gap-2 px-6 py-2.5 text-sm transition-opacity hover:opacity-90'
            >
              <Upload className='h-4 w-4' />
              Vybrat soubor
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PhotoPickerDialog;
