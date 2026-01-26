'use client';

import { useEffect } from 'react';

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

/**
 * Form lead tracking - stores user data before redirect and pushes to dataLayer on thank-you page
 */
const FORM_LEAD_KEY = 'pegas_form_lead';

export const storeFormLeadData = (email: string, phone: string): void => {
  sessionStorage.setItem(FORM_LEAD_KEY, JSON.stringify({ email, phone }));
};

const pushFormLeadEvent = (): void => {
  const raw = sessionStorage.getItem(FORM_LEAD_KEY);
  if (!raw) return;

  sessionStorage.removeItem(FORM_LEAD_KEY);

  const { email, phone } = JSON.parse(raw) as { email: string; phone: string };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'form_purchase_success',
    user_data: {
      ...(email && { email }),
      ...(phone && { phone_number: phone }),
    },
  });
};

export const FormLeadTracker = () => {
  useEffect(() => {
    pushFormLeadEvent();
  }, []);

  return null;
};
