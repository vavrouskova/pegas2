import { useMemo } from 'react';

import type { PobockaPost } from '@/utils/wordpress-types';
import { parseGPS, type GPSCoordinates } from '@/utils/gps';

export interface BranchWithCoords extends PobockaPost {
  coords: GPSCoordinates;
}

/**
 * Hook that filters branches to only include those with valid GPS coordinates
 */
export const useBranchesWithCoords = (branches: PobockaPost[]): BranchWithCoords[] => {
  return useMemo(() => {
    return branches
      .map((branch) => ({
        ...branch,
        coords: parseGPS(branch.pobockyACF?.gPS),
      }))
      .filter((branch): branch is BranchWithCoords => branch.coords !== null);
  }, [branches]);
};
