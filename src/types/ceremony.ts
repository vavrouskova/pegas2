export type CeremonyVisibility = 'public' | 'private';

export type CeremonyStatus = 'upcoming' | 'ongoing' | 'past';

export interface CeremonyVenue {
  name: string;
  address: string;
  city: string;
  mapsUrl: string;
}

export interface CeremonyPerson {
  firstName: string;
  lastName: string;
  birthYear?: number;
  deathYear?: number;
  photo?: string;
}

export interface CeremonyDonor {
  name: string;
}

export interface CeremonyGalleryItem {
  type: 'image' | 'video';
  src: string;
  alt: string;
  poster?: string;
}

export interface Ceremony {
  slug: string;
  visibility: CeremonyVisibility;
  person: CeremonyPerson;
  startAt: string;
  endAt: string;
  venue: CeremonyVenue;
  announcement: string;
  familyWish?: string;
  donors: CeremonyDonor[];
  gallery: CeremonyGalleryItem[];
  flowerOrderDeadline?: string;
  allowFlowers: boolean;
}
