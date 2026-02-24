export const scrollControl = { skipNext: false };

export function skipNextScroll() {
  scrollControl.skipNext = true;
}

const SCROLL_KEY_PREFIX = 'scroll_pos_';
const SCROLL_KEYS_INDEX = 'scroll_pos__keys';
const MAX_SCROLL_ENTRIES = 20;

export function saveScrollPosition(key: string, position: number) {
  try {
    sessionStorage.setItem(SCROLL_KEY_PREFIX + key, String(Math.round(position)));

    // LRU eviction
    const raw = sessionStorage.getItem(SCROLL_KEYS_INDEX);
    const keys: string[] = raw ? JSON.parse(raw) : [];
    const index = keys.indexOf(key);
    if (index !== -1) keys.splice(index, 1);
    keys.push(key);

    while (keys.length > MAX_SCROLL_ENTRIES) {
      const evicted = keys.shift()!;
      sessionStorage.removeItem(SCROLL_KEY_PREFIX + evicted);
    }

    sessionStorage.setItem(SCROLL_KEYS_INDEX, JSON.stringify(keys));
  } catch {
    // sessionStorage full or unavailable
  }
}

export function getSavedScrollPosition(key: string): number | null {
  try {
    const value = sessionStorage.getItem(SCROLL_KEY_PREFIX + key);
    if (!value) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
