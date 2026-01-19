'use client';

import { useEffect } from 'react';

import { pushViewItem } from '@/utils/datalayer';

interface ViewItemTrackerProps {
  itemId: string;
  itemName: string;
  itemCategory: string;
  itemCategory2: string;
  price?: number;
}

const ViewItemTracker = ({ itemId, itemName, itemCategory, itemCategory2, price }: ViewItemTrackerProps) => {
  useEffect(() => {
    pushViewItem({
      item_id: itemId,
      item_name: itemName,
      item_category: itemCategory,
      item_category2: itemCategory2,
      price,
    });
  }, [itemId, itemName, itemCategory, itemCategory2, price]);

  return null;
};

export default ViewItemTracker;
