/**
 * DataLayer utility functions for GA4 ecommerce tracking
 */

export interface DataLayerItem {
  item_id: string;
  item_name: string;
  item_category: string;
  item_category2: string;
  index?: number;
  price?: number;
}

/**
 * DataLayer item for branch tracking
 */
export interface BranchDataLayerItem {
  item_id: string;
  item_name: string;
  item_category: string;
  item_list_name?: string;
  index?: number;
}

/**
 * Helper to push ecommerce events to dataLayer
 */
const pushEcommerceEvent = <T>(eventName: string, items: T[]): void => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ecommerce: {
      items,
    },
  });
};

/**
 * Push select_item event when user clicks on a service/product tile
 */
export const pushSelectItem = (item: DataLayerItem): void => {
  pushEcommerceEvent('select_item', [item]);
};

/**
 * Push view_item event when user views a service/product detail page
 */
export const pushViewItem = (item: Omit<DataLayerItem, 'index'>): void => {
  pushEcommerceEvent('view_item', [item]);
};

/**
 * Push select_item event when user clicks on a branch card
 */
export const pushBranchSelectItem = (item: BranchDataLayerItem): void => {
  pushEcommerceEvent('select_item', [item]);
};

/**
 * Push view_item event when user views a branch detail page
 */
export const pushBranchViewItem = (item: Omit<BranchDataLayerItem, 'index' | 'item_list_name'>): void => {
  pushEcommerceEvent('view_item', [item]);
};

/**
 * Push contact_click event when user clicks on phone number
 */
export const pushContactClick = (contactValue: string, contactSection: string): void => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'contact_click',
    contact_type: 'phone',
    contact_value: contactValue,
    contact_section: contactSection,
  });
};
