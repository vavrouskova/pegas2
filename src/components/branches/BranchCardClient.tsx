'use client';

import { useTranslations } from 'next-intl';

import BranchCard from '@/components/branches/BranchCard';
import type { PobockaPost } from '@/utils/wordpress-types';

interface BranchCardClientProps {
  branch: PobockaPost;
  className?: string;
  layout?: 'vertical' | 'horizontal';
  showClosedInfo?: boolean;
  showParking?: boolean;
  index?: number;
}

const BranchCardClient = (props: BranchCardClientProps) => {
  const t = useTranslations('branches');

  return (
    <BranchCard
      {...props}
      translations={{
        closed: t('closed'),
        detailButton: t('detail-button'),
      }}
    />
  );
};

export default BranchCardClient;
