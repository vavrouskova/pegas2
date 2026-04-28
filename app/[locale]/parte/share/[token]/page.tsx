import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { BasePageProps } from '@/app/[locale]/layout';
import SharePreview from '@/components/parte/share/SharePreview';
import { getParteTemplateById } from '@/data/parte-templates';
import { decodeDraft } from '@/utils/parte/encode-draft';

export const metadata: Metadata = {
  title: 'Smuteční oznámení | Pegas',
  robots: { index: false, follow: false },
};

interface SharePageProps extends BasePageProps {
  params: Promise<{ locale: string; token: string }>;
}

const SharePage = async ({ params }: SharePageProps) => {
  const { locale, token } = await params;
  setRequestLocale(locale);

  const draft = decodeDraft(token);
  if (!draft) notFound();

  const template = getParteTemplateById(draft.templateId);
  if (!template) notFound();

  return (
    <SharePreview
      template={template}
      draft={draft}
    />
  );
};

export default SharePage;
