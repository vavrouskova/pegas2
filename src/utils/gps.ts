/**
 * GPS utility functions for parsing and validating GPS coordinates
 */

export interface GPSCoordinates {
  lat: number;
  lng: number;
}

/**
 * Parses GPS coordinates from a string
 * Accepts formats:
 * - "49.1234, 16.5678"
 * - "49.1234,16.5678"
 * - "49.1234 16.5678"
 * @param gpsString - GPS coordinate string
 * @returns GPS coordinates object or null if invalid
 */
export const parseGPS = (gpsString?: string): GPSCoordinates | null => {
  if (!gpsString) return null;

  // Clean the string and split by comma or space
  const cleaned = gpsString.trim();
  const parts = cleaned.split(/[,\s]+/).filter(Boolean);

  if (parts.length !== 2) return null;

  const lat = parseFloat(parts[0]);
  const lng = parseFloat(parts[1]);

  // Validate coordinates
  if (isNaN(lat) || isNaN(lng)) return null;
  if (lat < -90 || lat > 90) return null;
  if (lng < -180 || lng > 180) return null;

  return { lat, lng };
};

/**
 * Validates GPS coordinates
 * @param coords - GPS coordinates object
 * @returns true if valid, false otherwise
 */
export const isValidGPS = (coords: GPSCoordinates | null): coords is GPSCoordinates => {
  if (!coords) return false;
  const { lat, lng } = coords;
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
};

/**
 * Calculates the center point of multiple GPS coordinates
 * @param coordinates - Array of GPS coordinates
 * @returns Center GPS coordinates or null if empty
 */
export const calculateCenter = (coordinates: GPSCoordinates[]): GPSCoordinates | null => {
  if (!coordinates.length) return null;

  const sum = coordinates.reduce(
    (acc, coord) => ({
      lat: acc.lat + coord.lat,
      lng: acc.lng + coord.lng,
    }),
    { lat: 0, lng: 0 }
  );

  return {
    lat: sum.lat / coordinates.length,
    lng: sum.lng / coordinates.length,
  };
};

/**
 * Default map center for Czech Republic (Prague)
 */
export const DEFAULT_CENTER: GPSCoordinates = {
  lat: 50.0755,
  lng: 14.4378,
};

/**
 * Default zoom level for displaying multiple markers
 */
export const DEFAULT_ZOOM = 8;

/**
 * Default zoom level for single marker
 */
export const SINGLE_MARKER_ZOOM = 13;
