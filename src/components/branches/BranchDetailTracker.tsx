'use client';

import { useEffect } from 'react';

import { pushBranchViewItem } from '@/utils/datalayer';

interface BranchDetailTrackerProps {
  branchId: string;
  branchTitle: string;
}

const BranchDetailTracker = ({ branchId, branchTitle }: BranchDetailTrackerProps) => {
  useEffect(() => {
    pushBranchViewItem({
      item_id: branchId,
      item_name: branchTitle,
      item_category: 'Pobočky',
    });
  }, [branchId, branchTitle]);

  return null;
};

export default BranchDetailTracker;
