'use client';

import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';

import BranchCardClient from '@/components/branches/BranchCardClient';
import type { PobockaPost } from '@/utils/wordpress-types';
import { calculateCenter, DEFAULT_CENTER, DEFAULT_ZOOM, parseGPS, SINGLE_MARKER_ZOOM } from '@/utils/gps';

import 'leaflet/dist/leaflet.css';

// Hide attribution control and style custom markers
const mapStyle = `
  .leaflet-control-attribution {
    display: none !important;
  }
  .custom-pin-marker {
    background: transparent !important;
    border: none !important;
  }
  .leaflet-tile-pane {
    filter: grayscale(100%);
  }
  .leaflet-container {
    font-family: var(--font-body), sans-serif !important;
    font-size: inherit !important;
    line-height: inherit !important;
  }
  .leaflet-container a {
    color: oklch(var(--primary)) !important;
  }
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
`;

interface BranchesMapProps {
  branches: PobockaPost[];
  className?: string;
}

const BranchesMap = ({ branches, className }: BranchesMapProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className={className}>
        <div className='bg-muted flex h-full w-full items-center justify-center'>
          <p>Loading map...</p>
        </div>
      </div>
    );
  }

  // Parse GPS coordinates from branches
  const branchesWithCoords = branches
    .map((branch) => ({
      ...branch,
      coords: parseGPS(branch.pobockyACF?.gPS),
    }))
    .filter((branch) => branch.coords !== null);

  // If no valid coordinates, show empty state
  if (branchesWithCoords.length === 0) {
    return (
      <div className={className}>
        <div className='bg-muted flex h-full w-full items-center justify-center'>
          <p>No branch locations available</p>
        </div>
      </div>
    );
  }

  // Calculate map center
  const validCoords = branchesWithCoords.map((b) => b.coords!);
  const center = calculateCenter(validCoords) || DEFAULT_CENTER;
  const zoom = branchesWithCoords.length === 1 ? SINGLE_MARKER_ZOOM : DEFAULT_ZOOM;

  // Custom marker icon using Pin SVG
  const pinSvg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'>
      <g>
        <path d='M24.1825 25.7168C25.1568 25.7168 25.9895 25.3698 26.6804 24.6759C27.3714 23.9819 27.7168 23.1477 27.7168 22.1733C27.7168 21.199 27.3698 20.3663 26.6759 19.6754C25.9819 18.9845 25.1477 18.639 24.1734 18.639C23.199 18.639 22.3663 18.986 21.6754 19.6799C20.9845 20.3739 20.639 21.2081 20.639 22.1825C20.639 23.1568 20.986 23.9895 21.6799 24.6804C22.3739 25.3714 23.2081 25.7168 24.1825 25.7168ZM24.1779 46.4448C18.7516 41.8273 14.6987 37.5385 12.0192 33.5783C9.33973 29.618 8 25.9527 8 22.5823C8 17.5268 9.62622 13.4991 12.8786 10.4995C16.1311 7.49983 19.8975 6 24.1779 6C28.4583 6 32.2247 7.49983 35.4772 10.4995C38.7296 13.4991 40.3558 17.5268 40.3558 22.5823C40.3558 25.9527 39.0161 29.618 36.3366 33.5783C33.6571 37.5385 29.6042 41.8273 24.1779 46.4448Z' fill='#522953'/>
      </g>
      <circle cx='24' cy='22' r='8' fill='white'/>
    </svg>
  `;

  const customIcon = new L.DivIcon({
    html: pinSvg,
    className: 'custom-pin-marker',
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -48],
  });

  return (
    <div className={className}>
      <style>{mapStyle}</style>
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
          <Marker key={branch.id} position={[branch.coords!.lat, branch.coords!.lng]} icon={customIcon}>
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
