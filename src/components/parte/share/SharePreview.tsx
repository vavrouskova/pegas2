'use client';

import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import StaticParteSvg from '@/components/parte/StaticParteSvg';
import { Link } from '@/i18n/routing';
import { ParteDraft, ParteTemplate } from '@/types/parte';
import { exportParteToPdf } from '@/utils/parte/export-pdf';
import { svgElementToPng } from '@/utils/parte/svg-to-png';

interface SharePreviewProps {
  template: ParteTemplate;
  draft: ParteDraft;
}

const SharePreview = ({ template, draft }: SharePreviewProps) => {
  const t = useTranslations('parte.share.preview');
  const tToast = useTranslations('parte.editor.toast');
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    const svg = wrapperRef.current?.querySelector('svg');
    if (!svg) {
      toast.error('Nepodařilo se připravit PDF.');
      return;
    }
    setDownloading(true);
    try {
      const png = await svgElementToPng(svg as SVGSVGElement, 4);
      await exportParteToPdf(png, `parte-${template.id}.pdf`);
      toast.success(tToast('pdf-ready'));
    } catch {
      toast.error('Export PDF selhal.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <main className='max-w-container mx-auto flex flex-col items-center gap-8 px-4 py-10 lg:py-16'>
      <h1>{t('title')}</h1>

      <div
        ref={wrapperRef}
        className='ring-primary/10 aspect-[210/297] w-full max-w-xl bg-white shadow-lg ring-1'
      >
        <StaticParteSvg
          template={template}
          draft={draft}
          className='h-full w-full'
        />
      </div>

      <div className='flex flex-col gap-3 sm:flex-row'>
        <button
          type='button'
          onClick={handleDownload}
          disabled={downloading}
          className='bg-primary text-white-smoke flex items-center justify-center gap-2 px-6 py-3 text-base transition-opacity hover:opacity-90 disabled:opacity-60'
        >
          <Download className='h-4 w-4' />
          {downloading ? 'Připravuji…' : t('download')}
        </button>
        <Link
          href='/parte'
          className='border-primary/20 text-primary hover:bg-white-smoke flex items-center justify-center border bg-white px-6 py-3 text-sm transition'
        >
          {t('create-own')}
        </Link>
      </div>
    </main>
  );
};

export default SharePreview;
