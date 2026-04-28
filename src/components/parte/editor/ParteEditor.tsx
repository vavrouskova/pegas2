'use client';

import { useLocale, useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import ActionsPanel from '@/components/parte/editor/ActionsPanel';
import BackgroundsDialog from '@/components/parte/editor/BackgroundsDialog';
import EditorToolbar from '@/components/parte/editor/EditorToolbar';
import PhotoLibraryDialog from '@/components/parte/editor/PhotoLibraryDialog';
import PhotoPickerDialog from '@/components/parte/editor/PhotoPickerDialog';
import PropertiesPanel from '@/components/parte/editor/PropertiesPanel';
import QuotesDialog from '@/components/parte/editor/QuotesDialog';
import ShareDialog from '@/components/parte/editor/ShareDialog';
import { ParteDraft, ParteTemplate, ParteTextStyle } from '@/types/parte';
import { createEmptyDraft } from '@/utils/parte/create-empty-draft';
import { mergeTemplateWithDraft } from '@/utils/parte/effective-template';
import { exportParteToPdf } from '@/utils/parte/export-pdf';

// eslint-disable-next-line no-restricted-imports
import type { EditorCanvasHandle } from './EditorCanvas';

const EditorCanvas = dynamic(() => import('./EditorCanvas'), {
  ssr: false,
  loading: () => (
    <div className='text-primary/60 flex h-full w-full items-center justify-center bg-white text-sm'>
      Načítám editor…
    </div>
  ),
});

interface ParteEditorProps {
  template: ParteTemplate;
}

const MAX_HISTORY = 40;

const storageKey = (id: string) => `parte-draft-${id}`;

const ParteEditor = ({ template }: ParteEditorProps) => {
  const t = useTranslations('parte.editor.toast');
  const locale = useLocale();

  const [draft, setDraft] = useState<ParteDraft>(() => createEmptyDraft(template));
  const [past, setPast] = useState<ParteDraft[]>([]);
  const [future, setFuture] = useState<ParteDraft[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareTab, setShareTab] = useState<'link' | 'email'>('link');
  const [quotesOpen, setQuotesOpen] = useState(false);
  const [backgroundsOpen, setBackgroundsOpen] = useState(false);
  const [overlayPicker, setOverlayPicker] = useState<'portrait' | 'cross' | null>(null);
  const [stageSize, setStageSize] = useState({ width: template.width, height: template.height, scale: 1 });
  const [hydrated, setHydrated] = useState(false);

  const canvasHandleRef = useRef<EditorCanvasHandle | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey(template.id));
      if (saved) {
        const parsed = JSON.parse(saved) as ParteDraft;
        if (parsed?.templateId === template.id) {
          if (typeof parsed.portraitOverlay === 'string') parsed.portraitOverlay = undefined;
          if (typeof parsed.crossOverlay === 'string') parsed.crossOverlay = undefined;
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setDraft(parsed);
        }
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, [template.id]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(storageKey(template.id), JSON.stringify(draft));
    } catch {
      /* ignore quota errors */
    }
  }, [draft, template.id, hydrated]);

  useEffect(() => {
    const update = () => {
      if (!canvasContainerRef.current) return;
      const rect = canvasContainerRef.current.getBoundingClientRect();
      const scale = Math.min(rect.width / template.width, rect.height / template.height, 1.6);
      setStageSize({
        width: template.width * scale,
        height: template.height * scale,
        scale,
      });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [template.width, template.height]);

  const pushHistory = useCallback((previous: ParteDraft) => {
    setPast((p) => {
      const next = [...p, previous];
      if (next.length > MAX_HISTORY) next.shift();
      return next;
    });
    setFuture([]);
  }, []);

  const mutateDraft = useCallback(
    // eslint-disable-next-line no-unused-vars
    (producer: (previous: ParteDraft) => ParteDraft) => {
      setDraft((previous) => {
        pushHistory(previous);
        return producer(previous);
      });
    },
    [pushHistory]
  );

  const handleTextChange = useCallback(
    (slotId: string, value: string) => {
      mutateDraft((previous) => ({ ...previous, texts: { ...previous.texts, [slotId]: value } }));
    },
    [mutateDraft]
  );

  const handleTextStyleChange = useCallback(
    (slotId: string, key: keyof ParteTextStyle, value: string | number) => {
      mutateDraft((previous) => ({
        ...previous,
        textStyles: {
          ...previous.textStyles,
          [slotId]: { ...previous.textStyles[slotId], [key]: value },
        },
      }));
    },
    [mutateDraft]
  );

  const handlePhotoChange = useCallback(
    (slotId: string, value: string | null) => {
      mutateDraft((previous) => {
        const nextPhotos = { ...previous.photos };
        if (value === null) delete nextPhotos[slotId];
        else nextPhotos[slotId] = value;
        return { ...previous, photos: nextPhotos };
      });
    },
    [mutateDraft]
  );

  const handleUndo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past.at(-1);
    if (!previous) return;
    setFuture((f) => [draft, ...f].slice(0, MAX_HISTORY));
    setPast((p) => p.slice(0, -1));
    setDraft(previous);
  }, [past, draft]);

  const handleRedo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    setPast((p) => [...p, draft].slice(-MAX_HISTORY));
    setFuture((f) => f.slice(1));
    setDraft(next);
  }, [future, draft]);

  const handleDownload = useCallback(
    async (cmyk: boolean) => {
      const dataUrl = canvasHandleRef.current?.exportPng(4);
      if (!dataUrl) {
        toast.error('Nepodařilo se připravit PDF.');
        return;
      }
      try {
        await exportParteToPdf(dataUrl, `parte-${template.id}.pdf`);
        if (cmyk) toast.info(t('pdf-cmyk-note'));
        else toast.success(t('pdf-ready'));
      } catch {
        toast.error('Export PDF selhal.');
      }
    },
    [t, template.id]
  );

  const handleSaveDraft = useCallback(() => {
    try {
      localStorage.setItem(storageKey(template.id), JSON.stringify(draft));
      toast.success(t('draft-saved'));
    } catch {
      toast.error('Nepodařilo se uložit.');
    }
  }, [draft, template.id, t]);

  const handleReset = useCallback(() => {
    const ok = window.confirm(
      'Opravdu chcete vrátit parte na výchozí stav? Všechny úpravy textu, fotografií a pozadí se ztratí.'
    );
    if (!ok) return;
    setPast((p) => [...p, draft].slice(-MAX_HISTORY));
    setFuture([]);
    setDraft(createEmptyDraft(template));
    setSelectedSlotId(null);
    toast.success('Parte vráceno na výchozí stav.');
  }, [draft, template]);

  const openShare = useCallback((tab: 'link' | 'email') => {
    setShareTab(tab);
    setShareOpen(true);
  }, []);

  const effectiveTemplate = useMemo(() => mergeTemplateWithDraft(template, draft), [template, draft]);

  return (
    <div className='flex min-h-[calc(100vh-var(--header-height))] flex-col bg-white-smoke'>
      <EditorToolbar
        canUndo={past.length > 0}
        canRedo={future.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />

      <div className='flex flex-1 flex-col lg:flex-row'>
        <div
          ref={canvasContainerRef}
          className='flex flex-1 items-center justify-center p-4 lg:p-8'
        >
          <div
            className='bg-white shadow-lg ring-1 ring-primary/10'
            style={{ width: stageSize.width, height: stageSize.height }}
          >
            <EditorCanvas
              ref={canvasHandleRef}
              template={effectiveTemplate}
              draft={draft}
              selectedSlotId={selectedSlotId}
              onSelectSlot={setSelectedSlotId}
              onOverlayMove={(kind, x, y) => {
                const field = kind === 'cross' ? 'crossOverlay' : 'portraitOverlay';
                mutateDraft((previous) => {
                  const current = previous[field];
                  if (!current) return previous;
                  return { ...previous, [field]: { ...current, x, y } };
                });
              }}
              scale={stageSize.scale}
            />
          </div>
        </div>

        <div className='border-primary/10 flex w-full flex-col border-t bg-white lg:w-[320px] lg:border-t-0 lg:border-l'>
          <div className='flex-1'>
            <PropertiesPanel
              template={effectiveTemplate}
              selectedSlotId={selectedSlotId}
              texts={draft.texts}
              photos={draft.photos}
              portraitOverlay={draft.portraitOverlay}
              crossOverlay={draft.crossOverlay}
              onTextChange={handleTextChange}
              onTextStyleChange={handleTextStyleChange}
              onPhotoChange={handlePhotoChange}
              onOpenPhotoLibrary={() => setLibraryOpen(true)}
              onOpenQuotes={() => setQuotesOpen(true)}
              onOverlayZoomChange={(kind, zoom) => {
                const field = kind === 'cross' ? 'crossOverlay' : 'portraitOverlay';
                mutateDraft((previous) => {
                  const current = previous[field];
                  if (!current) return previous;
                  return { ...previous, [field]: { ...current, zoom } };
                });
              }}
              onOverlayRemove={(kind) => {
                const field = kind === 'cross' ? 'crossOverlay' : 'portraitOverlay';
                mutateDraft((previous) => ({ ...previous, [field]: undefined }));
                setSelectedSlotId(null);
              }}
            />
          </div>
          <ActionsPanel
            onDownloadPdf={() => handleDownload(false)}
            onDownloadCmyk={() => handleDownload(true)}
            onShare={() => openShare('link')}
            onSendEmail={() => openShare('email')}
            onSaveDraft={handleSaveDraft}
            onReset={handleReset}
            onOpenBackgrounds={() => setBackgroundsOpen(true)}
            onAddPortrait={() => setOverlayPicker('portrait')}
            onAddCross={() => setOverlayPicker('cross')}
            onRemovePortrait={() =>
              mutateDraft((previous) => ({ ...previous, portraitOverlay: undefined }))
            }
            onRemoveCross={() =>
              mutateDraft((previous) => ({ ...previous, crossOverlay: undefined }))
            }
            hasPortrait={Boolean(draft.portraitOverlay)}
            hasCross={Boolean(draft.crossOverlay)}
          />
        </div>
      </div>

      <PhotoLibraryDialog
        open={libraryOpen}
        onOpenChange={setLibraryOpen}
        onSelect={(photo) => {
          if (selectedSlotId) handlePhotoChange(selectedSlotId, photo.url);
        }}
      />

      <QuotesDialog
        open={quotesOpen}
        onOpenChange={setQuotesOpen}
        onSelect={(quote) => {
          const quoteSlot = template.slots.find((s) => s.id === 'quote' && s.type === 'text');
          const targetId = quoteSlot?.id ?? selectedSlotId;
          if (targetId) handleTextChange(targetId, quote.text);
        }}
      />

      <BackgroundsDialog
        open={backgroundsOpen}
        onOpenChange={setBackgroundsOpen}
        selectedId={draft.backgroundId}
        onSelect={(background) => {
          mutateDraft((previous) => ({ ...previous, backgroundId: background.id }));
        }}
      />

      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        draft={draft}
        locale={locale}
        defaultTab={shareTab}
      />

      <PhotoPickerDialog
        open={overlayPicker !== null}
        onOpenChange={(next) => !next && setOverlayPicker(null)}
        title={overlayPicker === 'cross' ? 'Přidat symbol' : 'Přidat portrét'}
        category={overlayPicker === 'cross' ? 'symbols' : 'backgrounds'}
        onSelect={(url) => {
          const isCross = overlayPicker === 'cross';
          const field = isCross ? 'crossOverlay' : 'portraitOverlay';
          const size = isCross ? 36 : 100;
          mutateDraft((previous) => ({
            ...previous,
            [field]: previous[field]
              ? { ...previous[field], src: url }
              : {
                  src: url,
                  x: (template.width - size) / 2,
                  y: isCross ? 16 : previous.crossOverlay ? 60 : 28,
                  width: size,
                  height: size,
                },
          }));
        }}
      />
    </div>
  );
};

export default ParteEditor;
