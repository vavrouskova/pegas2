'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  ParteQuote,
  ParteQuoteCategory,
  parteQuoteCategoryLabels,
  parteQuotes,
} from '@/data/parte-quotes';
import { cn } from '@/lib/utils';

/* eslint-disable no-unused-vars */
interface QuotesDialogProps {
  open: boolean;
  onOpenChange: (nextOpen: boolean) => void;
  onSelect: (quote: ParteQuote) => void;
}
/* eslint-enable no-unused-vars */

const decodeHtmlEntities = (text: string): string =>
  text.replaceAll('&nbsp;', '\u00a0').replaceAll('&amp;', '&');

const QuotesDialog = ({ open, onOpenChange, onSelect }: QuotesDialogProps) => {
  const tQuotes = useTranslations();
  void tQuotes;
  const [category, setCategory] = useState<ParteQuoteCategory | 'all'>('all');
  const [query, setQuery] = useState('');

  const categories: (ParteQuoteCategory | 'all')[] = [
    'all',
    'literary',
    'religious',
    'father',
    'mother',
    'universal',
    'children',
  ];

  const normalizedQuery = query.trim().toLocaleLowerCase('cs');
  const visibleQuotes = parteQuotes.filter((quote) => {
    if (category !== 'all' && quote.category !== category) return false;
    if (!normalizedQuery) return true;
    const haystack = `${quote.text} ${quote.author ?? ''}`.toLocaleLowerCase('cs');
    return haystack.includes(normalizedQuery);
  });

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className='max-w-2xl bg-white'>
        <DialogHeader>
          <DialogTitle>Vyberte citát</DialogTitle>
        </DialogHeader>

        <input
          type='text'
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder='Hledat ve verších a autorech…'
          className='border-primary/20 text-primary focus:border-primary/50 border bg-white p-2.5 text-sm focus:outline-none'
        />

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
              {cat === 'all' ? 'Vše' : parteQuoteCategoryLabels[cat]}
            </button>
          ))}
        </div>

        <div className='flex max-h-[60vh] flex-col gap-2 overflow-y-auto p-1'>
          {visibleQuotes.length === 0 && (
            <p className='text-primary/50 px-4 py-8 text-center text-sm'>
              Pro zadaný dotaz se nenašel žádný verš.
            </p>
          )}
          {visibleQuotes.map((quote) => (
            <button
              key={quote.id}
              type='button'
              onClick={() => {
                onSelect({ ...quote, text: decodeHtmlEntities(quote.text) });
                onOpenChange(false);
              }}
              className='border-primary/10 hover:bg-white-smoke flex flex-col gap-1 border bg-white p-4 text-left transition'
            >
              <span
                className='font-italic text-primary text-base leading-snug'
                dangerouslySetInnerHTML={{ __html: quote.text }}
              />
              {quote.author && <span className='text-primary/60 text-xs'>— {quote.author}</span>}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuotesDialog;
