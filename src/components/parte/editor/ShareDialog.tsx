'use client';

import { Check, Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FormEvent, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getPathname } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { ParteDraft } from '@/types/parte';
import { encodeDraft } from '@/utils/parte/encode-draft';

/* eslint-disable no-unused-vars */
interface ShareDialogProps {
  open: boolean;
  onOpenChange: (nextOpen: boolean) => void;
  draft: ParteDraft;
  locale: string;
  defaultTab?: 'link' | 'email';
}
/* eslint-enable no-unused-vars */

// eslint-disable-next-line sonarjs/slow-regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ShareDialog = ({ open, onOpenChange, draft, locale, defaultTab = 'link' }: ShareDialogProps) => {
  const t = useTranslations('parte.share');
  const tToast = useTranslations('parte.editor.toast');
  const [tab, setTab] = useState<'link' | 'email'>(defaultTab);
  const [copied, setCopied] = useState(false);

  const [recipients, setRecipients] = useState('');
  const [subject, setSubject] = useState('Smuteční oznámení');
  const [message, setMessage] = useState('Se smutkem vám posíláme parte naší blízké osoby.');
  const [sending, setSending] = useState(false);

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const token = encodeDraft(draft);
    const pathname = getPathname({
      href: { pathname: '/parte/share/[token]', params: { token } },
      locale,
    });
    return `${window.location.origin}${pathname}`;
  }, [draft, locale]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success(tToast('copied'));
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('Nepodařilo se zkopírovat odkaz.');
    }
  };

  const handleEmailSubmit = (event: FormEvent) => {
    event.preventDefault();
    const list = recipients
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
    if (list.length === 0) {
      toast.error(t('email-form.validation.recipients-required'));
      return;
    }
    if (list.some((entry) => !EMAIL_REGEX.test(entry))) {
      toast.error(t('email-form.validation.recipients-invalid'));
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success(tToast('email-sent'));
      onOpenChange(false);
    }, 800);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className='max-w-lg bg-white'>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <div className='border-primary/10 flex gap-2 border-b'>
          {(['link', 'email'] as const).map((key) => (
            <button
              key={key}
              type='button'
              onClick={() => setTab(key)}
              className={cn(
                '-mb-px border-b-2 px-4 py-2 text-sm transition',
                tab === key
                  ? 'border-primary text-primary font-medium'
                  : 'text-primary/60 hover:text-primary border-transparent'
              )}
            >
              {key === 'link' ? t('link-tab') : t('email-tab')}
            </button>
          ))}
        </div>

        {tab === 'link' ? (
          <div className='flex flex-col gap-3'>
            <label className='text-primary/60 text-xs font-medium tracking-wide uppercase'>{t('link-label')}</label>
            <div className='flex items-stretch gap-2'>
              <input
                readOnly
                value={shareUrl}
                className='border-primary/20 bg-white-smoke text-primary flex-1 border p-2.5 font-mono text-xs'
                onFocus={(event) => event.target.select()}
              />
              <button
                type='button'
                onClick={handleCopy}
                className='bg-primary text-white-smoke flex items-center gap-2 px-4 text-sm transition-opacity hover:opacity-90'
              >
                {copied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
                {t('copy')}
              </button>
            </div>
            <p className='text-primary/60 text-xs leading-relaxed'>
              Odkaz obsahuje kompletní obsah parte – ten, kdo ho otevře, uvidí stejné parte jako vy.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleEmailSubmit}
            className='flex flex-col gap-3'
          >
            <div className='flex flex-col gap-1.5'>
              <label className='text-primary/60 text-xs font-medium tracking-wide uppercase'>
                {t('email-form.recipients')}
              </label>
              <input
                type='text'
                value={recipients}
                onChange={(event) => setRecipients(event.target.value)}
                placeholder={t('email-form.recipients-placeholder')}
                className='border-primary/20 text-primary focus:border-primary/50 border bg-white p-2.5 text-sm focus:outline-none'
                required
              />
            </div>
            <div className='flex flex-col gap-1.5'>
              <label className='text-primary/60 text-xs font-medium tracking-wide uppercase'>
                {t('email-form.subject')}
              </label>
              <input
                type='text'
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder={t('email-form.subject-placeholder')}
                className='border-primary/20 text-primary focus:border-primary/50 border bg-white p-2.5 text-sm focus:outline-none'
              />
            </div>
            <div className='flex flex-col gap-1.5'>
              <label className='text-primary/60 text-xs font-medium tracking-wide uppercase'>
                {t('email-form.message')}
              </label>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={t('email-form.message-placeholder')}
                className='min-h-24 border-primary/20 text-primary focus:border-primary/50 border bg-white p-2.5 text-sm focus:outline-none'
                rows={4}
              />
            </div>
            <button
              type='submit'
              disabled={sending}
              className='bg-primary text-white-smoke mt-2 flex items-center justify-center gap-2 px-6 py-2.5 text-sm transition-opacity hover:opacity-90 disabled:opacity-60'
            >
              {sending ? 'Odesílám…' : t('email-form.send')}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
