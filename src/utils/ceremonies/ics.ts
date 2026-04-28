import { Ceremony } from '@/types/ceremony';

const formatIcsDate = (iso: string): string => {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}00Z`
  );
};

const escapeIcs = (value: string): string =>
  value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');

export const buildCeremonyIcs = (ceremony: Ceremony): string => {
  const summary = `Rozloučení s ${ceremony.person.firstName} ${ceremony.person.lastName}`;
  const location = `${ceremony.venue.name}, ${ceremony.venue.address}, ${ceremony.venue.city}`;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Pegas//Kalendar obradu//CS',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${ceremony.slug}@pohrebpegas.cz`,
    `DTSTAMP:${formatIcsDate(new Date().toISOString())}`,
    `DTSTART:${formatIcsDate(ceremony.startAt)}`,
    `DTEND:${formatIcsDate(ceremony.endAt)}`,
    `SUMMARY:${escapeIcs(summary)}`,
    `LOCATION:${escapeIcs(location)}`,
    `DESCRIPTION:${escapeIcs(ceremony.announcement)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return lines.join('\r\n');
};
