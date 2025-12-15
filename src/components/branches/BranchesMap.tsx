'use client';

import { LatLngBounds } from 'leaflet';
import { useEffect, useSyncExternalStore } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

import BranchCardClient from '@/components/branches/BranchCardClient';
import { getMapStyles } from '@/components/branches/map-styles';
import { createBranchMarkerIcon } from '@/components/branches/map-utilities';
import MapLoadingState from '@/components/branches/MapLoadingState';
import { useBranchesWithCoords } from '@/components/branches/useBranchesWithCoords';
import { calculateCenter, DEFAULT_CENTER, SINGLE_MARKER_ZOOM } from '@/utils/gps';
import type { GPSCoordinates } from '@/utils/gps';
import type { PobockaPost } from '@/utils/wordpress-types';

import 'leaflet/dist/leaflet.css';

interface FitBoundsProps {
  coords: GPSCoordinates[];
}

const FitBounds = ({ coords }: FitBoundsProps) => {
  const map = useMap();

  useEffect(() => {
    if (coords.length === 0) return;

    if (coords.length === 1) {
      // For single marker, just center on it with fixed zoom
      map.setView([coords[0].lat, coords[0].lng], SINGLE_MARKER_ZOOM);
    } else {
      // For multiple markers, fit bounds with padding
      const bounds = new LatLngBounds(coords.map((c) => [c.lat, c.lng]));
      map.fitBounds(bounds, {
        padding: [50, 50], // Add padding so markers aren't at the edge
        maxZoom: 15, // Don't zoom in too much even if markers are close
      });
    }
  }, [map, coords]);

  return null;
};

interface BranchesMapProps {
  branches: PobockaPost[];
  className?: string;
}

const useIsClient = () => {
  return useSyncExternalStore(
    // eslint-disable-next-line unicorn/consistent-function-scoping
    () => () => {},
    () => true,
    () => false
  );
};

const BranchesMap = ({ branches, className }: BranchesMapProps) => {
  const isClient = useIsClient();
  const branchesWithCoords = useBranchesWithCoords(branches);

  if (!isClient) {
    return (
      <div className={className}>
        <MapLoadingState message='Loading map...' />
      </div>
    );
  }

  if (branchesWithCoords.length === 0) {
    return (
      <div className={className}>
        <MapLoadingState message='No branch locations available' />
      </div>
    );
  }

  const validCoords = branchesWithCoords.map((b) => b.coords);
  const center = calculateCenter(validCoords) || DEFAULT_CENTER;
  const markerIcon = createBranchMarkerIcon();

  return (
    <div className={className}>
      <style>{getMapStyles()}</style>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={10}
        scrollWheelZoom={false}
        attributionControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
        <FitBounds coords={validCoords} />
        {branchesWithCoords.map((branch) => (
          <Marker
            key={branch.id}
            position={[branch.coords.lat, branch.coords.lng]}
            icon={markerIcon}
          >
            <Popup>
              <BranchCardClient
                branch={branch}
                layout='horizontal'
                showClosedInfo={false}
                showParking={false}
                className='w-80 gap-7.5 px-5.5 py-6.5 lg:w-150'
              />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default BranchesMap;
