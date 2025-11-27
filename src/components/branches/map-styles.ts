/**
 * CSS styles for customizing Leaflet map appearance
 */

export const MAP_STYLES = {
  ATTRIBUTION: `
    .leaflet-control-attribution {
      display: none !important;
    }
  `,

  CUSTOM_MARKER: `
    .custom-pin-marker {
      background: transparent !important;
      border: none !important;
    }
  `,

  GRAYSCALE_TILES: `
    .leaflet-tile-pane {
      filter: grayscale(100%);
    }
  `,

  CONTAINER: `
    .leaflet-container {
      font-family: var(--font-body), sans-serif !important;
      font-size: inherit !important;
      line-height: inherit !important;
    }
    .leaflet-container a {
      color: oklch(var(--primary)) !important;
    }
  `,

  POPUP: `
    .leaflet-popup-content-wrapper {
      padding: 0;
      border-radius: 0;
    }
    .leaflet-popup-content {
      margin: 0;
      width: auto !important;
    }
    .leaflet-popup-content p {
      margin: 0;
    }
    .leaflet-popup-content * {
      font-family: inherit;
    }
  `,

  CLOSE_BUTTON: `
    .leaflet-popup-close-button {
      width: 30px !important;
      height: 30px !important;
      font-size: 0 !important;
      color: oklch(var(--primary)) !important;
      padding: 0 !important;
      top: 1rem !important;
      right: 1.25rem !important;
    }
    .leaflet-popup-close-button span {
      display: none !important;
    }
    .leaflet-popup-close-button::before {
      content: '';
      display: block;
      width: 30px;
      height: 30px;
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none"><path d="M8 31.7849L6.25 29.996L13.25 22.8406L6.25 15.6851L8 13.8962L15 21.0517L22 13.8962L23.75 15.6851L16.75 22.8406L23.75 29.996L22 31.7849L15 24.6294L8 31.7849Z" fill="%23522953"/></svg>');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
    .leaflet-popup-close-button:hover::before {
      opacity: 0.7;
    }
  `
} as const;

/**
 * Combines all map styles into a single string
 */
export const getMapStyles = (): string => {
  return Object.values(MAP_STYLES).join('\n');
};
