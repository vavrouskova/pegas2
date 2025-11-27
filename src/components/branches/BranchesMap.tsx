'use client';

import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import BranchCardClient from '@/components/branches/BranchCardClient';
import type { PobockaPost } from '@/utils/wordpress-types';
import { calculateCenter, DEFAULT_CENTER, DEFAULT_ZOOM, SINGLE_MARKER_ZOOM } from '@/utils/gps';

import MapLoadingState from './MapLoadingState';
import { createBranchMarkerIcon } from './map-utils';
import { getMapStyles } from './map-styles';
import { useBranchesWithCoords } from './useBranchesWithCoords';

import 'leaflet/dist/leaflet.css';

interface BranchesMapProps {
  branches: PobockaPost[];
  className?: string;
}

const BranchesMap = ({ branches, className }: BranchesMapProps) => {
  const [isClient, setIsClient] = useState(false);
  const branchesWithCoords = useBranchesWithCoords(branches);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
  const zoom = branchesWithCoords.length === 1 ? SINGLE_MARKER_ZOOM : DEFAULT_ZOOM;
  const markerIcon = createBranchMarkerIcon();

  return (
    <div className={className}>
      <style>{getMapStyles()}</style>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        scrollWheelZoom={false}
        attributionControl={false}
        style={{ height: '100%', width: '100%'}}
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {branchesWithCoords.map((branch) => (
          <Marker key={branch.id} position={[branch.coords.lat, branch.coords.lng]} icon={markerIcon}>
            <Popup>
              <BranchCardClient
                branch={branch}
                layout='horizontal'
                showClosedInfo={false}
                showParking={false}
                className='w-80 lg:w-150 gap-7.5 px-5.5 py-6.5'
              />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default BranchesMap;
