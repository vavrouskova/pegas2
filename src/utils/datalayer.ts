/**
 * DataLayer utility functions for GA4 ecommerce tracking
 */

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export interface DataLayerItem {
  item_id: string;
  item_name: string;
  item_category: string;
  item_category2: string;
  index?: number;
  price?: number;
}

/**
 * Push select_item event when user clicks on a service/product tile
 */
export const pushSelectItem = (item: DataLayerItem): void => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'select_item',
    ecommerce: {
      items: [item],
    },
  });
};

/**
 * Push view_item event when user views a service/product detail page
 */
export const pushViewItem = (item: Omit<DataLayerItem, 'index'>): void => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'view_item',
    ecommerce: {
      items: [item],
    },
  });
};
