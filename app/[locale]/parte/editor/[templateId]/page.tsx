import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { BasePageProps } from '@/app/[locale]/layout';
import ParteEditor from '@/components/parte/editor/ParteEditor';
import { getParteTemplateById, parteTemplates } from '@/data/parte-templates';

export const metadata: Metadata = {
  title: 'Editor parte | Pegas',
  robots: { index: false, follow: false },
};

interface EditorPageProps extends BasePageProps {
  params: Promise<{ locale: string; templateId: string }>;
}

// eslint-disable-next-line unicorn/prevent-abbreviations
export const generateStaticParams = () => parteTemplates.map((template) => ({ templateId: template.id }));

const EditorPage = async ({ params }: EditorPageProps) => {
  const { locale, templateId } = await params;
  setRequestLocale(locale);

  const template = getParteTemplateById(templateId);
  if (!template) notFound();

  return <ParteEditor template={template} />;
};

export default EditorPage;
