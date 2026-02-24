export const scrollControl = { skipNext: false };

export function skipNextScroll() {
  scrollControl.skipNext = true;
}

const SCROLL_KEY_PREFIX = 'scroll_pos_';

export function saveScrollPosition(key: string, position: number) {
  try {
    sessionStorage.setItem(SCROLL_KEY_PREFIX + key, String(Math.round(position)));
  } catch {
    // sessionStorage full or unavailable
  }
}

export function getSavedScrollPosition(key: string): number | null {
  try {
    const value = sessionStorage.getItem(SCROLL_KEY_PREFIX + key);
    return value ? Number(value) : null;
  } catch {
    return null;
  }
}
