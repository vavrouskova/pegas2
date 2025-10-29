export const IMAGE_GALLERY_CONFIG = {
  colors: {
    overlayBg: 'oklch(var(--white-smoke) / 0.8)',
    buttonBg: 'oklch(var(--primary) / 0.8)',
  },

  gestures: {
    swipeThreshold: 50,
    swipeVerticalTolerance: 50,
    maxZoom: 4,
    minZoom: 1,
    zoomStep: 0.1,
    doubleClickZoom: 2,
  },

  navigation: {
    enableBoundaries: true,
    keyboardEnabled: true,
    touchEnabled: true,
  },

  performance: {
    maxImages: 100,
  },

  ui: {
    buttonSize: 48,
    iconSize: 24,
  },
} as const;
