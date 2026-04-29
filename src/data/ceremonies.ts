import { Ceremony } from '@/types/ceremony';

const dayOffset = (days: number, hour: number, minute = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

const ceremonyEnd = (start: string, durationMinutes = 60): string => {
  const date = new Date(start);
  date.setMinutes(date.getMinutes() + durationMinutes);
  return date.toISOString();
};

const STRASNICE = {
  name: 'Obřadní síň Strašnice',
  address: 'Vinohradská 2509/214',
  city: 'Praha 10',
  mapsUrl: 'https://maps.google.com/?q=Obřadní+síň+Strašnice',
};

const MOTOL = {
  name: 'Krematorium Motol',
  address: 'Plzeňská 195/241',
  city: 'Praha 5',
  mapsUrl: 'https://maps.google.com/?q=Krematorium+Motol',
};

const OLSANY = {
  name: 'Obřadní síň Olšany',
  address: 'Vinohradská 1835/153',
  city: 'Praha 3',
  mapsUrl: 'https://maps.google.com/?q=Olšanské+hřbitovy',
};

const DEFAULT_ANNOUNCEMENT =
  'S lítostí oznamujeme, že poslední rozloučení se uskuteční v uvedený čas a místě.\nRodina si přeje, aby účastníci přišli ve světlém oblečení, které odráží radostné vzpomínky na společně prožité chvíle.';

const HANNAH_ANNOUNCEMENT =
  'S lítostí oznamujeme, že poslední rozloučení s paní Hanou Novotnou se uskuteční v Obřadní síni Strašnice.\nRodina si přeje, aby účastníci přišli ve světlém oblečení, které odráží radostné vzpomínky na společně prožité chvíle. Vítány jsou drobné kytice nebo jednotlivé květy v bílé či jemně růžové barvě.\n\nPokud byste chtěli položit květinu, můžete ji přinést osobně v den obřadu, nebo využít možnost objednání online níže.\n\nRodina děkuje všem, kdo se přijdou tiše rozloučit a uchovají si paní Hanu ve svých vzpomínkách.';

const COMMON_DONORS = [
  { name: 'Jana s rodinou' },
  { name: 'Milan Jandera' },
  { name: 'Libuška' },
  { name: 'Folbrtovi' },
  { name: 'Miroslav Krcha' },
  { name: 'Jasanská Ester' },
];

export const CEREMONIES: Ceremony[] = [
  {
    slug: 'hana-novotna',
    visibility: 'public',
    person: {
      firstName: 'Hana',
      lastName: 'Novotná',
      birthYear: 1933,
      deathYear: 2026,
      photo: '/images/ceremonies/portrait-1.png',
    },
    startAt: dayOffset(2, 10),
    endAt: ceremonyEnd(dayOffset(2, 10), 60),
    venue: STRASNICE,
    announcement: HANNAH_ANNOUNCEMENT,
    familyWish: 'Prosíme bez smutečních věnců, jen jednotlivé květy.',
    donors: COMMON_DONORS,
    gallery: [
      { type: 'image', src: '/images/ceremonies.webp', alt: 'Vzpomínka 1' },
      { type: 'image', src: '/images/flowers.webp', alt: 'Květinová výzdoba' },
      { type: 'image', src: '/images/room.webp', alt: 'Obřadní síň' },
      { type: 'image', src: '/images/about-us.webp', alt: 'Vzpomínka 2' },
      { type: 'image', src: '/images/rose.webp', alt: 'Růže' },
    ],
    flowerOrderDeadline: dayOffset(2, 8),
    allowFlowers: true,
  },
  {
    slug: 'jan-dvorak',
    visibility: 'public',
    person: {
      firstName: 'Jan',
      lastName: 'Dvořák',
      birthYear: 1942,
      deathYear: 2026,
      photo: '/images/ceremonies/portrait-2.png',
    },
    startAt: dayOffset(0, 14, 30),
    endAt: ceremonyEnd(dayOffset(0, 14, 30), 60),
    venue: STRASNICE,
    announcement: DEFAULT_ANNOUNCEMENT,
    donors: COMMON_DONORS.slice(0, 3),
    gallery: [],
    flowerOrderDeadline: dayOffset(0, 12),
    allowFlowers: true,
  },
  {
    slug: 'jaroslava-benesova',
    visibility: 'public',
    person: {
      firstName: 'Jaroslava',
      lastName: 'Benešová',
      birthYear: 1936,
      deathYear: 2026,
      photo: '/images/ceremonies/portrait-6.png',
    },
    startAt: dayOffset(0, 9, 0),
    endAt: ceremonyEnd(dayOffset(0, 9, 0), 60),
    venue: OLSANY,
    announcement: DEFAULT_ANNOUNCEMENT,
    donors: COMMON_DONORS.slice(0, 3),
    gallery: [],
    flowerOrderDeadline: dayOffset(0, 7),
    allowFlowers: true,
  },
  {
    slug: 'oldrich-mares',
    visibility: 'public',
    person: {
      firstName: 'Oldřich',
      lastName: 'Mareš',
      birthYear: 1949,
      deathYear: 2026,
      photo: '/images/ceremonies/portrait-7.png',
    },
    startAt: dayOffset(0, 16, 0),
    endAt: ceremonyEnd(dayOffset(0, 16, 0), 60),
    venue: STRASNICE,
    announcement: DEFAULT_ANNOUNCEMENT,
    donors: COMMON_DONORS.slice(0, 4),
    gallery: [],
    flowerOrderDeadline: dayOffset(0, 14),
    allowFlowers: true,
  },
  {
    slug: 'helena-kucerova',
    visibility: 'public',
    person: {
      firstName: 'Helena',
      lastName: 'Kučerová',
      birthYear: 1942,
      deathYear: 2026,
      photo: '/images/ceremonies/portrait-9.png',
    },
    startAt: dayOffset(1, 9, 30),
    endAt: ceremonyEnd(dayOffset(1, 9, 30), 60),
    venue: OLSANY,
    announcement: DEFAULT_ANNOUNCEMENT,
    donors: COMMON_DONORS.slice(0, 3),
    gallery: [],
    flowerOrderDeadline: dayOffset(1, 7),
    allowFlowers: true,
  },
  {
    slug: 'vlastimil-kovar',
    visibility: 'public',
    person: {
      firstName: 'Vlastimil',
      lastName: 'Kovář',
      birthYear: 1945,
      deathYear: 2026,
      photo: '/images/ceremonies/portrait-2.png',
    },
    startAt: dayOffset(1, 13, 30),
    endAt: ceremonyEnd(dayOffset(1, 13, 30), 60),
    venue: STRASNICE,
    announcement: DEFAULT_ANNOUNCEMENT,
    donors: COMMON_DONORS.slice(0, 4),
    gallery: [],
    flowerOrderDeadline: dayOffset(1, 11),
    allowFlowers: true,
  },
  {
    slug: 'milena-pospisilova',
    visibility: 'public',
    person: {
      firstName: 'Milena',
      lastName: 'Pospíšilová',
      birthYear: 1950,
      deathYear: 2026,
      photo: '/images/ceremonies/portrait-1.png',
    },
    startAt: dayOffset(1, 16, 0),
    endAt: ceremonyEnd(dayOffset(1, 16, 0), 60),
    venue: MOTOL,
    announcement: DEFAULT_ANNOUNCEMENT,
    donors: COMMON_DONORS.slice(0, 5),
    gallery: [],
    flowerOrderDeadline: dayOffset(1, 14),
    allowFlowers: true,
  },
  {
    slug: 'marie-svobodova',
    visibility: 'public',
    person: {
      firstName: 'Marie',
      lastName: 'Nováková Svobodová',
      birthYear: 1938,
      deathYear: 2026,
      photo: '/images/ceremonies/portrait-5.png',
    },
    startAt: dayOffset(1, 11),
    endAt: ceremonyEnd(dayOffset(1, 11), 60),
    venue: MOTOL,
    announcement: DEFAULT_ANNOUNCEMENT,
    donors: COMMON_DONORS.slice(0, 4),
    gallery: [],
    flowerOrderDeadline: dayOffset(1, 8),
    allowFlowers: true,
  },
  {
    slug: 'petr-cerny',
    visibility: 'public',
    person: {
      firstName: 'Petr',
      lastName: 'Černý',
      birthYear: 1955,
      deathYear: 2026,
      photo: '/images/ceremonies/portrait-3.png',
    },
    startAt: dayOffset(3, 13),
    endAt: ceremonyEnd(dayOffset(3, 13), 60),
    venue: OLSANY,
    announcement: DEFAULT_ANNOUNCEMENT,
    donors: COMMON_DONORS.slice(0, 2),
    gallery: [],
    flowerOrderDeadline: dayOffset(3, 8),
    allowFlowers: true,
  },
  {
    slug: 'eva-prochazkova',
    visibility: 'public',
    person: {
      firstName: 'Eva',
      lastName: 'Procházková',
      birthYear: 1947,
      deathYear: 2026,
      photo: '/images/ceremonies/portrait-8.png',
    },
    startAt: dayOffset(4, 9, 30),
    endAt: ceremonyEnd(dayOffset(4, 9, 30), 60),
    venue: STRASNICE,
    announcement: DEFAULT_ANNOUNCEMENT,
    donors: COMMON_DONORS,
    gallery: [],
    flowerOrderDeadline: dayOffset(4, 8),
    allowFlowers: true,
  },
  {
    slug: 'frantisek-kral',
    visibility: 'public',
    person: {
      firstName: 'František',
      lastName: 'Král',
      birthYear: 1939,
      deathYear: 2026,
      photo: '/images/ceremonies/portrait-4.png',
    },
    startAt: dayOffset(5, 12),
    endAt: ceremonyEnd(dayOffset(5, 12), 60),
    venue: MOTOL,
    announcement: DEFAULT_ANNOUNCEMENT,
    donors: COMMON_DONORS.slice(0, 3),
    gallery: [],
    flowerOrderDeadline: dayOffset(5, 8),
    allowFlowers: true,
  },
  {
    slug: 'anna-vesela',
    visibility: 'public',
    person: {
      firstName: 'Anna',
      lastName: 'Veselá',
      birthYear: 1944,
      deathYear: 2026,
      photo: '/images/ceremonies/portrait-1.png',
    },
    startAt: dayOffset(7, 10, 30),
    endAt: ceremonyEnd(dayOffset(7, 10, 30), 60),
    venue: OLSANY,
    announcement: DEFAULT_ANNOUNCEMENT,
    donors: COMMON_DONORS.slice(0, 5),
    gallery: [],
    flowerOrderDeadline: dayOffset(7, 8),
    allowFlowers: true,
  },
  {
    slug: 'josef-pokorny',
    visibility: 'public',
    person: {
      firstName: 'Josef',
      lastName: 'Pokorný',
      birthYear: 1936,
      deathYear: 2026,
      photo: '/images/ceremonies/portrait-6.png',
    },
    startAt: dayOffset(8, 14),
    endAt: ceremonyEnd(dayOffset(8, 14), 60),
    venue: STRASNICE,
    announcement: DEFAULT_ANNOUNCEMENT,
    donors: COMMON_DONORS.slice(0, 2),
    gallery: [],
    flowerOrderDeadline: dayOffset(8, 8),
    allowFlowers: true,
  },
  {
    slug: 'vera-stastna',
    visibility: 'public',
    person: {
      firstName: 'Věra',
      lastName: 'Šťastná',
      birthYear: 1941,
      deathYear: 2026,
      photo: '/images/ceremonies/portrait-5.png',
    },
    startAt: dayOffset(-3, 11),
    endAt: ceremonyEnd(dayOffset(-3, 11), 60),
    venue: STRASNICE,
    announcement: DEFAULT_ANNOUNCEMENT,
    donors: COMMON_DONORS,
    gallery: [],
    allowFlowers: false,
  },
  {
    slug: 'karel-vesely',
    visibility: 'public',
    person: {
      firstName: 'Karel',
      lastName: 'Veselý',
      birthYear: 1932,
      deathYear: 2026,
      photo: '/images/ceremonies/portrait-7.png',
    },
    startAt: dayOffset(-7, 13),
    endAt: ceremonyEnd(dayOffset(-7, 13), 60),
    venue: MOTOL,
    announcement: DEFAULT_ANNOUNCEMENT,
    donors: COMMON_DONORS.slice(0, 4),
    gallery: [],
    allowFlowers: false,
  },
  {
    slug: 'helena-malikova',
    visibility: 'public',
    person: {
      firstName: 'Helena',
      lastName: 'Malíková',
      birthYear: 1948,
      deathYear: 2026,
      photo: '/images/ceremonies/portrait-8.png',
    },
    startAt: dayOffset(-10, 10),
    endAt: ceremonyEnd(dayOffset(-10, 10), 60),
    venue: OLSANY,
    announcement: DEFAULT_ANNOUNCEMENT,
    donors: COMMON_DONORS,
    gallery: [],
    allowFlowers: false,
  },
  {
    slug: 'antonin-marek',
    visibility: 'public',
    person: {
      firstName: 'Antonín',
      lastName: 'Marek',
      birthYear: 1937,
      deathYear: 2026,
      photo: '/images/ceremonies/portrait-9.png',
    },
    startAt: dayOffset(-14, 12, 30),
    endAt: ceremonyEnd(dayOffset(-14, 12, 30), 60),
    venue: STRASNICE,
    announcement: DEFAULT_ANNOUNCEMENT,
    donors: COMMON_DONORS.slice(0, 3),
    gallery: [],
    allowFlowers: false,
  },
  {
    slug: 'jaroslav-horak',
    visibility: 'public',
    person: {
      firstName: 'Jaroslav',
      lastName: 'Horák',
      birthYear: 1945,
      deathYear: 2026,
      photo: undefined,
    },
    startAt: dayOffset(6, 9, 30),
    endAt: ceremonyEnd(dayOffset(6, 9, 30), 60),
    venue: OLSANY,
    announcement: DEFAULT_ANNOUNCEMENT,
    donors: COMMON_DONORS.slice(0, 2),
    gallery: [],
    flowerOrderDeadline: dayOffset(6, 8),
    allowFlowers: true,
  },
  {
    slug: 'bozena-jelinkova',
    visibility: 'public',
    person: {
      firstName: 'Božena',
      lastName: 'Jelínková',
      birthYear: 1934,
      deathYear: 2026,
      photo: undefined,
    },
    startAt: dayOffset(-5, 11),
    endAt: ceremonyEnd(dayOffset(-5, 11), 60),
    venue: MOTOL,
    announcement: DEFAULT_ANNOUNCEMENT,
    donors: COMMON_DONORS,
    gallery: [],
    allowFlowers: false,
  },
];

const VENUE_CYCLE = [STRASNICE, MOTOL, OLSANY];

const EXTRA_PEOPLE: Array<{
  slug: string;
  firstName: string;
  lastName: string;
  birthYear: number;
  dayDelta: number;
  hour: number;
  minute: number;
}> = [
  { slug: 'vladimir-cernoch', firstName: 'Vladimír', lastName: 'Černoch', birthYear: 1942, dayDelta: 9, hour: 10, minute: 0 },
  { slug: 'marta-dvorakova', firstName: 'Marta', lastName: 'Dvořáková', birthYear: 1937, dayDelta: 10, hour: 11, minute: 30 },
  { slug: 'stanislav-benes', firstName: 'Stanislav', lastName: 'Beneš', birthYear: 1945, dayDelta: 11, hour: 9, minute: 0 },
  { slug: 'ruzena-hajkova', firstName: 'Růžena', lastName: 'Hájková', birthYear: 1933, dayDelta: 12, hour: 13, minute: 0 },
  { slug: 'miloslav-pokorny', firstName: 'Miloslav', lastName: 'Pokorný', birthYear: 1940, dayDelta: 13, hour: 14, minute: 30 },
  { slug: 'alzbeta-kratka', firstName: 'Alžběta', lastName: 'Krátká', birthYear: 1948, dayDelta: 14, hour: 10, minute: 0 },
  { slug: 'tomas-barta', firstName: 'Tomáš', lastName: 'Bárta', birthYear: 1952, dayDelta: 15, hour: 11, minute: 0 },
  { slug: 'ludmila-vankova', firstName: 'Ludmila', lastName: 'Vaňková', birthYear: 1936, dayDelta: 16, hour: 12, minute: 30 },
  { slug: 'miroslav-hruska', firstName: 'Miroslav', lastName: 'Hruška', birthYear: 1941, dayDelta: 17, hour: 9, minute: 30 },
  { slug: 'drahomira-prochazkova', firstName: 'Drahomíra', lastName: 'Procházková', birthYear: 1939, dayDelta: 18, hour: 14, minute: 0 },
  { slug: 'vaclav-soukup', firstName: 'Václav', lastName: 'Soukup', birthYear: 1944, dayDelta: 19, hour: 10, minute: 30 },
  { slug: 'emilie-rihova', firstName: 'Emilie', lastName: 'Říhová', birthYear: 1932, dayDelta: 20, hour: 11, minute: 0 },
  { slug: 'pavel-klima', firstName: 'Pavel', lastName: 'Klíma', birthYear: 1949, dayDelta: 22, hour: 13, minute: 30 },
  { slug: 'jindriska-bartonova', firstName: 'Jindřiška', lastName: 'Bartoňová', birthYear: 1935, dayDelta: -16, hour: 10, minute: 0 },
  { slug: 'bohumil-kucera', firstName: 'Bohumil', lastName: 'Kučera', birthYear: 1938, dayDelta: -18, hour: 11, minute: 30 },
  { slug: 'jaroslava-tomkova', firstName: 'Jaroslava', lastName: 'Tomková', birthYear: 1943, dayDelta: -20, hour: 9, minute: 0 },
  { slug: 'zdenek-kraus', firstName: 'Zdeněk', lastName: 'Kraus', birthYear: 1946, dayDelta: -22, hour: 13, minute: 0 },
  { slug: 'marcela-kovarova', firstName: 'Marcela', lastName: 'Kovářová', birthYear: 1950, dayDelta: -25, hour: 10, minute: 30 },
  { slug: 'oldrich-sedivy', firstName: 'Oldřich', lastName: 'Šedivý', birthYear: 1934, dayDelta: -27, hour: 14, minute: 30 },
  { slug: 'vlasta-adamcova', firstName: 'Vlasta', lastName: 'Adamcová', birthYear: 1940, dayDelta: -30, hour: 11, minute: 0 },
  { slug: 'karel-dolezal', firstName: 'Karel', lastName: 'Doležal', birthYear: 1937, dayDelta: -33, hour: 9, minute: 30 },
  { slug: 'hedvika-vankova', firstName: 'Hedvika', lastName: 'Vaňková', birthYear: 1942, dayDelta: -36, hour: 12, minute: 0 },
  { slug: 'lubomir-zednik', firstName: 'Lubomír', lastName: 'Zedník', birthYear: 1944, dayDelta: -39, hour: 13, minute: 30 },
  { slug: 'kveta-slamova', firstName: 'Květa', lastName: 'Slámová', birthYear: 1936, dayDelta: -42, hour: 10, minute: 0 },
  { slug: 'jiri-holecek', firstName: 'Jiří', lastName: 'Holeček', birthYear: 1948, dayDelta: -45, hour: 11, minute: 30 },
  { slug: 'libuse-sedlakova', firstName: 'Libuše', lastName: 'Sedláková', birthYear: 1933, dayDelta: -48, hour: 14, minute: 0 },
];

EXTRA_PEOPLE.forEach((person, index) => {
  const start = dayOffset(person.dayDelta, person.hour, person.minute);
  const isUpcoming = person.dayDelta >= 0;
  CEREMONIES.push({
    slug: person.slug,
    visibility: 'public',
    person: {
      firstName: person.firstName,
      lastName: person.lastName,
      birthYear: person.birthYear,
      deathYear: 2026,
      photo: index % 4 === 3 ? undefined : `/images/ceremonies/portrait-${(index % 9) + 1}.png`,
    },
    startAt: start,
    endAt: ceremonyEnd(start, 60),
    venue: VENUE_CYCLE[index % VENUE_CYCLE.length],
    announcement: DEFAULT_ANNOUNCEMENT,
    donors: COMMON_DONORS.slice(0, (index % 5) + 1),
    gallery: [],
    allowFlowers: isUpcoming,
    ...(isUpcoming ? { flowerOrderDeadline: dayOffset(person.dayDelta, 8) } : {}),
  });
});

export const getCeremonyBySlug = (slug: string): Ceremony | undefined =>
  CEREMONIES.find((ceremony) => ceremony.slug === slug);
