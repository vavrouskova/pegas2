'use client';

import { useTranslations } from 'next-intl';

import BranchCard from './BranchCard';
import type { PobockaPost } from '@/utils/wordpress-types';

interface BranchCardClientProps {
  branch: PobockaPost;
  className?: string;
  layout?: 'vertical' | 'horizontal';
  showClosedInfo?: boolean;
  showParking?: boolean;
}

const BranchCardClient = (props: BranchCardClientProps) => {
  const t = useTranslations('branches');

  return (
    <BranchCard
      {...props}
      translations={{
        noImage: t('no-image'),
        closed: t('closed'),
        detailButton: t('detail-button')
      }}
    />
  );
};

export default BranchCardClient;
